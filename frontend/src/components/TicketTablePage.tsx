import { useEffect, useRef, useState } from "react";
import GetTickets from "../hooks/getTickets";
import { useNavigate } from "react-router-dom";

export interface Ticket {
  priority_level: number;
  ticket_id: number;
  user_id: number;
  email: string;
  category: string;
  platform: string;
  subject: string;
  issue: string;
  claimed_by_user_id: number;
}

interface TicketTableProps {
  email: string;
}

type TicketFilter = "all" | "search";

const TicketTable = ({ email }: TicketTableProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<TicketFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const accountMenuRef = useRef<HTMLDetailsElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTickets = async () => {
      const fetchedTickets = await GetTickets();
      if (fetchedTickets) {
        setTickets(fetchedTickets);
        setFilter("all");
        setSearchQuery("");
      }
      setIsLoading(false);
    };

    void loadTickets();
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

  const visibleTickets =
    filter === "all"
      ? tickets
      : tickets.filter((ticket) => {
          const query = searchQuery.trim().toLowerCase();
          return (
            query === "" ||
            ticket.email.toLowerCase().includes(query) ||
            String(ticket.ticket_id).includes(query)
          );
        });

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 sm:px-10 lg:px-12">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
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
              {email}
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
            onClick={() => navigate("/create-ticket")}
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
            {(["all", "search"] as TicketFilter[]).map((option) => (
              <button
                className={`rounded-md px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 ${filter === option ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                key={option}
                onClick={() => setFilter(option)}
                type="button"
              >
                {option === "all" ? "All" : "Search"}
              </button>
            ))}
          </div>
          {filter === "search" && (
            <label
              className="flex items-center gap-3 text-sm text-slate-600"
              htmlFor="ticket-search"
            >
              Email or ticket ID
              <input
                className="w-64 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30"
                id="ticket-search"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="user@example.com or 123"
                value={searchQuery}
              />
            </label>
          )}
        </div>

        <div className="mt-8 overflow-hidden rounded-md border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse text-left">
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
                    className="w-48 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
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
                    className="w-52 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    scope="col"
                  >
                    Platform
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
                {isLoading && (
                  <tr>
                    <td
                      className="px-5 py-10 text-center text-sm text-slate-500"
                      colSpan={6}
                    >
                      Loading tickets...
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  visibleTickets.map((ticket) => (
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
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {ticket.platform}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-900">
                        <span className="block">{ticket.subject}</span>
                        <span className="mt-1 block text-xs font-normal text-slate-500">
                          {ticket.issue}
                        </span>
                      </td>
                    </tr>
                  ))}
                {!isLoading && visibleTickets.length === 0 && (
                  <tr>
                    <td
                      className="px-5 py-10 text-center text-sm text-slate-500"
                      colSpan={6}
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
