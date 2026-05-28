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
      <Card className="w-full max-w-md border-[var(--outline-variant)] bg-[var(--surface-container-low)]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-[#0070f3]/15 p-3">
              <Rocket className="h-6 w-6 text-[#0070f3]" />
            </div>
          </div>
          <CardTitle className="text-[var(--on-surface)]">Sign in with Magic Link</CardTitle>
          <CardDescription className="text-[var(--on-surface-variant)]">
            Enter your email and we&apos;ll send a secure sign-in link
          </CardDescription>
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
              <Label htmlFor="email" className="text-[var(--on-surface-variant)]">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="border-[var(--outline)] bg-[var(--surface-container)] text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]"
              />
            </div>

            <Button type="submit" className="w-full bg-[#0070f3] text-white" isLoading={isLoading}>
              Send Magic Link
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--on-surface-variant)]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#0070f3] hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
