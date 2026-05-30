import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardDescription>BuilddeckWorkspace access</CardDescription>
          <CardTitle className="text-2xl">Sign in to your workspace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input className="h-11 w-full rounded-xl border border-slate-200 bg-transparent px-3 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800" placeholder="founder@company.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input type="password" className="h-11 w-full rounded-xl border border-slate-200 bg-transparent px-3 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800" placeholder="••••••••" />
          </div>
          <Button className="w-full">Sign in</Button>
          <p className="text-sm text-slate-500">
            New here? <Link className="font-medium text-slate-950 underline dark:text-slate-50" href="/signup">Create an account</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}