import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionPlaceholder } from '@/components/layout/section-placeholder';

const members = [
  { name: 'Ava Chen', role: 'owner' },
  { name: 'Noah Kim', role: 'admin' },
  { name: 'Mia Patel', role: 'member' },
];

export default function TeamPage() {
  return (
    <div className="space-y-6 pb-8">
      <SectionPlaceholder title="Team" description="Invite collaborators and keep permissions light and predictable." action={<Button size="sm">Invite member</Button>} />
      <div className="grid gap-4 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.name}>
            <CardHeader>
              <CardDescription>{member.role}</CardDescription>
              <CardTitle>{member.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-500 dark:text-slate-400">
              Placeholder permission model for workspace access and product ownership.
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}