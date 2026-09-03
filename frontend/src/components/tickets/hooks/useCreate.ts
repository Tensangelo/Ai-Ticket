"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createTicket,
  type CreateTicketInput,
} from "@/lib/api/tickets";

export const MIN_CUSTOMER_NAME = 2;
export const MIN_TITLE = 3;
export const MIN_DESCRIPTION = 10;

export function useCreateTicket() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const clearError = () => {
    setErrorMessage(null);
  };
  const submitCreateTicket = async (
    input: CreateTicketInput,
  ): Promise<boolean> => {
    const customerName = input.customerName.trim();
    const title = input.title.trim();
    const description = input.description.trim();
    const attachmentUrl = input.attachmentUrl?.trim();
    if (customerName.length < MIN_CUSTOMER_NAME) {
      setErrorMessage("Customer name must be at least 2 characters.");
      return false;
    }
    if (title.length < MIN_TITLE) {
      setErrorMessage("Title must be at least 3 characters.");
      return false;
    }
    if (description.length < MIN_DESCRIPTION) {
      setErrorMessage("Description must be at least 10 characters.");
      return false;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    const result = await createTicket({
      customerName,
      title,
      description,
      attachmentUrl: attachmentUrl || undefined,
    });
    setIsSubmitting(false);
    if (!result.ticket) {
      setErrorMessage(result.errorMessage ?? "Could not create the ticket.");
      return false;
    }
    router.push(`/tickets/${result.ticket.id}`);
    router.refresh();
    return true;
  };
  return {
    isSubmitting,
    errorMessage,
    clearError,
    submitCreateTicket,
  };
}
