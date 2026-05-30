import { Clock } from "lucide-react";

export default function PlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-6">
      <Clock className="h-12 w-12 text-[var(--on-surface-variant)] mb-4 opacity-50" />
      <h2 className="text-xl font-semibold text-[var(--on-surface)] mb-2">Coming Soon</h2>
      <p className="text-sm text-[var(--on-surface-variant)] max-w-xs">
        This section is under construction. Check back soon!
      </p>
    </div>
  );
}
