import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, GripVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/utils";
import { getDefaultMockFounderProfile } from "@/lib/founder-profile/mock-data";
import { FounderDashboardNav } from "../_components/founder-dashboard-nav";

export const metadata = { title: "Links · Dashboard · Builddeck" };

export default async function DashboardLinksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = getDefaultMockFounderProfile();
  const links = [...profile.links].sort((a, b) => a.position - b.position);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Links</h1>
          <p className="mt-1 text-zinc-400">
            Featured links that appear on your public profile.
          </p>
        </div>
        <Button disabled className="gap-2">
          <Plus className="h-4 w-4" /> Add link
        </Button>
      </div>

      <FounderDashboardNav active="links" />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Active links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {links.length === 0 ? (
            <p className="text-sm text-zinc-400">No links yet.</p>
          ) : (
            links.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#101419] p-3"
              >
                <GripVertical className="h-4 w-4 text-zinc-500" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{link.title}</p>
                  <p className="truncate text-xs text-zinc-400">{link.url}</p>
                </div>
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide " +
                    (link.isActive
                      ? "bg-emerald-400/15 text-emerald-300"
                      : "bg-white/10 text-zinc-400")
                  }
                >
                  {link.isActive ? "Active" : "Hidden"}
                </span>
              </div>
            ))
          )}
          <p className="pt-2 text-xs text-zinc-500">
            Drag-to-reorder, edit, and delete are part of the next milestone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
