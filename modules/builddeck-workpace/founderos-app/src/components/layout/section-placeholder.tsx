import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type SectionPlaceholderProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function SectionPlaceholder({ title, description, action }: SectionPlaceholderProps) {
  return (
    <Card className="border-dashed bg-white/80 backdrop-blur dark:bg-slate-950/80">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
        <span>This route is wired and ready for the first data model.</span>
        {action}
      </CardContent>
    </Card>
  );
}