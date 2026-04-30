export const normalizeRole = (role) => String(role || "").trim().toUpperCase();

export const isAdminRole = (role) =>
  ["ADMIN", "COORDINATOR"].includes(normalizeRole(role));

export const isVolunteerRole = (role) =>
  ["ADMIN", "COORDINATOR", "VERIFIED_VOLUNTEER"].includes(
    normalizeRole(role),
  );
