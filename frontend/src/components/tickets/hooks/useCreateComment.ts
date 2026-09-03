"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTicketComment } from "@/lib/api/tickets";
import {
  OPERATOR_ROLE,
  getOperatorFullName,
  readOperatorIdentity,
} from "@/lib/operator";

const MIN_COMMENT_LENGTH = 2;

export function useCreateTicketComment(ticketId: string) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const submitComment = async (content: string): Promise<boolean> => {
    const identity = readOperatorIdentity();
    if (!identity) {
      setErrorMessage("Set your name before commenting.");
      return false;
    }
    const trimmedContent = content.trim();
    if (trimmedContent.length < MIN_COMMENT_LENGTH) {
      setErrorMessage("Comment must be at least 2 characters.");
      return false;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    const result = await createTicketComment(
      ticketId,
      trimmedContent,
      getOperatorFullName(identity),
      OPERATOR_ROLE,
    );
    setIsSubmitting(false);
    if (result.errorMessage) {
      setErrorMessage(result.errorMessage);
      return false;
    }
    router.refresh();
    return true;
  };
  return {
    isSubmitting,
    errorMessage,
    submitComment,
  };
}
