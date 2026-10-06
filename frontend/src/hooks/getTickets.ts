import { type Ticket } from "../components/TicketTablePage";

export default async function GetTickets(): Promise<Ticket[] | null> {
  console.log("GetTickets: Fetching...");

  try {
    const response = await fetch("/api/tickets", {
      credentials: "include",
    });

    if (!response.ok) return null;

    const tickets = (await response.json()) as Ticket[];

    return tickets;
  } catch {
    return null;
  }
}
