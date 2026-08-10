'use client';

import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/lib/language-context';
import type { AnalyzeResponse } from '@/types';

interface Message {
	id: string;
	sender: 'user' | 'assistant';
	text: string;
}

interface ChatContextType {
	lastAnalysisResult: AnalyzeResponse | null;
	setLastAnalysisResult: (results: AnalyzeResponse | null) => void;
}

const ChatContext = createContext<ChatContextType>({
	lastAnalysisResult: null,
	setLastAnalysisResult: () => {},
});

export function ChatContextProvider({ children }: { children: React.ReactNode }) {
	const [lastAnalysisResult, setLastAnalysisResult] = useState<AnalyzeResponse | null>(null);

	return (
		<ChatContext.Provider value={{ lastAnalysisResult, setLastAnalysisResult }}>
			{children}
		</ChatContext.Provider>
	);
}

export function useChatContext() {
	return useContext(ChatContext);
}

export default function ChatbotWidget() {
	const { t } = useLanguage();
	const { lastAnalysisResult } = useChatContext();
	const [isOpen, setIsOpen] = useState(false);
	const [input, setInput] = useState('');
	const [isTyping, setIsTyping] = useState(false);

	const initialWelcome = lastAnalysisResult
		? t(
				'Hi! Ask me anything about the bill you just scanned, or how CGHS pricing works.',
				'வணக்கம்! நீங்கள் இப்போது பகுப்பாய்வு செய்த மசோதாவை பற்றிய கேள்விகளை கேட்கலாம்.'
		  )
		: t(
				'Hi! Ask me how BillSense works, or ask about a medical bill you want to analyze.',
				'வணக்கம்! BillSense எப்படி செயல்படுகிறது அல்லது மருத்துவ மசோதாக்கள் பற்றி என்னிடம் கேளுங்கள்.'
		  );

	const [messages, setMessages] = useState<Message[]>([
		{
			id: 'welcome-1',
			sender: 'assistant',
			text: initialWelcome,
		},
	]);

	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen) {
			messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages, isOpen, isTyping]);

	const handleSend = async () => {
		const userMsg = input.trim();
		if (!userMsg || isTyping) return;

		const userMessageObj: Message = {
			id: 'user-' + Date.now(),
			sender: 'user',
			text: userMsg,
		};

		setMessages((prev) => [...prev, userMessageObj]);
		setInput('');
		setIsTyping(true);

		try {
			const historyPayload = messages.map((m) => ({
				role: m.sender === 'user' ? 'user' : 'model',
				parts: [{ text: m.text }],
			}));

			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: userMsg,
					history: historyPayload,
					lastAnalysisResult: lastAnalysisResult || undefined,
				}),
			});

			const data = await res.json();

			const botMessageObj: Message = {
				id: 'bot-' + Date.now(),
				sender: 'assistant',
				text: data.reply || t('I am here to help answer questions about BillSense and your medical bills.', 'உங்களுக்கு உதவ நான் இருக்கிறேன்.'),
			};

			setMessages((prev) => [...prev, botMessageObj]);
		} catch (err) {
			console.error('Chat API error:', err);
			setMessages((prev) => [
				...prev,
				{
					id: 'bot-err-' + Date.now(),
					sender: 'assistant',
					text: t(
						'BillSense Assistant is informational only. Feel free to ask about our methodology or test prices.',
						'தகவல் கேள்விகளை தொடர்ந்து கேட்கலாம்.'
					),
				},
			]);
		} finally {
			setIsTyping(false);
		}
	};

	return (
		<>
			{/* Floating Chat Bubble Button (Step 12) */}
			<div className="fixed bottom-6 right-6 z-40">
				<motion.button
					whileTap={{ scale: 0.92 }}
					onClick={() => setIsOpen(!isOpen)}
					className="w-14 h-14 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-xl flex items-center justify-center cursor-pointer border border-white/20 transition-all group"
					aria-label="Open BillSense Assistant Chat"
				>
					{isOpen ? (
						<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					) : (
						<svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-1.006-.826c.228-1.258.627-2.396 1.163-3.375A8.134 8.134 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
						</svg>
					)}
				</motion.button>
			</div>

			{/* Chat Window Panel */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 20, scale: 0.95 }}
						transition={{ type: 'spring', damping: 25, stiffness: 300 }}
						className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[500px] glass-card rounded-3xl shadow-2xl border border-slate-200 bg-white flex flex-col overflow-hidden"
					>
						{/* Header */}
						<div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
							<div className="flex items-center gap-2.5">
								<div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
									</svg>
								</div>
								<div>
									<h4 className="font-semibold text-sm leading-none">BillSense Assistant</h4>
									<p className="text-[10px] text-teal-300/80 mt-0.5">Healthcare Price AI</p>
								</div>
							</div>

							<button
								onClick={() => setIsOpen(false)}
								className="text-white/70 hover:text-white p-1 rounded-lg transition-colors"
							>
								<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						{/* Messages Container */}
						<div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
							{messages.map((m) => (
								<div
									key={m.id}
									className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
								>
									<div
										className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
											m.sender === 'user'
												? 'bg-teal-600 text-white rounded-br-xs'
												: 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
										}`}
									>
										{m.text}
									</div>
								</div>
							))}

							{isTyping && (
								<div className="flex justify-start">
									<div className="bg-white border border-slate-200 text-slate-500 rounded-2xl px-4 py-2.5 text-xs flex items-center gap-1.5 shadow-2xs">
										<span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" />
										<span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
										<span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
									</div>
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>

						{/* Input Bar */}
						<div className="p-3 border-t border-slate-200 bg-white">
							<form
								onSubmit={(e) => {
									e.preventDefault();
									handleSend();
								}}
								className="flex gap-2"
							>
								<input
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									placeholder={t('Ask a question...', 'கேள்வி கேட்கவும்...')}
									className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-600 bg-slate-50"
								/>
								<button
									type="submit"
									disabled={!input.trim() || isTyping}
									className="px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white transition-colors cursor-pointer"
								>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
									</svg>
								</button>
							</form>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
