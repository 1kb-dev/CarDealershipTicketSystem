export default function useClaimTicket() {
  try {
    const claimTicket = async (ticketId: number, userId: number) => {
      const response = await fetch("/api/claim-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticket_id: ticketId, user_id: userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to claim the ticket");
      }

      return await response.json();
    };

    return { claimTicket };
  } catch (error) {
    console.error("Error in useClaimTicket:", error);
    return { claimTicket: null };
  }
}
