"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { login } from "@/actions/auth";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const checkEmail = searchParams.get("checkEmail") === "true";

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    formData.append("redirect", redirectTo);

    const result = await login(formData);

    if (!result.success) {
      setError(result.error || "Something went wrong");
    } else {
      setSuccess("Magic link sent. Check your inbox to continue.");
    }

    setIsLoading(false);
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-violet-600/20 p-3">
              <Rocket className="h-6 w-6 text-violet-500" />
            </div>
          </div>
          <CardTitle>Sign in with Magic Link</CardTitle>
          <CardDescription>Enter your email and we&apos;ll send a secure sign-in link</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {(success || checkEmail) && (
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-300">
                {success || "Check your email for the sign-in link."}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Send Magic Link
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-violet-400 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
