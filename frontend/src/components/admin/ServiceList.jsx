// src/components/admin/ServiceList.jsx
import React, { useState, useEffect } from "react";
import ServiceForm from "./ServiceForm";
import { API_BASE } from "../../utils/api";

export default function ServiceList({ refreshFlag }) {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);

  // fetch list on mount and whenever refreshFlag toggles
  useEffect(() => {
    loadServices();
  }, [refreshFlag]);

  const loadServices = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/admin/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setServices(await res.json());
      } else {
        console.error("Failed to load services:", res.status);
      }
    } catch (err) {
      console.error("Network error loading services:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service for good?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/admin/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        // optimistically remove from UI
        setServices((s) => s.filter((svc) => svc._id !== id));
      } else {
        console.error("Failed to delete service:", res.status);
      }
    } catch (err) {
      console.error("Network error deleting service:", err);
    }
  };

  const startEdit = (svc) => setEditingService(svc);
  const cancelEdit = () => setEditingService(null);
  const onEdited = () => {
    setEditingService(null);
    loadServices();
  };

  return (
    <div>
      {editingService && (
        <ServiceForm
          existingService={editingService}
          onAdded={onEdited}
          onCancel={cancelEdit}
        />
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {services.map((svc) => (
          <li
            key={svc._id}
            style={{
              padding: 12,
              marginBottom: 8,
              border: "1px solid #ddd",
              borderRadius: 4,
            }}
          >
            <strong>{svc.name}</strong>
            <p>{svc.description}</p>
            <button onClick={() => startEdit(svc)} style={{ marginRight: 8 }}>
              Edit
            </button>
            <button onClick={() => handleDelete(svc._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
