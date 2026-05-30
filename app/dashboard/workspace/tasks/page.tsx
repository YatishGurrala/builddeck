import { getCurrentUser } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import { getWorkspaceProducts } from "@/lib/db/queries/workspace/products";
import { getWorkspaceTasks } from "@/lib/db/queries/workspace/tasks";
import { AllTasksView } from "@/components/workspace/all-tasks-view";

export default async function AllTasksPage() {
  const user = (await getCurrentUser()) ?? { id: "preview", name: "Preview User", email: "preview@local" };

  const products = await getWorkspaceProducts(user.id);
  const allTasks: Array<{
    id: string;
    title: string;
    description?: string | null;
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
        description: (task as any).description ?? null,
        productName: product.name,
        priority: (task as any).priority ?? "LOW",
      });
    }
  }

  return (
    <AllTasksView
      tasks={allTasks}
      products={products.map((p) => ({ id: p.id, name: p.name }))}
    />
  );
}
