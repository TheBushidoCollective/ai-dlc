import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const docsDirectory = path.join(process.cwd(), "content/docs")

export interface DocPage {
	slug: string
	title: string
	description?: string
	content: string
	order?: number
}

export interface NavItem {
	title: string
	href: string
	items?: NavItem[]
}

export function getDocSlugs(): string[] {
	if (!fs.existsSync(docsDirectory)) {
		return []
	}

	return fs
		.readdirSync(docsDirectory)
		.filter((file) => file.endsWith(".md"))
		.map((file) => file.replace(/\.md$/, ""))
}

export function getDocBySlug(slug: string): DocPage | null {
	const fullPath = path.join(docsDirectory, `${slug}.md`)

	if (!fs.existsSync(fullPath)) {
		return null
	}

	const fileContents = fs.readFileSync(fullPath, "utf8")
	const { data, content } = matter(fileContents)

	return {
		slug,
		title: data.title || slug,
		description: data.description,
		content,
		order: data.order,
	}
}

export function getAllDocs(): DocPage[] {
	const slugs = getDocSlugs()
	const docs = slugs
		.map((slug) => getDocBySlug(slug))
		.filter((doc): doc is DocPage => doc !== null)

	// Sort by order if specified, then by title
	return docs.sort((a, b) => {
		if (a.order !== undefined && b.order !== undefined) {
			return a.order - b.order
		}
		if (a.order !== undefined) return -1
		if (b.order !== undefined) return 1
		return a.title.localeCompare(b.title)
	})
}

export function getDocsNavigation(): NavItem[] {
	const docs = getAllDocs()

	// Create navigation structure
	const nav: NavItem[] = [
		{
			title: "Getting Started",
			href: "/docs/",
			items: docs.map((doc) => ({
				title: doc.title,
				href: `/docs/${doc.slug}/`,
			})),
		},
	]

	return nav
}
