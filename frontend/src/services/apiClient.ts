const API = "";

let globalToken = "";
export const setGlobalAuthToken = (token: string | null) => {
  globalToken = token || "";
};

export async function apiPost(path: string, body: any) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (globalToken) headers["Authorization"] = `Bearer ${globalToken}`;
  
  const r = await fetch(`${API}/api${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return r.json();
}

export async function apiGet(path: string) {
  const headers: Record<string, string> = {};
  if (globalToken) headers["Authorization"] = `Bearer ${globalToken}`;

  const r = await fetch(`${API}/api${path}`, { headers });
  return r.json();
}
