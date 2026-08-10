'use client';

import { useLanguage } from '@/lib/language-context';
import type { AnalyzeResponse, MatchedResult } from '@/types';

interface ResultsSectionProps {
	results: AnalyzeResponse;
	onShare: () => void;
}

const FLAG_CONFIG = {
	high: {
		badge: 'bg-red-500/20 text-red-300 border-red-500/30',
		dot: 'bg-red-400',
		icon: (
			<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
			</svg>
		),
		label_en: 'Higher Than Reference',
		label_ta: 'குறிப்பு விலையை விட அதிகம்',
	},
	fair: {
		badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
		dot: 'bg-emerald-400',
		icon: (
			<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		),
		label_en: 'Fair Price',
		label_ta: 'நியாயமான விலை',
	},
	no_data: {
		badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
		dot: 'bg-amber-400',
		icon: (
			<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
			</svg>
		),
		label_en: 'No Price Data',
		label_ta: 'விலை தகவல் இல்லை',
	},
};

function TestCard({ item }: { item: MatchedResult }) {
	const { language, t } = useLanguage();
	const { test, billed_price, flag } = item;
	const config = FLAG_CONFIG[flag];

	return (
		<div className="rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/8 transition-colors duration-200">
			<div className="flex items-start justify-between gap-3 mb-3">
				<div>
					<h3 className="text-white font-semibold text-base leading-snug">
						{language === 'ta' ? test.name_ta : test.name_en}
					</h3>
					<span className="text-white/40 text-xs">{test.category}</span>
				</div>
				<span className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${config.badge}`}>
					{config.icon}
					{language === 'ta' ? config.label_ta : config.label_en}
				</span>
			</div>

			<p className="text-white/60 text-sm leading-relaxed mb-4">
				{language === 'ta' ? test.explanation_ta : test.explanation_en}
			</p>

			{/* Price comparison */}
			<div className="flex items-center gap-4 pt-3 border-t border-white/10">
				<div className="flex-1">
					<p className="text-white/40 text-xs mb-0.5">{t('CGHS Reference', 'CGHS குறிப்பு விலை')}</p>
					<p className="text-teal-300 font-semibold">₹{test.cghs_price_inr.toLocaleString('en-IN')}</p>
				</div>
				{billed_price !== null && billed_price > 0 && (
					<>
						<div className="w-px h-8 bg-white/10" />
						<div className="flex-1">
							<p className="text-white/40 text-xs mb-0.5">{t('Billed Amount', 'வசூலிக்கப்பட்ட தொகை')}</p>
							<p className={`font-semibold ${flag === 'high' ? 'text-red-300' : 'text-white'}`}>
								₹{billed_price.toLocaleString('en-IN')}
								{flag === 'high' && (
									<span className="text-red-400/70 text-xs ml-1">
										(+{Math.round(((billed_price - test.cghs_price_inr) / test.cghs_price_inr) * 100)}%)
									</span>
								)}
							</p>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default function ResultsSection({ results, onShare }: ResultsSectionProps) {
	const { t } = useLanguage();
	const highCount = results.matched.filter((m) => m.flag === 'high').length;
	const fairCount = results.matched.filter((m) => m.flag === 'fair').length;

	return (
		<section>
			{/* Summary bar */}
			<div className="rounded-2xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 p-5 mb-6">
				<div className="flex items-center justify-between flex-wrap gap-3">
					<div>
						<h2 className="text-white font-bold text-lg">
							{t('Your Bill Explained', 'உங்கள் மசோதா விளக்கம்')}
						</h2>
						<p className="text-white/50 text-sm mt-0.5">
							{t(
								`${results.matched.length} test${results.matched.length !== 1 ? 's' : ''} identified`,
								`${results.matched.length} பரிசோதனைகள் கண்டறியப்பட்டன`
							)}
						</p>
					</div>
					<div className="flex gap-3">
						{highCount > 0 && (
							<div className="text-center">
								<p className="text-red-300 font-bold text-xl">{highCount}</p>
								<p className="text-red-300/60 text-xs">{t('Overpriced', 'அதிக விலை')}</p>
							</div>
						)}
						{fairCount > 0 && (
							<div className="text-center">
								<p className="text-emerald-300 font-bold text-xl">{fairCount}</p>
								<p className="text-emerald-300/60 text-xs">{t('Fair', 'நியாயம்')}</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Test cards */}
			<div className="flex flex-col gap-4">
				{results.matched.map((item, i) => (
					<TestCard key={item.test.id + i} item={item} />
				))}
			</div>

			{/* Unmatched section */}
			{results.unmatched.length > 0 && (
				<details className="mt-4 rounded-2xl bg-white/5 border border-white/10">
					<summary className="px-5 py-4 cursor-pointer text-white/50 text-sm select-none hover:text-white/70 transition-colors">
						{t(
							`We couldn't identify ${results.unmatched.length} item${results.unmatched.length !== 1 ? 's' : ''}`,
							`${results.unmatched.length} பொருட்களை கண்டறிய முடியவில்லை`
						)}
					</summary>
					<div className="px-5 pb-4 flex flex-col gap-2">
						{results.unmatched.map((text, i) => (
							<p key={i} className="text-white/40 text-sm font-mono bg-white/5 rounded-lg px-3 py-2">
								{text}
							</p>
						))}
					</div>
				</details>
			)}

			{/* Share button */}
			<button
				onClick={onShare}
				className="mt-6 w-full rounded-2xl py-4 font-semibold text-base bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all duration-200 flex items-center justify-center gap-2"
			>
				<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
				</svg>
				{t('Share Summary', 'சுருக்கம் பகிர்')}
			</button>

			{/* Disclaimer */}
			<div className="mt-6 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
				<p className="text-white/30 text-xs text-center leading-relaxed">
					{t(
						'This is informational only, not medical advice. Prices are reference estimates based on CGHS rates, not guarantees.',
						'இது தகவல் நோக்கங்களுக்காக மட்டுமே, மருத்துவ ஆலோசனை அல்ல. விலைகள் CGHS விகிதங்களை அடிப்படையாக கொண்ட மதிப்பீடுகளே.'
					)}
				</p>
			</div>
		</section>
	);
}
