"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LeadInquiryForm } from "@/components/forms/lead-inquiry-form";

type BuildOutput = {
  overview: string;
  features: string[];
  techStack: string[];
  uiPlan: string;
  backendPlan: string;
};

export function IdeaInputForm() {
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BuildOutput | null>(null);
  const [saved, setSaved] = useState<boolean | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(null);

    if (!idea.trim()) {
      setError("Please enter a product idea.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/generate-build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "Failed to generate build output.");
        return;
      }

      setResult(data.output as BuildOutput);
      setSaved(Boolean(data.saved));
    } catch {
      setError("Something went wrong while generating your build.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <Textarea
          name="idea"
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          placeholder="Example: A platform that helps local gyms automate class bookings, reminders, and member billing."
          className="min-h-36 border-[#2a3344] bg-[#141a25] text-sm text-white placeholder:text-[#73809c] focus:ring-[#0070f3] focus:ring-offset-[#0f131b]"
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <Button type="submit" isLoading={isLoading} className="w-full md:w-auto" size="lg">
          Generate Build
        </Button>
      </form>

      {result ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#2a3344] bg-[#141a25] p-5 text-sm text-[#d5def0]">
            <h3 className="mb-3 text-lg font-semibold text-white">Generated Build</h3>
            <p className="mb-4 text-[#c3cde2]">{result.overview}</p>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-white">Features</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-[#b7c3dc]">
                  {result.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-white">Tech Stack</p>
                <p className="mt-1 text-[#b7c3dc]">{result.techStack.join(", ")}</p>
              </div>
              <div>
                <p className="font-medium text-white">UI Plan</p>
                <p className="mt-1 text-[#b7c3dc]">{result.uiPlan}</p>
              </div>
              <div>
                <p className="font-medium text-white">Backend Plan</p>
                <p className="mt-1 text-[#b7c3dc]">{result.backendPlan}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-[#8fa0c2]">
              {saved
                ? "Saved to your account."
                : "Sign in to save generated builds to your dashboard."}
            </p>
          </div>

          <div className="rounded-2xl border border-[#2a3344] bg-[#111826] p-5">
            <h3 className="text-lg font-semibold text-white">Need help building this?</h3>
            <p className="mb-4 mt-1 text-sm text-[#b7c3dc]">
              Tell us what you need and we&apos;ll follow up with a scoped execution plan.
            </p>
            <LeadInquiryForm />
          </div>
        </div>
      ) : null}
    </div>
  );
}
