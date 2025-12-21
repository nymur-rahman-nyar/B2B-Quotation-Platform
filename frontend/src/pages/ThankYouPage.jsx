// src/pages/ThankYouPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ThankYouPage() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-4">Thank you!</h1>
      <p>Your quote request has been sent. We’ll get back to you shortly.</p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
      >
        Back to Home
      </button>
    </div>
  );
}
