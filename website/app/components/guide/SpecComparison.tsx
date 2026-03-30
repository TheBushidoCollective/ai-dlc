"use client"

import { motion } from "framer-motion"

export function SpecComparison() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-40px" }}
			transition={{ duration: 0.6 }}
			className="my-10 grid gap-5 md:grid-cols-3"
		>
			{/* Vibe Coding */}
			<div className="flex flex-col rounded-xl border border-rose-200 bg-rose-50/50 p-6 dark:border-rose-800 dark:bg-rose-950/10">
				<span className="mb-3 block text-4xl">&#x1F3B2;</span>
				<h3 className="mb-1 text-lg font-bold text-rose-500">Vibe Coding</h3>
				<span className="mb-4 w-fit rounded-lg bg-rose-100 px-2.5 py-0.5 text-[0.7rem] font-semibold text-rose-500 dark:bg-rose-900/30">
					the bad way
				</span>
				<ul className="mb-4 flex-1 space-y-2 text-sm text-gray-500 dark:text-gray-400">
					<li>
						<strong className="text-blue-500">Human:</strong> &ldquo;Build me a
						login page&rdquo;
					</li>
					<li>
						<strong className="text-amber-500">AI builds...</strong> something
					</li>
					<li>
						<strong className="text-blue-500">Human:</strong> &ldquo;No, not
						like that&rdquo;
					</li>
					<li>
						<strong className="text-amber-500">AI rebuilds...</strong>{" "}
						differently
					</li>
					<li>
						<strong className="text-blue-500">Human:</strong> &ldquo;Closer, but
						the styling is wrong&rdquo;
					</li>
					<li>
						<em>Repeat forever</em>
					</li>
				</ul>
				<div className="rounded-lg bg-rose-100/60 p-3 dark:bg-rose-900/20">
					<strong className="text-rose-500">Problem:</strong>{" "}
					<span className="text-sm text-gray-500 dark:text-gray-400">
						No definition of &ldquo;done.&rdquo; The AI guesses. You react.
						Progress is random.
					</span>
				</div>
				<div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
					<span className="text-lg">&#x1F500;</span>
					Tangled loop -- going in circles
				</div>
			</div>

			{/* Traditional Specs */}
			<div className="flex flex-col rounded-xl border border-gray-200 bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-800/20">
				<span className="mb-3 block text-4xl">&#x1F4CB;</span>
				<h3 className="mb-1 text-lg font-bold text-gray-500 dark:text-gray-400">
					Traditional Specs
				</h3>
				<span className="mb-4 w-fit rounded-lg bg-gray-200 px-2.5 py-0.5 text-[0.7rem] font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-400">
					the old way
				</span>
				<ul className="mb-4 flex-1 space-y-2 text-sm text-gray-500 dark:text-gray-400">
					<li>PM writes a 40-page requirements doc</li>
					<li>Developer reads it (maybe)</li>
					<li>Developer builds what they understood</li>
					<li>QA finds gaps between spec and implementation</li>
					<li>Spec is already stale by the time it&rsquo;s reviewed</li>
				</ul>
				<div className="rounded-lg bg-gray-200/60 p-3 dark:bg-gray-700/30">
					<strong className="text-gray-500">Problem:</strong>{" "}
					<span className="text-sm text-gray-500 dark:text-gray-400">
						Specs and code live in separate worlds. They drift apart
						immediately.
					</span>
				</div>
				<div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
					<span className="text-lg">&#x2195;&#xFE0F;</span>
					Two parallel lines that diverge
				</div>
			</div>

			{/* AI-DLC Specs */}
			<div className="flex flex-col rounded-xl border border-green-200 bg-green-50/50 p-6 dark:border-green-800 dark:bg-green-950/10">
				<span className="mb-3 block text-4xl">&#x1F3AF;</span>
				<h3 className="mb-1 text-lg font-bold text-green-500">AI-DLC Specs</h3>
				<span className="mb-4 w-fit rounded-lg bg-green-100 px-2.5 py-0.5 text-[0.7rem] font-semibold text-green-500 dark:bg-green-900/30">
					the AI-DLC way
				</span>
				<ul className="mb-4 flex-1 space-y-2 text-sm text-gray-500 dark:text-gray-400">
					<li>
						Human and AI define intent together -- conversation, not document
					</li>
					<li>
						Success criteria are{" "}
						<strong className="text-gray-700 dark:text-gray-200">
							measurable and verifiable
						</strong>{" "}
						-- tests, type checks, performance thresholds
					</li>
					<li>
						The AI builds to satisfy the spec -- criteria are the <em>only</em>{" "}
						way it knows when it&rsquo;s done
					</li>
					<li>
						Quality gates{" "}
						<strong className="text-gray-700 dark:text-gray-200">
							enforce
						</strong>{" "}
						the spec automatically -- if criteria aren&rsquo;t met, work
						continues
					</li>
					<li>
						Specs live alongside code in{" "}
						<code className="text-xs text-amber-500">.ai-dlc/</code> --
						versioned, committed, always current
					</li>
				</ul>
				<div className="rounded-lg bg-green-100/60 p-3 dark:bg-green-900/20">
					<strong className="text-green-500">Result:</strong>{" "}
					<span className="text-sm text-gray-500 dark:text-gray-400">
						The spec IS the contract. Clear spec = autonomous AI. Vague spec =
						stuck AI.
					</span>
				</div>
				<div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
					<span className="text-lg">&#x2705;</span>
					Straight arrow from spec to working code
				</div>
			</div>
		</motion.div>
	)
}

