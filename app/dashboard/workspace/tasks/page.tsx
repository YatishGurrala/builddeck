import { getCurrentUser } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import { getWorkspaceProducts } from "@/lib/db/queries/workspace/products";
import { getWorkspaceTasks } from "@/lib/db/queries/workspace/tasks";
import { StatusBadge } from "@/components/workspace/status-badge";
import Link from "next/link";
import { Circle, Clock, CheckCircle2, AlertCircle, CheckSquare } from "lucide-react";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";

const TASK_GROUPS: { status: TaskStatus; label: string; color: string }[] = [
  { status: "TODO", label: "To Do", color: "#a1a1aa" },
  { status: "IN_PROGRESS", label: "In Progress", color: "#6366f1" },
  { status: "DONE", label: "Done", color: "#22c55e" },
  { status: "BLOCKED", label: "Blocked", color: "#ef4444" },
];

const StatusIcon = ({ status }: { status: TaskStatus }) => {
  switch (status) {
    case "TODO": return <Circle className="h-3.5 w-3.5 text-[#a1a1aa]" />;
    case "IN_PROGRESS": return <Clock className="h-3.5 w-3.5 text-[#6366f1]" />;
    case "DONE": return <CheckCircle2 className="h-3.5 w-3.5 text-[#22c55e]" />;
    case "BLOCKED": return <AlertCircle className="h-3.5 w-3.5 text-[#ef4444]" />;
  }
};

export default async function AllTasksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const products = await getWorkspaceProducts(user.id);
  const allTasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    productId: string;
    productName: string;
  }> = [];

  for (const product of products) {
    const tasks = await getWorkspaceTasks(product.id, user.id);
    for (const task of tasks) {
      allTasks.push({
        ...task,
        productName: product.name,
        priority: (task as any).priority ?? "LOW",
      });
    }
  }

  const grouped = TASK_GROUPS.reduce<Record<TaskStatus, typeof allTasks>>((acc, g) => {
    acc[g.status] = allTasks.filter((t) => t.status === g.status);
    return acc;
  }, { TODO: [], IN_PROGRESS: [], DONE: [], BLOCKED: [] });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">All Tasks</h1>
          <p className="text-[#a1a1aa] text-sm mt-1 ws-label">{allTasks.length} tasks across {products.length} products</p>
        </div>
      </div>

      {allTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CheckSquare className="h-8 w-8 text-[#a1a1aa] mb-3 opacity-50" />
          <p className="text-[#a1a1aa] text-sm">No tasks yet. Create a product and add tasks.</p>
          <Link href="/dashboard/workspace/products/new" className="mt-4 flex items-center gap-2 bg-white text-[#131315] px-4 py-2 rounded text-sm font-mono tracking-wider hover:bg-[#e2e2e2] transition-colors">
            Get Started
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {TASK_GROUPS.map(({ status, label, color }) => {
            const group = grouped[status];
            return (
              <div key={status}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[#e5e1e4] text-sm ws-label font-semibold">{label}</span>
                  <span className="text-[#a1a1aa] text-xs ws-label">({group.length})</span>
                </div>
                {group.length === 0 ? (
                  <p className="text-[#444748] text-xs ws-label pl-4">No {label.toLowerCase()} tasks</p>
                ) : (
                  <div className="border border-[#27272a] rounded-lg overflow-hidden">
                    {group.map((task, idx) => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-3 py-3 px-4 hover:bg-[#1c1b1d] transition-colors ${idx !== group.length - 1 ? "border-b border-[#27272a]" : ""}`}
                      >
                        <StatusIcon status={task.status as TaskStatus} />
                        <span className={`flex-1 text-sm ${task.status === "DONE" ? "line-through text-[#444748]" : "text-[#e5e1e4]"}`}>
                          {task.title}
                        </span>
                        <StatusBadge status={task.priority} />
                        <Link
                          href={`/dashboard/workspace/products/${task.productId}`}
                          className="text-xs text-[#a1a1aa] ws-label hover:text-[#6366f1] transition-colors hidden sm:block"
                        >
                          {task.productName}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
