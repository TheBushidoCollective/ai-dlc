import fs from "node:fs"
import path from "node:path"

export interface ChangelogEntry {
	version: string
	date: string
	sections: ChangelogSection[]
}

export interface ChangelogSection {
	type: string
	items: string[]
}

const changelogPath = path.join(process.cwd(), "..", "CHANGELOG.md")

/**
 * Returns the raw markdown content of the CHANGELOG.md file,
 * excluding the preamble (title and format description).
 */
export function getChangelogContent(): string {
	if (!fs.existsSync(changelogPath)) {
		return ""
	}

	const fileContents = fs.readFileSync(changelogPath, "utf8")

	// Strip the preamble lines (title + description) before the first version heading
	const firstVersionIndex = fileContents.indexOf("\n## [")
	if (firstVersionIndex === -1) {
		return fileContents
	}

	return fileContents.slice(firstVersionIndex + 1)
}

/**
 * Parses the CHANGELOG.md into structured version entries.
 * Expects Keep a Changelog format with ## [version] - date headings
 * and ### Type subsections.
 */
export function getChangelog(): ChangelogEntry[] {
	if (!fs.existsSync(changelogPath)) {
		return []
	}

	const fileContents = fs.readFileSync(changelogPath, "utf8")
	const entries: ChangelogEntry[] = []

	// Split on version headings: ## [x.y.z] - YYYY-MM-DD
	const versionRegex = /^## \[([^\]]+)\]\s*-\s*(\S+)/gm
	const matches = [...fileContents.matchAll(versionRegex)]

	for (let i = 0; i < matches.length; i++) {
		const match = matches[i]
		const version = match[1]
		const date = match[2]

		// Get the content between this version heading and the next (or EOF)
		const startIndex = match.index! + match[0].length
		const endIndex =
			i + 1 < matches.length ? matches[i + 1].index! : fileContents.length
		const sectionContent = fileContents.slice(startIndex, endIndex)

		// Parse subsections (### Added, ### Fixed, ### Changed, ### Other)
		const sections: ChangelogSection[] = []
		const sectionRegex = /^### (.+)/gm
		const sectionMatches = [...sectionContent.matchAll(sectionRegex)]

		for (let j = 0; j < sectionMatches.length; j++) {
			const sectionMatch = sectionMatches[j]
			const type = sectionMatch[1].trim()

			const sectionStart = sectionMatch.index! + sectionMatch[0].length
			const sectionEnd =
				j + 1 < sectionMatches.length
					? sectionMatches[j + 1].index!
					: sectionContent.length
			const itemsContent = sectionContent.slice(sectionStart, sectionEnd)

			// Extract list items
			const items = itemsContent
				.split("\n")
				.filter((line) => line.startsWith("- "))
				.map((line) => line.slice(2).trim())

			if (items.length > 0) {
				sections.push({ type, items })
			}
		}

		entries.push({ version, date, sections })
	}

	return entries
}
