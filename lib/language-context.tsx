'use client';

import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ta';

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (en: string, ta: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
	language: 'en',
	setLanguage: () => {},
	t: (en) => en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
	const [language, setLanguage] = useState<Language>('en');

	const t = (en: string, ta: string) => (language === 'en' ? en : ta);

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	return useContext(LanguageContext);
}
