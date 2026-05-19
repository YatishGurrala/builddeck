import { IdeaInputForm } from "@/components/forms/idea-input-form";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 pb-16 pt-24 md:pt-28">
      <section className="rounded-3xl border border-white/10 bg-[#12161f] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:p-12">
        <p className="mb-4 inline-flex rounded-full border border-[#2e3a4f] bg-[#172133] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#8fb8ff]">
          BuildDeck MVP
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
          Turn your product idea into a structured build plan in minutes.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#aab6cf] md:text-lg">
          Describe your idea and BuildDeck will generate a product overview, core features,
          recommended stack, UI plan, and backend structure.
        </p>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0f131b] p-6 md:p-8">
        <h2 className="mb-4 text-xl font-semibold text-white">Enter your product idea</h2>
        <IdeaInputForm />
      </section>
    </main>
  );
}
