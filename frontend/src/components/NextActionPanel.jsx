import React, { useEffect, useState } from "react";
const API = "";

async function apiPost(path, body) {
  const r = await fetch(`${API}/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return r.json();
}

export default function NextActionPanel({ dealId, dealName }) {
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const res = await apiPost("/next-action", {
          dealId,
          dealName,
        });

        setAction(res.recommendation);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [dealId]);

  if (loading) return <div>Generating recommendation...</div>;

  return (
    <div className="card-panel" style={{ padding: 24 }}>
      <h3>Next Best Action</h3>
      <p>{action}</p>
    </div>
  );
}