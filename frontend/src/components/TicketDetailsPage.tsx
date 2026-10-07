import { useEffect, useRef, useState } from "react";
import type { Ticket } from "./TicketTablePage";
import useClaimTicket from "../hooks/useClaimTicket";
import type { User } from "../App";

interface TicketDetailsProps {
  go_back: React.Dispatch<React.SetStateAction<Ticket | null>>;
  setEmail: (email: string) => void;
  user: User;
  priority_level?: number;
  ticket_id?: number;
  claimed_by_user_mail?: string | null;
  email?: string;
  category?: string;
  platform?: string;
  subject?: string;
  issue?: string;
}

const TicketDetails = ({
  go_back,
  setEmail,
  user,
  priority_level,
  ticket_id,
  claimed_by_user_mail,
  email,
  category,
  platform,
  subject,
  issue,
}: TicketDetailsProps) => {
  const [isClaimed, setIsClaimed] = useState(Boolean(claimed_by_user_mail));
  const [isClosed, setIsClosed] = useState(false);
  console.log("TicketDetails props:", {
    go_back,
    user,
    priority_level,
    ticket_id,
    claimed_by_user_mail,
    email,
    category,
    platform,
    subject,
    issue,
  });
  const claimedBy = isClaimed ? claimed_by_user_mail || "You" : "Unassigned";
  const accountMenuRef = useRef<HTMLDetailsElement>(null);
  const { claimTicket } = useClaimTicket();

  const handleClaimTicket = async () => {
    console.log(
      "handleClaimTicket: ticket_id:",
      ticket_id,
      "userId:",
      user.userId,
    );
    if (ticket_id && user.userId) {
      try {
        if (!claimTicket) {
          throw new Error("claimTicket function is not available");
        }
        setEmail(user.email);
        await claimTicket(ticket_id, user.userId);
        setIsClaimed(true);
      } catch (error) {
        console.error("Error claiming ticket:", error);
      }
    } else {
      console.error("Ticket ID or User ID is missing");
    }
  };

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        accountMenuRef.current.open = false;
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 sm:px-10 lg:px-12">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0F2A43] text-sm font-semibold text-white"
            >
              CT
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-900">
                Car Ticket Service
              </p>
              <p className="hidden text-xs text-slate-500 sm:block">
                Support desk
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-600 sm:block">
              {user.email}
            </span>
            <details className="relative" ref={accountMenuRef}>
              <summary className="cursor-pointer list-none rounded-md px-2 py-1 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2">
                Account
              </summary>
              <div className="absolute right-0 top-full z-10 mt-2 w-40 rounded-md border border-slate-200 bg-white p-1 shadow-lg">
                <button
                  className="block w-full rounded px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:bg-slate-50 focus-visible:text-slate-900"
                  type="button"
                >
                  Logout
                </button>
              </div>
            </details>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
        <button
          className="mb-8 inline-flex items-center gap-2 rounded-md border border-blue-700 bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
          onClick={() => go_back(null)}
          type="button"
        >
          <span aria-hidden="true">←</span>
          Back to tickets
        </button>

        <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Ticket P{priority_level}-{ticket_id}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {subject}
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Claimed by {claimedBy}
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <button
              className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
              disabled={isClaimed || isClosed}
              onClick={handleClaimTicket}
              type="button"
            >
              {isClaimed ? "Claimed" : "Claim ticket"}
            </button>
            <button
              className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-slate-400"
              disabled={isClosed}
              onClick={() => setIsClosed(true)}
              type="button"
            >
              {isClosed ? "Closed" : "Close ticket"}
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 text-left sm:grid-cols-2">
          <div className="border-b border-slate-200 pb-6 sm:border-b-0 sm:border-r sm:pr-8">
            <h2 className="text-sm font-semibold text-slate-700">Category</h2>
            <p className="mt-2 text-base text-slate-600">{category}</p>
          </div>
          <div className="border-b border-slate-200 pb-6 sm:border-b-0">
            <h2 className="text-sm font-semibold text-slate-700">Platform</h2>
            <p className="mt-2 text-base text-slate-600">{platform}</p>
          </div>
          <div className="border-b border-slate-200 pb-6 sm:col-span-2">
            <h2 className="text-sm font-semibold text-slate-700">Subject</h2>
            <p className="mt-2 text-base font-medium text-slate-900">
              {subject}
            </p>
          </div>
          <div className="sm:col-span-2">
            <h2 className="text-sm font-semibold text-slate-700">Issue</h2>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              {issue}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TicketDetails;
