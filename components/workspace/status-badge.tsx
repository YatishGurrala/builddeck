import { cn } from "@/lib/utils";

type StatusVariant =
  | "IDEA" | "BUILDING" | "LAUNCHED" | "PAUSED" | "ARCHIVED"
  | "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED"
  | "PLANNED" | "COMPLETED"
  | "LOW" | "MEDIUM" | "HIGH"
  | "DISCOVERY" | "VALIDATION" | "BETA";

const variantStyles: Record<string, string> = {
  IDEA: "bg-[#2a2a2c] text-[#a1a1aa]",
  BUILDING: "bg-[#1e2c4a] text-[#6366f1]",
  LAUNCHED: "bg-[#0f2a1f] text-[#22c55e]",
  PAUSED: "bg-[#2a1a1a] text-[#f59e0b]",
  ARCHIVED: "bg-[#2a2a2c] text-[#444748]",

  TODO: "bg-[#2a2a2c] text-[#a1a1aa]",
  IN_PROGRESS: "bg-[#1e2c4a] text-[#6366f1]",
  DONE: "bg-[#0f2a1f] text-[#22c55e]",
  BLOCKED: "bg-[#2a1a1a] text-[#ef4444]",

  PLANNED: "bg-[#2a2a2c] text-[#a1a1aa]",
  COMPLETED: "bg-[#0f2a1f] text-[#22c55e]",

  LOW: "bg-[#2a2a2c] text-[#a1a1aa]",
  MEDIUM: "bg-yellow-900/20 text-yellow-400",
  HIGH: "bg-red-900/20 text-red-400",

  DISCOVERY: "bg-[#2a2a2c] text-[#6366f1]",
  VALIDATION: "bg-[#1e2c4a] text-[#818cf8]",
  BETA: "bg-[#0f2a1f] text-[#34d399]",
};

const labelMap: Record<string, string> = {
  IN_PROGRESS: "In Progress",
  TODO: "To Do",
  DONE: "Done",
  BLOCKED: "Blocked",
  PLANNED: "Planned",
  COMPLETED: "Completed",
  IDEA: "Idea",
  BUILDING: "Building",
  LAUNCHED: "Launched",
  PAUSED: "Paused",
  ARCHIVED: "Archived",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  DISCOVERY: "Discovery",
  VALIDATION: "Validation",
  BETA: "Beta",
};

interface StatusBadgeProps {
  status: StatusVariant | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = variantStyles[status] ?? "bg-[#2a2a2c] text-[#a1a1aa]";
  const label = labelMap[status] ?? status;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs ws-label",
        styles,
        className
      )}
    >
      {label}
    </span>
  );
}
