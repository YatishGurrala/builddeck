import { WaitlistForm } from "@/components/forms/waitlist-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pb-16 pt-24 md:pt-28">
      <section className="rounded-3xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.2)] md:p-12">
        <p className="mb-4 inline-flex rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">
          BuildDeck
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--on-surface)] md:text-5xl">
          Build faster.
          <br />
          Distribute smarter.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--on-surface-variant)] md:text-lg">
          BuildDeck helps founders launch products, grow audiences, and build online businesses
          using modern workflows, AI tools, and distribution systems.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="#waitlist-email">
            <Button className="rounded-full bg-[#0070f3] px-7">Join Waitlist</Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-[var(--on-surface-variant)]">
          Launching soon. Building in public.
        </p>
      </section>

      <section className="rounded-3xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-7 md:p-8">
        <h2 className="text-2xl font-bold text-[var(--on-surface)]">What is BuildDeck?</h2>
        <p className="mt-4 text-[var(--on-surface-variant)]">
          BuildDeck is a founder-first ecosystem focused on helping builders launch products faster
          and distribute them smarter.
        </p>
        <p className="mt-4 text-[var(--on-surface-variant)]">We believe building is easier than distribution.</p>
        <p className="mt-4 text-[var(--on-surface)]">That&apos;s why BuildDeck focuses on:</p>
        <ul className="mt-3 grid gap-2 text-[var(--on-surface-variant)] md:grid-cols-2">
          <li>Founder workflows</li>
          <li>AI-assisted systems</li>
          <li>Launch strategies</li>
          <li>Content and distribution</li>
          <li>Startup execution</li>
        </ul>
      </section>

      <section className="rounded-3xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-7 md:p-8">
        <h2 className="text-2xl font-bold text-[var(--on-surface)]">What You&apos;ll Find Inside</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container)] p-5">
            <h3 className="text-base font-semibold text-[var(--on-surface)]">Founder Insights</h3>
            <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
              Startup lessons, launch breakdowns, validation ideas, and growth strategies.
            </p>
          </article>
          <article className="rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container)] p-5">
            <h3 className="text-base font-semibold text-[var(--on-surface)]">AI-Powered Workflows</h3>
            <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
              Simple systems to help founders move faster using AI.
            </p>
          </article>
          <article className="rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container)] p-5">
            <h3 className="text-base font-semibold text-[var(--on-surface)]">Product Systems</h3>
            <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
              Frameworks for MVPs, launches, and startup execution.
            </p>
          </article>
          <article className="rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container)] p-5">
            <h3 className="text-base font-semibold text-[var(--on-surface)]">Launch Experiments</h3>
            <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
              Real build-in-public experiments and founder case studies.
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-7 md:p-8">
        <h2 className="text-2xl font-bold text-[var(--on-surface)]">What&apos;s coming next</h2>
        <p className="mt-4 text-[var(--on-surface-variant)]">
          We&apos;re building lightweight tools to help founders validate, structure, and launch
          products faster.
        </p>
        <p className="mt-4 text-[var(--on-surface)]">Coming soon:</p>
        <ul className="mt-3 grid gap-2 text-[var(--on-surface-variant)] md:grid-cols-2">
          <li>MVP Generator</li>
          <li>Startup Validator</li>
          <li>PRD Builder</li>
          <li>Launch Checklist Generator</li>
          <li>Founder Profiles</li>
        </ul>
        <p className="mt-4 text-sm text-[var(--on-surface-variant)]">Early access coming soon.</p>
      </section>

      <section id="waitlist-email" className="rounded-3xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-7 md:p-8">
        <h2 className="text-2xl font-bold text-[var(--on-surface)]">Waitlist</h2>
        <p className="mt-3 text-[var(--on-surface-variant)]">
          Join the early waitlist for direct product access updates.
        </p>
        <div className="mt-5">
          <WaitlistForm />
        </div>
      </section>
    </main>
  );
}
