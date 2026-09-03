import { getApiBaseUrl } from "@/lib/env";
import type {
  TicketDetail,
  TicketListItem,
  TicketStatus,
} from "@/lib/types/ticket";

export interface TicketListResult {
  tickets: TicketListItem[];
  errorMessage: string | null;
}

/* Lista tickets para el dashboard. no-store: datos vivos, no cache de Next. */
export async function fetchTicketList(): Promise<TicketListResult> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/tickets`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return {
        tickets: [],
        errorMessage: `The API returned ${response.status}. Is Nest running on port 3001?`,
      };
    }
    const tickets = (await response.json()) as TicketListItem[];
    return { tickets, errorMessage: null };
  } catch {
    return {
      tickets: [],
      errorMessage:
        "Could not reach the API. Start Nest (port 3001) and PostgreSQL, then refresh.",
    };
  }
}

export interface TicketDetailResult {
  ticket: TicketDetail | null;
  errorMessage: string | null;
}

/* Detalle de un ticket. 404 del API = ticket inexistente. */
export async function fetchTicketById(
  ticketId: string,
): Promise<TicketDetailResult> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/tickets/${ticketId}`, {
      cache: "no-store",
    });
    if (response.status === 404) {
      return { ticket: null, errorMessage: "This ticket was not found." };
    }
    if (!response.ok) {
      return {
        ticket: null,
        errorMessage: `The API returned ${response.status}. Is Nest running on port 3001?`,
      };
    }
    const ticket = (await response.json()) as TicketDetail;
    return { ticket, errorMessage: null };
  } catch {
    return {
      ticket: null,
      errorMessage:
        "Could not reach the API. Start Nest (port 3001) and PostgreSQL, then refresh.",
    };
  }
}

export interface CreateTicketInput {
  customerName: string;
  title: string;
  description: string;
  attachmentUrl?: string;
}

export interface CreateTicketResult {
  ticket: TicketDetail | null;
  errorMessage: string | null;
}

/* Alta desde el navegador (CORS). El POST espera a Groq. */
export async function createTicket(
  input: CreateTicketInput,
): Promise<CreateTicketResult> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      return {
        ticket: null,
        errorMessage: await readApiError(response),
      };
    }
    const ticket = (await response.json()) as TicketDetail;
    return { ticket, errorMessage: null };
  } catch {
    return {
      ticket: null,
      errorMessage:
        "Could not reach the API. Start Nest (port 3001) and PostgreSQL, then try again.",
    };
  }
}

async function readApiError(response: Response): Promise<string> {
  const payload = (await response.json().catch(() => null)) as {
    message?: string | string[];
  } | null;
  if (typeof payload?.message === "string") {
    return payload.message;
  }
  if (Array.isArray(payload?.message)) {
    return payload.message.join(" ");
  }
  return `The API returned ${response.status}.`;
}

export interface UpdateTicketInput {
  status: TicketStatus;
  ownerId?: string | null;
  categoryId: number;
  priorityId: number;
  summary: string;
}

export async function updateTicket(
  ticketId: string,
  input: UpdateTicketInput,
): Promise<{ errorMessage: string | null }> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      return { errorMessage: await readApiError(response) };
    }
    return { errorMessage: null };
  } catch {
    return {
      errorMessage:
        "Could not reach the API. Start Nest (port 3001) and try again.",
    };
  }
}

export async function createTicketComment(
  ticketId: string,
  content: string,
  authorName: string,
  authorRole: string,
): Promise<{ errorMessage: string | null }> {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/tickets/${ticketId}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, authorName, authorRole }),
      },
    );
    if (!response.ok) {
      return { errorMessage: await readApiError(response) };
    }
    return { errorMessage: null };
  } catch {
    return {
      errorMessage:
        "Could not reach the API. Start Nest (port 3001) and try again.",
    };
  }
}
