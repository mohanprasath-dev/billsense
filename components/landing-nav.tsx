'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

export default function LandingNav() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 glass-chrome transition-all duration-300">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
				{/* Wordmark */}
				<Link href="/" className="flex items-center gap-2.5 group">
					<div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-sm shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
						<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
					</div>
					<span className="font-bold text-slate-900 text-lg tracking-tight">BillSense</span>
				</Link>

				{/* Desktop Nav Links */}
				<nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
					<a href="#how-it-works" className="hover:text-teal-700 transition-colors">
						How it works
					</a>
					<a href="#why-this-exists" className="hover:text-teal-700 transition-colors">
						Why BillSense
					</a>
					<a href="#team" className="hover:text-teal-700 transition-colors">
						Team
					</a>
					<a href="#contact" className="hover:text-teal-700 transition-colors">
						Contact
					</a>
				</nav>

				{/* Right CTA Button */}
				<div className="hidden sm:flex items-center gap-3">
					<Link href="/app">
						<motion.button
							whileTap={{ scale: 0.97 }}
							transition={{ type: 'spring', damping: 25, stiffness: 400 }}
							className="px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm shadow-teal-600/20 transition-colors duration-150 cursor-pointer flex items-center gap-1.5"
						>
							<span>Try the Demo</span>
							<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
							</svg>
						</motion.button>
					</Link>
				</div>

				{/* Mobile Hamburger Toggle */}
				<div className="flex sm:hidden items-center gap-2">
					<Link href="/app">
						<motion.button
							whileTap={{ scale: 0.96 }}
							className="px-3 py-1.5 rounded-full bg-teal-600 text-white text-xs font-semibold"
						>
							Try Demo
						</motion.button>
					</Link>
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
						aria-label="Toggle Navigation Menu"
					>
						{mobileMenuOpen ? (
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						) : (
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
							</svg>
						)}
					</button>
				</div>
			</div>

			{/* Mobile Menu Drawer */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ type: 'spring', damping: 25, stiffness: 300 }}
						className="sm:hidden border-b border-slate-200/80 bg-white/95 backdrop-blur-lg px-4 pt-2 pb-5"
					>
						<div className="flex flex-col gap-3 font-medium text-slate-700 text-sm">
							<a
								href="#how-it-works"
								onClick={() => setMobileMenuOpen(false)}
								className="py-2 border-b border-slate-100"
							>
								How it works
							</a>
							<a
								href="#why-this-exists"
								onClick={() => setMobileMenuOpen(false)}
								className="py-2 border-b border-slate-100"
							>
								Why BillSense
							</a>
							<a
								href="#team"
								onClick={() => setMobileMenuOpen(false)}
								className="py-2 border-b border-slate-100"
							>
								Team
							</a>
							<a
								href="#contact"
								onClick={() => setMobileMenuOpen(false)}
								className="py-2"
							>
								Contact
							</a>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
