import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile/");
        setUser(res.data);
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading profile...</div>;
  if (error) return <div style={{ padding: "40px", color: "red", textAlign: "center" }}>{error}</div>;

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "32px" }}>My Profile</h2>

      <div style={{
        background: "white",
        padding: "32px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}>
        <div style={{ marginBottom: "20px" }}>
          <strong>Username:</strong> {user?.username || "—"}
        </div>
        <div style={{ marginBottom: "32px" }}>
          <strong>Email:</strong> {user?.email || "—"}
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <Link
            to="/change-password"
            style={{
              padding: "12px 24px",
              background: "#f39c12",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Change Password
          </Link>

          <Link
            to="/dashboard"
            style={{
              padding: "12px 24px",
              background: "#7f8c8d",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}