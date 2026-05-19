export const roles = {
  SUPER_ADMIN: "SUPER_ADMIN",
  UNIVERSITY_ADMIN: "UNIVERSITY_ADMIN",
  UNIVERSITY_STAFF: "UNIVERSITY_STAFF",
  STUDENT: "STUDENT",
  EMPLOYER: "EMPLOYER",
  AUDITOR: "AUDITOR",
};

export function canAccess(role, allowedRoles) {
  return allowedRoles.includes(role);
}

export function defaultRouteForRole(role) {
  if (role === roles.STUDENT) return "/degrees";
  if (role === roles.EMPLOYER) return "/verify";
  if (role === roles.AUDITOR) return "/audit";
  return "/";
}

