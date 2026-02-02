import Link from "next/link"

const hats = [
	{
		name: "Researcher",
		icon: (
			<svg
				className="h-8 w-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
		),
		description:
			"Gather context, understand requirements, and research existing patterns before diving into implementation.",
		color: "text-blue-600 dark:text-blue-400",
		bgColor: "bg-blue-50 dark:bg-blue-950/50",
		borderColor: "border-blue-200 dark:border-blue-900",
	},
	{
		name: "Planner",
		icon: (
			<svg
				className="h-8 w-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
				/>
			</svg>
		),
		description:
			"Design the implementation approach with clear steps, identify dependencies, and create actionable plans.",
		color: "text-purple-600 dark:text-purple-400",
		bgColor: "bg-purple-50 dark:bg-purple-950/50",
		borderColor: "border-purple-200 dark:border-purple-900",
	},
	{
		name: "Builder",
		icon: (
			<svg
				className="h-8 w-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
				/>
			</svg>
		),
		description:
			"Execute the plan, write code, implement features, and build the solution with focus and precision.",
		color: "text-green-600 dark:text-green-400",
		bgColor: "bg-green-50 dark:bg-green-950/50",
		borderColor: "border-green-200 dark:border-green-900",
	},
	{
		name: "Reviewer",
		icon: (
			<svg
				className="h-8 w-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		),
		description:
			"Validate quality, review completeness, verify tests pass, and ensure the work meets requirements.",
		color: "text-amber-600 dark:text-amber-400",
		bgColor: "bg-amber-50 dark:bg-amber-950/50",
		borderColor: "border-amber-200 dark:border-amber-900",
	},
]

const features = [
	{
		title: "Iterative Development",
		description:
			"Work in focused units with clear outcomes. Each iteration builds on the last, maintaining momentum while ensuring quality.",
	},
	{
		title: "Clear Responsibilities",
		description:
			"Each hat has a specific purpose. Switch contexts intentionally, not accidentally. Know what mode you are in.",
	},
	{
		title: "AI-Native Workflow",
		description:
			"Designed from the ground up for AI-driven development. Works seamlessly with Claude Code and other AI assistants.",
	},
	{
		title: "Quality Built-In",
		description:
			"Review is not an afterthought. Every unit goes through validation. Ship with confidence.",
	},
]

export default function Home() {
	return (
		<div>
			{/* Hero Section */}
			<section className="relative overflow-hidden px-4 py-24 sm:py-32">
				<div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(59,130,246,0.1),transparent)] dark:bg-[radial-gradient(45%_40%_at_50%_60%,rgba(59,130,246,0.05),transparent)]" />
				<div className="mx-auto max-w-4xl text-center">
					<h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
						AI-DLC{" "}
						<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
							2026
						</span>
					</h1>
					<p className="mb-4 text-xl text-gray-600 dark:text-gray-400 sm:text-2xl">
						AI-Driven Development Lifecycle
					</p>
					<p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
						A methodology for iterative, high-quality software development with
						AI. Define clear phases, switch hats intentionally, and ship with
						confidence.
					</p>
					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Link
							href="/docs/"
							className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
						>
							Get Started
							<svg
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 7l5 5m0 0l-5 5m5-5H6"
								/>
							</svg>
						</Link>
						<a
							href="https://github.com/thebushidocollective/ai-dlc"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
						>
							View on GitHub
							<svg
								className="h-4 w-4"
								fill="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									fillRule="evenodd"
									d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
									clipRule="evenodd"
								/>
							</svg>
						</a>
					</div>
				</div>
			</section>

			{/* Hats Section */}
			<section className="bg-gray-50 px-4 py-24 dark:bg-gray-900/50">
				<div className="mx-auto max-w-6xl">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-bold sm:text-4xl">
							Four Hats, One Workflow
						</h2>
						<p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
							AI-DLC uses a hat-based approach to separate concerns. Each hat
							represents a distinct mindset and set of responsibilities.
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-2">
						{hats.map((hat) => (
							<div
								key={hat.name}
								className={`rounded-xl border p-6 ${hat.bgColor} ${hat.borderColor}`}
							>
								<div className={`mb-4 ${hat.color}`}>{hat.icon}</div>
								<h3 className="mb-2 text-xl font-semibold">{hat.name}</h3>
								<p className="text-gray-600 dark:text-gray-400">
									{hat.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="px-4 py-24">
				<div className="mx-auto max-w-6xl">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-bold sm:text-4xl">
							Why AI-DLC?
						</h2>
						<p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
							Built for the age of AI-assisted development. Structure your
							workflow to get the most out of your AI collaborators.
						</p>
					</div>
					<div className="grid gap-8 md:grid-cols-2">
						{features.map((feature) => (
							<div key={feature.title} className="flex gap-4">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
									<svg
										className="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</div>
								<div>
									<h3 className="mb-2 font-semibold">{feature.title}</h3>
									<p className="text-gray-600 dark:text-gray-400">
										{feature.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="border-t border-gray-200 bg-gray-50 px-4 py-24 dark:border-gray-800 dark:bg-gray-900/50">
				<div className="mx-auto max-w-4xl text-center">
					<h2 className="mb-4 text-3xl font-bold sm:text-4xl">
						Ready to get started?
					</h2>
					<p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
						Install the Claude Code plugin and start using AI-DLC in your
						projects today.
					</p>
					<div className="inline-block rounded-lg bg-gray-900 p-4 text-left font-mono text-sm text-white dark:bg-gray-800">
						<code>/install-plugin thebushidocollective/ai-dlc</code>
					</div>
				</div>
			</section>
		</div>
	)
}
