const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const userModel = require("../models/userModel");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ==========================================
// 1. REGISTER USER
// ==========================================
const registerUser = async (userData) => {
  const { full_name, email, phone, password, role } = userData;

  // Basic Validation
  if (!full_name || !email || !phone || !password || !role) {
    throw new Error("All fields are required");
  }

  // Check if email already exists
  const existingUser = await userModel.findUserByEmail(email);

  if (existingUser.length > 0) {
    throw new Error("Email already registered");
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save User
  const newUser = {
    full_name,
    email,
    phone,
    password: hashedPassword,
    role,
  };

  await userModel.createUser(newUser);

  return {
    success: true,
    message: "Registration Successful",
  };
};

// ==========================================
// 2. LOGIN USER
// ==========================================
const loginUser = async (email, password) => {
  const users = await userModel.findUserByEmail(email);

  if (users.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = users[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  return {
    success: true,
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role
    }
  };
};

// ==========================================
// 3. GOOGLE LOGIN / REGISTER
// ==========================================
const googleLogin = async (idToken) => {
  if (!idToken) {
    throw new Error("Google ID token is required");
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Google Sign-In is not configured on the server (missing GOOGLE_CLIENT_ID)");
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    console.error("❌ Google verifyIdToken failed:", err.message);
    throw new Error("Invalid Google token");
  }

  if (!payload || !payload.email) {
    throw new Error("Invalid Google token");
  }

  if (!payload.email_verified) {
    throw new Error("Google email is not verified");
  }

  const googleId = payload.sub;
  const email = payload.email;
  const fullName = payload.name || email.split("@")[0];

  // 1. Already signed in with Google before -> log them straight in.
  let users = await userModel.findUserByGoogleId(googleId);

  // 2. Never used Google before, but an account with this email already
  //    exists (they registered normally) -> link the two together.
  if (users.length === 0) {
    const existingByEmail = await userModel.findUserByEmail(email);

    if (existingByEmail.length > 0) {
      const existingUser = existingByEmail[0];

      if (existingUser.google_id && existingUser.google_id !== googleId) {
        throw new Error("This email is already linked to a different Google account");
      }

      await userModel.linkGoogleAccount(existingUser.id, googleId);
      users = await userModel.findUserById(existingUser.id);
    }
  }

  // 3. Brand new user -> create an account for them.
  if (users.length === 0) {
    await userModel.createGoogleUser({
      full_name: fullName,
      email,
      google_id: googleId,
    });
    users = await userModel.findUserByGoogleId(googleId);
  }

  const user = users[0];

  if (user.status === "BLOCKED") {
    throw new Error("Your account has been blocked. Please contact support.");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    success: true,
    message: "Google login successful",
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
  };
};

// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  registerUser,
  loginUser,
  googleLogin,
};