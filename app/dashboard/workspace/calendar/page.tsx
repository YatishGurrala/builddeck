import { getCurrentUser } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import { getWorkspaceProducts } from "@/lib/db/queries/workspace/products";
import { getWorkspaceTasks } from "@/lib/db/queries/workspace/tasks";
import { WorkspaceCalendar } from "@/components/workspace/workspace-calendar";

export default async function CalendarPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const products = await getWorkspaceProducts(user.id).catch(() => []);

  const events: {
    id: string;
    title: string;
    date: Date;
    type: "task" | "milestone" | "deadline";
    productName?: string;
  }[] = [];

  for (const product of products) {
    const tasks = await getWorkspaceTasks(product.id, user.id).catch(() => []);
        events.push({
          id: task.id,
          title: task.title,
          date: new Date((task as any).dueDate),
          type: (task as any).priority === "HIGH" ? "deadline" : "task",
          productName: product.name,
        });
      }
    }

    for (const item of (product as any).roadmapItems ?? []) {
      if ((item as any).dueDate) {
        events.push({
          id: item.id,
          title: item.title,
          date: new Date((item as any).dueDate),
          type: "milestone",
          productName: product.name,
        });
      }
    }
  }

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Calendar</h1>
        <p className="text-[#a1a1aa] text-sm mt-1 ws-label">
          {events.length} upcoming events across {products.length} products
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <WorkspaceCalendar events={events} />
      </div>
    </div>
  );
}
