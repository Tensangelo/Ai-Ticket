"use client";

import { useState } from "react";
import { TicketBoard } from "@/components/dashboard/board";
import { TicketStatusSummary } from "@/components/dashboard/statusSummary";
import { TicketTable } from "@/components/dashboard/table";
import type { TicketListItem } from "@/lib/types/ticket";

type DashboardView = "board" | "list";

export function TicketDashboard({ tickets }: { tickets: TicketListItem[] }) {
  const [view, setView] = useState<DashboardView>("board");
  return (
    <div>
      <TicketStatusSummary tickets={tickets} />
      <div
        className="mb-4 flex flex-wrap gap-2"
        role="group"
        aria-label="Dashboard view"
      >
        <button
          type="button"
          className={view === "board" ? "btn-primary" : "btn-ghost"}
          aria-pressed={view === "board"}
          onClick={() => setView("board")}
        >
          Board
        </button>
        <button
          type="button"
          className={view === "list" ? "btn-primary" : "btn-ghost"}
          aria-pressed={view === "list"}
          onClick={() => setView("list")}
        >
          List
        </button>
      </div>
      {view === "board" ? (
        <TicketBoard tickets={tickets} />
      ) : (
        <TicketTable tickets={tickets} />
      )}
    </div>
  );
}
