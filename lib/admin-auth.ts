import { cookies } from "next/headers";

export const ADMIN_COOKIE = "pjh_admin";

/** Phase-1 dev-only check: cookie value must equal the ADMIN_KEY env var. */
export function isAdmin(): boolean {
  const key = process.env.ADMIN_KEY;
  if (!key) return false;
  return cookies().get(ADMIN_COOKIE)?.value === key;
}
