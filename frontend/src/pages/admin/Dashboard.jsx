import React, { useState, useEffect } from "react";
import { API_BASE } from "../../utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState([
    { name: "Products", count: 0 },
    { name: "Services", count: 0 },
    { name: "Projects", count: 0 },
  ]);
  const [cacheInfo, setCacheInfo] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [prodRes, servRes, projRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/admin/services`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/admin/projects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [prods, services, projects] = await Promise.all([
          prodRes.json(),
          servRes.json(),
          projRes.json(),
        ]);

        setData([
          { name: "Products", count: prods.length },
          { name: "Services", count: services.length },
          { name: "Projects", count: projects.length },
        ]);
      } catch (err) {
        console.error("Failed to load counts", err);
      }
    }

    async function fetchCache() {
      try {
        const res = await fetch(`${API_BASE}/api/admin/cache`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        setCacheInfo(json);
      } catch (err) {
        console.error("Failed to load cache info", err);
      }
    }

    fetchCounts();
    fetchCache();
  }, [token]);

  const clearCache = async () => {
    await fetch(`${API_BASE}/api/admin/cache/clear`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await fetch(`${API_BASE}/api/admin/cache`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    setCacheInfo(json);
  };

  const rebuildCache = async () => {
    await fetch(`${API_BASE}/api/admin/cache/rebuild`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await fetch(`${API_BASE}/api/admin/cache`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    setCacheInfo(json);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome to your admin dashboard overview.
      </p>

      {/* Existing Bar Chart */}
      <div className="w-full h-64 bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Products · Services · Projects
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cache Controls */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">⚙️ Cache Controls</h2>

        <div className="mb-4">
          <button
            onClick={clearCache}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          >
            Clear Cache
          </button>
          <button
            onClick={rebuildCache}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Rebuild Cache
          </button>
        </div>

        <div className="overflow-x-auto text-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4">Key</th>
                <th className="py-2">Value Preview</th>
              </tr>
            </thead>
            <tbody>
              {cacheInfo.map((entry) => (
                <tr key={entry.key} className="border-b">
                  <td className="py-2 pr-4 font-mono">{entry.key}</td>
                  <td className="py-2 text-gray-600">
                    {typeof entry.value === "object"
                      ? JSON.stringify(entry.value).slice(0, 100) + "..."
                      : String(entry.value)}
                  </td>
                </tr>
              ))}
              {cacheInfo.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-gray-500 py-4 italic">
                    No cache data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
