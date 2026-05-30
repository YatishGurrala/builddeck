import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const metrics = [
  { label: 'Total products', value: '12', delta: '+3 this month' },
  { label: 'Active tasks', value: '48', delta: '14 due soon' },
  { label: 'Roadmap shipped', value: '67%', delta: 'This quarter' },
  { label: 'Docs updated', value: '9', delta: 'Last 7 days' },
];

export function DashboardMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader className="pb-3">
            <CardDescription>{metric.label}</CardDescription>
            <CardTitle className="text-3xl">{metric.value}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 dark:text-slate-400">{metric.delta}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}