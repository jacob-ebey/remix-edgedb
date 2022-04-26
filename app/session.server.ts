import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { Session } from "@remix-run/node";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is not set");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_ID_SESSION_KEY = "userId";

export function setUserId(session: Session, userId: string) {
  session.set(USER_ID_SESSION_KEY, userId);
}

export async function getUserId(
  requestOrSession: Request | Session
): Promise<string | undefined> {
  let session: Session;
  if ("url" in requestOrSession) {
    session = await sessionStorage.getSession(
      requestOrSession.headers.get("Cookie")
    );
  } else {
    session = requestOrSession;
  }

  return session.get(USER_ID_SESSION_KEY);
}

export async function requireUserId(
  requestOrSession: Request | Session
): Promise<string> {
  const userId = await getUserId(requestOrSession);
  if (!userId) {
    throw redirect("/login");
  }
  return userId;
}
