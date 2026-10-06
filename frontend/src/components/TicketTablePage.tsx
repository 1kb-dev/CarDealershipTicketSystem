import { useEffect, useMemo, useRef, useState } from "react";
import GetTickets from "../hooks/getTickets";

export interface Ticket {
  priority_level: number;
  ticket_id: number;
  user_id: number;
  email: string;
  category: string;
  subject: string;
}

interface TicketTableProps {
  user_id: number;
  username: string;
}

type TicketFilter = "all" | "yours" | "user";

const TicketTable = ({ user_id, username }: TicketTableProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<TicketFilter>("all");
  const [userFilter, setUserFilter] = useState("");
  const accountMenuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    GetTickets().then((fetchedTickets) => {
      if (fetchedTickets) {
        console.log("Fetched tickets:", fetchedTickets);
        setTickets(fetchedTickets);
      }
    });
  }, []);

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

  const visibleTickets = useMemo(
    () =>
      tickets.filter((ticket) => {
        if (filter === "yours") return ticket.user_id === user_id;
        if (filter === "user")
          return userFilter === "" || ticket.user_id === Number(userFilter);
        return true;
      }),
    [filter, userFilter, user_id],
  );

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 sm:px-10 lg:px-12">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0F2A43] text-sm font-semibold text-white"
              aria-hidden="true"
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
              {username}
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

      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
        <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
              Support desk
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Tickets
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Review and manage requests from your support team.
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
            type="button"
          >
            Create ticket
          </button>
        </div>

        <div className="flex flex-col gap-4 border-b border-slate-200 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex flex-wrap items-center gap-2"
            aria-label="Ticket filters"
          >
            <span className="mr-1 text-sm font-medium text-slate-700">
              Show
            </span>
            {(["all", "yours", "user"] as TicketFilter[]).map((option) => (
              <button
                className={`rounded-md px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 ${filter === option ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                key={option}
                onClick={() => setFilter(option)}
                type="button"
              >
                {option === "all"
                  ? "All tickets"
                  : option === "yours"
                    ? "Yours"
                    : "By user ID"}
              </button>
            ))}
          </div>
          {filter === "user" && (
            <label
              className="flex items-center gap-3 text-sm text-slate-600"
              htmlFor="user-filter"
            >
              User ID
              <input
                className="w-28 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30"
                id="user-filter"
                inputMode="numeric"
                onChange={(event) => setUserFilter(event.target.value)}
                placeholder="e.g. 17"
                value={userFilter}
              />
            </label>
          )}
        </div>

        <div className="mt-8 overflow-hidden rounded-md border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full border-collapse text-left">
              <caption className="sr-only">Support tickets</caption>
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th
                    className="w-20 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    scope="col"
                  >
                    Priority
                  </th>
                  <th
                    className="w-24 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    scope="col"
                  >
                    ID
                  </th>
                  <th
                    className="w-44 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    scope="col"
                  >
                    User
                  </th>
                  <th
                    className="w-48 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    scope="col"
                  >
                    Category
                  </th>
                  <th
                    className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    scope="col"
                  >
                    Subject
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {visibleTickets.map((ticket) => (
                  <tr
                    className="transition-colors hover:bg-slate-50"
                    key={ticket.ticket_id}
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      P{ticket.priority_level}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      #{ticket.ticket_id}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      <span className="block font-medium text-slate-900">
                        {ticket.email}
                      </span>
                      <span className="text-xs text-slate-500">
                        User {ticket.user_id}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {ticket.category}
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-900">
                      {ticket.subject}
                    </td>
                  </tr>
                ))}
                {visibleTickets.length === 0 && (
                  <tr>
                    <td
                      className="px-5 py-10 text-center text-sm text-slate-500"
                      colSpan={5}
                    >
                      No tickets found for this user.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Showing {visibleTickets.length} of {tickets.length} tickets
        </p>
      </section>
    </main>
  );
};

export default TicketTable;
