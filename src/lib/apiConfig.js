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

// In development, we use the proxy (empty base URL) if no VITE_API_URL is provided.
// If VITE_API_URL is provided, we use it directly to avoid proxy issues with live APIs.
export const apiBaseUrl = configuredApiUrl || (import.meta.env.DEV ? '' : '');
export const socketServerUrl = stripApiSuffix(configuredApiUrl) || (import.meta.env.DEV ? undefined : undefined);

export default {
  apiBaseUrl,
  socketServerUrl,
};
