import { cn } from "@/lib/utils";

type StatusVariant =
  | "IDEA" | "BUILDING" | "LAUNCHED" | "PAUSED" | "ARCHIVED"
  | "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED"
  | "PLANNED" | "COMPLETED"
  | "LOW" | "MEDIUM" | "HIGH"
  | "DISCOVERY" | "VALIDATION" | "BETA";

const variantStyles: Record<string, string> = {
  IDEA: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  BUILDING: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  LAUNCHED: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  PAUSED: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  ARCHIVED: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500",

  TODO: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  DONE: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  BLOCKED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",

  PLANNED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",

  LOW: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  HIGH: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",

  DISCOVERY: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  VALIDATION: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  BETA: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
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
  const styles = variantStyles[status] ?? "bg-zinc-100 text-zinc-600";
  const label = labelMap[status] ?? status;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles,
        className
      )}
    >
      {label}
    </span>
  );
}
