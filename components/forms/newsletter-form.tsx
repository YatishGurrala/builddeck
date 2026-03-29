"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3ce36a]/20">
          <CheckCircle className="h-5 w-5 text-[#3ce36a]" />
        </div>
        <p className="text-[#3ce36a] font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
          className="flex-1 h-12 px-4 rounded-full bg-[#181c21] border border-[#414754]/30 text-[#e0e2ea] placeholder-[#8b90a0] focus:outline-none focus:ring-2 focus:ring-[#0070f3] transition-all"
        />
        <Button 
          type="submit" 
          isLoading={status === "loading"}
          className="h-12 px-8 rounded-full bg-[#0070f3] hover:shadow-[0_0_20px_rgba(0,112,243,0.3)]"
        >
          Subscribe
        </Button>
      </form>
      {status === "error" && message && (
        <p className="mt-3 text-sm text-[#ffb4ab] text-center">{message}</p>
      )}
    </div>
  );
}
