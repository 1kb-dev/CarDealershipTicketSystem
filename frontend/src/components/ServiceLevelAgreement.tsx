import { useNavigate } from "react-router-dom";

const COMPANY_NAME = "AA Car Dealership";

const serviceLevels = [
  {
    priority: "Critical",
    description:
      "A complete service outage or an issue blocking all dealership operations.",
    response: "1 business hour",
    resolution: "4 business hours",
  },
  {
    priority: "High",
    description:
      "A major feature is unavailable and there is no practical workaround.",
    response: "4 business hours",
    resolution: "1 business day",
  },
  {
    priority: "Normal",
    description:
      "A limited issue affecting part of the service with a workaround available.",
    response: "1 business day",
    resolution: "3 business days",
  },
  {
    priority: "Low",
    description:
      "General questions, information requests, or minor improvements.",
    response: "2 business days",
    resolution: "5 business days",
  },
];

const ServiceLevelAgreement = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="hidden flex-col justify-between bg-[#0F2A43] px-14 py-12 text-white lg:flex">
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
          <p className="text-sm font-medium uppercase tracking-widest text-blue-100/60">
            Support commitments
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight">
            Clear expectations for every request.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-blue-100/80">
            Our support team uses these service levels to prioritize requests,
            communicate progress, and keep your business moving.
          </p>
        </div>

        <p className="text-sm text-blue-100/60">
          &copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
        </p>
      </aside>

      <main className="min-w-0 px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <div className="mx-auto max-w-3xl">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 lg:hidden">
              <div
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0F2A43] font-semibold text-white"
              >
                {COMPANY_NAME.charAt(0)}
              </div>
              <span className="text-lg font-semibold tracking-tight">
                {COMPANY_NAME}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="ml-auto rounded-md px-2 py-1 text-sm font-medium text-slate-500 transition hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
            >
              Back to home
            </button>
          </header>

          <div className="mt-12 border-b border-slate-200 pb-8 lg:mt-16">
            <p className="text-sm font-medium text-slate-500">Support desk</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Service level agreement
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              This agreement explains how we prioritize support requests and the
              response and resolution times you can expect from our team.
            </p>
          </div>

          <section className="py-8" aria-labelledby="coverage-heading">
            <h2
              id="coverage-heading"
              className="text-lg font-semibold text-slate-900"
            >
              Support coverage
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Support is available Monday through Friday, 08:00–18:00 CET,
              excluding public holidays. The clock starts when a complete ticket
              is received.
            </p>

            <div className="mt-6 overflow-hidden rounded-md border border-slate-300">
              <div className="hidden grid-cols-[1fr_9rem_9rem] gap-6 border-b border-slate-300 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
                <span>Priority</span>
                <span>First response</span>
                <span>Target resolution</span>
              </div>
              <div className="divide-y divide-slate-200">
                {serviceLevels.map((level) => (
                  <div
                    key={level.priority}
                    className="grid gap-4 px-5 py-4 sm:grid-cols-[1fr_9rem_9rem] sm:gap-6"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {level.priority}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {level.description}
                      </p>
                    </div>
                    <div className="text-sm text-slate-600">
                      <span className="font-medium text-slate-500 sm:hidden">
                        First response:{" "}
                      </span>
                      {level.response}
                    </div>
                    <div className="text-sm text-slate-600">
                      <span className="font-medium text-slate-500 sm:hidden">
                        Target resolution:{" "}
                      </span>
                      {level.resolution}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            className="border-t border-slate-200 py-8"
            aria-labelledby="process-heading"
          >
            <h2
              id="process-heading"
              className="text-lg font-semibold text-slate-900"
            >
              How we work
            </h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  01. Triage
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  We review each ticket, confirm its priority, and ask for any
                  missing details.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  02. Updates
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  We share progress in the ticket and let you know if the target
                  timeline changes.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  03. Resolution
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  We confirm the fix with you before closing the request.
                </p>
              </div>
            </div>
          </section>

          <footer className="border-t border-slate-200 pt-6 text-sm text-slate-500">
            Need help now?{" "}
            <button
              type="button"
              onClick={() => navigate("/create-ticket")}
              className="font-medium text-blue-700 underline decoration-blue-700/30 underline-offset-4 transition hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
            >
              Create a support ticket
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default ServiceLevelAgreement;
