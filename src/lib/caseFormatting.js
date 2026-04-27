import { formatDistanceToNow } from "date-fns";

export const getCaseAddress = (caseItem) =>
  caseItem?.lastSeen?.location?.address ||
  caseItem?.lastSeen?.address ||
  "Location not provided";

export const getCaseCoordinates = (caseItem) =>
  caseItem?.lastSeen?.location?.coordinates ||
  caseItem?.lastSeen?.coordinates ||
  [];

export const getCaseImageSource = (caseItem) =>
  caseItem?.person?.imageUrl || caseItem?.person?.imageData || "";

export const getCaseLastSeenAt = (caseItem) =>
  caseItem?.lastSeen?.timestamp || caseItem?.createdAt || null;

export const getCaseSummary = (caseItem) =>
  caseItem?.aiData?.summary ||
  caseItem?.person?.description ||
  "No additional summary available yet.";

export const getPriorityClasses = (level) => {
  switch (level) {
    case "HIGH":
      return "bg-red-100 text-red-700 border border-red-200";
    case "MEDIUM":
      return "bg-amber-100 text-amber-700 border border-amber-200";
    case "LOW":
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 border border-slate-200";
  }
};

export const getStatusClasses = (status) => {
  switch (status) {
    case "active":
      return "bg-red-50 text-red-700 border border-red-200";
    case "resolved":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "pending_verification":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    default:
      return "bg-slate-50 text-slate-700 border border-slate-200";
  }
};

export const formatRelativeTime = (value) => {
  if (!value) return "Unknown";

  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  } catch {
    return "Unknown";
  }
};

export const formatDateTime = (value) => {
  if (!value) return "Unknown";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return "Unknown";
  }
};

export const buildGoogleMapsUrl = (coordinates, fallbackAddress = "") => {
  if (Array.isArray(coordinates) && coordinates.length === 2) {
    const [rawLng, rawLat] = coordinates;
    const lng = Number(rawLng);
    const lat = Number(rawLat);
    const isDefaultZero = lng === 0 && lat === 0;

    if (Number.isFinite(lat) && Number.isFinite(lng) && !isDefaultZero) {
      return `https://www.google.com/maps?q=${lat},${lng}`;
    }
  }

  if (fallbackAddress) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackAddress)}`;
  }

  return "https://www.google.com/maps";
};

export const parseCommaSeparated = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