export function InsightBox() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-40px" }}
			transition={{ duration: 0.5 }}
			className="my-10 rounded-xl border-2 border-amber-300/30 bg-white p-7 dark:border-amber-500/20 dark:bg-gray-900"
		>
			<div className="mb-3 text-base font-bold text-amber-500">
				The AI-DLC insight: Autonomy is a function of criteria clarity.
			</div>
			<div className="my-4 rounded-lg border border-gray-200 bg-gray-50 p-3.5 text-center font-mono text-lg font-semibold text-amber-500 dark:border-gray-700 dark:bg-gray-950">
				Autonomy = f(Criteria Clarity)
			</div>
			<ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
				<li>
					<strong className="text-rose-500">Vague criteria</strong> (&ldquo;make
					it look good&rdquo;) &rarr; AI keeps asking you questions, can&rsquo;t
					work alone
				</li>
				<li>
					<strong className="text-green-500">Clear criteria</strong> (&ldquo;all
					tests pass, p95 &lt; 200ms, WCAG AA contrast&rdquo;) &rarr; AI
					iterates autonomously until done
				</li>
			</ul>
			<p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
				This is why AI-DLC spends so much time on elaboration. The planning
				phase isn&rsquo;t overhead -- it&rsquo;s the thing that makes everything
				else work.
			</p>
		</motion.div>
	)
}

export function CriteriaCompare() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-40px" }}
			transition={{ duration: 0.5 }}
			className="my-8 grid gap-5 sm:grid-cols-2"
		>
			<CriteriaPair
				variant="bad"
				text={'"The login page should be fast"'}
				reason="What does 'fast' mean? The AI can't verify this."
			/>
			<CriteriaPair
				variant="good"
				text={
					'"Login API responds in <200ms at p95 under 100 concurrent users"'
				}
				reason="Measurable. The AI runs a load test and checks."
			/>
			<CriteriaPair
				variant="bad"
				text={'"The UI should look nice"'}
				reason='The AI has no idea what "nice" means to you.'
			/>
			<CriteriaPair
				variant="good"
				text={
					'"All pages pass WCAG AA contrast (4.5:1 body, 3:1 large text), use design system tokens only, and render correctly at 375px, 768px, and 1280px"'
				}
				reason="Verifiable. The AI checks contrast ratios, validates token usage, and tests breakpoints."
			/>
		</motion.div>
	)
}

function CriteriaPair({
	variant,
	text,
	reason,
}: { variant: "bad" | "good"; text: string; reason: string }) {
	return (
		<div
			className={`rounded-xl border p-5 ${
				variant === "good"
					? "border-green-200 dark:border-green-800"
					: "border-gray-200 dark:border-gray-700"
			} bg-white dark:bg-gray-900`}
		>
			<div
				className={`mb-1.5 text-xs font-semibold uppercase tracking-wider ${
					variant === "good" ? "text-green-500" : "text-rose-500"
				}`}
			>
				{variant === "good" ? "\u2705 Good criterion" : "\u274C Bad criterion"}
			</div>
			<div className="mb-1.5 text-sm font-semibold text-gray-800 dark:text-gray-200">
				{text}
			</div>
			<div className="text-xs text-gray-500 dark:text-gray-400">{reason}</div>
		</div>
	)
}
