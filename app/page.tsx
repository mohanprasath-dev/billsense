'use client';

import { useRef, useState, useCallback } from 'react';
import { useLanguage } from '@/lib/language-context';
import ResultsSection from '@/components/results-section';
import ShareCard from '@/components/share-card';
import type { AnalyzeResponse } from '@/types';

type AppState = 'idle' | 'loading' | 'results' | 'error';

export default function HomePage() {
	const { language, setLanguage, t } = useLanguage();
	const [appState, setAppState] = useState<AppState>('idle');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isDragOver, setIsDragOver] = useState(false);
	const [results, setResults] = useState<AnalyzeResponse | null>(null);
	const [errorMessage, setErrorMessage] = useState('');
	const [showShareCard, setShowShareCard] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const resultsRef = useRef<HTMLDivElement>(null);

	const handleFile = useCallback((file: File) => {
		if (!file.type.startsWith('image/')) return;
		setSelectedFile(file);
		setPreviewUrl(URL.createObjectURL(file));
		setAppState('idle');
		setResults(null);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragOver(false);
			const file = e.dataTransfer.files[0];
			if (file) handleFile(file);
		},
		[handleFile]
	);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = () => setIsDragOver(false);

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) handleFile(file);
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
			}, 100);
		} catch {
			setErrorMessage('Network error. Please check your connection and try again.');
			setAppState('error');
		}
	};

	const handleReset = () => {
		setAppState('idle');
		setSelectedFile(null);
		setPreviewUrl(null);
		setResults(null);
		setShowShareCard(false);
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900">
			{/* Header */}
			<header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-40">
				<div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg">
							<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
						</div>
						<div>
							<h1 className="text-white font-bold text-lg leading-none">BillSense</h1>
							<p className="text-teal-400 text-xs font-medium">
								{t('Understand your medical bill', 'உங்கள் மருத்துவ மசோதாவை புரிந்துகொள்ளுங்கள்')}
							</p>
						</div>
					</div>

					{/* Language Toggle */}
					<div className="flex items-center bg-white/10 rounded-full p-1 gap-1">
						<button
							onClick={() => setLanguage('en')}
							className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
								language === 'en'
									? 'bg-teal-500 text-white shadow-md'
									: 'text-white/60 hover:text-white'
							}`}
						>
							English
						</button>
						<button
							onClick={() => setLanguage('ta')}
							className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
								language === 'ta'
									? 'bg-teal-500 text-white shadow-md'
									: 'text-white/60 hover:text-white'
							}`}
						>
							தமிழ்
						</button>
					</div>
				</div>
			</header>

			<main className="max-w-2xl mx-auto px-4 py-10">
				{/* Hero text */}
				<div className="text-center mb-10">
					<h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
						{t(
							'Understand your medical bill in seconds',
							'உங்கள் மருத்துவ மசோதாவை சில வினாடிகளில் புரிந்துகொள்ளுங்கள்'
						)}
					</h2>
					<p className="text-teal-300/80 text-base">
						{t(
							'Upload a photo of your bill or prescription. We\'ll explain every test in plain language.',
							'உங்கள் மசோதா அல்லது மருந்துச்சீட்டின் புகைப்படத்தை பதிவேற்றவும். ஒவ்வொரு பரிசோதனையையும் எளிய மொழியில் விளக்குவோம்.'
						)}
					</p>
				</div>

				{/* Upload Card */}
				<div
					className={`relative rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
						${isDragOver
							? 'border-teal-400 bg-teal-500/10 scale-[1.01]'
							: selectedFile
							? 'border-teal-500/50 bg-white/5'
							: 'border-white/20 bg-white/5 hover:border-teal-500/50 hover:bg-white/8'
						}`}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onClick={() => !selectedFile && fileInputRef.current?.click()}
				>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						className="sr-only"
						onChange={handleFileInput}
						aria-label={t('Upload bill image', 'மசோதா படம் பதிவேற்று')}
					/>

					{previewUrl ? (
						<div className="relative">
							{/* Preview */}
							<img
								src={previewUrl}
								alt={t('Bill preview', 'மசோதா முன்னோட்டம்')}
								className="w-full max-h-80 object-contain bg-black/20"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
							<div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
								<span className="text-white text-sm font-medium truncate max-w-[60%]">
									{selectedFile?.name}
								</span>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleReset();
									}}
									className="text-white/80 hover:text-white bg-black/40 rounded-full px-3 py-1 text-xs transition-colors"
								>
									{t('Change', 'மாற்று')}
								</button>
							</div>
						</div>
					) : (
						<div className="p-12 flex flex-col items-center gap-4">
							<div className="w-16 h-16 rounded-2xl bg-teal-500/20 flex items-center justify-center">
								<svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
								</svg>
							</div>
							<div className="text-center">
								<p className="text-white font-semibold text-lg mb-1">
									{t('Upload a photo of your bill or prescription', 'மசோதா அல்லது மருந்துச்சீட்டின் புகைப்படம் பதிவேற்றவும்')}
								</p>
								<p className="text-white/40 text-sm">
									{t('Drag & drop or click to browse', 'இழுத்து விடவும் அல்லது கிளிக் செய்யவும்')}
								</p>
							</div>
							<div className="flex gap-2 flex-wrap justify-center">
								{['JPG', 'PNG', 'HEIC', 'WEBP'].map((fmt) => (
									<span key={fmt} className="px-2 py-0.5 rounded-full bg-white/10 text-white/50 text-xs font-mono">
										{fmt}
									</span>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Analyze Button */}
				<button
					onClick={handleAnalyze}
					disabled={!selectedFile || appState === 'loading'}
					className={`mt-5 w-full rounded-2xl py-4 font-semibold text-base transition-all duration-300 flex items-center justify-center gap-3
						${selectedFile && appState !== 'loading'
							? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-[1.01] active:scale-[0.99]'
							: 'bg-white/10 text-white/30 cursor-not-allowed'
						}`}
				>
					{appState === 'loading' ? (
						<>
							<svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
							</svg>
							{t('Reading your bill...', 'உங்கள் மசோதாவை படிக்கிறோம்...')}
						</>
					) : (
						<>
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
							</svg>
							{t('Explain My Bill', 'என் மசோதாவை விளக்கு')}
						</>
					)}
				</button>

				{/* Error state */}
				{appState === 'error' && (
					<div className="mt-4 rounded-2xl bg-red-500/10 border border-red-500/30 p-4 text-red-300 text-sm flex gap-3 items-start">
						<svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
						</svg>
						{errorMessage}
					</div>
				)}

				{/* Results */}
				{appState === 'results' && results && (
					<div ref={resultsRef} className="mt-10">
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

			{/* Persistent disclaimer */}
			<footer className="border-t border-white/10 mt-16 py-4 px-4">
				<p className="text-center text-white/30 text-xs max-w-2xl mx-auto">
					{t(
						'This tool is for informational purposes only and not medical advice. CGHS reference prices are approximate estimates for comparison — not guaranteed government rates.',
						'இந்த கருவி தகவல் நோக்கங்களுக்காக மட்டுமே, மருத்துவ ஆலோசனை அல்ல. CGHS குறிப்பு விலைகள் ஒப்பீட்டிற்கான தோராயமான மதிப்பீடுகளே — உத்தரவாதமான அரசு விலைகள் அல்ல.'
					)}
				</p>
			</footer>
		</div>
	);
}
