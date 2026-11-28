export const adminRoles = ["User", "Admin", "SuperAdmin"] as const;

export type UserRole = (typeof adminRoles)[number];

export function canAccessAdmin(role: string | undefined | null, usersOnly = false) {
  return role === "SuperAdmin" || (!usersOnly && role === "Admin");
}

export function roleLabel(role: string) {
  return role === "SuperAdmin" ? "Super Admin" : role;
}
