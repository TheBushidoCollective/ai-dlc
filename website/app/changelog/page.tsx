import { getChangelog } from "@/lib/changelog"
import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Changelog",
	description:
		"What's new in AI-DLC — a complete history of features, fixes, and changes.",
	openGraph: {
		title: "AI-DLC Changelog",
		description:
			"What's new in AI-DLC — a complete history of features, fixes, and changes.",
	},
}

function formatDate(dateString: string): string {
	const date = new Date(`${dateString}T00:00:00`)
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	})
}

function sectionTypeColor(type: string): string {
	switch (type.toLowerCase()) {
		case "added":
			return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
		case "fixed":
			return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
		case "changed":
			return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
		default:
			return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
	}
}

export default function ChangelogPage() {
	const entries = getChangelog()

	return (
		<div className="mx-auto max-w-3xl px-4 py-8 lg:py-12">
			<header className="mb-12">
				<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
					Changelog
				</h1>
				<p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
					A complete history of features, fixes, and changes in AI-DLC.
				</p>
			</header>

			{entries.length === 0 ? (
				<div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900">
					<p className="text-gray-600 dark:text-gray-400">
						No changelog entries yet.
					</p>
				</div>
			) : (
				<div className="space-y-12">
					{entries.map((entry) => (
						<section
							key={entry.version}
							id={`v${entry.version}`}
							className="scroll-mt-24"
						>
							<div className="mb-4 flex flex-wrap items-baseline gap-3">
								<a
									href={`#v${entry.version}`}
									className="text-2xl font-bold tracking-tight hover:text-blue-600 dark:hover:text-blue-400"
								>
									v{entry.version}
								</a>
								<time className="text-sm text-gray-500 dark:text-gray-500">
									{formatDate(entry.date)}
								</time>
							</div>

							{entry.sections.length > 0 ? (
								<div className="space-y-4">
									{entry.sections.map((section) => (
										<div key={section.type}>
											<span
												className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${sectionTypeColor(section.type)}`}
											>
												{section.type}
											</span>
											<ul className="mt-2 space-y-1">
												{section.items.map((item, index) => (
													<li
														key={index}
														className="flex gap-2 text-gray-700 dark:text-gray-300"
													>
														<span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400 dark:bg-gray-600" />
														<span>{item}</span>
													</li>
												))}
											</ul>
										</div>
									))}
								</div>
							) : (
								<p className="text-sm text-gray-500 dark:text-gray-500">
									No notable changes.
								</p>
							)}

							{entry !==
								entries[entries.length - 1] && (
								<div className="mt-8 border-b border-gray-200 dark:border-gray-800" />
							)}
						</section>
					))}
				</div>
			)}
		</div>
	)
}
