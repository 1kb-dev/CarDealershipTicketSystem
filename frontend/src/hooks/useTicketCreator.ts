import { useState } from "react";

export interface TicketDetails {
  ticket_id: number;
  user_id: number;
  priority_level: number;
  category: string;
  platform: string;
  subject: string;
  issue: string;
  claimed_by_user_id: number;
}

export interface CreateTicketRequest {
  user_id: number;
  category: string;
  platform: string;
  subject: string;
  issue: string;
}

interface ApiBody extends Partial<TicketDetails> {
  message?: string;
}

interface UseTicketCreatorOptions {
  onSuccess?: (ticket: TicketDetails) => void;
}

interface UseTicketCreatorResult {
  createTicket: (
    ticket: CreateTicketRequest,
  ) => Promise<TicketDetails | undefined>;
  isLoading: boolean;
  error: string | null;
}

export const useTicketCreator = ({
  onSuccess,
}: UseTicketCreatorOptions = {}): UseTicketCreatorResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createTicket = async (
    ticket: CreateTicketRequest,
  ): Promise<TicketDetails | undefined> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(ticket),
      });

      const data: ApiBody | null = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to create the ticket.");
      }

      const result: TicketDetails = {
        ticket_id: data?.ticket_id ?? 0,
        user_id: data?.user_id ?? ticket.user_id,
        priority_level: data?.priority_level ?? 5,
        category: data?.category ?? ticket.category,
        platform: data?.platform ?? ticket.platform,
        subject: data?.subject ?? ticket.subject,
        issue: data?.issue ?? ticket.issue,
        claimed_by_user_id: data?.claimed_by_user_id ?? 0,
      };

      onSuccess?.(result);
      return result;
    } catch (err: unknown) {
      if (err instanceof TypeError) {
        setError(
          "Can't reach the server. Check your connection and try again.",
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Try again.");
      }
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  return { createTicket, isLoading, error };
};
