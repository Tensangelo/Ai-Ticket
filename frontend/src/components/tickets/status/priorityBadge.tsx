import type { CatalogItem } from "@/lib/types/ticket";

const priorityClassNames: Record<string, string> = {
  "Needed yesterday": "bg-danger-bg text-danger",
  High: "bg-orange-500/15 text-orange-300",
  Medium: "bg-accent/10 text-muted",
  Low: "bg-accent/15 text-accent-dim",
};

export function PriorityBadge({
  priority,
}: {
  priority: Pick<CatalogItem, "name">;
}) {
  const className =
    priorityClassNames[priority.name] ?? "bg-background text-muted";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {priority.name}
    </span>
  );
}
