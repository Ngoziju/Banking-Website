
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://banking-website-beige.vercel.app/api"
).replace(/\/+$/, "");

export function apiUrl(path) {
  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

export async function parseApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("json")) {
    throw new Error(
      `Server response error (HTTP ${response.status}). Please try again later.`
    );
  }

  return response.json();
}
