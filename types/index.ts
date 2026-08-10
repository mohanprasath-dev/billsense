import type { MedicalTest } from '@/lib/fuzzy-match';

export type PriceFlag = 'high' | 'fair' | 'no_data';

export interface MatchedResult {
	test: MedicalTest;
	raw_text: string;
	billed_price: number | null;
	flag: PriceFlag;
}

export interface AnalyzeResponse {
	matched: MatchedResult[];
	unmatched: string[];
	image_url?: string | null;
}
