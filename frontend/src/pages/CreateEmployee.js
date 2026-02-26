// src/pages/CreateEmployee.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";

export default function CreateEmployee() {
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [selectedForm, setSelectedForm] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch all forms on mount
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await API.get("/forms/");
        setForms(res.data);
      } catch (err) {
        setError("Failed to load forms");
        console.error(err);
      }
    };
    fetchForms();
  }, []);

  // When user selects a form → load its fields & reset values
  const handleFormSelect = (e) => {
    const formId = e.target.value;
    setSelectedFormId(formId);
    setError("");
    setMessage("");

    if (!formId) {
      setSelectedForm(null);
      setFormValues({});
      return;
    }

    const foundForm = forms.find((f) => f.id === Number(formId));
    if (foundForm) {
      setSelectedForm(foundForm);
      // Reset form values
      const initialValues = {};
      foundForm.fields.forEach((field) => {
        initialValues[field.label] = "";
      });
      setFormValues(initialValues);
    }
  };

  // Handle input change for dynamic fields
  const handleChange = (label, value) => {
    setFormValues((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  // Submit to /employees/
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedForm) {
      setError("Please select a form");
      return;
    }

    // Simple required field validation
    const missing = selectedForm.fields
      .filter((f) => !formValues[f.label]?.trim())
      .map((f) => f.label);

    if (missing.length > 0) {
      setError(`Please fill: ${missing.join(", ")}`);
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        form: selectedForm.id,
        data: formValues,
      };

      await API.post("/employees/", payload);

      setMessage("Employee created successfully!");
      // Reset form
      setSelectedFormId("");
      setSelectedForm(null);
      setFormValues({});
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        "Failed to create employee"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "24px" }}>Create Employee</h2>

      {/* Feedback messages */}
      {error && (
        <div
          style={{
            padding: "12px",
            marginBottom: "16px",
            background: "#fff1f0",
            color: "#cf1322",
            borderRadius: "6px",
            border: "1px solid #ffa39e",
          }}
        >
          {error}
        </div>
      )}

      {message && (
        <div
          style={{
            padding: "12px",
            marginBottom: "16px",
            background: "#e6fffa",
            color: "#006d75",
            borderRadius: "6px",
            border: "1px solid #87e8de",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Form Selection */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
            }}
          >
            Select Form
          </label>
          <select
            value={selectedFormId}
            onChange={handleFormSelect}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #d9d9d9",
              fontSize: "1rem",
            }}
            required
          >
            <option value="">-- Choose a form --</option>
            {forms.map((form) => (
              <option key={form.id} value={form.id}>
                {form.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Fields */}
        {selectedForm && selectedForm.fields?.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ marginBottom: "16px", color: "#333" }}>
              {selectedForm.name}
            </h3>

            {selectedForm.fields
              .sort((a, b) => a.order - b.order) // respect order from backend
              .map((field) => (
                <div key={field.id} style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "500",
                    }}
                  >
                    {field.label}
                    <span style={{ color: "#f5222d" }}>*</span>
                  </label>

                  <input
                    type={field.field_type}
                    value={formValues[field.label] || ""}
                    onChange={(e) => handleChange(field.label, e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #d9d9d9",
                      borderRadius: "6px",
                      fontSize: "1rem",
                    }}
                  />
                </div>
              ))}
          </div>
        )}

        {selectedForm && (
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#d9d9d9" : "#1890ff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "1.05rem",
              fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating..." : "Create Employee"}
          </button>
        )}
      </form>
    </div>
  );
}