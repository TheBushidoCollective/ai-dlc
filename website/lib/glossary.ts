import { getMainPaper } from "./papers"

export interface GlossaryTerm {
	term: string
	definition: string
	slug: string
}

/**
 * Generate a URL-safe slug from a term
 */
function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.trim()
}

/**
 * Extract glossary terms from the AI-DLC paper
 */
export function extractGlossaryTerms(): GlossaryTerm[] {
	const paper = getMainPaper()
	if (!paper) {
		return []
	}

	const terms: GlossaryTerm[] = []

	// Find the glossary section
	const glossaryMatch = paper.content.match(
		/## Glossary\s*\n\n([\s\S]*?)(?=\n---|\n## |$)/,
	)
	if (!glossaryMatch) {
		return []
	}

	const glossaryContent = glossaryMatch[1]

	// Parse the markdown table
	// Format: | **Term** | Definition |
	const tableRowRegex = /\|\s*\*\*([^*]+)\*\*\s*\|\s*([^|]+)\s*\|/g

	let match: RegExpExecArray | null
	while (true) {
		match = tableRowRegex.exec(glossaryContent)
		if (match === null) break
		const term = match[1].trim()
		const definition = match[2].trim()

		// Skip header row
		if (
			term.toLowerCase() === "term" ||
			definition.toLowerCase() === "definition"
		) {
			continue
		}

		terms.push({
			term,
			definition,
			slug: slugify(term),
		})
	}

	// Sort alphabetically by term
	return terms.sort((a, b) => a.term.localeCompare(b.term))
}

/**
 * Get all unique first letters for alphabetical index
 */
export function getGlossaryIndex(terms: GlossaryTerm[]): string[] {
	const letters = new Set<string>()
	for (const term of terms) {
		const firstLetter = term.term[0].toUpperCase()
		letters.add(firstLetter)
	}
	return Array.from(letters).sort()
}

/**
 * Group terms by first letter
 */
export function groupTermsByLetter(
	terms: GlossaryTerm[],
): Record<string, GlossaryTerm[]> {
	const groups: Record<string, GlossaryTerm[]> = {}

	for (const term of terms) {
		const firstLetter = term.term[0].toUpperCase()
		if (!groups[firstLetter]) {
			groups[firstLetter] = []
		}
		groups[firstLetter].push(term)
	}

	return groups
}

/**
 * Search glossary terms
 */
export function searchGlossaryTerms(
	terms: GlossaryTerm[],
	query: string,
): GlossaryTerm[] {
	if (!query.trim()) {
		return terms
	}

	const lowerQuery = query.toLowerCase()
	return terms.filter(
		(term) =>
			term.term.toLowerCase().includes(lowerQuery) ||
			term.definition.toLowerCase().includes(lowerQuery),
	)
}

/**
 * Get paper section anchor for a glossary term
 * Maps terms to their relevant paper sections
 */
export function getTermPaperAnchor(term: string): string | null {
	const termMappings: Record<string, string> = {
		Backpressure: "backpressure-over-prescription",
		Bolt: "bolt",
		"Completion Criteria": "completion-criteria",
		"Completion Promise": "autonomous-bolt-ahotl",
		"Context Budget": "context-is-abundant-use-it-wisely",
		HITL: "three-operating-modes-hitl-ohotl-and-ahotl",
		AHOTL: "three-operating-modes-hitl-ohotl-and-ahotl",
		OHOTL: "three-operating-modes-hitl-ohotl-and-ahotl",
		Integrator: "bolt",
		Intent: "intent",
		"Memory Provider": "memory-providers-expand-knowledge",
		"Mob Elaboration": "mob-elaboration-ritual",
		"Mob Construction": "mob-construction-ritual",
		"Quality Gate": "backpressure-over-prescription",
		"Ralph Wiggum Pattern": "implementing-autonomous-bolts",
		Unit: "unit",
		"Unit DAG": "unit",
	}

	return termMappings[term] || null
}
