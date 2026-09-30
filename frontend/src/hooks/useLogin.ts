import { useCallback, useState } from "react";

// Change this to match your Go server's route.
const LOGIN_URL = "/api/auth/login";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

interface ApiBody {
  message?: string;
}

interface UseLoginOptions {
  onSuccess?: (data: LoginResponse) => void;
}

interface UseLoginResult {
  login: (credentials: LoginCredentials) => Promise<LoginResponse | undefined>;
  isLoading: boolean;
  error: string | null;
}

export const useLogin = ({
  onSuccess,
}: UseLoginOptions = {}): UseLoginResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async ({ email, password }: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data: ApiBody | null = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401 || response.status === 400) {
          throw new Error(
            data?.message ||
              "Incorrect email or password. Check your details and try again.",
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

      const result: LoginResponse = {
        message: data?.message ?? "Login successful",
      };

      onSuccess?.(result);
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
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
