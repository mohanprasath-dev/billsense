'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// ==========================================
// 1. SEE IT IN ACTION CAROUSEL (Step 9.1)
// ==========================================
const CAROUSEL_FRAMES = [
	{
		id: 1,
		title: '1. Live Camera Capture',
		subtitle: 'Frame your medical bill or prescription using your mobile camera or desktop upload.',
		tag: 'Live Capture',
		render: () => (
			<div className="bg-slate-900 text-white rounded-2xl p-6 h-64 flex flex-col justify-between relative overflow-hidden">
				<div className="flex items-center justify-between border-b border-white/10 pb-3">
					<div className="flex items-center gap-2">
						<span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
						<span className="text-xs font-semibold text-white/90">Camera Preview</span>
					</div>
					<span className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full">Rear Camera</span>
				</div>
				<div className="border-2 border-dashed border-teal-400/50 rounded-xl p-4 text-center my-auto bg-teal-500/5">
					<p className="text-sm font-medium text-teal-200">Position Hospital Bill Here</p>
					<p className="text-xs text-slate-400 mt-1">Apollo Hospital Invoice #48291</p>
				</div>
				<div className="flex justify-center">
					<div className="w-12 h-12 rounded-full border-2 border-white bg-white/20 p-1 flex items-center justify-center">
						<div className="w-full h-full rounded-full bg-white" />
					</div>
				</div>
			</div>
		),
	},
	{
		id: 2,
		title: '2. Instant OCR Scanning',
		subtitle: 'AI scans diagnostic test names, dosages, and billed numbers in seconds.',
		tag: 'AI Extraction',
		render: () => (
			<div className="bg-white rounded-2xl p-6 h-64 border border-slate-200 shadow-sm flex flex-col justify-between">
				<div className="flex items-center justify-between border-b border-slate-100 pb-3">
					<span className="text-xs font-semibold text-teal-700">Extracting Line Items...</span>
					<span className="text-xs font-bold text-slate-400 font-mono">100% Complete</span>
				</div>
				<div className="space-y-2 my-auto">
					<div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl text-xs font-mono border border-slate-100">
						<span className="text-slate-700">1. Lipid Profile Screen</span>
						<span className="text-slate-900 font-bold">₹1,850</span>
					</div>
					<div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl text-xs font-mono border border-slate-100">
						<span className="text-slate-700">2. Glycated Hemoglobin (HbA1c)</span>
						<span className="text-slate-900 font-bold">₹950</span>
					</div>
				</div>
				<div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
					<div className="bg-teal-600 h-full w-full rounded-full" />
				</div>
			</div>
		),
	},
	{
		id: 3,
		title: '3. Plain Language Explanation',
		subtitle: 'Complex medical jargon translated into simple everyday English or Tamil.',
		tag: 'Plain Explanation',
		render: () => (
			<div className="bg-white rounded-2xl p-6 h-64 border border-slate-200 shadow-sm flex flex-col justify-between">
				<div className="flex items-center justify-between border-b border-slate-100 pb-3">
					<span className="text-xs font-bold text-slate-900">Lipid Profile Test</span>
					<span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-semibold">Blood Test</span>
				</div>
				<p className="text-xs text-slate-600 leading-relaxed my-auto">
					Measures total cholesterol, LDL (bad cholesterol), HDL (good cholesterol), and triglycerides to evaluate heart health and cardiovascular risks.
				</p>
				<div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
					<span className="text-slate-500">Available in:</span>
					<span className="font-semibold text-teal-700">English & தமிழ்</span>
				</div>
			</div>
		),
	},
	{
		id: 4,
		title: '4. CGHS Price Benchmark',
		subtitle: 'Cross-referenced against official Central Government Health Scheme rates.',
		tag: 'Price Match',
		render: () => (
			<div className="bg-white rounded-2xl p-6 h-64 border border-slate-200 shadow-sm flex flex-col justify-between">
				<div className="flex items-center justify-between border-b border-slate-100 pb-3">
					<span className="text-xs font-bold text-slate-900">Price Check Summary</span>
					<span className="text-xs bg-red-50 text-red-700 font-semibold px-2.5 py-0.5 rounded-full border border-red-200">
						Overpriced (+54%)
					</span>
				</div>
				<div className="grid grid-cols-2 gap-3 my-auto pt-1">
					<div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
						<p className="text-[10px] text-slate-400 font-medium">CGHS Benchmark</p>
						<p className="text-sm font-bold text-teal-700">₹1,200</p>
					</div>
					<div className="bg-red-50 p-3 rounded-xl border border-red-100">
						<p className="text-[10px] text-red-600 font-medium">Hospital Charge</p>
						<p className="text-sm font-bold text-red-700">₹1,850</p>
					</div>
				</div>
				<p className="text-[11px] text-slate-500 text-center">Transparent pricing insight for insurance claims</p>
			</div>
		),
	},
];

