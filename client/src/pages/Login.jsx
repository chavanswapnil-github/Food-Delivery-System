import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  sendLoginOTP,
  verifyOTP,
  forgotPassword,
} from "../services/authService";
import { toast } from "react-toastify";
import "./Auth.css";
import foodImage from "../assets/auth/food-auth.png";
import GoogleAuthButton from "../components/GoogleAuthButton/GoogleAuthButton";

function Login() {
  const navigate = useNavigate();

  const handleGoogleSuccess = (res) => {
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));

    toast.success("Login successful!");

    if (res.user.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (res.user.role === "OWNER") {
      navigate("/owner/dashboard");
    } else {
      navigate("/");
    }
  };

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot-password mini flow (lives on the same page so we don't need a
  // separate route just to collect an email address)
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      toast.warning("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      const res = await sendLoginOTP(email);
      toast.info(res.message || "OTP sent to your email.");
      setShowOTP(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!email || !otp) {
      toast.warning("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await verifyOTP(email, otp);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      toast.success("Login successful!");

      if (res.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (res.user.role === "OWNER") {
        navigate("/owner/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast.warning("Please enter your email.");
      return;
    }

    try {
      setForgotLoading(true);
      const res = await forgotPassword(forgotEmail);
      toast.success(res.message || "Reset link sent to your email.");
      setForgotSent(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not send reset link."
      );
    } finally {
      setForgotLoading(false);
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
          {!showForgot ? (
            <>
              <h1 className="auth-title">Login with OTP</h1>
              <p className="auth-subtitle">Welcome back 👋</p>

              {!showOTP && (
                <>
                  <GoogleAuthButton onSuccess={handleGoogleSuccess} />
                  <div className="auth-divider">or continue with email</div>
                </>
              )}

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={showOTP}
                />
              </div>

              {!showOTP && (
                <button
                  className="auth-btn"
                  onClick={handleSendOTP}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              )}

              {showOTP && (
                <div className="otp-box">
                  <div className="input-group">
                    <label>OTP Verification</label>
                    <input
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <button
                    className="auth-btn"
                    onClick={handleVerifyOTP}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify & Login"}
                  </button>
                </div>
              )}

              <div className="auth-footer">
                <span
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => {
                    setShowForgot(true);
                    setForgotSent(false);
                  }}
                >
                  Forgot password?
                </span>
              </div>

              <div className="auth-footer">
                Don&apos;t have an account? <Link to="/register">Register</Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="auth-title">Reset Password</h1>
              <p className="auth-subtitle">
                Enter your account email and we&apos;ll send you a reset link.
              </p>

              {!forgotSent ? (
                <>
                  <div className="input-group">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                    />
                  </div>
                  <button
                    className="auth-btn"
                    onClick={handleForgotPassword}
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                </>
              ) : (
                <p style={{ color: "#fff" }}>
                  Check your inbox for a password reset link. It expires in
                  15 minutes.
                </p>
              )}

              <div className="auth-footer">
                <span
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => setShowForgot(false)}
                >
                  Back to login
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
