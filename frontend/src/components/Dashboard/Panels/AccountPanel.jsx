import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usersApi } from "../../../services/users";

const isValidEmail = (email) => {
  const basicCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!basicCheck) return false;

  const allowedDomains = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", 
    "icloud.com", "live.com", "protonmail.com", "aol.com", 
    "gmx.com", "yandex.com"
  ];

  const domain = email.split("@")[1]?.toLowerCase();
  return allowedDomains.includes(domain);
};

export const AccountPanel = ({ data, setData, setToast }) => {
  const navigate = useNavigate();
  
  const [profileForm, setProfileForm] = useState({
    name: data.user.name || "",
    email: data.user.email || ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!profileForm.name.trim()) {
      return setToast({ message: "Name is required.", type: "error" });
    }

    if (!isValidEmail(profileForm.email)) {
      return setToast({ message: "Please use a valid email from a recognized provider.", type: "error" });
    }

    setIsSubmitting(true);
    try {
      const res = await usersApi.updateProfile(profileForm);
      setData(prev => ({ ...prev, user: { ...prev.user, ...res.user } }));
      setToast({ message: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword.length < 6) {
      return setToast({ message: "New password must be at least 6 characters.", type: "error" });
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setToast({ message: "Passwords do not match.", type: "error" });
    }

    try {
      await usersApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setToast({ message: "Password updated successfully!", type: "success" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Permanently delete your account? This cannot be undone.")) {
      try {
        await usersApi.deleteAccount();
        localStorage.removeItem("token");
        setToast({ message: "Account deleted.", type: "success" });
        navigate("/login");
      } catch (err) {
        setToast({ message: "Delete failed.", type: "error" });
      }
    }
  };

  return (
    <div className="panel account-panel">
      <h2>Account Settings</h2>

      <section className="settings-section">
        <h3>Update Profile</h3>
        <form onSubmit={handleUpdateProfile} className="form" noValidate>
          <input 
            placeholder="Name" 
            value={profileForm.name} 
            onChange={e => setProfileForm({...profileForm, name: e.target.value})} 
          />
          <input 
            type="email"
            placeholder="Email" 
            value={profileForm.email} 
            onChange={e => setProfileForm({...profileForm, email: e.target.value})} 
          />
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            Update Info
          </button>
        </form>
      </section>

      <hr className="divider" />

      <section className="settings-section">
        <h3>Security</h3>
        <form onSubmit={handleChangePassword} className="form">
          <input 
            type="password" 
            placeholder="Current Password" 
            value={passwordForm.currentPassword}
            onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="New Password (min 6 chars)" 
            value={passwordForm.newPassword}
            onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Confirm New Password" 
            value={passwordForm.confirmPassword}
            onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
            required
          />
          <button type="submit" className="submit-btn">Change Password</button>
        </form>
      </section>

      <hr className="divider" />

      <section className="settings-section danger-zone">
        <h3>Danger Zone</h3>
        <button type="button" className="delete-btn" onClick={handleDeleteAccount}>
          Delete My Account
        </button>
      </section>
    </div>
  );
};