"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type FormStatus = "idle" | "loading" | "success" | "duplicate" | "error";

interface WaitlistResponse {
  success: boolean;
  message: string;
  alreadyExists?: boolean;
}

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "builddeck-landing",
        }),
      });

      const result = (await response.json()) as WaitlistResponse;

      if (!response.ok || !result.success) {
        setStatus("error");
        setMessage(result.message || "Something went wrong. Please try again.");
        return;
      }

      setStatus(result.alreadyExists ? "duplicate" : "success");
      setMessage(result.message);
      if (!result.alreadyExists) {
        setEmail("");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={status === "loading"}
          className="h-12 flex-1 rounded-full border border-[var(--outline)] bg-[var(--surface-container-low)] px-4 text-[var(--on-surface)] placeholder-[var(--on-surface-variant)] transition-all focus:outline-none focus:ring-2 focus:ring-[#0070f3]"
        />
        <Button
          type="submit"
          isLoading={status === "loading"}
          disabled={status === "loading"}
          className="h-12 rounded-full bg-[#0070f3] px-8 hover:shadow-[0_0_20px_rgba(0,112,243,0.3)]"
        >
          Join waitlist
        </Button>
      </form>

      {status === "success" && (
        <p className="mt-3 text-sm text-[#8fb8ff]">
          {message || "You’re on the list. We’ll send early access soon."}
        </p>
      )}

      {status === "duplicate" && (
        <p className="mt-3 text-sm text-[#ffd88a]">
          {message || "This email already exists on the waitlist."}
        </p>
      )}

      {status === "error" && (
        <p className="mt-3 text-sm text-[#ffb4ab]">
          {message || "Please enter a valid email address."}
        </p>
      )}
    </div>
  );
}
