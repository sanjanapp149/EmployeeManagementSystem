// src/pages/CreateForm.jsx
import { useState, useEffect } from "react";
import API from "../api/axios";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

function SortableField({ field, updateField, removeField }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.dndId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "12px",
    marginBottom: "12px",
    background: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "6px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        {...listeners}
        style={{ cursor: "grab", fontSize: "1.4rem", color: "#888", padding: "0 8px" }}
      >
        ☰
      </div>

      <input
        value={field.label || ""}
        onChange={(e) => updateField(field.dndId, "label", e.target.value)}
        placeholder="Field label"
        style={{ flex: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
      />

      <select
        value={field.field_type || "text"}
        onChange={(e) => updateField(field.dndId, "field_type", e.target.value)}
        style={{ padding: "8px", minWidth: "140px", border: "1px solid #ccc", borderRadius: "4px" }}
      >
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="date">Date</option>
        <option value="email">Email</option>
        <option value="password">Password</option>
        <option value="textarea">Textarea</option>
      </select>

      <button
        onClick={() => removeField(field.dndId)}
        style={{
          background: "#ff4d4f",
          color: "white",
          border: "none",
          padding: "6px 12px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>
  );
}

export default function CreateForm() {
  const [mode, setMode] = useState("list"); // "list" | "create" | "edit"
  const [editingId, setEditingId] = useState(null);

  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState([]);
  const [savedForms, setSavedForms] = useState([]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Load all saved forms when component mounts
  useEffect(() => {
    loadSavedForms();
  }, []);

  const loadSavedForms = async () => {
    try {
      const res = await API.get("/forms/");
      setSavedForms(res.data || []);
    } catch (err) {
      console.error("Failed to load forms", err);
    }
  };

  const startNewForm = () => {
    setMode("create");
    setEditingId(null);
    setFormName("");
    setFields([]);
    setMessage("");
  };

  const startEditForm = async (form) => {
    setMode("edit");
    setEditingId(form.id);
    setFormName(form.name);

    const loadedFields = form.fields.map((f) => ({
      ...f,
      dndId: `field-${f.id}`,
    }));

    setFields(loadedFields);
    setMessage("");
  };

  const addField = () => {
    setFields([
      ...fields,
      { dndId: `new-${Date.now()}`, label: "", field_type: "text" },
    ]);
  };

  const updateField = (dndId, key, value) => {
    setFields(fields.map((f) =>
      f.dndId === dndId ? { ...f, [key]: value } : f
    ));
  };

  const removeField = (dndId) => {
    setFields(fields.filter((f) => f.dndId !== dndId));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.dndId === active.id);
        const newIndex = items.findIndex((i) => i.dndId === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    if (!formName.trim()) return setMessage("Form name is required");
    if (fields.length === 0) return setMessage("Add at least one field");

    setSaving(true);
    setMessage("");

    const payload = {
      name: formName.trim(),
      fields: fields.map((f, i) => ({
        label: f.label.trim(),
        field_type: f.field_type,
        order: i + 1,
        ...(f.id ? { id: f.id } : {}),
      })),
    };

    try {
      if (mode === "edit" && editingId) {
        await API.put(`/forms/${editingId}/`, payload);
        setMessage("✅ Form updated successfully! (Drag & Drop order saved)");
      } else {
        await API.post("/forms/", payload);
        setMessage("✅ Form created successfully!");
      }

      await loadSavedForms(); // refresh list

      // Go back to list view after success
      setTimeout(() => {
        setMode("list");
        setFormName("");
        setFields([]);
        setEditingId(null);
      }, 1800);
    } catch (err) {
      setMessage("❌ Failed to save. Check console.");
      console.error(err.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "30px" }}>Dynamic Form Builder</h1>

      {/* Tabs */}
      <div style={{ marginBottom: "30px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setMode("list")}
          style={{
            padding: "12px 24px",
            background: mode === "list" ? "#1890ff" : "#f0f0f0",
            color: mode === "list" ? "white" : "black",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          My Saved Forms
        </button>

        <button
          onClick={startNewForm}
          style={{
            padding: "12px 24px",
            background: mode === "create" ? "#1890ff" : "#f0f0f0",
            color: mode === "create" ? "white" : "black",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          + Create New Form
        </button>
      </div>

      {message && (
        <div
          style={{
            padding: "14px",
            marginBottom: "20px",
            borderRadius: "8px",
            background: message.includes("✅") ? "#e6fffa" : "#fff1f0",
            color: message.includes("✅") ? "#006d75" : "#cf1322",
          }}
        >
          {message}
        </div>
      )}

      {/* LIST OF SAVED FORMS */}
      {mode === "list" && (
        <div>
          <h2>My Saved Forms</h2>
          {savedForms.length === 0 ? (
            <p style={{ color: "#777", marginTop: "40px" }}>
              No forms created yet. Click "Create New Form" above.
            </p>
          ) : (
            savedForms.map((form) => (
              <div
                key={form.id}
                style={{
                  background: "white",
                  padding: "20px",
                  marginBottom: "15px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 5px 0" }}>{form.name}</h3>
                  <p style={{ margin: 0, color: "#666" }}>
                    {form.fields?.length || 0} fields
                  </p>
                </div>
                <button
                  onClick={() => startEditForm(form)}
                  style={{
                    padding: "10px 20px",
                    background: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Edit Form
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* CREATE / EDIT FORM */}
      {(mode === "create" || mode === "edit") && (
        <div>
          <h2>{mode === "edit" ? "Edit Form" : "Create New Form"}</h2>

          <input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Form Name"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "24px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "1.1rem",
            }}
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={fields.map((f) => f.dndId)} strategy={verticalListSortingStrategy}>
              {fields.map((field) => (
                <SortableField
                  key={field.dndId}
                  field={field}
                  updateField={updateField}
                  removeField={removeField}
                />
              ))}
            </SortableContext>
          </DndContext>

          <div style={{ marginTop: "30px", display: "flex", gap: "15px" }}>
            <button
              onClick={addField}
              style={{
                padding: "10px 20px",
                background: "#52c41a",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              + Add Field
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "10px 32px",
                background: saving ? "#d9d9d9" : "#1890ff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving..." : mode === "edit" ? "Update Form" : "Save Form"}
            </button>

            <button
              onClick={() => setMode("list")}
              style={{
                padding: "10px 20px",
                background: "#95a5a6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}