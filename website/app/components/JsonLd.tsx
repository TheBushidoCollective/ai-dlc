interface OrganizationJsonLdProps {
	name: string
	url: string
	logo?: string
	description?: string
	sameAs?: string[]
}

export function OrganizationJsonLd({
	name,
	url,
	logo,
	description,
	sameAs = [],
}: OrganizationJsonLdProps) {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name,
		url,
		...(logo && { logo }),
		...(description && { description }),
		...(sameAs.length > 0 && { sameAs }),
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	)
}

interface ArticleJsonLdProps {
	title: string
	description: string
	url: string
	datePublished: string
	dateModified?: string
	authorName?: string
	publisherName: string
	publisherLogo?: string
	image?: string
}

export function ArticleJsonLd({
	title,
	description,
	url,
	datePublished,
	dateModified,
	authorName,
	publisherName,
	publisherLogo,
	image,
}: ArticleJsonLdProps) {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: title,
		description,
		url,
		datePublished,
		dateModified: dateModified || datePublished,
		...(authorName && {
			author: {
				"@type": "Person",
				name: authorName,
			},
		}),
		publisher: {
			"@type": "Organization",
			name: publisherName,
			...(publisherLogo && {
				logo: {
					"@type": "ImageObject",
					url: publisherLogo,
				},
			}),
		},
		...(image && {
			image: {
				"@type": "ImageObject",
				url: image,
			},
		}),
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	)
}

interface SoftwareApplicationJsonLdProps {
	name: string
	description: string
	url: string
	applicationCategory?: string
	operatingSystem?: string
	offers?: {
		price: string
		priceCurrency: string
	}
	aggregateRating?: {
		ratingValue: number
		ratingCount: number
	}
}

export function SoftwareApplicationJsonLd({
	name,
	description,
	url,
	applicationCategory = "DeveloperApplication",
	operatingSystem = "Cross-platform",
	offers,
	aggregateRating,
}: SoftwareApplicationJsonLdProps) {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name,
		description,
		url,
		applicationCategory,
		operatingSystem,
		...(offers && {
			offers: {
				"@type": "Offer",
				price: offers.price,
				priceCurrency: offers.priceCurrency,
			},
		}),
		...(aggregateRating && {
			aggregateRating: {
				"@type": "AggregateRating",
				ratingValue: aggregateRating.ratingValue,
				ratingCount: aggregateRating.ratingCount,
			},
		}),
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	)
}

interface WebSiteJsonLdProps {
	name: string
	url: string
	description?: string
	potentialAction?: {
		target: string
		queryInput: string
	}
}

export function WebSiteJsonLd({
	name,
	url,
	description,
	potentialAction,
}: WebSiteJsonLdProps) {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name,
		url,
		...(description && { description }),
		...(potentialAction && {
			potentialAction: {
				"@type": "SearchAction",
				target: potentialAction.target,
				"query-input": potentialAction.queryInput,
			},
		}),
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	)
}

interface BreadcrumbJsonLdProps {
	items: Array<{
		name: string
		url: string
	}>
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	)
}
