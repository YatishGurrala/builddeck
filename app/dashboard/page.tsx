import Link from "next/link";
import { Plus, CheckCircle, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth/utils";
import { getBuildsByUser } from "@/lib/db/queries/builds";

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
        <Link href="/">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Generate New Build
          </Button>
        </Link>
      </div>

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
              {builds[0] ? formatDate(builds[0].createdAt) : "No builds yet"}
            </p>
          </CardContent>
        </Card>
      </div>

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
                    <h3 className="font-medium text-white truncate">{build.idea}</h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      Generated {formatDate(build.createdAt)}
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
