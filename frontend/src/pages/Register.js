import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError((prev) => ({ ...prev, [e.target.name]: "" })); // clear error per field
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError({});

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      await API.post("/auth/register/", payload);

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      const serverError = err.response?.data || {};

      // Handle DRF field-specific errors or non_field_errors
      if (typeof serverError === "object") {
        setError({
          username: serverError.username?.[0],
          email: serverError.email?.[0],
          password: serverError.password?.[0] || serverError.detail || serverError.non_field_errors?.[0],
          general: serverError.detail || "",
        });
      } else {
        setError({ general: "Registration failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      padding: "20px",
    }}>
      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: "420px",
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
          Employee Management System
        </h2>
        <h3 style={{ textAlign: "center", marginBottom: "24px" }}>Create Account</h3>

        {error.general && (
          <div style={{
            background: "#ffebee",
            color: "#c62828",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
            textAlign: "center",
          }}>
            {error.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                border: `1px solid ${error.username ? "#c62828" : "#ccc"}`,
                borderRadius: "6px",
                fontSize: "16px",
              }}
            />
            {error.username && <small style={{ color: "#c62828" }}>{error.username}</small>}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                border: `1px solid ${error.email ? "#c62828" : "#ccc"}`,
                borderRadius: "6px",
                fontSize: "16px",
              }}
            />
            {error.email && <small style={{ color: "#c62828" }}>{error.email}</small>}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Create a password (min 8 chars)"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                border: `1px solid ${error.password ? "#c62828" : "#ccc"}`,
                borderRadius: "6px",
                fontSize: "16px",
              }}
            />
            {error.password && <small style={{ color: "#c62828" }}>{error.password}</small>}
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                border: `1px solid ${error.confirmPassword ? "#c62828" : "#ccc"}`,
                borderRadius: "6px",
                fontSize: "16px",
              }}
            />
            {error.confirmPassword && <small style={{ color: "#c62828" }}>{error.confirmPassword}</small>}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#aaa" : "#667eea",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", color: "#555" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#667eea", textDecoration: "none", fontWeight: "500" }}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;