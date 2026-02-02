import Link from "next/link"

export function Footer() {
	return (
		<footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
			<div className="mx-auto max-w-6xl px-4 py-12">
				<div className="grid gap-8 md:grid-cols-3">
					<div>
						<h3 className="mb-4 font-semibold">AI-DLC 2026</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							A methodology for iterative AI-driven development with hat-based
							workflows.
						</p>
					</div>

					<div>
						<h3 className="mb-4 font-semibold">Resources</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/docs/"
									className="text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
								>
									Documentation
								</Link>
							</li>
							<li>
								<Link
									href="/blog/"
									className="text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
								>
									Blog
								</Link>
							</li>
							<li>
								<a
									href="https://github.com/thebushidocollective/ai-dlc"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
								>
									GitHub
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="mb-4 font-semibold">Related Projects</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<a
									href="https://han.guru"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
								>
									Han - Claude Code Plugins
								</a>
							</li>
							<li>
								<a
									href="https://www.anthropic.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
								>
									Anthropic
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
					<p>
						Built with{" "}
						<a
							href="https://nextjs.org"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:underline"
						>
							Next.js
						</a>{" "}
						and{" "}
						<a
							href="https://tailwindcss.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:underline"
						>
							Tailwind CSS
						</a>
						.
					</p>
					<p className="mt-2">
						&copy; {new Date().getFullYear()} The Bushido Collective. MIT
						License.
					</p>
				</div>
			</div>
		</footer>
	)
}
