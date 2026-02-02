export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-8">
			<div className="max-w-3xl text-center">
				<h1 className="mb-4 text-5xl font-bold tracking-tight">AI-DLC 2026</h1>
				<p className="mb-8 text-xl text-gray-600 dark:text-gray-400">
					AI-Driven Development Lifecycle
				</p>

				<div className="mb-12 rounded-lg border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-900">
					<p className="text-lg">
						A methodology for iterative AI-driven development with hat-based
						workflows.
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<div className="rounded-lg border border-gray-200 p-6 text-left dark:border-gray-800">
						<h2 className="mb-2 text-xl font-semibold">Researcher</h2>
						<p className="text-gray-600 dark:text-gray-400">
							Gather context and understand requirements before diving in.
						</p>
					</div>

					<div className="rounded-lg border border-gray-200 p-6 text-left dark:border-gray-800">
						<h2 className="mb-2 text-xl font-semibold">Planner</h2>
						<p className="text-gray-600 dark:text-gray-400">
							Design the implementation approach with clear steps.
						</p>
					</div>

					<div className="rounded-lg border border-gray-200 p-6 text-left dark:border-gray-800">
						<h2 className="mb-2 text-xl font-semibold">Builder</h2>
						<p className="text-gray-600 dark:text-gray-400">
							Execute the plan and implement the solution.
						</p>
					</div>

					<div className="rounded-lg border border-gray-200 p-6 text-left dark:border-gray-800">
						<h2 className="mb-2 text-xl font-semibold">Reviewer</h2>
						<p className="text-gray-600 dark:text-gray-400">
							Validate quality and completeness of the work.
						</p>
					</div>
				</div>

				<div className="mt-12">
					<a
						href="https://github.com/thebushidocollective/ai-dlc"
						className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
					>
						View on GitHub
					</a>
				</div>
			</div>
		</main>
	)
}
