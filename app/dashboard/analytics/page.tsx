import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Eye, MousePointerClick, Package, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/utils";
import { FounderDashboardNav } from "../_components/founder-dashboard-nav";

export const metadata = { title: "Analytics · Dashboard · Builddeck" };

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  icon: React.ComponentType<{ className?: string }>;
}

function MetricCard({ label, value, delta, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
          <Icon className="h-4 w-4" /> {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-white">{value}</p>
        {delta ? <p className="mt-1 text-xs text-emerald-400">{delta}</p> : null}
      </CardContent>
    </Card>
  );
}

export default async function DashboardAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // MVP: mock analytics. Wire to a real data source when persistence ships.
  const metrics = {
    profileViews: "1,284",
    linkClicks: "326",
    productClicks: "92",
    newsletterClicks: "41",
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="mt-1 text-zinc-400">Last 30 days · sample data while persistence is wired up.</p>
      </header>

      <FounderDashboardNav active="analytics" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Profile views" value={metrics.profileViews} delta="+12.4% vs prev" icon={Eye} />
        <MetricCard label="Link clicks" value={metrics.linkClicks} delta="+5.1% vs prev" icon={MousePointerClick} />
        <MetricCard label="Product clicks" value={metrics.productClicks} delta="+18.7% vs prev" icon={Package} />
        <MetricCard label="Newsletter clicks" value={metrics.newsletterClicks} icon={Mail} />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Top links</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-400">
            Detailed per-link, per-product, and referrer breakdowns ship with the analytics persistence milestone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
