"use client"

import type { DiagramLayer as DiagramLayerType } from "./types"

interface DiagramLayerProps {
	layer: DiagramLayerType
	width: number
	isDarkMode: boolean
}

export function DiagramLayer({ layer, width, isDarkMode }: DiagramLayerProps) {
	const bgColor = isDarkMode
		? "rgba(255, 255, 255, 0.02)"
		: "rgba(0, 0, 0, 0.02)"
	const textColor = isDarkMode ? "#64748b" : "#94a3b8" // slate-500 / slate-400

	return (
		<g>
			{/* Layer background band */}
			<rect
				x={0}
				y={layer.y}
				width={width}
				height={layer.height}
				fill={bgColor}
				rx={4}
				ry={4}
			/>

			{/* Layer label */}
			<text
				x={16}
				y={layer.y + 18}
				fill={textColor}
				fontSize={11}
				fontWeight={500}
				style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
			>
				{layer.label}
			</text>
		</g>
	)
}
