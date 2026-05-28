export default function AboutPage() {
	return (
		<main className="container mx-auto max-w-5xl px-6 py-24">
			<section className="rounded-3xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)] md:p-10">
				<h1 className="text-3xl font-bold tracking-tight text-[var(--on-surface)] md:text-5xl">
					Build products. Grow audience. Launch smarter.
				</h1>
				<p className="mt-4 text-base leading-relaxed text-[var(--on-surface-variant)] md:text-lg">
					BuildDeck is a founder-first platform sharing systems, AI workflows, and launch
					strategies to help builders turn ideas into products and products into businesses.
				</p>
			</section>

			<section className="mt-8 rounded-3xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-8">
				<h2 className="text-2xl font-bold text-[var(--on-surface)]">Why BuildDeck exists</h2>
				<p className="mt-4 text-[var(--on-surface-variant)]">
					Modern founders can build products faster than ever.
				</p>
				<p className="mt-2 text-[var(--on-surface-variant)]">
					But distribution, visibility, and consistency are still difficult.
				</p>
				<p className="mt-4 text-[var(--on-surface)]">BuildDeck was created to help founders:</p>
				<ul className="mt-3 grid gap-2 text-[var(--on-surface-variant)] md:grid-cols-2">
					<li>Structure ideas</li>
					<li>Launch faster</li>
					<li>Distribute smarter</li>
					<li>Build systems around their products</li>
				</ul>
				<p className="mt-5 text-[var(--on-surface)]">We believe:</p>
				<ul className="mt-3 grid gap-2 text-[var(--on-surface-variant)] md:grid-cols-2">
					<li>Building is easier than distribution</li>
					<li>Consistency compounds</li>
					<li>Audience matters</li>
					<li>Content is leverage</li>
					<li>Simple systems outperform complexity</li>
				</ul>
				<p className="mt-5 text-[var(--on-surface-variant)]">
					BuildDeck is being built in public as an evolving ecosystem for modern internet founders.
				</p>
			</section>

			<section className="mt-8 rounded-3xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-8">
				<h2 className="text-2xl font-bold text-[var(--on-surface)]">Mission</h2>
				<p className="mt-3 text-[var(--on-surface-variant)]">
					Our mission is to help founders build faster, distribute smarter, and create sustainable
					businesses online.
				</p>
			</section>

		</main>
	);
}
