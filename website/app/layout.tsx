import type { Metadata } from "next"
import { Footer, Header, ThemeProvider } from "./components"
import "./globals.css"

export const metadata: Metadata = {
	title: "AI-DLC 2026 - AI-Driven Development Lifecycle",
	description:
		"A methodology for iterative AI-driven development with hat-based workflows",
	openGraph: {
		title: "AI-DLC 2026",
		description:
			"A methodology for iterative AI-driven development with hat-based workflows",
		url: "https://ai-dlc.dev",
		siteName: "AI-DLC 2026",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "AI-DLC 2026",
		description:
			"A methodology for iterative AI-driven development with hat-based workflows",
	},
	alternates: {
		canonical: "https://ai-dlc.dev",
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="flex min-h-screen flex-col bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
				<ThemeProvider>
					<Header />
					<main className="flex-1">{children}</main>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	)
}
