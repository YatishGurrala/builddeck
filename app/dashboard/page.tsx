import Link from "next/link";
import { Plus, CheckCircle, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth/utils";
import { getBuildsByUser } from "@/lib/db/queries/builds";
import { getFounderProfileForUser } from "@/lib/founder-profile/store";
import { getFounderPublicProfileUrl } from "@/lib/founder-profile/public-url";

interface DashboardPageProps {
  searchParams: Promise<{ submitted?: string; mode?: string }>;
}

const OWNER_DASHBOARD_EMAILS = new Set(
  (process.env.OWNER_DASHBOARD_EMAILS || "yatishkotlin@gmail.com")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const builds = await getBuildsByUser(user.id);
  const founderProfile = await getFounderProfileForUser(user);
  const founderPublicUrl = getFounderPublicProfileUrl(founderProfile.username);
  const isOwner = OWNER_DASHBOARD_EMAILS.has(user.email.toLowerCase());
  const isFounderMode = params.mode === "founder";

  if (!isOwner) {
    redirect("/dashboard/editor");
  }

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
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Dashboard</h1>
          <p className="mt-1 text-[color:var(--on-surface-variant)]">
            Welcome back, {founderProfile.username || user?.email}
          </p>
          <div className="mt-3 inline-flex rounded-lg border border-[color:var(--outline-variant)] bg-[color:var(--surface-container-low)] p-1">
            <Link
              href="/dashboard?mode=internal"
              className={
                "rounded-md px-3 py-1.5 text-sm " +
                (!isFounderMode
                  ? "bg-[color:var(--surface-container-high)] text-[color:var(--on-surface)]"
                  : "text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface)]")
              }
            >
              Internal
            </Link>
            <Link
              href="/dashboard?mode=founder"
              className={
                "rounded-md px-3 py-1.5 text-sm " +
                (isFounderMode
                  ? "bg-[color:var(--surface-container-high)] text-[color:var(--on-surface)]"
                  : "text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface)]")
              }
            >
              Founder
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isFounderMode && user.role === "ADMIN" && (
            <Link href="/dashboard/waitlist">
              <Button variant="outline">View Waitlist Leads</Button>
            </Link>
          )}
          {isFounderMode ? (
            <Link href={founderPublicUrl} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2">Open Public Profile</Button>
            </Link>
          ) : (
            <Link href="/">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Generate New Build
              </Button>
            </Link>
          )}
        </div>
      </div>

      {!isFounderMode ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[color:var(--on-surface-variant)]">
                  Total Builds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[color:var(--on-surface)]">{builds?.length || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[color:var(--on-surface-variant)]">
                  Last Generated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-[color:var(--on-surface)]">
                  {builds[0] ? formatDate(builds[0].createdAt) : "No builds yet"}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}

      {isFounderMode ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Founder Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[color:var(--on-surface-variant)]">
              Manage your creator studio, block library, public profile, and analytics.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { href: "/dashboard/editor", label: "Editor" },
                { href: "/dashboard/blocks", label: "Blocks" },
                { href: "/dashboard/themes", label: "Themes" },
                { href: "/dashboard/profile", label: "Profile" },
                { href: "/dashboard/links", label: "Links" },
                { href: "/dashboard/products", label: "Products" },
                { href: "/dashboard/analytics", label: "Analytics" },
                { href: founderPublicUrl, label: "Public View", external: true },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center justify-between gap-2 rounded-lg border border-[color:var(--outline-variant)] bg-[color:var(--surface-container-low)] px-4 py-3 text-sm font-medium text-[color:var(--on-surface)] transition-colors hover:bg-[color:var(--surface-container)]"
                >
                  {item.label}
                  <ArrowRight className="h-4 w-4 text-[color:var(--on-surface-variant)]" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {!isFounderMode ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Builds</CardTitle>
          </CardHeader>
          <CardContent>
            {!builds || builds.length === 0 ? (
              <div className="text-center py-12">
                <p className="mb-4 text-[color:var(--on-surface-variant)]">
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
                    className="flex items-center justify-between gap-4 rounded-lg border border-[color:var(--outline-variant)] bg-[color:var(--surface-container-low)] p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate font-medium text-[color:var(--on-surface)]">{build.idea}</h3>
                      <p className="mt-1 text-xs text-[color:var(--on-surface-variant)]">
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
      ) : null}
    </div>
  );
}
