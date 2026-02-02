export type OperatingMode = "HITL" | "OHOTL" | "AHOTL"

export interface Hat {
	id: string
	name: string
	emoji: string
	description: string
	responsibilities: string[]
	mode: OperatingMode
	color: {
		bg: string
		bgDark: string
		border: string
		borderDark: string
		text: string
		textDark: string
		glow: string
	}
}

export interface WorkflowStep {
	hatId: string
	description: string
}

export interface IterationLoop {
	fromStep: number
	toStep: number
	label: string
}

export interface Workflow {
	id: string
	name: string
	description: string
	steps: WorkflowStep[]
	iterationLoop?: IterationLoop
}

export interface WorkflowData {
	hats: Record<string, Hat>
	workflows: Workflow[]
}
