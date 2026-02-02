import { getAllBlogPosts } from "@/lib/blog"

export const dynamic = "force-static"
export const revalidate = false

const SITE_URL = "https://ai-dlc.dev"
const SITE_TITLE = "AI-DLC"
const SITE_DESCRIPTION =
	"A methodology for iterative AI-driven development with hat-based workflows"

function escapeXml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;")
}

function formatISO8601(dateString: string): string {
	const date = new Date(dateString)
	return date.toISOString()
}

export async function GET() {
	const posts = getAllBlogPosts()

	const entries = posts
		.map(
			(post) => `
  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${SITE_URL}/blog/${post.slug}/" rel="alternate" type="text/html"/>
    <id>${SITE_URL}/blog/${post.slug}/</id>
    <published>${formatISO8601(post.date)}</published>
    <updated>${formatISO8601(post.date)}</updated>
    <summary>${escapeXml(post.description || "")}</summary>
    ${post.author ? `<author><name>${escapeXml(post.author)}</name></author>` : ""}
  </entry>`,
		)
		.join("\n")

	const latestDate =
		posts.length > 0
			? formatISO8601(posts[0].date)
			: formatISO8601(new Date().toISOString())

	const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_TITLE)}</title>
  <subtitle>${escapeXml(SITE_DESCRIPTION)}</subtitle>
  <link href="${SITE_URL}/atom.xml" rel="self" type="application/atom+xml"/>
  <link href="${SITE_URL}" rel="alternate" type="text/html"/>
  <id>${SITE_URL}/</id>
  <updated>${latestDate}</updated>
  ${entries}
</feed>`

	return new Response(atom.trim(), {
		headers: {
			"Content-Type": "application/atom+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=3600",
		},
	})
}