export function SeeItInActionSection() {
	const [activeFrame, setActiveFrame] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setActiveFrame((prev) => (prev + 1) % CAROUSEL_FRAMES.length);
		}, 4500);
		return () => clearInterval(timer);
	}, []);

	return (
		<section id="see-it-in-action" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
			<div className="text-center max-w-2xl mx-auto mb-14">
				<span className="inline-block px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold tracking-wide uppercase mb-3 border border-teal-100">
					Product Tour
				</span>
				<h2 className="type-heading-1 text-slate-900 mb-3">
					See BillSense in Action
				</h2>
				<p className="type-body text-slate-600">
					Experience how BillSense transforms confusing hospital bills into clear explanations.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
				{/* Frame Selector Tabs (Desktop/Tablet left) */}
				<div className="lg:col-span-5 flex flex-col gap-3">
					{CAROUSEL_FRAMES.map((frame, idx) => (
						<motion.button
							key={frame.id}
							whileTap={{ scale: 0.98 }}
							onClick={() => setActiveFrame(idx)}
							className={`p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer border ${
								activeFrame === idx
									? 'bg-white border-teal-500 shadow-md ring-1 ring-teal-500/20'
									: 'bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300'
							}`}
						>
							<div className="flex items-center justify-between mb-1">
								<span className={`text-xs font-semibold uppercase ${activeFrame === idx ? 'text-teal-700' : 'text-slate-400'}`}>
									{frame.tag}
								</span>
								{activeFrame === idx && (
									<span className="w-2 h-2 rounded-full bg-teal-600" />
								)}
							</div>
							<h3 className="font-semibold text-slate-900 text-sm mb-1">
								{frame.title}
							</h3>
							<p className="text-xs text-slate-500 line-clamp-2">
								{frame.subtitle}
							</p>
						</motion.button>
					))}
				</div>

				{/* Mockup Frame Viewer (Right) */}
				<div className="lg:col-span-7">
					<div className="glass-card rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 relative overflow-hidden bg-slate-50">
						<AnimatePresence mode="wait">
							<motion.div
								key={activeFrame}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ type: 'spring', damping: 25, stiffness: 300 }}
							>
								{CAROUSEL_FRAMES[activeFrame].render()}
							</motion.div>
						</AnimatePresence>

						{/* Manual Navigation Indicators */}
						<div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60">
							<div className="flex gap-1.5">
								{CAROUSEL_FRAMES.map((_, idx) => (
									<button
										key={idx}
										onClick={() => setActiveFrame(idx)}
										className={`h-1.5 rounded-full transition-all duration-300 ${
											activeFrame === idx ? 'w-6 bg-teal-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
										}`}
										aria-label={`Go to frame ${idx + 1}`}
									/>
								))}
							</div>

							<div className="flex gap-2">
								<button
									onClick={() => setActiveFrame((prev) => (prev - 1 + CAROUSEL_FRAMES.length) % CAROUSEL_FRAMES.length)}
									className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white transition-colors"
									aria-label="Previous frame"
								>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
									</svg>
								</button>
								<button
									onClick={() => setActiveFrame((prev) => (prev + 1) % CAROUSEL_FRAMES.length)}
									className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white transition-colors"
									aria-label="Next frame"
								>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

