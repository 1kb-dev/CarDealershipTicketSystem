import { useState } from "react";
import type { User } from "../App";

// Change this to match your Go server's route.
const REGISTER_URL = "/api/register";

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
  userId: number | null;
}

interface ApiBody {
  message?: string;
  email?: string;
  userId?: number | null;
}

interface UseRegisterOptions {
  onSuccess?: (user: User) => void;
}

interface UseRegisterResult {
  register: (
    credentials: RegisterCredentials,
  ) => Promise<RegisterResponse | undefined>;
  isLoading: boolean;
  error: string | null;
}

export const useRegister = ({
  onSuccess,
}: UseRegisterOptions = {}): UseRegisterResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const register = async ({
    email,
    password,
  }: RegisterCredentials): Promise<RegisterResponse | undefined> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email, password }),
      });

      const data: ApiBody | null = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401 || response.status === 400) {
          throw new Error(
            data?.message ||
              "Unable to create account. Check your details and try again.",
          );
        }
        if (response.status === 429) {
          throw new Error(
            "Too many attempts. Wait a few minutes and try again.",
          );
        }
        throw new Error(
          data?.message ||
            "Something went wrong on our side. Try again shortly.",
        );
      }

      const result: RegisterResponse = {
        message: data?.message ?? "Registration successful",
        email: data?.email ?? "user",
        userId: data?.userId ?? null,
      };

      if (result.userId !== null) {
        onSuccess?.({ userId: result.userId, email: result.email });
      }
      return result;
    } catch (err: unknown) {
      if (err instanceof TypeError) {
        setError(
          "Can't reach the server. Check your connection and try again.",
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Try again.");
      }
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};
