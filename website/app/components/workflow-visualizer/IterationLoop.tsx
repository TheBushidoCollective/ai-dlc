"use client"

import { motion } from "framer-motion"
import type { IterationLoop as IterationLoopType } from "./types"

interface IterationLoopProps {
	loop: IterationLoopType
	isActive: boolean
	stepCount: number
}

export function IterationLoop({
	loop,
	isActive,
	stepCount,
}: IterationLoopProps) {
	// Calculate the span of the loop (how many steps it covers)
	const loopSpan = loop.fromStep - loop.toStep

	return (
		<div className="relative w-full mt-6">
			{/* The curved arrow going backwards */}
			<svg
				className="w-full h-16 overflow-visible"
				viewBox="0 0 400 60"
				preserveAspectRatio="xMidYMid meet"
			>
				<defs>
					<marker
						id="arrowhead"
						markerWidth="10"
						markerHeight="7"
						refX="9"
						refY="3.5"
						orient="auto"
					>
						<polygon
							points="0 0, 10 3.5, 0 7"
							fill="currentColor"
							className="text-gray-400 dark:text-gray-500"
						/>
					</marker>
					<marker
						id="arrowhead-active"
						markerWidth="10"
						markerHeight="7"
						refX="9"
						refY="3.5"
						orient="auto"
					>
						<polygon
							points="0 0, 10 3.5, 0 7"
							fill="currentColor"
							className="text-amber-500"
						/>
					</marker>
				</defs>

				{/* Background path */}
				<motion.path
					d={`M ${80 + loop.fromStep * 80} 0
						 C ${80 + loop.fromStep * 80} 50,
						   ${80 + loop.toStep * 80} 50,
						   ${80 + loop.toStep * 80} 0`}
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeDasharray="6 4"
					className="text-gray-300 dark:text-gray-600"
					markerEnd="url(#arrowhead)"
				/>

				{/* Animated path */}
				<motion.path
					d={`M ${80 + loop.fromStep * 80} 0
						 C ${80 + loop.fromStep * 80} 50,
						   ${80 + loop.toStep * 80} 50,
						   ${80 + loop.toStep * 80} 0`}
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeDasharray="6 4"
					className="text-amber-500"
					initial={{ pathLength: 0, opacity: 0 }}
					animate={{
						pathLength: isActive ? 1 : 0,
						opacity: isActive ? 1 : 0,
					}}
					transition={{ duration: 0.8, ease: "easeInOut" }}
					markerEnd="url(#arrowhead-active)"
				/>
			</svg>

			{/* Label */}
			<motion.div
				className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
				animate={{
					opacity: isActive ? 1 : 0.5,
					scale: isActive ? 1.1 : 1,
				}}
				transition={{ duration: 0.3 }}
			>
				<span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 whitespace-nowrap">
					{loop.label}
				</span>
			</motion.div>
		</div>
	)
}
