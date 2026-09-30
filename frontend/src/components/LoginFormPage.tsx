import { useState } from "react";
import type { ChangeEvent } from "react";
// Adjust the path to match your project structure.
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import type { User } from "../App";

const COMPANY_NAME = "AA Car Dealership";

interface LoginFormPageProps {
  setUser: (user: User | null) => void;
}

const LoginFormPage = ({ setUser }: LoginFormPageProps) => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin({
    onSuccess: (user) => {
      setUser(user);
      navigate("/");
    },
  });
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    void login({ email, password });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] bg-white text-slate-900">
      {/* Brand panel */}
      <aside className="hidden lg:flex flex-col justify-between bg-[#0F2A43] px-14 py-12 text-white">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="h-9 w-9 rounded-md bg-white/10 ring-1 ring-white/25 flex items-center justify-center font-semibold"
          >
            {COMPANY_NAME.charAt(0)}
          </div>
          <span className="text-lg font-semibold tracking-tight">
            {COMPANY_NAME}
          </span>
        </div>

        <div className="max-w-md">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            Everything your team needs, in one secure place.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-blue-100/80">
            Sign in with your work account to access your dashboard, documents
            and internal tools.
          </p>
        </div>

        <p className="text-sm text-blue-100/60">
          &copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div
              aria-hidden="true"
              className="h-9 w-9 rounded-md bg-[#0F2A43] text-white flex items-center justify-center font-semibold"
            >
              {COMPANY_NAME.charAt(0)}
            </div>
            <span className="text-lg font-semibold tracking-tight">
              {COMPANY_NAME}
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">
            Use your work email and password to continue.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                autoFocus
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                placeholder="name@company.com"
                className="mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-slate-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  className="block w-full rounded-md border border-slate-300 bg-white py-2.5 pl-3.5 pr-16 text-sm shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 px-3.5 text-sm font-medium text-slate-500 hover:text-slate-800 focus:outline-none focus-visible:text-blue-700 focus-visible:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isLoading && (
                <svg
                  className="h-4 w-4 animate-spin motion-reduce:animate-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-25"
                  />
                  <path
                    d="M4 12a8 8 0 018-8"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="opacity-90"
                  />
                </svg>
              )}
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-sm text-slate-500">
            Accounts are created by your administrator. Need access or having
            trouble signing in? Contact your IT support team.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginFormPage;
