const {
  getUserById,
  updateUserProfile,
} = require("../models/userModel");

// Get Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const results = await getUserById(userId);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: results[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = {
      full_name: req.body.full_name,
      phone: req.body.phone,
    };

    await updateUserProfile(userId, data);

    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
