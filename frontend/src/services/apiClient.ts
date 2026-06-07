const API = "";

let getGlobalTokenFn: (() => Promise<string | null>) | null = null;
export const setGlobalAuthTokenFn = (fn: () => Promise<string | null>) => {
  getGlobalTokenFn = fn;
};

export async function apiPost(path: string, body: any) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (getGlobalTokenFn) {
    const token = await getGlobalTokenFn();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  
  const r = await fetch(`${API}/api${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return r.json();
}

export async function apiStream(path: string, body: any) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (getGlobalTokenFn) {
    const token = await getGlobalTokenFn();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  
  return fetch(`${API}/api${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

export async function apiGet(path: string) {
  const headers: Record<string, string> = {};
  if (getGlobalTokenFn) {
    const token = await getGlobalTokenFn();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const r = await fetch(`${API}/api${path}`, { headers });
  return r.json();
}
