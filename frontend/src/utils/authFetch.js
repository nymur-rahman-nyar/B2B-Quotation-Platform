// src/utils/authFetch.js
import { API_BASE } from "./api"; // assumes you added src/utils/api.js

export async function authFetch(input, init = {}) {
  const token = localStorage.getItem("token");
  // Prepend the base URL if input is a relative path
  const url =
    input.startsWith("http") || !API_BASE ? input : `${API_BASE}${input}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  // read it as text first
  const text = await response.text();

  // try to parse JSON only if there's something there
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.warn("authFetch: invalid JSON, returning raw text", text);
      data = text;
    }
  }

  // if it was an error status, throw so callers can catch
  if (!response.ok) {
    const message =
      (data && data.error) || (data && data.message) || response.statusText;
    throw new Error(message);
  }

  return data;
}
