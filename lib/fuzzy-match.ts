/**
 * Simple fuzzy string matching for medical test names.
 * Uses token overlap + Levenshtein distance for matching.
 * No external NLP libraries — lightweight and fast.
 */

function levenshtein(a: string, b: string): number {
	const m = a.length;
	const n = b.length;
	const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
		Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
	);
	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			if (a[i - 1] === b[j - 1]) {
				dp[i][j] = dp[i - 1][j - 1];
			} else {
				dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
			}
		}
	}
	return dp[m][n];
}

function tokenOverlapScore(query: string, candidate: string): number {
	const queryTokens = new Set(query.toLowerCase().split(/\s+/).filter(Boolean));
	const candidateTokens = candidate.toLowerCase().split(/\s+/).filter(Boolean);
	if (queryTokens.size === 0) return 0;
	const matches = candidateTokens.filter((t) => queryTokens.has(t)).length;
	return matches / Math.max(queryTokens.size, candidateTokens.length);
}

export interface MedicalTest {
	id: string;
	name_en: string;
	name_ta: string;
	aliases: string[];
	explanation_en: string;
	explanation_ta: string;
	cghs_price_inr: number;
	category: string;
}

export function fuzzyMatchTest(
	query: string,
	tests: MedicalTest[]
): MedicalTest | null {
	const normalizedQuery = query.toLowerCase().trim();

	let bestMatch: MedicalTest | null = null;
	let bestScore = -1;

	for (const test of tests) {
		const candidates = [test.name_en, test.name_ta, ...test.aliases];

		for (const candidate of candidates) {
			const normalizedCandidate = candidate.toLowerCase().trim();

			// Exact match shortcut
			if (normalizedCandidate === normalizedQuery) return test;

			// Substring match — high weight
			const substringScore =
				normalizedCandidate.includes(normalizedQuery) ||
				normalizedQuery.includes(normalizedCandidate)
					? 0.85
					: 0;

			// Token overlap
			const tokenScore = tokenOverlapScore(normalizedQuery, normalizedCandidate);

			// Levenshtein similarity — normalized to 0-1
			const maxLen = Math.max(normalizedQuery.length, normalizedCandidate.length);
			const levScore =
				maxLen === 0
					? 1
					: 1 - levenshtein(normalizedQuery, normalizedCandidate) / maxLen;

			// Weighted combo
			const score = Math.max(substringScore, tokenScore * 0.7 + levScore * 0.3);

			if (score > bestScore) {
				bestScore = score;
				bestMatch = test;
			}
		}
	}

	// Only return match if score is meaningful
	return bestScore > 0.45 ? bestMatch : null;
}

export type PriceFlag = 'high' | 'fair' | 'no_data';

export function computePriceFlag(
	billedPrice: number | null,
	cghsPrice: number
): PriceFlag {
	if (billedPrice === null || billedPrice <= 0) return 'no_data';
	if (billedPrice > cghsPrice * 1.4) return 'high';
	return 'fair';
}
