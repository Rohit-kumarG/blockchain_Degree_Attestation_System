export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://blockchaindegreeattestationsystem-production.up.railway.app/api";

export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.warn("Response is not valid JSON", err);
    }
  }

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

