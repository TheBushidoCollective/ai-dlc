"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ThemeToggle } from "./ThemeToggle"

const navItems = [
	{ href: "/", label: "Home" },
	{ href: "/big-picture/", label: "Big Picture" },
	{ href: "/workflows/", label: "Workflows" },
	{ href: "/docs/", label: "Docs" },
	{ href: "/tools/mode-selector/", label: "Mode Selector" },
	{ href: "/blog/", label: "Blog" },
]

export function Header() {
	const pathname = usePathname()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	return (
		<header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
				<Link
					href="/"
					className="text-xl font-bold tracking-tight transition hover:opacity-80"
				>
					AI-DLC 2026
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden items-center gap-6 md:flex">
					{navItems.map((item) => {
						const isActive =
							item.href === "/"
								? pathname === "/"
								: pathname.startsWith(item.href)
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`transition hover:text-gray-900 dark:hover:text-white ${
									isActive
										? "font-medium text-gray-900 dark:text-white"
										: "text-gray-600 dark:text-gray-400"
								}`}
							>
								{item.label}
							</Link>
						)
					})}
					<a
						href="https://github.com/thebushidocollective/ai-dlc"
						target="_blank"
						rel="noopener noreferrer"
						className="text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
					>
						GitHub
						<span className="sr-only">(opens in new tab)</span>
					</a>
					<ThemeToggle />
				</div>

				{/* Mobile Menu Button */}
				<div className="flex items-center gap-2 md:hidden">
					<ThemeToggle />
					<button
						type="button"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
						aria-label="Toggle menu"
						aria-expanded={mobileMenuOpen}
					>
						{mobileMenuOpen ? (
							<svg
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						) : (
							<svg
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						)}
					</button>
				</div>
			</nav>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className="border-t border-gray-200 px-4 py-4 dark:border-gray-800 md:hidden">
					<div className="flex flex-col gap-4">
						{navItems.map((item) => {
							const isActive =
								item.href === "/"
									? pathname === "/"
									: pathname.startsWith(item.href)
							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setMobileMenuOpen(false)}
									className={`transition hover:text-gray-900 dark:hover:text-white ${
										isActive
											? "font-medium text-gray-900 dark:text-white"
											: "text-gray-600 dark:text-gray-400"
									}`}
								>
									{item.label}
								</Link>
							)
						})}
						<a
							href="https://github.com/thebushidocollective/ai-dlc"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
						>
							GitHub
						</a>
					</div>
				</div>
			)}
		</header>
	)
}
