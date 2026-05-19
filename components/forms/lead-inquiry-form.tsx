"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function LeadInquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Failed to submit inquiry.");
        return;
      }

      setSuccess("Thanks. We received your inquiry and will contact you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Something went wrong while submitting your inquiry.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lead-name">Name</Label>
          <Input
            id="lead-name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead-email">Email</Label>
          <Input
            id="lead-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lead-message">Message</Label>
        <Textarea
          id="lead-message"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Share what you want help building"
          className="min-h-28"
          required
        />
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {success ? <p className="text-sm text-green-300">{success}</p> : null}

      <Button type="submit" isLoading={isLoading}>
        Submit Inquiry
      </Button>
    </form>
  );
}
