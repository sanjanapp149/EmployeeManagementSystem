import { useEffect, useState } from "react";
import API from "../api/axios";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Global search only
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editFormValues, setEditFormValues] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [page, searchTerm]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `/employees/?page=${page}`;
      if (searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }

      const res = await API.get(url);

      // Adjust based on your real response structure
      // Common patterns: { results: [], count: X } or direct array
      const data = res.data.results || res.data || [];
      setEmployees(data);
      setTotalPages(
        res.data.total_pages ||
        Math.ceil((res.data.count || data.length) / 10) ||
        1
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await API.delete(`/employees/${id}/`);
      fetchEmployees();
      alert("Employee deleted successfully");
    } catch (err) {
      alert("Failed to delete employee");
    }
  };

  // ── Edit / Update ──────────────────────────────────────────────

  const openEditModal = async (emp) => {
    setEditingEmployee(emp);
    setEditFormValues(emp.data || {});

    // Optional: fetch form fields to validate / show correct types
    // But for simplicity we just use existing keys/values

    setEditModalOpen(true);
  };

  const handleEditChange = (key, value) => {
    setEditFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingEmployee) return;

    setEditLoading(true);

    try {
      await API.put(`/employees/${editingEmployee.id}/`, {
        form: editingEmployee.form,
        data: editFormValues,
      });

      alert("Employee updated successfully");
      setEditModalOpen(false);
      fetchEmployees(); // refresh list
    } catch (err) {
      alert("Failed to update employee");
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header + Search */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <h1 style={{ margin: 0, color: "#2c3e50", fontSize: "2.1rem" }}>
            Employee Records
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // reset pagination on search
              }}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                width: "280px",
                fontSize: "1rem",
              }}
            />

            <button
              onClick={() => {
                setSearchTerm("");
                setPage(1);
              }}
              style={{
                padding: "10px 16px",
                background: "#95a5a6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>

            <button
              onClick={fetchEmployees}
              style={{
                padding: "10px 20px",
                background: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "#ffebee",
              color: "#c62828",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#7f8c8d" }}>
            Loading employees...
          </div>
        ) : employees.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <h3 style={{ color: "#95a5a6", marginBottom: "12px" }}>No employees found</h3>
            <p style={{ color: "#7f8c8d" }}>
              {searchTerm ? "Try different search terms" : "No records yet"}
            </p>
          </div>
        ) : (
          <>
            {/* Employee Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
                gap: "24px",
                marginBottom: "32px",
              }}
            >
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    transition: "transform 0.15s, box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                  }}
                >
                  <div
                    style={{
                      padding: "20px 24px",
                      borderBottom: "1px solid #eee",
                      background: "#f8f9fa",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3 style={{ margin: 0, color: "#2c3e50", fontSize: "1.3rem" }}>
                      Employee #{emp.id}
                    </h3>

                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        onClick={() => openEditModal(emp)}
                        style={{
                          background: "#f39c12",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteEmployee(emp.id)}
                        style={{
                          background: "#e74c3c",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div style={{ padding: "24px" }}>
                    {Object.entries(emp.data || {}).map(([key, value]) => (
                      <div
                        key={key}
                        style={{
                          display: "flex",
                          marginBottom: "12px",
                          fontSize: "1.05rem",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: "600",
                            color: "#34495e",
                            minWidth: "140px",
                          }}
                        >
                          {key}:
                        </div>
                        <div style={{ color: "#2c3e50" }}>{value ?? "—"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ textAlign: "center", marginTop: "32px" }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "8px 16px",
                    marginRight: "16px",
                    background: page === 1 ? "#ccc" : "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  Previous
                </button>

                <span style={{ fontWeight: "500", margin: "0 16px" }}>
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  style={{
                    padding: "8px 16px",
                    background: page >= totalPages ? "#ccc" : "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: page >= totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Edit Modal ──────────────────────────────────────────────── */}
      {editModalOpen && editingEmployee && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "32px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2 style={{ marginBottom: "24px" }}>Edit Employee #{editingEmployee.id}</h2>

            <form onSubmit={handleUpdateSubmit}>
              {Object.entries(editFormValues).map(([key, value]) => (
                <div key={key} style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "500",
                    }}
                  >
                    {key}
                  </label>
                  <input
                    type="text" // you can improve with proper type later
                    value={value}
                    onChange={(e) => handleEditChange(key, e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                    }}
                  />
                </div>
              ))}

              <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                <button
                  type="submit"
                  disabled={editLoading}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: editLoading ? "#ccc" : "#27ae60",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: editLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#95a5a6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;