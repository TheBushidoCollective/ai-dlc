import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog"

interface Props {
	params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
	const posts = getAllBlogPosts()
	return posts.map((post) => ({
		slug: post.slug,
	}))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const resolvedParams = await params
	const post = getBlogPostBySlug(resolvedParams.slug)

	if (!post) {
		return {
			title: "Post Not Found - AI-DLC 2026",
		}
	}

	return {
		title: `${post.title} - AI-DLC 2026`,
		description: post.description,
	}
}

function formatDate(dateString: string): string {
	const date = new Date(dateString)
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	})
}

export default async function BlogPostPage({ params }: Props) {
	const resolvedParams = await params
	const post = getBlogPostBySlug(resolvedParams.slug)

	if (!post) {
		notFound()
	}

	return (
		<article>
			<Link
				href="/blog/"
				className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
			>
				<svg
					className="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				Back to blog
			</Link>

			<header className="mb-8">
				<time className="text-sm text-gray-500 dark:text-gray-500">
					{formatDate(post.date)}
				</time>
				<h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
					{post.title}
				</h1>
				{post.author && (
					<p className="mt-4 text-gray-600 dark:text-gray-400">
						By {post.author}
					</p>
				)}
			</header>

			<div className="prose prose-gray dark:prose-invert max-w-none">
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[rehypeHighlight, rehypeSlug]}
				>
					{post.content}
				</ReactMarkdown>
			</div>
		</article>
	)
}
