import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify"; // Step 3.1: Added toast import
import "./Auth.css";
import foodImage from "../assets/auth/food-auth.png"; 
import {
  sendRegisterOTP,
  verifyOTP,
  registerUser,
} from "../services/authService";
import GoogleAuthButton from "../components/GoogleAuthButton/GoogleAuthButton";

function Register() {
  const navigate = useNavigate();

  const handleGoogleSuccess = (res) => {
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));

    toast.success("Account created with Google!");

    if (res.user.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (res.user.role === "OWNER") {
      navigate("/owner/dashboard");
    } else {
      navigate("/");
    }
  };

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "CUSTOMER",
  });

  const [otp, setOtp] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOTP = async () => {
    // Step 3.2: Upgraded validation alerts with Toastify warning configurations
    if (
      !formData.full_name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !confirmPassword
    ) {
      toast.warning("Please fill all fields.");
      return;
    }
    if (formData.password !== confirmPassword) {
      toast.warning("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      toast.warning("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await sendRegisterOTP(formData.email);
      
      // Step 3.3: Updated to clean info toast
      toast.info("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      // Step 3.6: Standardized fallback error handling
      toast.error(
        err.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp) {
      toast.warning("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      await verifyOTP(formData.email, otp);
      
      // Step 3.4: Replaced OTP confirmation window popups
      toast.success("OTP verified successfully!");

      await registerUser(formData);
      
      // Step 3.5: Notified customer of registered state success
      toast.success("Registration completed successfully!");
      navigate("/login");
    } catch (err) {
      // Step 3.6: Standardized fallback error handling
      toast.error(
        err.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={foodImage} alt="Food Delivery" />
        <h1>FoodHub</h1>
        <p>
          Order food from your favourite restaurants.
          <br />
          Fast delivery.
          <br />
          Live tracking.
          <br />
          Best offers.
        </p>
      </div>
      
      <div className="auth-right">
        <div className="auth-card">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join Food Delivery today 🍔</p>

          {step === 1 && (
            <>
              <GoogleAuthButton onSuccess={handleGoogleSuccess} />
              <div className="auth-divider">or register with email</div>

              <div className="input-group">
                <label>Full Name</label>
                <input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>
              
              <div className="input-group">
                <label>Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                />
              </div>
              
              <div className="input-group">
                <label>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "16px",
                      cursor: "pointer",
                      color: "#fff",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              
              <div className="input-group">
                <label>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "16px",
                      cursor: "pointer",
                      color: "#fff",
                    }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              
              <div className="input-group">
                <label>Account Type</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="CUSTOMER">Customer</option>
                  <option value="OWNER">Restaurant Owner</option>
                </select>
              </div>
              
              <button className="auth-btn" onClick={handleSendOTP} disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
              
              <div className="auth-footer">
                Already have an account?{" "}
                <Link to="/login">Login</Link>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="otp-box">
                <div className="input-group">
                  <label>OTP Verification</label>
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                  />
                </div>
                <button className="auth-btn" onClick={handleVerify} disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Register"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;