// client/src/utils/services.js
// Uses Vite env variable VITE_BACKEND_URL or falls back to localhost
const RAW_BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// ensure no trailing slash on backend URL
const BACKEND = RAW_BACKEND.replace(/\/+$/, "");
export const baseUrl = `${BACKEND}/api`; // normalized base like https://host/example.com/api

function buildUrl(path) {
  // if the caller passed a full absolute URL, return it unchanged
  if (/^https?:\/\//i.test(path)) return path;
  // ensure path has leading slash
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${p}`;
}

export const postRequest = async (path, body) => {
  const url = buildUrl(path);
  console.log("POST ->", url, "body", body);

  const payload = typeof body === "string" ? body : JSON.stringify(body);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    return { error: true, message: "Invalid JSON response from server" };
  }

  if (!response.ok) {
    let message = "An error occurred";
    if (data?.message) message = data.message;
    else if (typeof data === "string") message = data;
    return { error: true, message };
  }
  return data;
};

export const getRequest = async (path) => {
  const url = buildUrl(path);
  console.log("GET ->", url);

  const response = await fetch(url, {
    method: "GET",
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    return { error: true, message: "Invalid JSON response from server" };
  }

  if (!response.ok) {
    let message = "An error occurred";
    if (data?.message) message = data.message;
    return { error: true, message };
  }
  return data;
};
