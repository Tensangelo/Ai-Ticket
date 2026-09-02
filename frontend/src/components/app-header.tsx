import Link from "next/link";
import { CreateTicketDialog } from "@/components/create-ticket-dialog";
import { OperatorBadge } from "@/components/operator-badge";

export function AppHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div>
          <p className="text-sm font-semibold tracking-tight text-zinc-900">
            AI Ticket Workspace
          </p>
          <p className="text-xs text-zinc-500">Operational requests</p>
        </div>
        <nav aria-label="Primary" className="flex items-center gap-3">
          <OperatorBadge />
          <Link
            href="/"
            className="min-h-11 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            Dashboard
          </Link>
          <CreateTicketDialog />
        </nav>
      </div>
    </header>
  );
}
