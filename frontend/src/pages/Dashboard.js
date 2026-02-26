import { Link, useNavigate } from "react-router-dom";
import { 
  FaPlusCircle, 
  FaUsers, 
  FaFileAlt, 
  FaSignOutAlt,
  FaUserCircle,         
  FaKey                    
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "40px 20px",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        {/* Header – Updated with Profile & Change Password */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "16px",
        }}>
          <div>
            <h1 style={{
              fontSize: "2.2rem",
              color: "#2c3e50",
              margin: 0,
            }}>
              Employee Management Dashboard
            </h1>
           
          </div>

          {/* User actions – Profile, Change Password, Logout */}
          <div style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}>
            <Link
              to="/profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "500",
                transition: "background 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.background = "#2980b9"}
              onMouseOut={e => e.currentTarget.style.background = "#3498db"}
            >
              <FaUserCircle />
              My Profile
            </Link>

            <Link
              to="/change-password"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "#f39c12",
                color: "white",
                border: "none",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "500",
                transition: "background 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.background = "#e67e22"}
              onMouseOut={e => e.currentTarget.style.background = "#f39c12"}
            >
              <FaKey />
              Change Password
            </Link>

            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                transition: "background 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.background = "#c0392b"}
              onMouseOut={e => e.currentTarget.style.background = "#e74c3c"}
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        {/* Cards Grid – remains unchanged */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
        }}>
          {/* Create Form Card */}
          <Link to="/create-form" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={cardStyle}>
              <div style={iconContainer}>
                <FaFileAlt size={36} color="#3498db" />
              </div>
              <h3 style={cardTitle}>Create / Edit Form</h3>
              <div style={actionText}>Go to Form Builder →</div>
            </div>
          </Link>

          {/* Create Employee Card */}
          <Link to="/create-employee" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={cardStyle}>
              <div style={iconContainer}>
                <FaPlusCircle size={36} color="#2ecc71" />
              </div>
              <h3 style={cardTitle}>Add New Employee</h3>
              
              <div style={actionText}>Create Employee →</div>
            </div>
          </Link>

          {/* Employee List Card */}
          <Link to="/employees" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={cardStyle}>
              <div style={iconContainer}>
                <FaUsers size={36} color="#9b59b6" />
              </div>
              <h3 style={cardTitle}>View All Employees</h3>
             
              <div style={actionText}>Open Employee List →</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Reusable card styles (unchanged)
const cardStyle = {
  background: "white",
  borderRadius: "12px",
  padding: "32px 24px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "all 0.25s ease",
  cursor: "pointer",
  border: "1px solid #eee",
};

const iconContainer = {
  marginBottom: "20px",
  opacity: 0.9,
};

const cardTitle = {
  fontSize: "1.4rem",
  color: "#2c3e50",
  margin: "0 0 12px 0",
};

const cardDescription = {
  color: "#7f8c8d",
  lineHeight: 1.5,
  marginBottom: "20px",
};

const actionText = {
  color: "#3498db",
  fontWeight: "600",
  fontSize: "0.95rem",
};

export default Dashboard;