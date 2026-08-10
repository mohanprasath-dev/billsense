'use client';

import { motion } from 'motion/react';
import { useLanguage } from '@/lib/language-context';
import type { AnalyzeResponse, MatchedResult } from '@/types';

interface ResultsSectionProps {
	results: AnalyzeResponse;
	onShare: () => void;
}

const FLAG_CONFIG = {
	high: {
		badge: 'bg-red-50 text-red-700 border-red-200',
		priceColor: 'text-red-700 font-bold',
		icon: (
			<svg className="w-3.5 h-3.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
			</svg>
		),
		label_en: 'Higher Than Reference',
		label_ta: 'குறிப்பு விலையை விட அதிகம்',
	},
	fair: {
		badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
		priceColor: 'text-slate-900 font-semibold',
		icon: (
			<svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		),
		label_en: 'Fair Price',
		label_ta: 'நியாயமான விலை',
	},
	no_data: {
		badge: 'bg-amber-50 text-amber-700 border-amber-200',
		priceColor: 'text-slate-900 font-semibold',
		icon: (
			<svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
			</svg>
		),
		label_en: 'No Price Data',
		label_ta: 'விலை தகவல் இல்லை',
	},
};

function TestCard({ item, index }: { item: MatchedResult; index: number }) {
	const { language, t } = useLanguage();
	const { test, billed_price, flag } = item;
	const config = FLAG_CONFIG[flag];

	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				type: 'spring',
				damping: 25,
				stiffness: 250,
				delay: index * 0.07, // Staggered spring reveal ~70ms delay (Step 6)
			}}
			className="rounded-2xl glass-card p-5 hover:border-teal-200 transition-all duration-200 shadow-xs bg-white"
		>
			{/* Card Header: Test Name & Accessible Flag Badge */}
			<div className="flex items-start justify-between gap-3 mb-3">
				<div>
					<h3 className="type-heading-2 text-slate-900 text-base leading-snug">
						{language === 'ta' ? test.name_ta : test.name_en}
					</h3>
					<span className="text-xs font-medium text-slate-500">{test.category}</span>
				</div>
				<span className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${config.badge}`}>
					{config.icon}
					{language === 'ta' ? config.label_ta : config.label_en}
				</span>
			</div>

			{/* Plain Explanation */}
			<p className="type-body text-slate-600 text-sm leading-relaxed mb-4">
				{language === 'ta' ? test.explanation_ta : test.explanation_en}
			</p>

			{/* Price Comparison Block */}
			<div className="flex items-center gap-4 pt-3.5 border-t border-slate-100">
				<div className="flex-1">
					<p className="type-caption text-slate-500 mb-0.5">{t('CGHS Reference', 'CGHS குறிப்பு விலை')}</p>
					<p className="text-teal-700 font-bold text-base">₹{test.cghs_price_inr.toLocaleString('en-IN')}</p>
				</div>

				{billed_price !== null && billed_price > 0 && (
					<>
						<div className="w-px h-8 bg-slate-200" />
						<div className="flex-1">
							<p className="type-caption text-slate-500 mb-0.5">{t('Billed Amount', 'வசூலிக்கப்பட்ட தொகை')}</p>
							<p className={`text-base ${config.priceColor}`}>
								₹{billed_price.toLocaleString('en-IN')}
								{flag === 'high' && (
									<span className="text-red-600 font-semibold text-xs ml-1.5">
										(+{Math.round(((billed_price - test.cghs_price_inr) / test.cghs_price_inr) * 100)}%)
									</span>
								)}
							</p>
						</div>
					</>
				)}
			</div>
		</motion.div>
	);
}

export default function ResultsSection({ results, onShare }: ResultsSectionProps) {
	const { t } = useLanguage();
	const highCount = results.matched.filter((m) => m.flag === 'high').length;
	const fairCount = results.matched.filter((m) => m.flag === 'fair').length;

	return (
		<section className="space-y-4">
			{/* Summary Bar */}
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ type: 'spring', damping: 25, stiffness: 300 }}
				className="rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 p-5 shadow-xs"
			>
				<div className="flex items-center justify-between flex-wrap gap-4">
					<div>
						<h2 className="type-heading-2 text-slate-900">
							{t('Your Bill Explained', 'உங்கள் மசோதா விளக்கம்')}
						</h2>
						<p className="type-subheadline text-slate-600 mt-0.5">
							{t(
								`${results.matched.length} test${results.matched.length !== 1 ? 's' : ''} identified and matched`,
								`${results.matched.length} பரிசோதனைகள் கண்டறியப்பட்டன`
							)}
						</p>
					</div>

					<div className="flex gap-4">
						{highCount > 0 && (
							<div className="text-center px-3 py-1.5 rounded-xl bg-red-100/80 border border-red-200">
								<p className="text-red-700 font-bold text-xl leading-none">{highCount}</p>
								<p className="text-red-700/80 text-xs font-medium mt-0.5">{t('Overpriced', 'அதிக விலை')}</p>
							</div>
						)}
						{fairCount > 0 && (
							<div className="text-center px-3 py-1.5 rounded-xl bg-emerald-100/80 border border-emerald-200">
								<p className="text-emerald-800 font-bold text-xl leading-none">{fairCount}</p>
								<p className="text-emerald-800/80 text-xs font-medium mt-0.5">{t('Fair', 'நியாயம்')}</p>
							</div>
						)}
					</div>
				</div>
			</motion.div>

			{/* Staggered Test Cards List */}
			<div className="flex flex-col gap-4">
				{results.matched.map((item, i) => (
					<TestCard key={item.test.id + i} item={item} index={i} />
				))}
			</div>

			{/* Unmatched Items Collapsible */}
			{results.unmatched.length > 0 && (
				<details className="rounded-2xl glass-card border border-slate-200 bg-white">
					<summary className="px-5 py-4 cursor-pointer text-slate-600 text-sm font-medium select-none hover:text-slate-900 transition-colors">
						{t(
							`We couldn't identify ${results.unmatched.length} item${results.unmatched.length !== 1 ? 's' : ''}`,
							`${results.unmatched.length} பொருட்களை கண்டறிய முடியவில்லை`
						)}
					</summary>
					<div className="px-5 pb-4 flex flex-col gap-2">
						{results.unmatched.map((text, i) => (
							<p key={i} className="text-slate-600 text-sm font-mono bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
								{text}
							</p>
						))}
					</div>
				</details>
			)}

			{/* Share Button */}
			<motion.button
				whileTap={{ scale: 0.97 }}
				transition={{ type: 'spring', damping: 25, stiffness: 400 }}
				onClick={onShare}
				className="mt-6 w-full rounded-2xl py-4 font-semibold text-base bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
			>
				<svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
				</svg>
				<span>{t('Share Summary', 'சுருக்கம் பகிர்')}</span>
			</motion.button>
		</section>
	);
}
