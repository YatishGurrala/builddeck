import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics';
import { RecentDocsChart } from '@/components/dashboard/recent-docs-chart';

const activity = [
  { title: 'Launch checklist ready', detail: 'Product Alpha', time: '2h ago' },
  { title: 'Roadmap item shipped', detail: 'Pricing experiment', time: '5h ago' },
  { title: 'Doc updated', detail: 'PRD: Onboarding flow', time: 'Yesterday' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-8">
      <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Overview</p>
        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">Founder command center</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              Track products, execute the roadmap, and keep docs and tasks aligned from one workspace.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/60">
            <p className="font-medium text-slate-950 dark:text-slate-50">Focus this week</p>
            <p className="text-slate-500 dark:text-slate-400">Ship onboarding, validate pricing, and prepare launch notes.</p>
          </div>
        </div>
      </section>

      <DashboardMetrics />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <RecentDocsChart />

        <Card>
          <CardHeader>
            <CardDescription>Workspace pulse</CardDescription>
            <CardTitle>Recent updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <p className="font-medium text-slate-950 dark:text-slate-50">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.detail}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">{item.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}