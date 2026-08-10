'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import LandingNav from '@/components/landing-nav';
import { HowItWorksSection, WhyThisExistsSection, ProblemStatsSection } from '@/components/landing-sections';
import {
	SeeItInActionSection,
	BeforeAfterSection,
	ComparisonTableSection,
	RoadmapSection,
	FaqSection,
} from '@/components/landing-expansion';
import LandingTeamAndContact from '@/components/landing-team';

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
			{/* Sticky Top Nav */}
			<LandingNav />

			{/* Main Content */}
			<main className="flex-1">
				{/* Hero Section (Band 1: Slate-50) */}
				<section className="pt-16 pb-24 px-4 sm:px-6 max-w-5xl mx-auto text-center relative overflow-hidden">
					{/* Background decorative glow */}
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

					{/* Live Demo Badge */}
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

					{/* Primary CTA */}
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

				{/* Problem / Solution Section (Band 2: White) */}
				<div className="bg-white">
					<WhyThisExistsSection />
				</div>

				{/* Problem in Numbers / Proof Stats Section (Band 3: Slate-50) */}
				<div className="bg-slate-50">
					<ProblemStatsSection />
				</div>

				{/* See It In Action Mockup Carousel (Step 9.1 - Band 4: White) */}
				<div className="bg-white">
					<SeeItInActionSection />
				</div>

				{/* Before / After Section (Step 9.2 - Band 5: Slate-50) */}
				<div className="bg-slate-50">
					<BeforeAfterSection />
				</div>

				{/* How It Works Flow (Band 6: White) */}
				<div className="bg-white">
					<HowItWorksSection />
				</div>

				{/* Competitor Comparison Matrix (Step 9.3 - Band 7: Slate-50) */}
				<div className="bg-slate-50">
					<ComparisonTableSection />
				</div>

				{/* Roadmap Section (Step 9.4 - Band 8: White) */}
				<div className="bg-white">
					<RoadmapSection />
				</div>

				{/* FAQ Section (Step 9.5 - Band 9: Slate-50) */}
				<div className="bg-slate-50">
					<FaqSection />
				</div>

				{/* Team & Contact Section (Band 10: White) */}
				<div className="bg-white border-t border-slate-200/60">
					<LandingTeamAndContact />
				</div>
			</main>

			{/* Footer (Step 9.6: Three-column desktop / stacked mobile layout) */}
			<footer className="border-t border-slate-200 bg-slate-900 text-white py-12 px-4 sm:px-6">
				<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-slate-400">
					{/* Column 1: Branding & Mission */}
					<div className="space-y-3">
						<div className="flex items-center gap-3">
							<Image src="/logo.png" alt="BillSense Logo" width={110} height={28} className="h-7 w-auto object-contain brightness-0 invert" />
						</div>
						<p className="leading-relaxed text-slate-400 max-w-xs">
							Empowering Indian patients with medical bill clarity, plain-language test explanations, and CGHS price benchmarks.
						</p>
					</div>

					{/* Column 2: Quick Links & Socials */}
					<div className="space-y-2">
						<h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">Quick Navigation</h4>
						<ul className="space-y-1.5">
							<li><a href="#how-it-works" className="hover:text-teal-400 transition-colors">How It Works</a></li>
							<li><a href="#see-it-in-action" className="hover:text-teal-400 transition-colors">Product Tour</a></li>
							<li><a href="#comparison" className="hover:text-teal-400 transition-colors">How We Compare</a></li>
							<li><a href="#faq" className="hover:text-teal-400 transition-colors">FAQ</a></li>
							<li>
								<a
									href="https://www.linkedin.com/in/mohanprasath21/"
									target="_blank"
									rel="noreferrer"
									className="hover:text-teal-400 transition-colors inline-flex items-center gap-1"
								>
									LinkedIn Profile ↗
								</a>
							</li>
						</ul>
					</div>

					{/* Column 3: Credit Line */}
					<div className="space-y-3 md:text-right">
						<span className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 font-semibold text-[10px] border border-teal-500/30">
							Built for HackFusion 2026
						</span>
						<p className="text-slate-400">
							Designed & Developed by{' '}
							<a href="https://taskdrift.in" target="_blank" rel="noreferrer" className="text-teal-400 hover:underline font-semibold">
								TaskDrift
							</a>
						</p>
						<p className="text-[10px] text-slate-500">© 2026 BillSense. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
