// client/src/utils/services.js
// Uses Vite env variables (set in client/.env) or falls back to localhost defaults.
const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
export const baseUrl = `${BACKEND}/api`; // e.g. http://localhost:5000/api

export const postRequest = async (path, body) => {
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;
  console.log("POST ->", url, "body", body);

  const payload = typeof body === "string" ? body : JSON.stringify(body);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // if body is already a JSON string, send it as-is; otherwise stringify the object
    body: payload,
  });

  const data = await response.json();
  if (!response.ok) {
    let message = "An error occurred";
    if (data?.message) message = data.message;
    else if (typeof data === "string") message = data;
    return { error: true, message };
  }
  return data;
};


export const getRequest = async (path) => {
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;
  console.log("GET ->", url);

  const response = await fetch(url, {
    method: "GET",
    // credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    let message = "An error occurred";
    if (data?.message) message = data.message;
    return { error: true, message };
  }
  return data;
};
