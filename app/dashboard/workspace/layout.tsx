import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/utils";
import WorkspaceSidebar from "@/components/workspace/workspace-sidebar";
import WorkspaceTopBar from "@/components/workspace/workspace-topbar";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  // Auth bypassed for local preview — restore before merging to dev
  const user = (await getCurrentUser()) ?? { id: "preview", name: "Preview User", email: "preview@local" };
  return (
    <div className="workspace-theme min-h-screen flex" style={{ backgroundColor: "#131315", color: "#e5e1e4" }}>
      <WorkspaceSidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <WorkspaceTopBar user={user} />
        <main className="flex-1 overflow-y-auto relative">
          <div className="absolute inset-0 ws-grid-bg pointer-events-none opacity-20" style={{ zIndex: 0 }} />
          <div className="relative" style={{ zIndex: 1 }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
