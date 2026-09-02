import type { CatalogItem } from "@/lib/types/ticket";

const priorityClassNames: Record<string, string> = {
  "Needed yesterday": "bg-red-100 text-red-800",
  High: "bg-orange-100 text-orange-800",
  Medium: "bg-amber-100 text-amber-900",
  Low: "bg-emerald-100 text-emerald-800",
};

export function PriorityBadge({
  priority,
}: {
  priority: Pick<CatalogItem, "name">;
}) {
  const className =
    priorityClassNames[priority.name] ?? "bg-zinc-100 text-zinc-800";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {priority.name}
    </span>
  );
}
