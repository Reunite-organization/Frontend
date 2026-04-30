const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

const normalizeConfiguredApiUrl = (value) => {
  if (typeof value !== 'string') return '';
  
  const trimmed = value.trim();
  if (!trimmed) return '';

  return trimTrailingSlash(trimmed);
};

const stripApiSuffix = (value) => value.replace(/\/api(\/)?$/i, '');

const rawApiUrl = import.meta.env.VITE_API_URL;
const configuredApiUrl = normalizeConfiguredApiUrl(rawApiUrl);
const preferDirectApiInDev = String(import.meta.env.VITE_USE_DIRECT_API || "").toLowerCase() === "true";

// In development we default to Vite proxy to avoid CORS headaches.
// Set VITE_USE_DIRECT_API=true only when you intentionally want direct cross-origin calls.
export const apiBaseUrl =
  import.meta.env.DEV && !preferDirectApiInDev ? "" : configuredApiUrl;
export const socketServerUrl =
  import.meta.env.DEV && !preferDirectApiInDev ? undefined : stripApiSuffix(configuredApiUrl);

export default {
  apiBaseUrl,
  socketServerUrl,
};
