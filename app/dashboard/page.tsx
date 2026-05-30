import Link from "next/link";
import { Plus, CheckCircle, ArrowRight, LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth/utils";
import { getBuildsByUser } from "@/lib/buildstack/queries/builds";

interface DashboardPageProps {
  searchParams: Promise<{ submitted?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const builds = await getBuildsByUser(user.id);

  return (
    <div className="container mx-auto px-4 py-12">
      {params.submitted && (
        <div className="mb-8 rounded-lg bg-green-500/10 border border-green-500/20 p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <p className="text-green-400">
            Your build has been generated successfully.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400 mt-1">
            Welcome back, {user?.name || user?.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {user.role === "ADMIN" && (
            <Link href="/dashboard/waitlist">
              <Button variant="outline">View Waitlist Leads</Button>
            </Link>
          )}
          <Link href="/">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Generate New Build
            </Button>
          </Link>
        </div>
      </div>

      {/* Workspace entry point */}
      <Link href="/dashboard/workspace" className="block mb-8 group">
        <div className="flex items-center justify-between p-5 rounded-xl border border-[#27272a] bg-[#131315] hover:border-[#6366f1] hover:bg-[#1c1b1d] transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/30 flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-[#818cf8]" />
            </div>
            <div>
              <p className="text-white font-semibold">Founder Workspace</p>
              <p className="text-zinc-500 text-sm">Manage products, tasks, roadmap &amp; docs</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-[#818cf8] transition-colors" />
        </div>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Builds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{builds?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Last Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-cyan-300">
              {builds[0] ? formatDate(new Date(builds[0].createdAt)) : "No builds yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Founder Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-400">
            Manage your public founder profile, links, products, and analytics.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/dashboard/profile", label: "Profile" },
              { href: "/dashboard/links", label: "Links" },
              { href: "/dashboard/products", label: "Products" },
              { href: "/dashboard/analytics", label: "Analytics" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#101419] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
              >
                {item.label}
                <ArrowRight className="h-4 w-4 text-zinc-400" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Builds</CardTitle>
        </CardHeader>
        <CardContent>
          {!builds || builds.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-400 mb-4">
                You haven&apos;t generated any builds yet.
              </p>
              <Link href="/">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Generate Your First Build
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {builds.map((build) => (
                <div
                  key={build.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{build.data.idea}</h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      Generated {formatDate(new Date(build.createdAt))}
                    </p>
                  </div>

                  <Link href={`/dashboard/builds/${build.id}`}>
                    <Button variant="outline" className="gap-2">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
