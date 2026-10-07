import { useState, type ChangeEvent } from "react";
import { useTicketCreator } from "../hooks/useTicketCreator";
import { Navigate, useNavigate } from "react-router-dom";

interface CreateTicketFormProps {
  user_id: number;
}

const categories = [
  "Technical issue",
  "Account and access",
  "General question",
  "Billing problem",
];

const CreateTicketForm = ({ user_id }: CreateTicketFormProps) => {
  const [category, setCategory] = useState(categories[0]);
  const [platform, setPlatform] = useState("");
  const [subject, setSubject] = useState("");
  const [issue, setIssue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { createTicket, isLoading, error } = useTicketCreator({
    onSuccess: () => {
      setSubmitted(true);
      navigate("/tickets");
    },
  });

  const clearForm = () => {
    setCategory(categories[0]);
    setPlatform("");
    setSubject("");
    setIssue("");
    setSubmitted(false);
  };

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    setSubmitted(false);
    void createTicket({ user_id, category, platform, subject, issue });
  };
  return (
    <main
      className="min-h-screen bg-white text-slate-900 lg:grid lg:grid-cols-[minmax(280px,38%)_1fr]"
      data-user-id={user_id}
    >
      <section className="flex min-h-[260px] flex-col justify-between bg-[#0F2A43] p-8 text-white sm:p-10 lg:min-h-screen lg:p-14">
        <div>
          <div onClick={() => navigate("/")}>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-sm font-bold tracking-wide ring-1 ring-white/25">
              CT
            </div>
          </div>
          <p className="mt-12 text-sm font-semibold uppercase tracking-[0.18em] text-blue-100/80">
            Support desk
          </p>
          <h1 className="mt-4 max-w-sm text-3xl font-semibold tracking-tight sm:text-4xl">
            How can we help?
          </h1>
          <p className="mt-4 max-w-sm text-base leading-7 text-blue-100/80">
            Tell us what you need and our team will get back to you as soon as
            possible.
          </p>
        </div>
        <p className="mt-12 text-xs text-blue-100/60">
          Customer support portal
        </p>
      </section>

      <section className="relative flex items-start justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-24">
        <span className="absolute right-6 top-6 text-xs font-medium text-slate-400 sm:right-10 sm:top-10 lg:right-16">
          v0.3.0
        </span>
        <form className="w-full max-w-2xl" onSubmit={handleSubmit}>
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
              New request
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Create a support ticket
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Give us a few details so we can route your request to the right
              team.
            </p>
          </div>

          {submitted && (
            <div
              className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
              role="status"
            >
              Your ticket has been submitted. We will be in touch shortly.
            </div>
          )}

          {error && (
            <div
              className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
                htmlFor="category"
              >
                Category
              </label>
              <select
                className="block w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30"
                id="category"
                name="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
                htmlFor="platform"
              >
                Platform
              </label>
              <input
                className="block w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30"
                id="platform"
                name="platform"
                placeholder="e.g. Windows, macOS, web browser"
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
                htmlFor="subject"
              >
                Subject
              </label>
              <input
                className="block w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30"
                id="subject"
                name="subject"
                placeholder="Briefly describe the issue"
                required
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
                htmlFor="issue"
              >
                Issue details
              </label>
              <textarea
                className="block min-h-36 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30"
                id="issue"
                name="issue"
                placeholder="What happened? Include any steps that may help us reproduce it."
                required
                value={issue}
                onChange={(event) => setIssue(event.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <button
              className="rounded-md px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
              type="button"
              onClick={clearForm}
            >
              Clear form
            </button>
            <button
              className="rounded-md bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit ticket"}
            </button>
          </div>
          <p className="mt-5 text-xs text-slate-500">
            Required fields are marked by the browser when left incomplete.
          </p>
        </form>
      </section>
    </main>
  );
};

export default CreateTicketForm;
