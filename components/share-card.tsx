'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '@/lib/language-context';
import type { AnalyzeResponse } from '@/types';

interface ShareCardProps {
	results: AnalyzeResponse;
	onClose: () => void;
}

export default function ShareCard({ results, onClose }: ShareCardProps) {
	const { t } = useLanguage();
	const cardRef = useRef<HTMLDivElement>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [copied, setCopied] = useState(false);
	const [actionMessage, setActionMessage] = useState<string | null>(null);

	const highCount = results.matched.filter((m) => m.flag === 'high').length;
	const fairCount = results.matched.filter((m) => m.flag === 'fair').length;
	const noDataCount = results.matched.filter((m) => m.flag === 'no_data').length;

	// Canvas 2D Fallback renderer if html2canvas ever fails
	const renderNativeCanvas = (): Promise<Blob> => {
		return new Promise((resolve, reject) => {
			try {
				const canvas = document.createElement('canvas');
				canvas.width = 800;
				canvas.height = 1000;
				const ctx = canvas.getContext('2d');
				if (!ctx) return reject(new Error('Canvas 2D context unavailable'));

				// Background Gradient
				const grad = ctx.createLinearGradient(0, 0, 800, 1000);
				grad.addColorStop(0, '#061519');
				grad.addColorStop(0.45, '#0d2a30');
				grad.addColorStop(1, '#051013');
				ctx.fillStyle = grad;
				ctx.fillRect(0, 0, 800, 1000);

				// Glow Accent
				const radial = ctx.createRadialGradient(700, 100, 10, 700, 100, 300);
				radial.addColorStop(0, 'rgba(20, 184, 166, 0.3)');
				radial.addColorStop(1, 'rgba(20, 184, 166, 0)');
				ctx.fillStyle = radial;
				ctx.fillRect(400, 0, 400, 400);

				// Brand Header
				ctx.fillStyle = '#ffffff';
				ctx.font = 'bold 36px system-ui, sans-serif';
				ctx.fillText('BillSense', 50, 75);

				ctx.fillStyle = '#2dd4bf';
				ctx.font = 'bold 20px system-ui, sans-serif';
				ctx.fillText('MEDICAL BILL SUMMARY', 520, 75);

				// Line Divider
				ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(50, 110);
				ctx.lineTo(750, 110);
				ctx.stroke();

				// Main Stat Label
				ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
				ctx.font = '500 24px system-ui, sans-serif';
				ctx.fillText('Total Diagnostic Tests Analyzed', 50, 180);

				// Big Number
				ctx.fillStyle = '#ffffff';
				ctx.font = '900 120px system-ui, sans-serif';
				ctx.fillText(`${results.matched.length}`, 50, 300);

				ctx.fillStyle = '#2dd4bf';
				ctx.font = 'bold 28px system-ui, sans-serif';
				ctx.fillText('Line Items Explained', 200, 290);

				// Breakdown Cards
				// Card 1: Overpriced
				ctx.fillStyle = 'rgba(239, 68, 68, 0.18)';
				ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
				ctx.beginPath();
				ctx.roundRect(50, 350, 215, 150, 20);
				ctx.fill();
				ctx.stroke();

				ctx.fillStyle = '#f87171';
				ctx.font = 'bold 50px system-ui, sans-serif';
				ctx.fillText(`${highCount}`, 75, 415);
				ctx.font = 'bold 20px system-ui, sans-serif';
				ctx.fillText('Overpriced', 75, 465);

				// Card 2: Fair Price
				ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
				ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
				ctx.beginPath();
				ctx.roundRect(292, 350, 215, 150, 20);
				ctx.fill();
				ctx.stroke();

				ctx.fillStyle = '#34d399';
				ctx.font = 'bold 50px system-ui, sans-serif';
				ctx.fillText(`${fairCount}`, 317, 415);
				ctx.font = 'bold 20px system-ui, sans-serif';
				ctx.fillText('Fair Price', 317, 465);

				// Card 3: No Data
				ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
				ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
				ctx.beginPath();
				ctx.roundRect(535, 350, 215, 150, 20);
				ctx.fill();
				ctx.stroke();

				ctx.fillStyle = '#fbbf24';
				ctx.font = 'bold 50px system-ui, sans-serif';
				ctx.fillText(`${noDataCount}`, 560, 415);
				ctx.font = 'bold 20px system-ui, sans-serif';
				ctx.fillText('No Data', 560, 465);

				// Footer
				ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
				ctx.beginPath();
				ctx.moveTo(50, 900);
				ctx.lineTo(750, 900);
				ctx.stroke();

				ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
				ctx.font = '20px system-ui, sans-serif';
				ctx.fillText('Informational only • Not medical advice', 50, 940);

				ctx.fillStyle = '#2dd4bf';
				ctx.font = 'bold 22px system-ui, sans-serif';
				ctx.fillText('billsense.taskdrift.in', 560, 940);

				canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas blob failed'))), 'image/png');
			} catch (canvasErr) {
				reject(canvasErr);
			}
		});
	};

	// Helper to generate PNG blob from card element
	const generateCardImage = async (): Promise<Blob> => {
		try {
			if (!cardRef.current) return renderNativeCanvas();

			const html2canvas = (await import('html2canvas')).default;

			const canvas = await html2canvas(cardRef.current, {
				backgroundColor: '#061519',
				scale: 2,
				useCORS: true,
				allowTaint: true,
				logging: false,
			});

			return await new Promise<Blob>((resolve, reject) => {
				canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas rasterization failed'))), 'image/png');
			});
		} catch (err) {
			console.warn('html2canvas failed, falling back to native Canvas 2D:', err);
			return renderNativeCanvas();
		}
	};

	// Primary Share Action (Native Web Share with File -> Fallback to Download)
	const handleShare = async () => {
		setIsGenerating(true);
		setActionMessage(null);

		try {
			const blob = await generateCardImage();
			const file = new File([blob], 'billsense-summary.png', { type: 'image/png' });

			if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
				try {
					await navigator.share({
						files: [file],
						title: 'BillSense | Medical Bill Summary',
						text: t(
							`My medical bill has ${results.matched.length} diagnostic tests explained by BillSense.`,
							`என் மருத்துவ மசோதாவில் ${results.matched.length} பரிசோதனைகளை BillSense விளக்கியது.`
						),
					});
					setActionMessage(t('✓ Shared successfully!', '✓ வெற்றிகரமாக பகிரப்பட்டது!'));
				} catch (shareErr: any) {
					if (shareErr.name !== 'AbortError') {
						downloadBlob(blob);
					}
				}
			} else {
				downloadBlob(blob);
			}
		} catch (err) {
			console.error('Share generation error:', err);
			setActionMessage(t('Could not generate share image', 'பகிர்வு படத்தை உருவாக்க முடியவில்லை'));
		} finally {
			setIsGenerating(false);
		}
	};

	// Direct Download PNG Action
	const handleDownload = async () => {
		setIsGenerating(true);
		setActionMessage(null);

		try {
			const blob = await generateCardImage();
			downloadBlob(blob);
		} catch (err) {
			console.error('Download error:', err);
			setActionMessage(t('Could not download image', 'படத்தை பதிவிறக்க முடியவில்லை'));
		} finally {
			setIsGenerating(false);
		}
	};

	const downloadBlob = (blob: Blob) => {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'billsense-summary.png';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		setActionMessage(t('✓ Image downloaded!', '✓ படம் பதிவிறக்கப்பட்டது!'));
	};

	// Copy Summary Text Action
	const handleCopyText = () => {
		const text = t(
			`BillSense Summary: ${results.matched.length} tests analyzed. ${fairCount} Fair Price, ${highCount} Higher Than CGHS Reference. Check yours at https://billsense.taskdrift.in`,
			`BillSense அறிக்கை: ${results.matched.length} பரிசோதனைகள் பகுப்பாய்வு செய்யப்பட்டன. https://billsense.taskdrift.in`
		);
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2500);
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
			onClick={onClose}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.95, y: 10 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: 10 }}
				transition={{ type: 'spring', damping: 25, stiffness: 300 }}
				className="w-full max-w-sm my-auto"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Shareable Card Canvas Container */}
				<div
					ref={cardRef}
					className="rounded-3xl overflow-hidden shadow-2xl relative border border-teal-500/30"
					style={{
						background: 'linear-gradient(145deg, #061519 0%, #0d2a30 45%, #051013 100%)',
						fontFamily: 'system-ui, -apple-system, sans-serif',
						color: '#ffffff',
					}}
				>
					{/* Top Glow Accent */}
					<div
						style={{
							position: 'absolute',
							top: '-60px',
							right: '-60px',
							width: '180px',
							height: '180px',
							borderRadius: '50%',
							background: 'rgba(20, 184, 166, 0.25)',
							filter: 'blur(40px)',
							pointerEvents: 'none',
						}}
					/>

					<div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '430px' }}>
						{/* Header */}
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
								{/* Inline SVG Medical Icon for 100% Reliable html2canvas Rendering */}
								<div
									style={{
										width: '32px',
										height: '32px',
										borderRadius: '10px',
										background: 'rgba(20, 184, 166, 0.2)',
										border: '1px solid rgba(20, 184, 166, 0.4)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
										<polyline points="14 2 14 8 20 8" />
										<line x1="16" y1="13" x2="8" y2="13" />
										<line x1="16" y1="17" x2="8" y2="17" />
										<polyline points="10 9 9 9 8 9" />
									</svg>
								</div>
								<span style={{ fontWeight: 800, fontSize: '18px', color: '#ffffff', letterSpacing: '-0.02em' }}>
									BillSense
								</span>
							</div>

							<span
								style={{
									marginLeft: 'auto',
									fontSize: '10px',
									fontWeight: 700,
									color: '#2dd4bf',
									background: 'rgba(20, 184, 166, 0.15)',
									border: '1px solid rgba(20, 184, 166, 0.3)',
									padding: '4px 10px',
									borderRadius: '20px',
									textTransform: 'uppercase',
									letterSpacing: '0.04em',
								}}
							>
								Medical Bill Summary
							</span>
						</div>

						{/* Hero Stat Section */}
						<div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
							<p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', fontWeight: 500, margin: '0 0 4px 0' }}>
								{t('Total Diagnostic Tests Analyzed', 'பகுப்பாய்வு செய்யப்பட்ட மொத்த பரிசோதனைகள்')}
							</p>

							<div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '18px' }}>
								<span
									style={{
										color: '#ffffff',
										fontSize: '56px',
										fontWeight: 900,
										lineHeight: 1,
										letterSpacing: '-0.04em',
									}}
								>
									{results.matched.length}
								</span>
								<span style={{ color: 'rgba(45, 212, 191, 0.9)', fontSize: '13px', fontWeight: 600 }}>
									{t('Line Items Explained', 'பரிசோதனைகள்')}
								</span>
							</div>

							{/* Price Flag Breakdown Badges */}
							<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '18px' }}>
								{/* High/Overpriced Flag */}
								<div
									style={{
										background: 'rgba(239, 68, 68, 0.14)',
										border: '1px solid rgba(239, 68, 68, 0.35)',
										borderRadius: '12px',
										padding: '10px 8px',
										textAlign: 'center',
									}}
								>
									<p style={{ color: '#f87171', fontSize: '20px', fontWeight: 800, margin: 0, lineHeight: 1 }}>
										{highCount}
									</p>
									<p style={{ color: 'rgba(254, 202, 202, 0.85)', fontSize: '10px', fontWeight: 600, margin: '4px 0 0 0' }}>
										{t('Overpriced', 'அதிக விலை')}
									</p>
								</div>

								{/* Fair Price Flag */}
								<div
									style={{
										background: 'rgba(16, 185, 129, 0.14)',
										border: '1px solid rgba(16, 185, 129, 0.35)',
										borderRadius: '12px',
										padding: '10px 8px',
										textAlign: 'center',
									}}
								>
									<p style={{ color: '#34d399', fontSize: '20px', fontWeight: 800, margin: 0, lineHeight: 1 }}>
										{fairCount}
									</p>
									<p style={{ color: 'rgba(167, 243, 208, 0.85)', fontSize: '10px', fontWeight: 600, margin: '4px 0 0 0' }}>
										{t('Fair Price', 'நியாயமான விலை')}
									</p>
								</div>

								{/* No Data Flag */}
								<div
									style={{
										background: 'rgba(245, 158, 11, 0.14)',
										border: '1px solid rgba(245, 158, 11, 0.35)',
										borderRadius: '12px',
										padding: '10px 8px',
										textAlign: 'center',
									}}
								>
									<p style={{ color: '#fbbf24', fontSize: '20px', fontWeight: 800, margin: 0, lineHeight: 1 }}>
										{noDataCount}
									</p>
									<p style={{ color: 'rgba(253, 230, 138, 0.85)', fontSize: '10px', fontWeight: 600, margin: '4px 0 0 0' }}>
										{t('No Data', 'தகவல் இல்லை')}
									</p>
								</div>
							</div>

							{/* Test Name Pills */}
							<div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
								{results.matched.slice(0, 4).map((m, i) => (
									<span
										key={i}
										style={{
											background: 'rgba(255, 255, 255, 0.08)',
											border: '1px solid rgba(255, 255, 255, 0.12)',
											borderRadius: '8px',
											padding: '4px 10px',
											color: 'rgba(255, 255, 255, 0.9)',
											fontSize: '11px',
											fontWeight: 500,
										}}
									>
										{m.test.name_en}
									</span>
								))}
								{results.matched.length > 4 && (
									<span
										style={{
											background: 'rgba(20, 184, 166, 0.15)',
											border: '1px solid rgba(20, 184, 166, 0.3)',
											borderRadius: '8px',
											padding: '4px 10px',
											color: '#2dd4bf',
											fontSize: '11px',
											fontWeight: 600,
										}}
									>
										+{results.matched.length - 4} {t('more tests', 'மேலும்')}
									</span>
								)}
							</div>
						</div>

						{/* Footer Watermark */}
						<div
							style={{
								borderTop: '1px solid rgba(255, 255, 255, 0.12)',
								paddingTop: '12px',
								marginTop: '16px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<p style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '10px', margin: 0 }}>
								{t('Informational only • Not medical advice', 'தகவல் நோக்கம் மட்டுமே')}
							</p>
							<p style={{ color: '#2dd4bf', fontSize: '11px', fontWeight: 700, margin: 0, letterSpacing: '0.02em' }}>
								billsense.taskdrift.in
							</p>
						</div>
					</div>
				</div>

				{/* Action Toast Feedback */}
				{actionMessage && (
					<motion.div
						initial={{ opacity: 0, y: -5 }}
						animate={{ opacity: 1, y: 0 }}
						className="mt-3 p-2.5 rounded-xl bg-teal-900/90 border border-teal-500/40 text-teal-200 text-xs font-semibold text-center shadow-lg"
					>
						{actionMessage}
					</motion.div>
				)}

				{/* Controls & Actions */}
				<div className="space-y-2 mt-4">
					<div className="flex gap-2">
						{/* Main Share Button */}
						<motion.button
							whileTap={{ scale: 0.97 }}
							onClick={handleShare}
							disabled={isGenerating}
							className="flex-1 py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-teal-600/30"
						>
							{isGenerating ? (
								<>
									<svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
									</svg>
									<span>{t('Processing...', 'உருவாக்குகிறோம்...')}</span>
								</>
							) : (
								<>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
									</svg>
									<span>{t('Share Card', 'கார்டு பகிர்')}</span>
								</>
							)}
						</motion.button>

						{/* Direct Download Button */}
						<motion.button
							whileTap={{ scale: 0.97 }}
							onClick={handleDownload}
							disabled={isGenerating}
							className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
							title={t('Download PNG Image', 'படமாக பதிவிறக்கு')}
						>
							<svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
							</svg>
							<span>{t('PNG', 'படம்')}</span>
						</motion.button>
					</div>

					<div className="flex gap-2">
						{/* Copy Text Summary */}
						<button
							onClick={handleCopyText}
							className="flex-1 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-medium text-xs border border-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
						>
							<svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.375a9.06 9.06 0 00-1.5-.124" />
							</svg>
							<span>{copied ? t('✓ Copied Text!', '✓ பிரதி எடுக்கப்பட்டது!') : t('Copy Text', 'உரை நகலெடு')}</span>
						</button>

						{/* Close Button */}
						<button
							onClick={onClose}
							className="py-2.5 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white font-medium text-xs border border-slate-800 transition-colors cursor-pointer"
						>
							{t('Close', 'மூடு')}
						</button>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
