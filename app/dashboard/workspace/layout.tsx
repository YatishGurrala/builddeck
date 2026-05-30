import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/utils";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <WorkspaceSidebar />
      <main className="flex-1 overflow-y-auto bg-[var(--background)]">
        {children}
      </main>
    </div>
  );
}
