"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { CheckCircle } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const result = await subscribeToNewsletter(email);

    if (result.success) {
      setStatus("success");
      setMessage("Thanks for subscribing! Check your email for confirmation.");
      setEmail("");
    } else {
      setStatus("error");
      setMessage(result.error || "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-3 py-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20">
          <CheckCircle className="h-5 w-5 text-green-400" />
        </div>
        <p className="text-green-400 font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
          className="flex-1 h-12 bg-zinc-800/80 border-zinc-700"
        />
        <Button 
          type="submit" 
          isLoading={status === "loading"}
          className="h-12 px-6"
        >
          Subscribe
        </Button>
      </form>
      {status === "error" && message && (
        <p className="mt-3 text-sm text-red-400 text-center">{message}</p>
      )}
    </div>
  );
}
