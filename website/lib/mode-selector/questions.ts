export interface Option {
	label: string
	description: string
	weights: {
		HITL: number
		OHOTL: number
		AHOTL: number
	}
}

export interface Question {
	id: string
	title: string
	description: string
	options: Option[]
}

export const questions: Question[] = [
	{
		id: "requirements",
		title: "How clear are the requirements?",
		description:
			"Consider how well-defined the expected outcome is and whether success criteria can be programmatically verified.",
		options: [
			{
				label: "Vague or exploratory",
				description:
					"Requirements are still being discovered. Success may be subjective or hard to define upfront.",
				weights: { HITL: 3, OHOTL: 1, AHOTL: 0 },
			},
			{
				label: "Mostly clear",
				description:
					"Main goals are defined but some details need human judgment during implementation.",
				weights: { HITL: 1, OHOTL: 3, AHOTL: 1 },
			},
			{
				label: "Crystal clear",
				description:
					"Requirements are precise with measurable acceptance criteria that can be automatically verified.",
				weights: { HITL: 0, OHOTL: 1, AHOTL: 3 },
			},
		],
	},
	{
		id: "risk",
		title: "What's the risk level?",
		description:
			"Consider the potential impact of mistakes - data loss, security issues, user impact, or difficult-to-reverse changes.",
		options: [
			{
				label: "High risk",
				description:
					"Production data, security-sensitive, or architectural decisions with long-term consequences.",
				weights: { HITL: 3, OHOTL: 1, AHOTL: 0 },
			},
			{
				label: "Medium risk",
				description:
					"Mistakes would be noticeable but recoverable. Changes affect users but can be rolled back.",
				weights: { HITL: 1, OHOTL: 3, AHOTL: 1 },
			},
			{
				label: "Low risk",
				description:
					"Isolated changes, easy to revert, or working in a sandboxed environment.",
				weights: { HITL: 0, OHOTL: 1, AHOTL: 3 },
			},
		],
	},
	{
		id: "verification",
		title: "How can correctness be verified?",
		description:
			"Think about whether success can be checked automatically through tests, or requires human evaluation.",
		options: [
			{
				label: "Manual verification only",
				description:
					"Requires human judgment to assess quality - visual review, UX evaluation, or subjective criteria.",
				weights: { HITL: 3, OHOTL: 2, AHOTL: 0 },
			},
			{
				label: "Mixed verification",
				description:
					"Some aspects can be tested automatically, but human review adds significant value.",
				weights: { HITL: 1, OHOTL: 3, AHOTL: 1 },
			},
			{
				label: "Fully automated",
				description:
					"Tests, type checks, and linting can comprehensively verify correctness without human review.",
				weights: { HITL: 0, OHOTL: 1, AHOTL: 3 },
			},
		],
	},
	{
		id: "experience",
		title: "How familiar is this domain?",
		description:
			"Consider team experience with this type of work, existing patterns to follow, and prior art.",
		options: [
			{
				label: "Novel territory",
				description:
					"First time implementing this type of feature. No established patterns or prior examples.",
				weights: { HITL: 3, OHOTL: 1, AHOTL: 0 },
			},
			{
				label: "Familiar but nuanced",
				description:
					"Similar work has been done before, but this has unique aspects requiring attention.",
				weights: { HITL: 1, OHOTL: 3, AHOTL: 1 },
			},
			{
				label: "Well-established",
				description:
					"Routine work following established patterns. Clear examples exist to follow.",
				weights: { HITL: 0, OHOTL: 1, AHOTL: 3 },
			},
		],
	},
	{
		id: "quality",
		title: "What type of quality matters most?",
		description:
			"Consider whether success is measured objectively (tests pass) or subjectively (looks good, feels right).",
		options: [
			{
				label: "Judgment-heavy",
				description:
					"Requires expert judgment - architectural decisions, security considerations, edge case handling.",
				weights: { HITL: 3, OHOTL: 1, AHOTL: 0 },
			},
			{
				label: "Subjective/creative",
				description:
					"Quality is taste-driven - UX, design, content, naming. Human intuition guides refinement.",
				weights: { HITL: 1, OHOTL: 3, AHOTL: 0 },
			},
			{
				label: "Objective/measurable",
				description:
					"Quality is binary - tests pass or fail, types check or don't, performance meets threshold or not.",
				weights: { HITL: 0, OHOTL: 1, AHOTL: 3 },
			},
		],
	},
]
