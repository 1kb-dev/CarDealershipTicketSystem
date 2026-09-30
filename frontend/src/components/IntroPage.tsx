import { useNavigate } from "react-router-dom";
const COMPANY_NAME = "Car Ticket Service";

const highlights = [
  "Follow the status of your tickets",
  "Report an issue in a few steps",
  "Keep requests and updates in one place",
];

const optionClass =
  "group flex w-full items-center gap-4 rounded-md border border-slate-300 bg-white p-4 text-left shadow-sm transition-colors hover:border-blue-600 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2";

const iconTileClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-700 text-white";

const IntroPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen grid grid-cols-1 grid-rows-[auto_1fr] bg-white text-slate-900 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:grid-rows-1">
      {/* Navy info sidebar: left on desktop, top banner on mobile.
          Add md:order-last to move it to the right on desktop. */}
      <aside className="flex flex-col justify-between gap-10 bg-[#0F2A43] px-6 py-8 text-white md:px-10 md:py-12 lg:px-14">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 font-semibold ring-1 ring-white/25"
          >
            {COMPANY_NAME.charAt(0)}
          </div>
          <span className="text-lg font-semibold tracking-tight">
            {COMPANY_NAME}
          </span>
        </div>

        <div className="max-w-md">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
            Everything your team needs, in one secure place.
          </h2>
          <p className="mt-4 hidden text-base leading-relaxed text-blue-100/80 md:block">
            Track requests, report issues and keep work moving with your team.
          </p>

          <ul className="mt-8 hidden space-y-3 md:block">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-blue-100/90"
              >
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-blue-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="hidden text-sm text-blue-100/60 md:block">
          &copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
        </p>
      </aside>

      {/* Actions */}
      <main className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
          <p className="mt-2 text-sm text-slate-600">
            Choose what you want to do.
          </p>

          <div className="mt-8 space-y-4">
            <button
              type="button"
              onClick={() => navigate("/tickets")}
              className={optionClass}
            >
              <span className={iconTileClass}>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                </svg>
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-slate-900">
                  See Tickets
                </span>
                <span className="mt-0.5 block text-sm text-slate-600">
                  View and follow up on existing tickets.
                </span>
              </span>
              <svg
                className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => navigate("/create-ticket")}
              className={optionClass}
            >
              <span className={iconTileClass}>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-slate-900">
                  Create Ticket
                </span>
                <span className="mt-0.5 block text-sm text-slate-600">
                  Report a new issue or make a request.
                </span>
              </span>
              <svg
                className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          <p className="mt-8 text-sm text-slate-500">
            Need help? Contact your IT support team.
          </p>
        </div>
      </main>
    </div>
  );
};

export default IntroPage;
