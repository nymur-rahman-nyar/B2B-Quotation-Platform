// src/components/AdminGate.jsx
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminGate({ children }) {
  const [status, setStatus] = useState("loading");
  // "loading" | "ok" | "forbidden" | "error"

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/check-ip`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          setStatus("ok");
        } else if (res.status === 403) {
          setStatus("forbidden");
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  if (status === "loading") {
    return <div>Checking access…</div>;
  }
  if (status === "forbidden") {
    return <Navigate to="/" replace />;
  }
  if (status === "error") {
    return <div>⚠️ Server error. Please try again later.</div>;
  }

  return <>{children}</>;
}
