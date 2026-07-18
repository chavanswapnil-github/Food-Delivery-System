import { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaBox,
  FaHeart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCog,
  FaSignOutAlt,
  FaEdit,
} from "react-icons/fa";

// ✅ Updated to import useNavigate for standalone step navigation redirection
import { getUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

// ✅ Step 6 — Imported core profile data services and notification modules
import { getProfile, updateProfile } from "../services/userService";
import { toast } from "react-toastify";

import "./Profile.css";

function Profile() {
  const user = getUser();
  const navigate = useNavigate();

  const [tab, setTab] = useState("profile");
  
  // ✅ Step 7 — Injected inline form data binding state objects
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  // ✅ Step 8 — Wired hook pipeline runner to populate inputs from the backend on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();

      if (res.success) {
        setFormData({
          full_name: res.user.full_name,
          phone: res.user.phone || "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Step 13 — Updated handleSave to extract contextual error payloads from the API response envelope
  const handleSave = async () => {
    try {
      const res = await updateProfile(formData);

      if (res.success) {
        toast.success("Profile updated successfully");

        const updatedUser = {
          ...user,
          full_name: formData.full_name,
          phone: formData.phone,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
      // ✅ Intercepts backend validation errors dynamically (e.g., "Phone number already exists.")
      toast.error(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="profile-page">

      {/* Banner */}
      <div className="profile-banner">
        <div className="banner-left">
          <div className="profile-avatar">
            {formData.full_name?.charAt(0) || user?.full_name?.charAt(0)}
          </div>
          <div>
            <h1>{formData.full_name || user?.full_name}</h1>
            <p>{user?.email}</p>
            <span>{formData.phone || user?.phone || "Phone not added"}</span>
          </div>
        </div>
        
        {/* ✅ Step 9 — Replaced plain button template with active condition toggle triggers */}
        <button
          className="edit-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          <FaEdit />
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="profile-body">

        {/* Sidebar */}
        <div className="profile-sidebar">
          <div
            className={tab === "profile" ? "active" : ""}
            onClick={() => setTab("profile")}
          >
            <FaUserCircle /> Profile
          </div>

          <div
            className={tab === "orders" ? "active" : ""}
            onClick={() => setTab("orders")}
          >
            <FaBox /> Orders
          </div>

          {/* ✅ Updated Favorites row to bypass local tabs and trigger router navigation matrix */}
          <div
            className={tab === "favorites" ? "active" : ""}
            onClick={() => navigate("/favorites")}
          >
            <FaHeart /> Favorites
          </div>

          <div
            className={tab === "addresses" ? "active" : ""}
            onClick={() => setTab("addresses")}
          >
            <FaMapMarkerAlt /> Addresses
          </div>

          <div
            className={tab === "payments" ? "active" : ""}
            onClick={() => setTab("payments")}
          >
            <FaCreditCard /> Payments
          </div>

          <div
            className={tab === "settings" ? "active" : ""}
            onClick={() => setTab("settings")}
          >
            <FaCog /> Settings
          </div>

          <div className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </div>
        </div>

        {/* Content */}
        <div className="profile-content">

          {tab === "profile" && (
            <>
              <h2>Personal Information</h2>

              <div className="info-card">
                {/* ✅ Step 10 — Replaced plain paragraphs out for dynamic conditional text inputs */}
                <div>
                  <label>Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.full_name} 
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  ) : (
                    <p>{formData.full_name || user?.full_name}</p>
                  )}
                </div>

                <div>
                  <label>Email</label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      defaultValue={user?.email} 
                      disabled 
                      style={{ background: "#334155", color: "#94a3b8", cursor: "not-allowed" }}
                    />
                  ) : (
                    <p>{user?.email}</p>
                  )}
                </div>

                {/* ✅ Step 11 — Replaced phone fields out for dynamic tracking entries */}
                <div>
                  <label>Phone</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.phone} 
                      placeholder="Add your phone number" 
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <p>{formData.phone || "Not Added"}</p>
                  )}
                </div>

                <div>
                  <label>Role</label>
                  <p>{user?.role}</p>
                </div>

                {/* ✅ Step 12 — Injected the functional save transmitter action button row below */}
                {isEditing && (
                  <div style={{ gridColumn: "1 / -1", marginTop: "15px" }}>
                    <button
                      className="save-btn"
                      onClick={handleSave}
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {tab === "orders" && (
            <h2>My Orders (Coming Soon)</h2>
          )}

          {/* ✅ Removed the local favorite placeholder render layout per workflow instructions */}

          {tab === "addresses" && (
            <h2>Saved Addresses</h2>
          )}

          {tab === "payments" && (
            <h2>Payment Methods</h2>
          )}

          {tab === "settings" && (
            <h2>Account Settings</h2>
          )}

        </div>

      </div>

    </div>
  );
}

export default Profile;