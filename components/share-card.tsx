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
	const [shared, setShared] = useState(false);

	const highCount = results.matched.filter((m) => m.flag === 'high').length;
	const fairCount = results.matched.filter((m) => m.flag === 'fair').length;
	const noDataCount = results.matched.filter((m) => m.flag === 'no_data').length;

	const handleShare = async () => {
		setIsGenerating(true);
		try {
			const html2canvas = (await import('html2canvas')).default;

			if (!cardRef.current) return;

			const canvas = await html2canvas(cardRef.current, {
				backgroundColor: '#0f172a',
				scale: 2,
				useCORS: true,
				logging: false,
			});

			const blob = await new Promise<Blob>((resolve, reject) => {
				canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas to blob failed'))), 'image/png', 0.95);
			});

			const file = new File([blob], 'billsense-summary.png', { type: 'image/png' });

			if (navigator.canShare?.({ files: [file] })) {
				await navigator.share({
					files: [file],
					title: 'BillSense — Medical Bill Summary',
					text: t(
						`My medical bill has ${results.matched.length} tests explained by BillSense`,
						`என் மருத்துவ மசோதாவில் ${results.matched.length} பரிசோதனைகளை BillSense விளக்கியது`
					),
				});
				setShared(true);
			} else {
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'billsense-summary.png';
				a.click();
				URL.revokeObjectURL(url);
				setShared(true);
			}
		} catch (err) {
			console.error('Share error:', err);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				transition={{ type: 'spring', damping: 25, stiffness: 300 }}
				className="w-full max-w-sm"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Shareable Card Canvas */}
				<div
					ref={cardRef}
					className="rounded-3xl overflow-hidden shadow-2xl"
					style={{
						background: 'linear-gradient(135deg, #0f172a 0%, #0f766e 60%, #0f172a 100%)',
						aspectRatio: '4/5',
						fontFamily: 'system-ui, -apple-system, sans-serif',
					}}
				>
					<div className="h-full flex flex-col p-7 text-white">
						{/* Header */}
						<div className="flex items-center justify-between mb-6">
							<img src="/logo.png" alt="BillSense Logo" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
							<span style={{ color: 'rgba(204,251,241,0.9)', fontSize: 11, fontWeight: 600, background: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: 20 }}>Medical Bill Summary</span>
						</div>

						{/* Main Stat */}
						<div className="flex-1 flex flex-col justify-center">
							<p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 }}>
								{t('Tests Explained', 'விளக்கப்பட்ட பரிசோதனைகள்')}
							</p>
							<p style={{ color: 'white', fontSize: 60, fontWeight: 800, lineHeight: 1, marginBottom: 20, letterSpacing: '-0.03em' }}>
								{results.matched.length}
							</p>

							{/* Flag Counts */}
							<div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
								{highCount > 0 && (
									<div style={{
										flex: 1, background: 'rgba(239,68,68,0.18)', borderRadius: 12,
										border: '1px solid rgba(239,68,68,0.35)', padding: '10px 12px',
									}}>
										<p style={{ color: '#fca5a5', fontSize: 20, fontWeight: 700, margin: 0 }}>{highCount}</p>
										<p style={{ color: 'rgba(252,165,165,0.8)', fontSize: 10, margin: 0 }}>
											{t('Overpriced', 'அதிக விலை')}
										</p>
									</div>
								)}
								{fairCount > 0 && (
									<div style={{
										flex: 1, background: 'rgba(16,185,129,0.18)', borderRadius: 12,
										border: '1px solid rgba(16,185,129,0.35)', padding: '10px 12px',
									}}>
										<p style={{ color: '#6ee7b7', fontSize: 20, fontWeight: 700, margin: 0 }}>{fairCount}</p>
										<p style={{ color: 'rgba(110,231,183,0.8)', fontSize: 10, margin: 0 }}>
											{t('Fair Price', 'நியாயமான விலை')}
										</p>
									</div>
								)}
								{noDataCount > 0 && (
									<div style={{
										flex: 1, background: 'rgba(245,158,11,0.18)', borderRadius: 12,
										border: '1px solid rgba(245,158,11,0.35)', padding: '10px 12px',
									}}>
										<p style={{ color: '#fcd34d', fontSize: 20, fontWeight: 700, margin: 0 }}>{noDataCount}</p>
										<p style={{ color: 'rgba(252,211,77,0.8)', fontSize: 10, margin: 0 }}>
											{t('No Data', 'தகவல் இல்லை')}
										</p>
									</div>
								)}
							</div>

							{/* Test Name Pills */}
							<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
								{results.matched.slice(0, 5).map((m, i) => (
									<span key={i} style={{
										background: 'rgba(255,255,255,0.1)', borderRadius: 8,
										padding: '4px 10px', color: 'rgba(255,255,255,0.85)', fontSize: 11,
									}}>
										{m.test.name_en}
									</span>
								))}
								{results.matched.length > 5 && (
									<span style={{
										background: 'rgba(255,255,255,0.1)', borderRadius: 8,
										padding: '4px 10px', color: 'rgba(255,255,255,0.5)', fontSize: 11,
									}}>
										+{results.matched.length - 5} {t('more', 'மேலும்')}
									</span>
								)}
							</div>
						</div>

						{/* Footer */}
						<div style={{
							borderTop: '1px solid rgba(255,255,255,0.12)',
							paddingTop: 14, marginTop: 14,
							display: 'flex', alignItems: 'center', justifyContent: 'space-between',
						}}>
							<p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, margin: 0 }}>
								{t('Informational only • Not medical advice', 'தகவல் நோக்கம் மட்டுமே')}
							</p>
							<p style={{ color: 'rgba(45,212,191,0.9)', fontSize: 11, fontWeight: 600, margin: 0 }}>
								billsense.taskdrift.in
							</p>
						</div>
					</div>
				</div>

				{/* Modal Actions */}
				<div className="flex gap-3 mt-4">
					<button
						onClick={onClose}
						className="flex-1 py-3 rounded-2xl bg-white text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
					>
						{t('Close', 'மூடு')}
					</button>

					<motion.button
						whileTap={{ scale: 0.97 }}
						onClick={handleShare}
						disabled={isGenerating}
						className="flex-1 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-teal-600/20"
					>
						{isGenerating ? (
							<>
								<svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
								</svg>
								<span>{t('Generating...', 'உருவாக்குகிறோம்...')}</span>
							</>
						) : shared ? (
							<span>{t('✓ Shared!', '✓ பகிரப்பட்டது!')}</span>
						) : (
							<>
								<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
								</svg>
								<span>{t('Share / Download', 'பகிர் / பதிவிறக்கு')}</span>
							</>
						)}
					</motion.button>
				</div>
			</motion.div>
		</div>
	);
}
