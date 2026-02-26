import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await API.post("/auth/change-password/", form);
      setMessage("Password changed successfully!");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.old_password?.[0] ||
        err.response?.data?.new_password?.[0] ||
        err.response?.data?.detail ||
        "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "32px" }}>Change Password</h2>

      {message && (
        <div style={{
          padding: "16px",
          background: "#e6fffa",
          color: "#006d75",
          borderRadius: "8px",
          marginBottom: "24px",
          textAlign: "center",
        }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{
          padding: "16px",
          background: "#fff1f0",
          color: "#cf1322",
          borderRadius: "8px",
          marginBottom: "24px",
          textAlign: "center",
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
            Current Password
          </label>
          <input
            type="password"
            name="old_password"
            value={form.old_password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
            }}
          />
        </div>

        <div style={{ marginBottom: "32px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
            New Password
          </label>
          <input
            type="password"
            name="new_password"
            value={form.new_password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading ? "#ccc" : "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1.1rem",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}