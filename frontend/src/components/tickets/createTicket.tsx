"use client";

import { useId, useState, type SubmitEventHandler } from "react";
import { createPortal } from "react-dom";
import {
  MIN_CUSTOMER_NAME,
  MIN_DESCRIPTION,
  MIN_TITLE,
  useCreateTicket,
} from "@/components/tickets/hooks/useCreate";

export function CreateTicketDialog() {
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const { isSubmitting, errorMessage, clearError, submitCreateTicket } =
    useCreateTicket();
  const handleOpen = () => {
    clearError();
    setIsOpen(true);
  };
  const handleClose = () => {
    if (isSubmitting) {
      return;
    }
    setIsOpen(false);
  };
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    void submitCreateTicket({
      customerName: String(formData.get("customerName") ?? ""),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      attachmentUrl: String(formData.get("attachmentUrl") ?? "") || undefined,
    }).then((didCreate) => {
      if (didCreate) {
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="btn-primary px-2.5 transition-all duration-300 sm:px-3
          hover:text-background
          hover:shadow-[0_0_12px_rgba(8,253,216,0.25)]
          hover:border-[#08fdd8]/40"
        aria-label="New ticket"
      >
        <span className="sm:hidden">New</span>
        <span className="hidden sm:inline">New ticket</span>
      </button>
      {isOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto p-4 sm:items-center"
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  handleClose();
                }
              }}
            >
              <button
                type="button"
                aria-label="Close dialog"
                className="absolute inset-0 bg-background/80"
                onClick={handleClose}
                disabled={isSubmitting}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="form-panel relative z-10 my-auto w-full max-w-lg"
              >
                <h2 id={titleId} className="page-title text-xl">
                  New ticket
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Category, priority and summary are filled by AI after you
                  submit.
                </p>
                <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                  <label className="block text-sm font-medium text-foreground">
                    Customer
                    <input
                      name="customerName"
                      required
                      minLength={MIN_CUSTOMER_NAME}
                      autoFocus
                      disabled={isSubmitting}
                      className="field"
                    />
                  </label>
                  <label className="block text-sm font-medium text-foreground">
                    Title
                    <input
                      name="title"
                      required
                      minLength={MIN_TITLE}
                      disabled={isSubmitting}
                      className="field"
                    />
                  </label>
                  <label className="block text-sm font-medium text-foreground">
                    Description
                    <textarea
                      name="description"
                      required
                      minLength={MIN_DESCRIPTION}
                      rows={5}
                      disabled={isSubmitting}
                      className="field"
                    />
                  </label>
                  <label className="block text-sm font-medium text-foreground">
                    Attachment URL
                    <span className="font-normal text-muted"> (optional)</span>
                    <input
                      name="attachmentUrl"
                      type="url"
                      disabled={isSubmitting}
                      placeholder="https://"
                      className="field"
                    />
                  </label>
                  {errorMessage ? (
                    <p role="alert" className="text-sm text-danger">
                      {errorMessage}
                    </p>
                  ) : null}
                  <div className="form-actions pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="btn-ghost"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary"
                    >
                      {isSubmitting
                        ? "Creating and classifying…"
                        : "Create ticket"}
                    </button>
                  </div>
                </form>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
