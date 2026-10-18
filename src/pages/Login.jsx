// Login Page for SmartGuard
import React, { useState, useEffect } from "react";
import { Shield, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { authService } from "../services/authService";
import { validateEmail, validatePassword } from "../utils/validation";
import { isFirebaseActive } from "../services/firebase";

export default function Login({ onLoginSuccess, onNavigateRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const isFirebase = isFirebaseActive();

  useEffect(() => {
    const remembered = authService.getRememberedEmail();
    if (remembered) {
      setEmail(remembered);
    } else {
      setEmail("homeowner@smartguard.com");
      setPassword("password123");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const user = await authService.login({ email, password, rememberMe });
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      setServerError(err.message || "Login failed. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      const user = authService.demoLogin();
      setIsLoading(false);
      if (onLoginSuccess) onLoginSuccess(user);
    }, 400);
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
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
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
            SmartGuard Login
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            Smart Contactless Doorbell & Visitor Monitoring System
          </p>
        </div>

        {/* Demo Mode / Firebase Indicator Banner */}
        <div style={{
          background: isFirebase ? "rgba(16, 185, 129, 0.08)" : "rgba(245, 158, 11, 0.08)",
          border: `1px solid ${isFirebase ? "rgba(16, 185, 129, 0.25)" : "rgba(245, 158, 11, 0.25)"}`,
          borderRadius: "var(--radius-md)",
          padding: "10px 14px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.78rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className={`status-dot ${isFirebase ? "status-dot-green" : "status-dot-amber"}`} />
            <span style={{ color: "var(--text-main)", fontWeight: 500 }}>
              {isFirebase ? "Firebase Auth Connected" : "Local Mock Authentication Mode"}
            </span>
          </div>
          <span style={{ color: "var(--text-dim)" }}>
            {isFirebase ? "Cloud Live" : "Demo Ready"}
          </span>
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
          {/* Email input */}
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

          {/* Password input */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                className="form-input"
                style={{ width: "100%", paddingLeft: "38px" }}
                placeholder="••••••••"
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

          {/* Remember me & Forgot Password */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            fontSize: "0.825rem"
          }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "var(--text-muted)" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: "var(--accent-cyan)" }}
              />
              Remember me
            </label>

            <button
              type="button"
              onClick={() => alert("Password reset instructions simulated to your email address.")}
              style={{ color: "var(--accent-cyan)", fontSize: "0.825rem" }}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px", fontSize: "0.95rem", marginBottom: "12px" }}
          >
            {isLoading ? "Signing in..." : "Sign In to Dashboard"} <ArrowRight size={16} />
          </button>

          {/* 1-Click Quick Demo Login Button */}
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={isLoading}
            className="btn btn-secondary"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "0.85rem",
              background: "rgba(6, 182, 212, 0.08)",
              border: "1px dashed rgba(6, 182, 212, 0.4)",
              color: "var(--accent-cyan)",
              marginBottom: "20px"
            }}
          >
            <Sparkles size={15} /> 1-Click Demo Login (College Evaluation)
          </button>
        </form>

        {/* Link to Register */}
        <div style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <button
            onClick={onNavigateRegister}
            style={{ color: "var(--accent-cyan)", fontWeight: 600 }}
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}
