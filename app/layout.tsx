import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/language-context';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
	metadataBase: new URL('https://billsense.taskdrift.in'),
	title: 'BillSense | Understand Your Medical Bill',
	description:
		'Upload a photo of your Indian medical bill or prescription and get plain-language explanations of every test with CGHS reference pricing. Available in English and Tamil.',
	keywords: ['medical bill', 'India', 'CGHS', 'bill explainer', 'Tamil', 'health'],
	icons: {
		icon: '/logo.png',
		shortcut: '/logo.png',
		apple: '/logo.png',
	},
	openGraph: {
		title: 'BillSense | Understand Your Medical Bill',
		description: 'Plain-language explanations of every test on your bill, with CGHS reference pricing.',
		type: 'website',
		images: [{ url: '/logo+name.png', width: 1200, height: 630, alt: 'BillSense | Understand Your Medical Bill' }],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'BillSense | Understand Your Medical Bill',
		description: 'Plain-language explanations of every test on your bill, with CGHS reference pricing.',
		images: ['/logo+name.png'],
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={`${inter.className} bg-slate-50 text-slate-900 antialiased min-h-screen selection:bg-teal-100 selection:text-teal-900`}>
				<LanguageProvider>{children}</LanguageProvider>
			</body>
		</html>
	);
}
