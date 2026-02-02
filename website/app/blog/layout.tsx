import type { ReactNode } from "react"

export default function BlogLayout({ children }: { children: ReactNode }) {
	return (
		<div className="mx-auto max-w-4xl px-4 py-8 lg:py-12">{children}</div>
	)
}