// ==========================================
// 2. BEFORE / AFTER COMPARISON (Step 9.2)
// ==========================================
export function BeforeAfterSection() {
	return (
		<section id="before-after" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
			<div className="text-center max-w-2xl mx-auto mb-14">
				<span className="inline-block px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold tracking-wide uppercase mb-3 border border-slate-200">
					Clarity Transformation
				</span>
				<h2 className="type-heading-1 text-slate-900 mb-3">
					Before & After BillSense
				</h2>
				<p className="type-body text-slate-600">
					Compare raw hospital invoice codes with plain-language explanations.
				</p>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ type: 'spring', damping: 25, stiffness: 200 }}
				className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-lg bg-white"
			>
				<div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
					{/* Before Card */}
					<div className="md:col-span-5 rounded-2xl bg-slate-900 text-white p-6 border border-slate-800 relative">
						<span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-mono uppercase">
							Raw Bill Text
						</span>
						<p className="text-xs text-slate-400 font-mono mb-2">Hospital Line Item #04</p>
						<h3 className="font-mono text-base text-red-300 font-bold mb-3">
							CBC w/ Diff, LFT, KFT : Rs. 2,450
						</h3>
						<p className="text-xs text-slate-400 leading-relaxed font-mono">
							[UNEXPLAINED JARGON] Abbreviated medical acronyms. Billed without reference rate breakdown or patient clarity.
						</p>
					</div>

					{/* Arrow Divider */}
					<div className="md:col-span-1 flex justify-center py-2 md:py-0">
						<div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shadow-xs">
							<svg className="w-5 h-5 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
							</svg>
							<svg className="w-5 h-5 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
							</svg>
						</div>
					</div>

					{/* After Card */}
					<div className="md:col-span-5 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 p-6 border border-teal-200 text-slate-900 relative">
						<span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-semibold uppercase">
							BillSense Explanation
						</span>
						<p className="text-xs text-teal-700 font-semibold mb-1">Complete Blood Count & Panel</p>
						<h3 className="font-bold text-slate-900 text-base mb-2">
							Evaluates infection, red blood cells, liver & kidney function.
						</h3>
						<div className="pt-2 border-t border-teal-200/80 flex items-center justify-between text-xs font-medium">
							<span className="text-slate-600">CGHS Reference Rate:</span>
							<span className="text-teal-800 font-bold">₹1,150 (Overpriced by +113%)</span>
						</div>
					</div>
				</div>
			</motion.div>
		</section>
	);
}

// ==========================================
// 3. COMPETITOR COMPARISON TABLE (Step 9.3)
// ==========================================
const COMPETITORS = [
	{ name: 'Watchdoq', realtime: false, multilingual: false, indiaPriced: false, consumerFirst: true },
	{ name: 'Evaakil', realtime: false, multilingual: true, indiaPriced: false, consumerFirst: false },
	{ name: 'Reverie', realtime: true, multilingual: true, indiaPriced: false, consumerFirst: false },
	{ name: 'Patiently AI', realtime: true, multilingual: false, indiaPriced: false, consumerFirst: true },
	{ name: 'FairMedBill', realtime: false, multilingual: false, indiaPriced: true, consumerFirst: true },
	{ name: 'BillSense', realtime: true, multilingual: true, indiaPriced: true, consumerFirst: true, highlight: true },
];

