"use client"

import type { PaperHeading } from "@/lib/papers"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

interface PaperContentProps {
	content: string
	toc: PaperHeading[]
}

function TOCItem({
	heading,
	activeId,
	depth = 0,
}: {
	heading: PaperHeading
	activeId: string
	depth?: number
}) {
	const isActive = activeId === heading.id
	const paddingLeft = depth * 12

	return (
		<li>
			<a
				href={`#${heading.id}`}
				className={`block truncate py-1 text-sm transition ${
					isActive
						? "font-medium text-blue-600 dark:text-blue-400"
						: "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
				}`}
				style={{ paddingLeft: `${paddingLeft}px` }}
			>
				{heading.text}
			</a>
			{heading.children.length > 0 && (
				<ul>
					{heading.children.map((child) => (
						<TOCItem
							key={child.id}
							heading={child}
							activeId={activeId}
							depth={depth + 1}
						/>
					))}
				</ul>
			)}
		</li>
	)
}

export function PaperContent({ content, toc }: PaperContentProps) {
	const [activeId, setActiveId] = useState<string>("")

	// Flatten TOC for scroll spy
	const flattenTOC = useCallback((headings: PaperHeading[]): string[] => {
		const result: string[] = []
		for (const heading of headings) {
			result.push(heading.id)
			result.push(...flattenTOC(heading.children))
		}
		return result
	}, [])

	useEffect(() => {
		const headingIds = flattenTOC(toc)

		// Set initial active heading based on URL hash
		if (window.location.hash) {
			setActiveId(window.location.hash.slice(1))
		}

		const handleScroll = () => {
			const scrollPosition = window.scrollY + 100 // Offset for header

			// Find the current heading
			let currentId = ""
			for (const id of headingIds) {
				const element = document.getElementById(id)
				if (element) {
					const rect = element.getBoundingClientRect()
					const offsetTop = rect.top + window.scrollY
					if (offsetTop <= scrollPosition) {
						currentId = id
					}
				}
			}

			if (currentId !== activeId) {
				setActiveId(currentId)
			}
		}

		window.addEventListener("scroll", handleScroll, { passive: true })
		handleScroll() // Initial check

		return () => {
			window.removeEventListener("scroll", handleScroll)
		}
	}, [toc, activeId, flattenTOC])

	return (
		<div className="flex gap-8">
			{/* TOC Sidebar - desktop only */}
			<aside className="hidden w-64 shrink-0 lg:block">
				<nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
					<h2 className="mb-3 font-semibold text-gray-900 dark:text-white">
						Table of Contents
					</h2>
					<ul className="space-y-1">
						{toc.map((heading) => (
							<TOCItem key={heading.id} heading={heading} activeId={activeId} />
						))}
					</ul>
					<div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
						<Link
							href="/glossary/"
							className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
						>
							View Glossary
						</Link>
					</div>
				</nav>
			</aside>

			{/* Main content */}
			<article className="prose prose-gray dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-blue-600 dark:prose-a:text-blue-400 min-w-0 flex-1">
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[rehypeSlug, rehypeHighlight]}
					components={{
						// Add link icons to headings
						h2: ({ children, id, ...props }) => (
							<h2 id={id} className="group relative scroll-mt-20" {...props}>
								{children}
								{id && (
									<a
										href={`#${id}`}
										className="ml-2 text-gray-400 opacity-0 transition group-hover:opacity-100"
										aria-label={`Link to ${children}`}
									>
										#
									</a>
								)}
							</h2>
						),
						h3: ({ children, id, ...props }) => (
							<h3 id={id} className="group relative scroll-mt-20" {...props}>
								{children}
								{id && (
									<a
										href={`#${id}`}
										className="ml-2 text-gray-400 opacity-0 transition group-hover:opacity-100"
										aria-label={`Link to ${children}`}
									>
										#
									</a>
								)}
							</h3>
						),
						h4: ({ children, id, ...props }) => (
							<h4 id={id} className="group relative scroll-mt-20" {...props}>
								{children}
								{id && (
									<a
										href={`#${id}`}
										className="ml-2 text-gray-400 opacity-0 transition group-hover:opacity-100"
										aria-label={`Link to ${children}`}
									>
										#
									</a>
								)}
							</h4>
						),
						// Add callouts for cross-links
						blockquote: ({ children, ...props }) => (
							<blockquote
								className="border-l-4 border-blue-500 bg-blue-50 pl-4 text-gray-700 dark:bg-blue-950/30 dark:text-gray-300"
								{...props}
							>
								{children}
							</blockquote>
						),
						// Style tables nicely
						table: ({ children, ...props }) => (
							<div className="overflow-x-auto">
								<table {...props}>{children}</table>
							</div>
						),
						// Add interactive tools callout
						a: ({ href, children, ...props }) => {
							// Check if this is an internal link to the interactive tools
							if (
								href?.startsWith("/tools/") ||
								href?.startsWith("/big-picture/") ||
								href?.startsWith("/workflows/")
							) {
								return (
									<Link
										href={href}
										className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
										{...props}
									>
										{children}
										<svg
											className="h-3 w-3"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
											/>
										</svg>
									</Link>
								)
							}
							return (
								<a href={href} {...props}>
									{children}
								</a>
							)
						},
					}}
				>
					{content}
				</ReactMarkdown>

				{/* See it in action callout */}
				<div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
					<h3 className="mb-4 text-lg font-semibold text-blue-900 dark:text-blue-100">
						See AI-DLC in Action
					</h3>
					<p className="mb-4 text-blue-800 dark:text-blue-200">
						Explore the interactive tools to understand and apply the AI-DLC
						methodology:
					</p>
					<ul className="space-y-2">
						<li>
							<Link
								href="/big-picture/"
								className="text-blue-700 underline hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
							>
								Big Picture Diagram
							</Link>{" "}
							- Visual overview of all concepts and their relationships
						</li>
						<li>
							<Link
								href="/workflows/"
								className="text-blue-700 underline hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
							>
								Workflow Visualizer
							</Link>{" "}
							- Step through hat-based workflows interactively
						</li>
						<li>
							<Link
								href="/tools/mode-selector/"
								className="text-blue-700 underline hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
							>
								Mode Selector Tool
							</Link>{" "}
							- Find the right operating mode for your task
						</li>
						<li>
							<Link
								href="/glossary/"
								className="text-blue-700 underline hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
							>
								Glossary
							</Link>{" "}
							- Quick reference for all AI-DLC terminology
						</li>
					</ul>
				</div>
			</article>
		</div>
	)
}
