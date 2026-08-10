'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/lib/language-context';

interface CameraCaptureProps {
	onPhotoSelected: (file: File) => void;
}

type CaptureMode = 'camera' | 'review' | 'fallback';

export default function CameraCapture({ onPhotoSelected }: CameraCaptureProps) {
	const { t } = useLanguage();
	const [mode, setMode] = useState<CaptureMode>('camera');
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
	const [capturedFile, setCapturedFile] = useState<File | null>(null);
	const [cameraError, setCameraError] = useState<string | null>(null);
	const [isFlashActive, setIsFlashActive] = useState(false);
	const [isDragOver, setIsDragOver] = useState(false);

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const galleryInputRef = useRef<HTMLInputElement>(null);
	const cameraInputRef = useRef<HTMLInputElement>(null);

	// Start Live Camera Stream
	const startCamera = useCallback(async () => {
		setCameraError(null);
		try {
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				setMode('fallback');
				return;
			}
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: { ideal: 'environment' },
					width: { ideal: 1920 },
					height: { ideal: 1080 },
				},
				audio: false,
			});

			setStream(mediaStream);
			if (videoRef.current) {
				videoRef.current.srcObject = mediaStream;
			}
			setMode('camera');
		} catch (err) {
			console.warn('Camera access error or denied:', err);
			setCameraError('Camera preview unavailable. You can upload an image from your device.');
			setMode('fallback');
		}
	}, []);

	// Stop Camera Stream
	const stopCamera = useCallback(() => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			setStream(null);
		}
	}, [stream]);

	useEffect(() => {
		startCamera();
		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Capture Photo Frame from Live Stream
	const handleCapture = useCallback(() => {
		if (!videoRef.current || !canvasRef.current) return;

		// Visual shutter flash (Apple Design Section 1 & 2)
		setIsFlashActive(true);
		setTimeout(() => setIsFlashActive(false), 150);

		const video = videoRef.current;
		const canvas = canvasRef.current;

		canvas.width = video.videoWidth || 1280;
		canvas.height = video.videoHeight || 720;

		const ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			canvas.toBlob(
				(blob) => {
					if (!blob) return;
					const file = new File([blob], `captured-bill-${Date.now()}.jpg`, { type: 'image/jpeg' });
					const url = URL.createObjectURL(blob);
					setCapturedFile(file);
					setCapturedUrl(url);
					setMode('review');
					stopCamera();
				},
				'image/jpeg',
				0.92
			);
		}
	}, [stopCamera]);

	// Retake Photo
	const handleRetake = () => {
		if (capturedUrl) {
			URL.revokeObjectURL(capturedUrl);
		}
		setCapturedUrl(null);
		setCapturedFile(null);
		startCamera();
	};

	// Use Captured Photo
	const handleUsePhoto = () => {
		if (capturedFile) {
			onPhotoSelected(capturedFile);
		}
	};

	// File Upload Handler (Works for both Gallery Pick & Camera File capture)
	const handleFileSelect = (file: File) => {
		if (!file || !file.type.startsWith('image/')) return;
		const url = URL.createObjectURL(file);
		setCapturedFile(file);
		setCapturedUrl(url);
		setMode('review');
		stopCamera();
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
		const file = e.dataTransfer.files[0];
		if (file) handleFileSelect(file);
	};

	return (
		<div className="w-full max-w-xl mx-auto">
			{/* Hidden Canvas for Frame Capture */}
			<canvas ref={canvasRef} className="hidden" />

			{/* File Input 1: Gallery / File Picker (NO capture attribute -> opens Photo Library / Files on Mobile) */}
			<input
				ref={galleryInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (file) handleFileSelect(file);
					e.target.value = ''; // Reset for re-selection
				}}
			/>

			{/* File Input 2: Direct Camera Shot (capture="environment" -> opens Native Camera) */}
			<input
				ref={cameraInputRef}
				type="file"
				accept="image/*"
				capture="environment"
				className="hidden"
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (file) handleFileSelect(file);
					e.target.value = ''; // Reset for re-selection
				}}
			/>

			<AnimatePresence mode="wait">
				{/* MODE 1: LIVE CAMERA VIEW */}
				{mode === 'camera' && (
					<motion.div
						key="camera"
						initial={{ opacity: 0, scale: 0.98 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0 }}
						transition={{ type: 'spring', damping: 25, stiffness: 300 }}
						className="relative rounded-3xl overflow-hidden glass-card border border-slate-200/80 shadow-lg bg-black text-white"
					>
						{/* Shutter Flash Effect */}
						{isFlashActive && (
							<div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-150" />
						)}

						{/* Video Preview */}
						<div className="relative aspect-[3/4] sm:aspect-[4/3] w-full bg-black flex items-center justify-center overflow-hidden">
							<video
								ref={videoRef}
								autoPlay
								playsInline
								muted
								className="w-full h-full object-cover"
							/>

							{/* Document Framing Guide Overlay */}
							<div className="absolute inset-6 border-2 border-white/40 border-dashed rounded-2xl pointer-events-none flex items-center justify-center">
								<span className="text-white/70 text-xs font-medium bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-center">
									{t('Position medical bill within frame', 'மசோதாவை சட்டகத்தினுள் வைக்கவும்')}
								</span>
							</div>

							{/* Top Bar Controls */}
							<div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
								<span className="bg-black/60 backdrop-blur-md text-white/90 text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
									<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
									{t('Live Camera', 'நேரலை கேமரா')}
								</span>

								{/* Mobile/Desktop Upload Button -> Opens Gallery File Picker */}
								<button
									type="button"
									onClick={() => {
										stopCamera();
										galleryInputRef.current?.click();
									}}
									className="bg-black/60 hover:bg-black/80 active:bg-black backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
								>
									<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
									</svg>
									<span>{t('Upload File', 'கோப்பு பதிவேற்றவும்')}</span>
								</button>
							</div>

							{/* Bottom Shutter Controls */}
							<div className="absolute bottom-6 left-0 right-0 flex flex-col items-center justify-center z-20 gap-3">
								<motion.button
									onPointerDown={handleCapture}
									whileTap={{ scale: 0.92 }}
									transition={{ type: 'spring', damping: 20, stiffness: 400 }}
									className="w-18 h-18 rounded-full border-4 border-white bg-white/20 backdrop-blur-xs p-1.5 flex items-center justify-center cursor-pointer shadow-xl group"
									aria-label={t('Take Photo', 'புகைப்படம் எடு')}
								>
									<div className="w-full h-full rounded-full bg-white group-active:bg-slate-200 transition-colors" />
								</motion.button>
								<span className="text-white/80 text-xs font-medium bg-black/50 backdrop-blur-xs px-3 py-1 rounded-full">
									{t('Tap to Capture', 'புகைப்படம் எடுக்க தட்டவும்')}
								</span>
							</div>
						</div>
					</motion.div>
				)}

				{/* MODE 2: REVIEW PHOTO VIEW */}
				{mode === 'review' && capturedUrl && (
					<motion.div
						key="review"
						initial={{ opacity: 0, scale: 0.98 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0 }}
						transition={{ type: 'spring', damping: 25, stiffness: 300 }}
						className="rounded-3xl overflow-hidden glass-card border border-slate-200/80 shadow-lg bg-white p-4 sm:p-6"
					>
						<div className="text-center mb-4">
							<h3 className="type-heading-2 text-slate-900 mb-1">
								{t('Review Selected Photo', 'புகைப்படத்தை சரிபார்க்கவும்')}
							</h3>
							<p className="type-subheadline text-slate-500">
								{t('Ensure text and test names are clear before proceeding', 'தகவல்கள் தெளிவாக உள்ளதா என பார்க்கவும்')}
							</p>
						</div>

						{/* Captured Image Preview */}
						<div className="relative aspect-[3/4] sm:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-900 mb-6 border border-slate-200 flex items-center justify-center">
							<img
								src={capturedUrl}
								alt="Captured Bill"
								className="max-h-full max-w-full object-contain"
							/>
						</div>

						{/* Review Action Buttons */}
						<div className="flex gap-3">
							<motion.button
								whileTap={{ scale: 0.97 }}
								onClick={handleRetake}
								className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
							>
								<svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
								</svg>
								{t('Change / Retake', 'மாற்று')}
							</motion.button>

							<motion.button
								whileTap={{ scale: 0.97 }}
								onClick={handleUsePhoto}
								className="flex-1 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md shadow-teal-600/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
							>
								<span>{t('Use This Photo', 'இந்த படத்தை பயன்படுத்து')}</span>
								<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
								</svg>
							</motion.button>
						</div>
					</motion.div>
				)}

				{/* MODE 3: FALLBACK / DIRECT FILE SELECTION VIEW */}
				{mode === 'fallback' && (
					<motion.div
						key="fallback"
						initial={{ opacity: 0, scale: 0.98 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0 }}
						transition={{ type: 'spring', damping: 25, stiffness: 300 }}
						className={`rounded-3xl glass-card p-6 sm:p-8 border-2 border-dashed transition-all duration-200 text-center ${
							isDragOver
								? 'border-teal-500 bg-teal-50/50 scale-[1.01]'
								: 'border-slate-300 hover:border-teal-500 hover:bg-slate-50/50'
						}`}
						onDrop={handleDrop}
						onDragOver={(e) => {
							e.preventDefault();
							setIsDragOver(true);
						}}
						onDragLeave={() => setIsDragOver(false)}
					>
						<div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto mb-4">
							<svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
							</svg>
						</div>

						<h3 className="type-heading-2 text-slate-900 mb-2">
							{t('Upload Medical Bill Image', 'மருத்துவ மசோதா படம் பதிவேற்றவும்')}
						</h3>

						<p className="type-subheadline text-slate-500 mb-6 max-w-sm mx-auto">
							{t('Choose a clear photo from your gallery or take a new photo', 'உங்கள் கேலரியில் இருந்து தேர்வு செய்யவும் அல்லது படம் எடுக்கவும்')}
						</p>

						{/* Action Buttons for Mobile & Desktop */}
						<div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch max-w-sm mx-auto">
							{/* Option 1: Gallery Pick */}
							<motion.button
								whileTap={{ scale: 0.97 }}
								type="button"
								onClick={() => galleryInputRef.current?.click()}
								className="py-3.5 px-5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
							>
								<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
								</svg>
								<span>{t('Choose from Gallery / Files', 'கேலரியில் இருந்து தேர்ந்தெடு')}</span>
							</motion.button>

							{/* Option 2: Native Camera Trigger */}
							<motion.button
								whileTap={{ scale: 0.97 }}
								type="button"
								onClick={() => cameraInputRef.current?.click()}
								className="py-3.5 px-4 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
							>
								<svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
								</svg>
								<span>{t('Take New Photo', 'புகைப்படம் எடு')}</span>
							</motion.button>
						</div>

						{cameraError && (
							<p className="text-xs text-amber-700 mt-4 bg-amber-50 rounded-xl p-2.5 max-w-sm mx-auto border border-amber-200">
								{cameraError}
							</p>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
