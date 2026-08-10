'use client';

import { motion } from 'motion/react';

const STEPS = [
	{
		step: '01',
		title: 'Upload or Capture',
		description: 'Take a clear photo or upload your medical bill or doctor prescription.',
		icon: (
			<svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
				<path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
			</svg>
		),
	},
	{
		step: '02',
		title: 'AI Scanning & OCR',
		description: 'Our OCR engine scans every diagnostic test, medicine, and line item in seconds.',
		icon: (
			<svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
				<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.008v.008H6.75V6.75zM6.75 16.5h.008v.008H6.75V16.5zM16.5 6.75h.008v.008H16.5V6.75zM13.5 13.5h4.5v4.5h-4.5v-4.5z" />
			</svg>
		),
	},
	{
		step: '03',
		title: 'Plain Explanation',
		description: 'Get simple, zero-jargon explanations in English or Tamil for what each test actually means.',
		icon: (
			<svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 2.625a3.75 3.75 0 10-7.5 0h7.5zM12 12.75a3 3 0 100-6 3 3 0 000 6z" />
			</svg>
		),
	},
	{
		step: '04',
		title: 'CGHS Price Check',
		description: 'Compare billed amounts against standard CGHS benchmark rates to check for fair pricing.',
		icon: (
			<svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		),
	},
];

export function HowItWorksSection() {
	return (
		<section id="how-it-works" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
			<div className="text-center max-w-2xl mx-auto mb-16">
				<span className="inline-block px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold tracking-wide uppercase mb-3 border border-teal-100">
					Simple 4-Step Process
				</span>
				<h2 className="type-heading-1 text-slate-900 mb-4">
					How BillSense Works
				</h2>
				<p className="type-body text-slate-600">
					From a quick photo to a transparent breakdown in seconds. No medical background required.
				</p>
			</div>

			{/* Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{STEPS.map((item, index) => (
					<motion.div
						key={item.step}
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-50px' }}
						transition={{
							type: 'spring',
							damping: 25,
							stiffness: 200,
							delay: index * 0.1,
						}}
						className="glass-card rounded-2xl p-6 relative flex flex-col justify-between hover:shadow-md hover:border-teal-200 transition-all duration-200 group"
					>
						<div>
							<div className="flex items-center justify-between mb-5">
								<div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
									{item.icon}
								</div>
								<span className="text-xs font-bold text-slate-400 font-mono">
									{item.step}
								</span>
							</div>

							<h3 className="type-heading-2 text-slate-900 text-base mb-2">
								{item.title}
							</h3>
							<p className="type-subheadline text-slate-600">
								{item.description}
							</p>
						</div>
					</motion.div>
				))}
			</div>
		</section>
	);
}

export function WhyThisExistsSection() {
	return (
		<section id="why-this-exists" className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ type: 'spring', damping: 25, stiffness: 200 }}
				className="rounded-3xl bg-gradient-to-br from-teal-900 to-slate-900 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden"
			>
				{/* Subtle background glow */}
				<div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

				<span className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold tracking-wide uppercase mb-4 border border-teal-500/30">
					Why This Exists
				</span>

				<h2 className="type-heading-1 text-white mb-5">
					Empowering Patients with Price Clarity
				</h2>

				<p className="type-body text-slate-200 leading-relaxed mb-4">
					Hospital bills and diagnostic prescriptions in India are often filled with complex medical jargon and unstandardized pricing. Most patients pay without knowing what each test measures or whether the charged rate aligns with benchmark standards.
				</p>

				<p className="type-body text-teal-200/90 leading-relaxed">
					BillSense bridges this gap by translating complex medical bills into clear plain language while cross-referencing Central Government Health Scheme (CGHS) rates for transparent comparison.
				</p>
			</motion.div>
		</section>
	);
}
