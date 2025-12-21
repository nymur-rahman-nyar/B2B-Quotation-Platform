// src/pages/admin/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../utils/api";

export default function Login() {
  const [step, setStep] = useState("credentials"); // "credentials" or "otp"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [tempToken, setTempToken] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already authenticated, go straight to dashboard
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  // STEP 1: send credentials → receive tempToken (backend mails OTP)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin/auth/login`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      setTempToken(data.tempToken);
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: send tempToken + OTP → receive real JWT → delay → dashboard
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // verify OTP
      const res = await fetch(`${API_BASE}/api/admin/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid code");

      // store the JWT
      localStorage.setItem("token", data.token);

      // warm up backend (optional, ignore errors)
      try {
        await fetch(`${API_BASE}/health`);
      } catch {
        /* no-op */
      }

      // wait 3 seconds, then redirect
      setTimeout(() => {
        navigate("/admin/dashboard", { replace: true });
      }, 3000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      {step === "credentials" ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <input
            type="text"
            placeholder="Username"
            value={username}
            disabled={loading}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded focus:outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 px-4 py-2 border rounded focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Sending code…" : "Log In"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleOtpSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Two-Factor Verification
          </h2>
          <p className="text-gray-700 mb-4 text-center">
            Enter the 6-digit code we sent to your email.
          </p>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <input
            type="text"
            inputMode="numeric"
            placeholder="6-digit code"
            value={otp}
            disabled={loading}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full mb-6 px-4 py-2 border rounded focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Verifying…" : "Verify Code"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("credentials");
              setError("");
              setOtp("");
              setTempToken(null);
            }}
            disabled={loading}
            className="w-full mt-4 text-sm text-gray-600 hover:underline"
          >
            ← Back to Login
          </button>
        </form>
      )}
    </div>
  );
}
