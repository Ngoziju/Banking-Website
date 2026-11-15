const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

export function apiUrl(path) {
  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

export async function parseApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("json")) {
    throw new Error(
      `The API returned a non-JSON response (HTTP ${response.status}). Check that VITE_API_URL points to your deployed backend.`
    );
  }

  return response.json();
}
