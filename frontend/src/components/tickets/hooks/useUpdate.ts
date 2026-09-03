"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  updateTicket,
  type UpdateTicketInput,
} from "@/lib/api/tickets";

const MIN_SUMMARY_LENGTH = 3;

export function useUpdateTicket(ticketId: string) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const submitUpdateTicket = async (
    input: UpdateTicketInput,
  ): Promise<boolean> => {
    if (input.summary.trim().length < MIN_SUMMARY_LENGTH) {
      setErrorMessage("Summary must be at least 3 characters.");
      setSuccessMessage(null);
      return false;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    const result = await updateTicket(ticketId, {
      ...input,
      summary: input.summary.trim(),
    });
    setIsSubmitting(false);
    if (result.errorMessage) {
      setErrorMessage(result.errorMessage);
      return false;
    }
    setSuccessMessage("Ticket updated.");
    router.refresh();
    return true;
  };
  return {
    isSubmitting,
    errorMessage,
    successMessage,
    submitUpdateTicket,
  };
}
