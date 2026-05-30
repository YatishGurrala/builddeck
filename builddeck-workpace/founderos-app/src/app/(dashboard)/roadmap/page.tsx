import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionPlaceholder } from '@/components/layout/section-placeholder';

const roadmap = [
  { title: 'Onboarding flow rewrite', status: 'planned', priority: 'high', target: 'Jun 18' },
  { title: 'Pricing page refresh', status: 'in-progress', priority: 'medium', target: 'Jun 10' },
  { title: 'Launch metrics dashboard', status: 'shipped', priority: 'low', target: 'Jun 2' },
];

export default function RoadmapPage() {
  return (
    <div className="space-y-6 pb-8">
      <SectionPlaceholder title="Roadmap" description="Manage initiative status, priorities, and target dates in a product-first roadmap." action={<Button size="sm">Add item</Button>} />
      <div className="grid gap-4 lg:grid-cols-3">
        {roadmap.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardDescription>{item.status}</CardDescription>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <p>Priority: {item.priority}</p>
              <p>Target date: {item.target}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}