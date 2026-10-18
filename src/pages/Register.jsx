// Registration Page for SmartGuard
import React, { useState } from "react";
import { Shield, Lock, Mail, User, ArrowRight } from "lucide-react";
import { authService } from "../services/authService";
import { 
  validateFullName, 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword 
} from "../utils/validation";

export default function Register({ onRegisterSuccess, onNavigateLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const nameErr = validateFullName(fullName);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);

    if (nameErr || emailErr || passErr || confirmErr) {
      setErrors({
        fullName: nameErr,
        email: emailErr,
        password: passErr,
        confirmPassword: confirmErr
      });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const user = await authService.register({ fullName, email, password });
      if (onRegisterSuccess) onRegisterSuccess(user);
    } catch (err) {
      setServerError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px"
    }}>
      <div 
        className="glass-card" 
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "36px",
          position: "relative",
          boxShadow: "var(--shadow-lg), 0 0 40px rgba(6, 182, 212, 0.15)"
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 0 25px rgba(6, 182, 212, 0.45)"
          }}>
            <Shield size={32} color="#ffffff" />
          </div>

          <h2 style={{ fontSize: "1.75rem", marginBottom: "6px" }}>
            Create Account
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            Register your SmartGuard contactless doorbell gateway
          </p>
        </div>

        {serverError && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
            borderRadius: "var(--radius-md)",
            padding: "10px 14px",
            marginBottom: "16px",
            fontSize: "0.825rem"
          }}>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="form-input"
                style={{ width: "100%", paddingLeft: "38px" }}
                placeholder="Akshaya (Homeowner)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <User 
                size={16} 
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-dim)"
                }} 
              />
            </div>
            {errors.fullName && <span className="form-error">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                className="form-input"
                style={{ width: "100%", paddingLeft: "38px" }}
                placeholder="homeowner@smartguard.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail 
                size={16} 
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-dim)"
                }} 
              />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                className="form-input"
                style={{ width: "100%", paddingLeft: "38px" }}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock 
                size={16} 
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-dim)"
                }} 
              />
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                className="form-input"
                style={{ width: "100%", paddingLeft: "38px" }}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Lock 
                size={16} 
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-dim)"
                }} 
              />
            </div>
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px", fontSize: "0.95rem", marginTop: "8px", marginBottom: "20px" }}
          >
            {isLoading ? "Creating Account..." : "Create Account & Connect"} <ArrowRight size={16} />
          </button>
        </form>

        {/* Link to Login */}
        <div style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <button
            onClick={onNavigateLogin}
            style={{ color: "var(--accent-cyan)", fontWeight: 600 }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
