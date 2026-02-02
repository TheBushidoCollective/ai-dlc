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

function formatRFC822Date(dateString: string): string {
	const date = new Date(dateString)
	return date.toUTCString()
}

export async function GET() {
	const posts = getAllBlogPosts()

	const items = posts
		.map(
			(post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}/</guid>
      <pubDate>${formatRFC822Date(post.date)}</pubDate>
      <description>${escapeXml(post.description || "")}</description>
      ${post.author ? `<author>${escapeXml(post.author)}</author>` : ""}
    </item>`,
		)
		.join("\n")

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${formatRFC822Date(new Date().toISOString())}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

	return new Response(rss.trim(), {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=3600",
		},
	})
}
