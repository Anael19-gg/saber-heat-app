import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

const SESSION_SECRET = process.env.SESSION_SECRET ?? "";
const HASH_SALT = process.env.HASH_SALT ?? "";

export function hashPassword(password: string): string {
  const salt = HASH_SALT || randomBytes(16).toString("base64url");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");

  if (!salt || !hash) return false;

  const expected = scryptSync(password, salt, 64);
  const actual = Buffer.from(hash, "hex");

  return (
    expected.length === actual.length && timingSafeEqual(expected, actual)
  );
}

export type SessionPayload = {
  uid: string;
  exp: number;
};

export function signSession(payload: SessionPayload): string {
  if (!SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not configured");
  }

  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("base64url");

  return `${data}.${signature}`;
}

export function verifySession(token: string): SessionPayload | null {
  if (!SESSION_SECRET) return null;

  const [data, signature] = token.split(".");

  if (!data || !signature) return null;

  const expected = createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("base64url");

  const provided = Buffer.from(signature);
  const computed = Buffer.from(expected);

  if (
    provided.length !== computed.length ||
    !timingSafeEqual(provided, computed)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf8"),
    ) as SessionPayload;

    if (
      !payload.uid ||
      typeof payload.exp !== "number" ||
      payload.exp < Date.now()
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
