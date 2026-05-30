import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignupPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardDescription>Create BuilddeckWorkspace</CardDescription>
          <CardTitle className="text-2xl">Start a new founder workspace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full name</label>
            <input className="h-11 w-full rounded-xl border border-slate-200 bg-transparent px-3 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800" placeholder="Ava Chen" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input className="h-11 w-full rounded-xl border border-slate-200 bg-transparent px-3 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800" placeholder="ava@builddeckworkspace.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input type="password" className="h-11 w-full rounded-xl border border-slate-200 bg-transparent px-3 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800" placeholder="Create a secure password" />
          </div>
          <Button className="w-full">Create account</Button>
          <p className="text-sm text-slate-500">
            Already have an account? <Link className="font-medium text-slate-950 underline dark:text-slate-50" href="/login">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}