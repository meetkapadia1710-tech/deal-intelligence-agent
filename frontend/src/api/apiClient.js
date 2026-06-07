const API = "";

export async function apiPost(path, body) {
  const r = await fetch(`${API}/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
}

export async function apiGet(path) {
  const r = await fetch(`${API}/api${path}`);
  return r.json();
}
