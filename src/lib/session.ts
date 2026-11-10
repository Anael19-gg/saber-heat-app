import { cookies } from "next/headers";

import {
  signSession,
  verifySession,
  type SessionPayload,
} from "@/lib/security";

const COOKIE_NAME = "saber_session";
const MAX_AGE = 60 * 60 * 24 * 30;

export async function createSession(uid: string): Promise<void> {
  const token = signSession({
    uid,
    exp: Date.now() + MAX_AGE * 1000,
  });

  const store = await cookies();

  const secure =
    process.env.VERCEL === "1" ||
    (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://");

  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;

  if (!token) return null;

  return verifySession(token);
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
