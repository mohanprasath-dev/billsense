'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useLanguage } from '@/lib/language-context';
import CameraCapture from '@/components/camera-capture';
import ResultsSection from '@/components/results-section';
import ShareCard from '@/components/share-card';
import type { AnalyzeResponse } from '@/types';

type AppState = 'idle' | 'loading' | 'results' | 'error';

export default function BillSenseAppPage() {
	const { language, setLanguage, t } = useLanguage();
	const [appState, setAppState] = useState<AppState>('idle');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [results, setResults] = useState<AnalyzeResponse | null>(null);
	const [errorMessage, setErrorMessage] = useState('');
	const [showShareCard, setShowShareCard] = useState(false);
	const resultsRef = useRef<HTMLDivElement>(null);

	const handlePhotoSelected = (file: File) => {
		setSelectedFile(file);
		setPreviewUrl(URL.createObjectURL(file));
		setAppState('idle');
		setResults(null);
	};

	const handleAnalyze = async () => {
		if (!selectedFile) return;

		setAppState('loading');
		setErrorMessage('');

		try {
			const formData = new FormData();
			formData.append('image', selectedFile);

			const response = await fetch('/api/analyze', {
				method: 'POST',
				body: formData,
			});

			const data = await response.json();

			if (!response.ok || data.error) {
				setErrorMessage(data.error ?? 'Something went wrong. Please try again.');
				setAppState('error');
				return;
			}

			setResults(data as AnalyzeResponse);
			setAppState('results');

			setTimeout(() => {
				resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
			}, 150);
		} catch {
			setErrorMessage('Network error. Please check your internet connection and try again.');
			setAppState('error');
		}
	};

	const handleReset = () => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		setAppState('idle');
		setSelectedFile(null);
		setPreviewUrl(null);
		setResults(null);
		setShowShareCard(false);
	};

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
			{/* Sticky Translucent Header */}
			<header className="sticky top-0 z-40 glass-chrome">
				<div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
					{/* Logo + Back Link */}
					<div className="flex items-center gap-3">
						<Link href="/" className="flex items-center group">
							<Image
								src="/logo.png"
								alt="BillSense Logo"
								width={140}
								height={36}
								priority
								className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
							/>
						</Link>

						{/* Demo Badge (Step 2 & 7) */}
						<span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium">
							<span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
							Live Demo
						</span>
					</div>

					{/* Right Controls: Language Switcher */}
					<div className="flex items-center bg-slate-200/70 p-1 rounded-full text-xs font-semibold">
						<button
							onClick={() => setLanguage('en')}
							className={`px-3 py-1 rounded-full transition-all duration-150 ${
								language === 'en'
									? 'bg-white text-teal-800 shadow-xs'
									: 'text-slate-600 hover:text-slate-900'
							}`}
						>
							English
						</button>
						<button
							onClick={() => setLanguage('ta')}
							className={`px-3 py-1 rounded-full transition-all duration-150 ${
								language === 'ta'
									? 'bg-white text-teal-800 shadow-xs'
									: 'text-slate-600 hover:text-slate-900'
							}`}
						>
							தமிழ்
						</button>
					</div>
				</div>
			</header>

			{/* Tool Interface Main Body */}
			<main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
				{/* Top Headline & Demo Banner */}
				<div className="text-center mb-8">
					<div className="inline-flex md:hidden items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium mb-3">
						<span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
						Live Demo: Full Product in Development
					</div>

					<h1 className="type-heading-1 text-slate-900 mb-2">
						{t('Medical Bill Analyzer', 'மருத்துவ மசோதா பகுப்பாய்வாளர்')}
					</h1>
					<p className="type-subheadline text-slate-600">
						{t(
							'Capture or upload your bill image to get instant plain explanations & CGHS price matching.',
							'உங்கள் மசோதாவை படம் எடுத்து எளிய விளக்கங்களையும் CGHS குறிப்பு விலைகளையும் பெறுங்கள்.'
						)}
					</p>
				</div>

				{/* Camera / Upload Section */}
				{!selectedFile ? (
					<CameraCapture onPhotoSelected={handlePhotoSelected} />
				) : (
					/* Selected Photo Frame & Analyze Trigger */
					<div className="rounded-3xl glass-card p-6 border border-slate-200 shadow-md bg-white">
						<div className="flex items-center justify-between mb-4">
							<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
								{t('Selected Document', 'தேர்ந்தெடுக்கப்பட்ட படம்')}
							</span>
							<button
								onClick={handleReset}
								className="text-xs text-slate-600 hover:text-red-600 font-medium px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
							>
								{t('Change Photo', 'படத்தை மாற்று')}
							</button>
						</div>

						{previewUrl && (
							<div className="relative rounded-2xl overflow-hidden bg-slate-900 max-h-80 flex items-center justify-center mb-6">
								<img src={previewUrl} alt="Bill Preview" className="max-h-80 object-contain" />
							</div>
						)}

						{/* Analyze Button */}
						<motion.button
							whileTap={{ scale: 0.97 }}
							transition={{ type: 'spring', damping: 25, stiffness: 400 }}
							onClick={handleAnalyze}
							disabled={appState === 'loading'}
							className={`w-full py-4 rounded-2xl font-semibold text-base transition-all flex items-center justify-center gap-3 cursor-pointer shadow-md ${
								appState === 'loading'
									? 'bg-slate-200 text-slate-400 cursor-not-allowed'
									: 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
							}`}
						>
							{appState === 'loading' ? (
								<>
									<svg className="w-5 h-5 animate-spin text-teal-600" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
									</svg>
									<span>{t('Reading your bill...', 'உங்கள் மசோதாவை படிக்கிறோம்...')}</span>
								</>
							) : (
								<>
									<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
									</svg>
									<span>{t('Explain My Bill', 'என் மசோதாவை விளக்கு')}</span>
								</>
							)}
						</motion.button>
					</div>
				)}

				{/* Error Notification Card */}
				{appState === 'error' && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-800 text-sm flex gap-3 items-start"
					>
						<svg className="w-5 h-5 shrink-0 mt-0.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
						</svg>
						<div>
							<p className="font-semibold">{t('Analysis Error', 'பகுப்பாய்வு பிழை')}</p>
							<p className="text-red-700 mt-0.5">{errorMessage}</p>
						</div>
					</motion.div>
				)}

				{/* Results Display */}
				{appState === 'results' && results && (
					<div ref={resultsRef} className="mt-8">
						<ResultsSection
							results={results}
							onShare={() => setShowShareCard(true)}
						/>
					</div>
				)}

				{/* Share Card Modal */}
				{showShareCard && results && (
					<ShareCard
						results={results}
						onClose={() => setShowShareCard(false)}
					/>
				)}
			</main>

			{/* Persistent Footer Disclaimer */}
			<footer className="border-t border-slate-200 bg-white py-6 px-4 mt-12">
				<p className="text-center text-slate-500 text-xs max-w-2xl mx-auto leading-relaxed">
					{t(
						'This tool is for informational purposes only and does not constitute medical advice. CGHS reference prices are approximate benchmarks for comparison.',
						'இந்த கருவி தகவல் நோக்கங்களுக்காக மட்டுமே, மருத்துவ ஆலோசனை அல்ல. CGHS குறிப்பு விலைகள் தோராயமான மதிப்பீடுகளே.'
					)}
				</p>
			</footer>
		</div>
	);
}