export function ComparisonTableSection() {
	return (
		<section id="comparison" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
			<div className="text-center max-w-2xl mx-auto mb-14">
				<span className="inline-block px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold tracking-wide uppercase mb-3 border border-teal-100">
					Competitive Advantage
				</span>
				<h2 className="type-heading-1 text-slate-900 mb-3">
					How BillSense Compares
				</h2>
				<p className="type-body text-slate-600">
					Built specifically for Indian healthcare consumers with real-time OCR and CGHS reference data.
				</p>
			</div>

			<div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg bg-white">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse min-w-[600px]">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50/80">
								<th className="py-4 px-6 font-semibold text-slate-900 text-sm sticky left-0 bg-slate-50/90 backdrop-blur-xs">
									Platform / Solution
								</th>
								<th className="py-4 px-4 font-semibold text-slate-700 text-xs text-center">Real-Time OCR</th>
								<th className="py-4 px-4 font-semibold text-slate-700 text-xs text-center">Multilingual (Tamil/EN)</th>
								<th className="py-4 px-4 font-semibold text-slate-700 text-xs text-center">India CGHS Pricing</th>
								<th className="py-4 px-4 font-semibold text-slate-700 text-xs text-center">Consumer First</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 text-sm">
							{COMPETITORS.map((item) => (
								<tr
									key={item.name}
									className={`transition-colors ${
										item.highlight
											? 'bg-teal-50/60 font-bold border-l-4 border-l-teal-600'
											: 'hover:bg-slate-50/50'
									}`}
								>
									<td className={`py-4 px-6 text-slate-900 sticky left-0 ${item.highlight ? 'bg-teal-50/90 font-bold text-teal-950' : 'bg-white'}`}>
										{item.name}
										{item.highlight && <span className="ml-2 text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded-full">Us</span>}
									</td>
									<td className="py-4 px-4 text-center">
										{item.realtime ? (
											<span className="text-emerald-600 font-bold">✓</span>
										) : (
											<span className="text-slate-300">✕</span>
										)}
									</td>
									<td className="py-4 px-4 text-center">
										{item.multilingual ? (
											<span className="text-emerald-600 font-bold">✓</span>
										) : (
											<span className="text-slate-300">✕</span>
										)}
									</td>
									<td className="py-4 px-4 text-center">
										{item.indiaPriced ? (
											<span className="text-emerald-600 font-bold">✓</span>
										) : (
											<span className="text-slate-300">✕</span>
										)}
									</td>
									<td className="py-4 px-4 text-center">
										{item.consumerFirst ? (
											<span className="text-emerald-600 font-bold">✓</span>
										) : (
											<span className="text-slate-300">✕</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}

// ==========================================
// 4. WHAT'S NEXT ROADMAP (Step 9.4)
// ==========================================
const ROADMAP_CHIPS = [
	{ title: 'Tamil & Regional Languages', status: 'In Progress' },
	{ title: 'Live Price Benchmarking', status: 'Planned' },
	{ title: 'Crowdsourced Pricing Data', status: 'Research' },
	{ title: 'Insurer / TPA Integration', status: 'Future' },
];

export function RoadmapSection() {
	return (
		<section id="roadmap" className="py-16 px-4 sm:px-6 max-w-4xl mx-auto text-center">
			<span className="inline-block px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold tracking-wide uppercase mb-3 border border-slate-200">
				Future Vision
			</span>
			<h2 className="type-heading-1 text-slate-900 mb-3">
				What's Next for BillSense
			</h2>
			<p className="type-subheadline text-slate-600 mb-8 max-w-lg mx-auto">
				Upcoming features on our roadmap aimed at driving healthcare transparency across India.
			</p>

			<div className="flex flex-wrap justify-center gap-3">
				{ROADMAP_CHIPS.map((chip, i) => (
					<motion.div
						key={chip.title}
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ type: 'spring', damping: 25, stiffness: 250, delay: i * 0.08 }}
						className="glass-card rounded-2xl px-4 py-2.5 border border-slate-200 shadow-xs flex items-center gap-2.5 hover:border-teal-300 transition-colors"
					>
						<span className="w-2 h-2 rounded-full bg-teal-500" />
						<span className="text-slate-900 font-medium text-sm">{chip.title}</span>
						<span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded-full">
							{chip.status}
						</span>
					</motion.div>
				))}
			</div>
		</section>
	);
}

// ==========================================
// 5. FAQ ACCORDION (Step 9.5)
// ==========================================
const FAQS = [
	{
		q: 'Is this medical advice?',
		a: 'No. BillSense is strictly for informational and price-clarity purposes. It does not provide medical diagnoses or treatment recommendations. Always consult a qualified medical professional for health decisions.',
	},
	{
		q: 'How accurate is it?',
		a: 'Explanations are sourced from standard medical taxonomies (LOINC, MedlinePlus) and cross-referenced with CGHS benchmark rates. Always verify diagnostic results directly with your physician.',
	},
	{
		q: 'Is my data stored or shared?',
		a: 'Uploaded images are processed securely for text extraction. No personal health records are sold or shared with third parties.',
	},
	{
		q: 'Is it free?',
		a: 'Yes. BillSense is free to use for patients and families seeking clarity on medical expenses.',
	},
];

export function FaqSection() {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<section id="faq" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
			<div className="text-center max-w-2xl mx-auto mb-14">
				<span className="inline-block px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold tracking-wide uppercase mb-3 border border-teal-100">
					Questions & Answers
				</span>
				<h2 className="type-heading-1 text-slate-900 mb-3">
					Frequently Asked Questions
				</h2>
				<p className="type-body text-slate-600">
					Everything you need to know about BillSense and healthcare transparency.
				</p>
			</div>

			<div className="space-y-4">
				{FAQS.map((faq, i) => {
					const isOpen = openIndex === i;
					return (
						<div
							key={faq.q}
							className="glass-card rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs transition-colors"
						>
							<button
								onClick={() => setOpenIndex(isOpen ? null : i)}
								className="w-full py-5 px-6 text-left flex items-center justify-between font-semibold text-slate-900 text-base cursor-pointer"
							>
								<span>{faq.q}</span>
								<span className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 bg-teal-50 text-teal-700' : ''}`}>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
									</svg>
								</span>
							</button>

							<AnimatePresence initial={false}>
								{isOpen && (
									<motion.div
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: 'auto', opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ type: 'spring', damping: 25, stiffness: 300 }}
										className="overflow-hidden"
									>
										<div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
											{faq.a}
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					);
				})}
			</div>
		</section>
	);
}
