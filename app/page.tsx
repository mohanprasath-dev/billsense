'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import LandingNav from '@/components/landing-nav';
import { HowItWorksSection, WhyThisExistsSection, ProblemStatsSection } from '@/components/landing-sections';
import LandingTeamAndContact from '@/components/landing-team';

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
			{/* Sticky Top Nav */}
			<LandingNav />

			{/* Main Content */}
			<main className="flex-1">
				{/* Hero Section */}
				<section className="pt-16 pb-20 px-4 sm:px-6 max-w-5xl mx-auto text-center relative overflow-hidden">
					{/* Background decorative glow */}
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

					{/* Live Demo Badge (Step 2) */}
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ type: 'spring', damping: 25, stiffness: 300 }}
						className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold tracking-wide mb-8 shadow-xs"
					>
						<span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
						<span>Live Demo: Full Product in Development</span>
					</motion.div>

					{/* Core Value Proposition Headline */}
					<motion.h1
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.1 }}
						className="type-display text-slate-900 mb-6 max-w-3xl mx-auto"
					>
						Understand your medical bill in seconds
					</motion.h1>

					{/* Subheadline */}
					<motion.p
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.2 }}
						className="type-body text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
					>
						Upload a photo of your medical bill or prescription. AI instantly scans every line item, explains complex medical terms in plain language, and checks prices against official CGHS benchmarks.
					</motion.p>

					{/* Single Obvious Primary CTA (Step 2 UI detail) */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ type: 'spring', damping: 25, stiffness: 250, delay: 0.3 }}
						className="flex justify-center"
					>
						<Link href="/app">
							<motion.button
								whileTap={{ scale: 0.97 }}
								transition={{ type: 'spring', damping: 25, stiffness: 400 }}
								className="px-8 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base shadow-lg shadow-teal-600/25 hover:shadow-teal-600/35 transition-all duration-200 cursor-pointer flex items-center gap-3 group"
							>
								<span>Try the Demo</span>
								<svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
								</svg>
							</motion.button>
						</Link>
					</motion.div>
				</section>

				{/* Problem / Solution Section (Step 3) */}
				<WhyThisExistsSection />

				{/* Problem in Numbers / Proof Stats Section (Step 8) */}
				<ProblemStatsSection />

				{/* How It Works Section (Step 3) */}
				<HowItWorksSection />

				{/* Team & Contact Section (Step 4) */}
				<LandingTeamAndContact />
			</main>

			{/* Footer */}
			<footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6">
				<div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
					<div className="flex items-center gap-2.5">
						<Image src="/logo.png" alt="BillSense Logo" width={100} height={26} className="h-6 w-auto object-contain" />
						<span className="text-slate-400">|</span>
						<span>Healthcare Transparency for India</span>
					</div>
					<p className="text-center sm:text-right">
						Designed & Developed by <a href="https://taskdrift.in" target="_blank" rel="noreferrer" className="text-teal-600 hover:underline font-medium">TaskDrift</a>
					</p>
				</div>
			</footer>
		</div>
	);
}
