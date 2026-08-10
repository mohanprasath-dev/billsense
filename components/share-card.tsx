'use client';

import { useRef, useState } from 'react';
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
			// Dynamically import html2canvas to avoid SSR issues
			const html2canvas = (await import('html2canvas')).default;

			if (!cardRef.current) return;

			const canvas = await html2canvas(cardRef.current, {
				backgroundColor: '#0f1e2e',
				scale: 2, // Retina quality
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
				// Fallback: download
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
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
			<div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
				{/* The shareable card — fixed 4:5 aspect */}
				<div
					ref={cardRef}
					className="rounded-3xl overflow-hidden"
					style={{
						background: 'linear-gradient(135deg, #0d1f2d 0%, #0a4a4a 50%, #0d1f2d 100%)',
						aspectRatio: '4/5',
						fontFamily: 'system-ui, sans-serif',
					}}
				>
					<div className="h-full flex flex-col p-7">
						{/* Header */}
						<div className="flex items-center gap-2.5 mb-8">
							<div style={{
								width: 36, height: 36, borderRadius: 10,
								background: 'linear-gradient(135deg, #2dd4bf, #06b6d4)',
								display: 'flex', alignItems: 'center', justifyContent: 'center',
							}}>
								<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
							<div>
								<p style={{ color: 'white', fontWeight: 700, fontSize: 18, margin: 0 }}>BillSense</p>
								<p style={{ color: 'rgba(94,234,212,0.8)', fontSize: 11, margin: 0 }}>Medical Bill Analyser</p>
							</div>
						</div>

						{/* Main stat */}
						<div className="flex-1 flex flex-col justify-center">
							<p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 4 }}>
								{t('Tests Explained', 'விளக்கப்பட்ட பரிசோதனைகள்')}
							</p>
							<p style={{ color: 'white', fontSize: 64, fontWeight: 800, lineHeight: 1, marginBottom: 24 }}>
								{results.matched.length}
							</p>

							{/* Flag counts */}
							<div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
								{highCount > 0 && (
									<div style={{
										flex: 1, background: 'rgba(239,68,68,0.15)', borderRadius: 12,
										border: '1px solid rgba(239,68,68,0.3)', padding: '12px 14px',
									}}>
										<p style={{ color: '#fca5a5', fontSize: 22, fontWeight: 700, margin: 0 }}>{highCount}</p>
										<p style={{ color: 'rgba(252,165,165,0.7)', fontSize: 11, margin: 0 }}>
											{t('Overpriced', 'அதிக விலை')}
										</p>
									</div>
								)}
								{fairCount > 0 && (
									<div style={{
										flex: 1, background: 'rgba(16,185,129,0.15)', borderRadius: 12,
										border: '1px solid rgba(16,185,129,0.3)', padding: '12px 14px',
									}}>
										<p style={{ color: '#6ee7b7', fontSize: 22, fontWeight: 700, margin: 0 }}>{fairCount}</p>
										<p style={{ color: 'rgba(110,231,183,0.7)', fontSize: 11, margin: 0 }}>
											{t('Fair Price', 'நியாயமான விலை')}
										</p>
									</div>
								)}
								{noDataCount > 0 && (
									<div style={{
										flex: 1, background: 'rgba(245,158,11,0.15)', borderRadius: 12,
										border: '1px solid rgba(245,158,11,0.3)', padding: '12px 14px',
									}}>
										<p style={{ color: '#fcd34d', fontSize: 22, fontWeight: 700, margin: 0 }}>{noDataCount}</p>
										<p style={{ color: 'rgba(252,211,77,0.7)', fontSize: 11, margin: 0 }}>
											{t('No Data', 'தகவல் இல்லை')}
										</p>
									</div>
								)}
							</div>

							{/* Test name pills */}
							<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
								{results.matched.slice(0, 6).map((m, i) => (
									<span key={i} style={{
										background: 'rgba(255,255,255,0.08)', borderRadius: 8,
										padding: '4px 10px', color: 'rgba(255,255,255,0.6)', fontSize: 11,
									}}>
										{m.test.name_en}
									</span>
								))}
								{results.matched.length > 6 && (
									<span style={{
										background: 'rgba(255,255,255,0.08)', borderRadius: 8,
										padding: '4px 10px', color: 'rgba(255,255,255,0.4)', fontSize: 11,
									}}>
										+{results.matched.length - 6} {t('more', 'மேலும்')}
									</span>
								)}
							</div>
						</div>

						{/* Footer */}
						<div style={{
							borderTop: '1px solid rgba(255,255,255,0.1)',
							paddingTop: 16, marginTop: 16,
							display: 'flex', alignItems: 'center', justifyContent: 'space-between',
						}}>
							<p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, margin: 0 }}>
								{t('Informational only • Not medical advice', 'தகவல் நோக்கம் மட்டுமே')}
							</p>
							<p style={{ color: 'rgba(45,212,191,0.6)', fontSize: 11, fontWeight: 600, margin: 0 }}>
								billsense.app
							</p>
						</div>
					</div>
				</div>

				{/* Action buttons */}
				<div className="flex gap-3 mt-4">
					<button
						onClick={onClose}
						className="flex-1 py-3 rounded-xl bg-white/10 text-white/70 text-sm font-medium hover:bg-white/15 transition-colors"
					>
						{t('Close', 'மூடு')}
					</button>
					<button
						onClick={handleShare}
						disabled={isGenerating}
						className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
					>
						{isGenerating ? (
							<>
								<svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
								</svg>
								{t('Generating...', 'உருவாக்குகிறோம்...')}
							</>
						) : shared ? (
							t('✓ Shared!', '✓ பகிரப்பட்டது!')
						) : (
							<>
								<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
								</svg>
								{t('Share / Download', 'பகிர் / பதிவிறக்கு')}
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
