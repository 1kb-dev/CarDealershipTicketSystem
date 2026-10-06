export interface SessionUser {
  userId: number;
  email: string;
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
      email?: string;
    };

    if (
      !session.authenticated ||
      typeof session.userId !== "number" ||
      typeof session.email !== "string"
    ) {
      return null;
    }

    return { userId: session.userId, email: session.email };
  } catch {
    return null;
  }
}
