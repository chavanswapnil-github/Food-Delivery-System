import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "./Auth.css";
import foodImage from "../assets/auth/food-auth.png";
import { resetPassword } from "../services/authService";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      toast.warning("Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, password);
      toast.success("Password updated successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "This reset link is invalid or has expired."
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
          <h1 className="auth-title">Set New Password</h1>
          <p className="auth-subtitle">Choose a new password for your account</p>

          <div className="input-group">
            <label>New Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
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
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>

          <div className="auth-footer">
            <Link to="/login">Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
