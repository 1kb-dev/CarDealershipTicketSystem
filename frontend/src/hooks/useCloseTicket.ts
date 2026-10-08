interface CloseTicketResponse {
  status: string;
  ticket_id: number;
}

export default function useCloseTicket() {
  const closeTicket = async (
    ticketId: number,
  ): Promise<CloseTicketResponse> => {
    const response = await fetch("/api/close-ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ ticket_id: ticketId }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Failed to close the ticket");
    }

    return (await response.json()) as CloseTicketResponse;
  };

  return { closeTicket };
}
