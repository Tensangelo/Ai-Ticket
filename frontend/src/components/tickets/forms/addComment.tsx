"use client";

import { type SubmitEventHandler } from "react";
import { useCreateTicketComment } from "@/components/tickets/hooks/useCreateComment";

export function AddCommentForm({ ticketId }: { ticketId: string }) {
  const { isSubmitting, errorMessage, submitComment } =
    useCreateTicketComment(ticketId);
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    void submitComment(String(formData.get("content") ?? "")).then(
      (didPost) => {
        if (didPost) {
          form.reset();
        }
      },
    );
  };
  return (
    <form className="form-panel space-y-3" onSubmit={handleSubmit}>
      <p className="section-title text-accent">Add a comment</p>
      <label className="block text-sm font-medium text-foreground">
        Comment
        <textarea
          name="content"
          required
          minLength={2}
          rows={3}
          disabled={isSubmitting}
          placeholder="Write a note for this ticket…"
          className="field"
        />
      </label>
      {errorMessage ? (
        <p role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      ) : null}
      <div className="form-actions">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? "Posting…" : "Post comment"}
        </button>
      </div>
    </form>
  );
}
