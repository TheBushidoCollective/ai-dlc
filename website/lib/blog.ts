import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const blogDirectory = path.join(process.cwd(), "content/blog")

export interface BlogPost {
	slug: string
	title: string
	description?: string
	date: string
	author?: string
	content: string
}

export function getBlogSlugs(): string[] {
	if (!fs.existsSync(blogDirectory)) {
		return []
	}

	return fs
		.readdirSync(blogDirectory)
		.filter((file) => file.endsWith(".md"))
		.map((file) => file.replace(/\.md$/, ""))
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
	const fullPath = path.join(blogDirectory, `${slug}.md`)

	if (!fs.existsSync(fullPath)) {
		return null
	}

	const fileContents = fs.readFileSync(fullPath, "utf8")
	const { data, content } = matter(fileContents)

	return {
		slug,
		title: data.title || slug,
		description: data.description,
		date: data.date || new Date().toISOString(),
		author: data.author,
		content,
	}
}

export function getAllBlogPosts(): BlogPost[] {
	const slugs = getBlogSlugs()
	const posts = slugs
		.map((slug) => getBlogPostBySlug(slug))
		.filter((post): post is BlogPost => post !== null)

	// Sort by date, newest first
	return posts.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	)
}
