import Link from "next/link";
import { OperatorBadge } from "@/components/operator/badge";
import { CreateTicketDialog } from "@/components/tickets/createTicket";

export const AppHeader = () => {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-md shadow-sm shadow-accent">
      <div className="mx-auto flex max-w-[95%] items-center gap-2 px-3 py-2 sm:gap-4 sm:px-4 sm:py-3">
        <Link
          href="/"
          className="min-h-11 min-w-0 rounded-md py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <p className="font-semibold tracking-wide text-accent text-base">
            AI Ticket
          </p>
          <p className="text-sm text-muted ">Operational workspace</p>
        </Link>
        <nav
          aria-label="Primary"
          className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-3"
        >
          <Link href="/" className="btn-ghost hidden sm:inline-flex">
            Dashboard
          </Link>
          <CreateTicketDialog />
          <OperatorBadge />
        </nav>
      </div>
    </header>
  );
};
