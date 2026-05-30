import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionPlaceholder } from '@/components/layout/section-placeholder';

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-8">
      <SectionPlaceholder title="Settings" description="Profile, workspace, and product settings will live in a single predictable area." />
      <div className="grid gap-4 lg:grid-cols-3">
        {['Profile settings', 'Workspace settings', 'Product settings'].map((title) => (
          <Card key={title}>
            <CardHeader>
              <CardDescription>Configuration</CardDescription>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-500 dark:text-slate-400">
              Placeholder form surface for the first iteration.
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}