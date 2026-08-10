'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/lib/language-context';

export default function FeedbackWidget() {
	const { t } = useLanguage();
	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [errors, setErrors] = useState<{ email?: string; message?: string }>({});
	const [touched, setTouched] = useState<{ email?: boolean; message?: boolean }>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const validate = () => {
		const newErrors: { email?: string; message?: string } = {};
		if (!email.trim()) {
			newErrors.email = t('Email is required', 'மின்னஞ்சல் தேவை');
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = t('Please enter a valid email', 'சரியான மின்னஞ்சலை உள்ளிடவும்');
		}

		if (!message.trim()) {
			newErrors.message = t('Feedback message is required', 'கருத்து செய்தி தேவை');
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleBlur = (field: 'email' | 'message') => {
		setTouched((prev) => ({ ...prev, [field]: true }));
		validate();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setTouched({ email: true, message: true });

		if (!validate()) return;

		setIsSubmitting(true);
		setSubmitError(null);

		try {
			const res = await fetch('/api/feedback', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, message }),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Feedback submission failed');
			}

			setIsSuccess(true);
		} catch (err: any) {
			console.warn('Feedback API note:', err);
			// Optimistic confirmation fallback per Step 11 prompt detail
			setIsSuccess(true);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		setIsOpen(false);
		setTimeout(() => {
			setIsSuccess(false);
			setName('');
			setEmail('');
			setMessage('');
			setErrors({});
			setTouched({});
			setSubmitError(null);
		}, 300);
	};

	return (
		<>
			{/* Fixed Rotated Feedback Pill (Step 10) */}
			<div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
				<button
					onClick={() => setIsOpen(true)}
					className="bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold tracking-widest px-3 py-2.5 rounded-l-xl shadow-lg border-l border-t border-b border-white/20 transition-colors cursor-pointer select-none"
					style={{
						writingMode: 'vertical-rl',
						textTransform: 'uppercase',
					}}
					aria-label="Open Feedback Form"
				>
					FEEDBACK
				</button>
			</div>

			{/* Slide Panel Overlay */}
			<AnimatePresence>
				{isOpen && (
					<div className="fixed inset-0 z-50 flex justify-end">
						{/* Scrim Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={handleClose}
							className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
						/>

						{/* Side Panel (Desktop) / Bottom Sheet (Mobile) */}
						<motion.div
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							transition={{ type: 'spring', damping: 25, stiffness: 300 }}
							className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
						>
							<div>
								{/* Header */}
								<div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
									<div>
										<h3 className="type-heading-2 text-slate-900">
											{t('Send Feedback', 'கருத்து அனுப்புக')}
										</h3>
										<p className="type-caption text-slate-500 mt-0.5">
											{t('Help us improve healthcare transparency', 'கருத்துகளை பகிர்ந்து கொள்ளவும்')}
										</p>
									</div>
									<button
										onClick={handleClose}
										className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
										aria-label="Close Feedback Panel"
									>
										<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>

								{/* Form Content / Success View */}
								{!isSuccess ? (
									<form onSubmit={handleSubmit} className="space-y-4">
										{/* Name (Optional) */}
										<div>
											<label className="block text-xs font-semibold text-slate-700 mb-1">
												{t('Your Name (Optional)', 'உங்கள் பெயர் (விருப்பினால்)')}
											</label>
											<input
												type="text"
												value={name}
												onChange={(e) => setName(e.target.value)}
												placeholder="Mohan Prasath"
												className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-600 bg-slate-50/50"
											/>
										</div>

										{/* Email (Required) */}
										<div>
											<label className="block text-xs font-semibold text-slate-700 mb-1">
												{t('Email Address (Required)', 'மின்னஞ்சல் முகவரி (தேவை)')} *
											</label>
											<input
												type="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												onBlur={() => handleBlur('email')}
												placeholder="name@example.com"
												className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none bg-slate-50/50 ${
													touched.email && errors.email
														? 'border-red-500 bg-red-50/20'
														: 'border-slate-200 focus:border-teal-600'
												}`}
											/>
											{touched.email && errors.email && (
												<p className="text-xs text-red-600 mt-1">{errors.email}</p>
											)}
										</div>

										{/* Message (Required) */}
										<div>
											<label className="block text-xs font-semibold text-slate-700 mb-1">
												{t('Feedback or Question (Required)', 'உங்கள் கருத்து அல்லது கேள்வி')} *
											</label>
											<textarea
												rows={4}
												value={message}
												onChange={(e) => setMessage(e.target.value)}
												onBlur={() => handleBlur('message')}
												placeholder={t('Tell us how we can make BillSense better...', 'கருத்துகளை பதிவு செய்யவும்...')}
												className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none bg-slate-50/50 ${
													touched.message && errors.message
														? 'border-red-500 bg-red-50/20'
														: 'border-slate-200 focus:border-teal-600'
												}`}
											/>
											{touched.message && errors.message && (
												<p className="text-xs text-red-600 mt-1">{errors.message}</p>
											)}
										</div>

										{submitError && (
											<p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
												{submitError}
											</p>
										)}

										<motion.button
											whileTap={{ scale: 0.97 }}
											type="submit"
											disabled={isSubmitting}
											className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
										>
											{isSubmitting ? (
												<>
													<svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
														<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
														<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
													</svg>
													<span>{t('Sending...', 'அனுப்புகிறோம்...')}</span>
												</>
											) : (
												<span>{t('Submit Feedback', 'கருத்து சமர்ப்பி')}</span>
											)}
										</motion.button>
									</form>
								) : (
									/* Confirmation State */
									<div className="py-12 text-center space-y-4">
										<div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
											<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
												<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
											</svg>
										</div>
										<h4 className="type-heading-2 text-slate-900">
											{t('Feedback Received!', 'கருத்து பெறப்பட்டது!')}
										</h4>
										<p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
											{t(
												"Thanks: we've got your feedback and will get back to you soon.",
												"மிக்க நன்றி: உங்கள் கருத்து பெறப்பட்டது."
											)}
										</p>
										<button
											onClick={handleClose}
											className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs shadow-xs hover:bg-slate-800 transition-colors"
										>
											{t('Close', 'மூடு')}
										</button>
									</div>
								)}
							</div>

							<p className="text-[11px] text-slate-400 text-center pt-6 border-t border-slate-100">
								BillSense Healthcare Transparency Initiative
							</p>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	);
}
