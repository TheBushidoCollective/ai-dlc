export type NodeCategory =
	| "artifact"
	| "hat"
	| "operating-mode"
	| "principle"
	| "workflow"

export interface DiagramNode {
	id: string
	label: string
	description: string
	href: string
	category: NodeCategory
	x: number
	y: number
	width: number
	height: number
}

export interface DiagramConnector {
	id: string
	from: string
	to: string
	label?: string
	type: "flow" | "contains" | "influences"
}

export interface DiagramLayer {
	id: string
	label: string
	y: number
	height: number
}

export interface DiagramData {
	layers: DiagramLayer[]
	nodes: DiagramNode[]
	connectors: DiagramConnector[]
}

export interface NodeColors {
	fill: string
	fillDark: string
	stroke: string
	strokeDark: string
	text: string
	textDark: string
}

export const categoryColors: Record<NodeCategory, NodeColors> = {
	artifact: {
		fill: "#eff6ff", // blue-50
		fillDark: "#172554", // blue-950
		stroke: "#2563eb", // blue-600
		strokeDark: "#60a5fa", // blue-400
		text: "#1d4ed8", // blue-700
		textDark: "#93c5fd", // blue-300
	},
	hat: {
		fill: "#faf5ff", // purple-50
		fillDark: "#3b0764", // purple-950
		stroke: "#9333ea", // purple-600
		strokeDark: "#c084fc", // purple-400
		text: "#7c3aed", // purple-700
		textDark: "#d8b4fe", // purple-300
	},
	"operating-mode": {
		fill: "#fffbeb", // amber-50
		fillDark: "#451a03", // amber-950
		stroke: "#d97706", // amber-600
		strokeDark: "#fbbf24", // amber-400
		text: "#b45309", // amber-700
		textDark: "#fcd34d", // amber-300
	},
	principle: {
		fill: "#f0fdf4", // green-50
		fillDark: "#052e16", // green-950
		stroke: "#16a34a", // green-600
		strokeDark: "#4ade80", // green-400
		text: "#15803d", // green-700
		textDark: "#86efac", // green-300
	},
	workflow: {
		fill: "#fef2f2", // red-50
		fillDark: "#450a0a", // red-950
		stroke: "#dc2626", // red-600
		strokeDark: "#f87171", // red-400
		text: "#b91c1c", // red-700
		textDark: "#fca5a5", // red-300
	},
}
