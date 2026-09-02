"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createTicketComment } from "@/lib/api/tickets";
import {
  OPERATOR_ROLE,
  getOperatorFullName,
  readOperatorIdentity,
} from "@/lib/operator";

export function AddCommentForm({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const identity = readOperatorIdentity();
    if (!identity) {
      setErrorMessage("Set your name before commenting.");
      return;
    }
    const form = event.currentTarget;
    const formData = new FormData(form);
    const content = String(formData.get("content") ?? "").trim();
    if (content.length < 2) {
      setErrorMessage("Comment must be at least 2 characters.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    const result = await createTicketComment(
      ticketId,
      content,
      getOperatorFullName(identity),
      OPERATOR_ROLE,
    );
    setIsSubmitting(false);
    if (result.errorMessage) {
      setErrorMessage(result.errorMessage);
      return;
    }
    form.reset();
    router.refresh();
  };
  return (
    <form className="mt-4 space-y-2" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-zinc-800">
        Add a comment
        <textarea
          name="content"
          required
          minLength={2}
          rows={3}
          disabled={isSubmitting}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </label>
      {errorMessage ? (
        <p role="alert" className="text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-11 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
      >
        {isSubmitting ? "Posting…" : "Post comment"}
      </button>
    </form>
  );
}
