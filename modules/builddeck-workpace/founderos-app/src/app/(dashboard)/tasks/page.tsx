import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionPlaceholder } from '@/components/layout/section-placeholder';

const columns = [
  { title: 'Todo', items: ['Ship billing copy', 'Review onboarding spec'] },
  { title: 'In progress', items: ['Update landing page', 'QA invite flow'] },
  { title: 'Review', items: ['Product feedback digest'] },
  { title: 'Done', items: ['PRD template published'] },
];

export default function TasksPage() {
  return (
    <div className="space-y-6 pb-8">
      <SectionPlaceholder title="Tasks" description="A task list and kanban board will share the same dataset and filters." action={<Button size="sm">New task</Button>} />
      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map((column) => (
          <Card key={column.title}>
            <CardHeader>
              <CardDescription>{column.items.length} items</CardDescription>
              <CardTitle>{column.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {column.items.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-900/60">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}