import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionPlaceholder } from '@/components/layout/section-placeholder';

const docs = [
  { title: 'PRD: Onboarding rewrite', template: 'prd' },
  { title: 'Launch Plan: Q3 beta', template: 'launch_plan' },
  { title: 'Feature Spec: Mobile nav', template: 'feature_spec' },
];

export default function DocsPage() {
  return (
    <div className="space-y-6 pb-8">
      <SectionPlaceholder title="Docs" description="Markdown-first docs with templates for PRDs, launch plans, and feature specs." action={<Button size="sm">New doc</Button>} />
      <div className="grid gap-4 lg:grid-cols-3">
        {docs.map((doc) => (
          <Card key={doc.title}>
            <CardHeader>
              <CardDescription>{doc.template}</CardDescription>
              <CardTitle>{doc.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-500 dark:text-slate-400">
              Linked to product roadmap context and ready for collaborative editing.
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}