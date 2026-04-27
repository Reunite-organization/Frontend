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

// In development, we use the proxy (empty base URL)
// In production, we use the configured API URL
export const apiBaseUrl = import.meta.env.DEV ? '' : configuredApiUrl;
export const socketServerUrl = import.meta.env.DEV ? undefined : stripApiSuffix(configuredApiUrl);

export default {
  apiBaseUrl,
  socketServerUrl,
};
