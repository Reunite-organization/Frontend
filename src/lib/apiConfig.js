const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

const normalizeConfiguredApiUrl = (value) => {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  return trimTrailingSlash(trimmed);
};

const stripApiSuffix = (value) => value.replace(/\/api$/i, '');

const configuredApiUrl = normalizeConfiguredApiUrl(import.meta.env.VITE_API_URL);

export const apiBaseUrl = stripApiSuffix(configuredApiUrl);
export const socketServerUrl = apiBaseUrl || undefined;

export default {
  apiBaseUrl,
  socketServerUrl,
};
