import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Eye, MousePointerClick, Package, Mail, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/utils";
import { getFounderAnalyticsForUser } from "@/lib/founder-profile/store";
import { FounderDashboardNav } from "../_components/founder-dashboard-nav";

export const metadata = { title: "Analytics · Dashboard · Builddeck" };

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}

function MetricCard({ label, value, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[color:var(--on-surface-variant)]">
          <Icon className="h-4 w-4" /> {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-[color:var(--on-surface)]">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}

export default async function DashboardAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const metrics = await getFounderAnalyticsForUser(user);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[color:var(--on-surface)]">Analytics</h1>
        <p className="mt-1 text-[color:var(--on-surface-variant)]">Last 30 days · live founder profile events.</p>
      </header>

      <FounderDashboardNav active="analytics" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Profile views" value={metrics.profileViews} icon={Eye} />
        <MetricCard label="Link clicks" value={metrics.linkClicks} icon={MousePointerClick} />
        <MetricCard label="Product clicks" value={metrics.productClicks} icon={Package} />
        <MetricCard label="Newsletter clicks" value={metrics.newsletterClicks} icon={Mail} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Social clicks" value={metrics.socialClicks} icon={Share2} />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Top links</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.topLinks.length === 0 ? (
            <p className="text-sm text-[color:var(--on-surface-variant)]">No tracked link clicks yet.</p>
          ) : (
            <ul className="space-y-2">
              {metrics.topLinks.map((item) => (
                <li
                  key={item.targetId}
                  className="flex items-center justify-between rounded-lg border border-[color:var(--outline-variant)] bg-[color:var(--surface-container-low)] px-3 py-2"
                >
                  <span className="text-sm text-[color:var(--on-surface)]">{item.label}</span>
                  <span className="text-xs font-semibold text-[color:var(--on-surface-variant)]">{item.clicks.toLocaleString()} clicks</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
