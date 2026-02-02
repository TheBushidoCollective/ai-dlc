import { getAllBlogPosts } from "@/lib/blog"

export const dynamic = "force-static"
export const revalidate = false

const SITE_URL = "https://ai-dlc.dev"
const SITE_TITLE = "AI-DLC 2026"
const SITE_DESCRIPTION =
	"A methodology for iterative AI-driven development with hat-based workflows"

export async function GET() {
	const posts = getAllBlogPosts()

	const feed = {
		version: "https://jsonfeed.org/version/1.1",
		title: SITE_TITLE,
		home_page_url: SITE_URL,
		feed_url: `${SITE_URL}/feed.json`,
		description: SITE_DESCRIPTION,
		language: "en-US",
		items: posts.map((post) => ({
			id: `${SITE_URL}/blog/${post.slug}/`,
			url: `${SITE_URL}/blog/${post.slug}/`,
			title: post.title,
			summary: post.description || "",
			date_published: new Date(post.date).toISOString(),
			authors: post.author ? [{ name: post.author }] : [],
		})),
	}

	return new Response(JSON.stringify(feed, null, 2), {
		headers: {
			"Content-Type": "application/feed+json; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=3600",
		},
	})
}
