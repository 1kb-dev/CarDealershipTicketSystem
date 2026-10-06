export interface SessionUser {
  userId: number;
  username: string;
}

export default async function CheckSession(): Promise<SessionUser | null> {
  console.log("CheckSession: Checking session...");

  try {
    const response = await fetch("/api/session", {
      credentials: "include",
    });

    if (!response.ok) return null;

    const session = (await response.json()) as {
      authenticated?: boolean;
      userId?: number;
      username?: string;
    };

    if (
      !session.authenticated ||
      typeof session.userId !== "number" ||
      typeof session.username !== "string"
    ) {
      return null;
    }

    return { userId: session.userId, username: session.username };
  } catch {
    return null;
  }
}
