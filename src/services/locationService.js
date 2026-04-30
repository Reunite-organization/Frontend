const ETHIOPIA_FALLBACK = ", Ethiopia";

const parseCoordinates = (value) => {
  if (!value) return null;

  const parts = String(value)
    .split(/[,\s]+/)
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item));

  if (parts.length !== 2) {
    return null;
  }

  const [first, second] = parts;
  const looksLikeLatLng = Math.abs(first) <= 90 && Math.abs(second) <= 180;

  return {
    latitude: looksLikeLatLng ? first : second,
    longitude: looksLikeLatLng ? second : first,
    address: String(value).trim(),
  };
};

export const geocodeLocation = async (value) => {
  const directCoordinates = parseCoordinates(value);
  if (directCoordinates) {
    return directCoordinates;
  }

  const query = String(value || "").trim();
  if (!query) {
    throw new Error("Location is required");
  }

  const requestQuery = /ethiopia/i.test(query)
    ? query
    : `${query}${ETHIOPIA_FALLBACK}`;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(requestQuery)}`,
    {
      headers: {
        "Accept-Language": "en",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Location lookup failed");
  }

  const results = await response.json();
  const bestMatch = results?.[0];

  if (!bestMatch) {
    throw new Error("Location not found");
  }

  return {
    latitude: Number(bestMatch.lat),
    longitude: Number(bestMatch.lon),
    address: bestMatch.display_name || query,
  };
};
