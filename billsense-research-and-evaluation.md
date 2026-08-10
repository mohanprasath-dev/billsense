# Billsense — Research & Evaluation

Multilingual, real-time medical test/hospital bill explainer. India-first, Tamil + English MVP. Free public-good tool, no monetization planned.

---

## 1. Core Concept

**Flow:** Photo of bill/test slip → OCR → fuzzy match against test/procedure database → plain-language explanation (LOINC/MedlinePlus sourced) → price benchmark (CGHS/IRDAI reference + crowdsourced data) → shareable WhatsApp card.

**Positioning:** Product-branded, not founder-branded. Free-forever, no monetization layer (confirmed not a business — public-good build).

**Rollout:** English + Tamil → major Indian languages (Hindi, Telugu, Bengali, Marathi) → remaining Indian languages → global.

**Non-negotiables:**
- Never claim a test is "unnecessary" — liability risk. Show patterns/prices, let user decide.
- Every explanation human-reviewed before going live.
- No language ships without native-speaker medical accuracy review.

---

## 2. Competitive Landscape (from original roadmap)

| Name | What they do | Gap vs Billsense |
|---|---|---|
| Watchdoq (India) | Compare hospitals/doctors/costs | Pre-admission research tool, not in-the-moment |
| Evaakil Medical Bill Auditor (India) | Post-bill overcharge flagging vs IRDAI list | Post-bill only, English-only |
| Reverie | B2B multilingual chatbot sold to hospitals | Hospital-controlled, conflict of interest |
| Patiently AI | Multilingual plain-language note simplifier | US/global-facing, not India-priced |
| FairMedBill / OvrCharged (US) | Post-bill AI audit + dispute automation | US-only, post-bill |

**Verdict:** No one combines real-time + multilingual + India-priced + consumer-first. Lane is open.

---

## 3. Market Research Findings (web-verified)

**Scale of the pain — bigger than originally scoped:**
- A 2023 Public Health Foundation of India study found 73% of patients could not understand their hospital bills, even after discharge.
- A LocalCircles survey of 35,000+ citizens across 329 districts found 53% of patients did not receive fully itemised bills; 74% wanted government-mandated fixed billing formats.
- This isn't a rare, once-a-year moment for a family — it's most hospital visits, most people. One-shot-trust framing (not daily-use, needs word-of-mouth growth) still holds, but the addressable moment is wider than assumed.

**What people do today — worse than "ask a doctor friend":**
- Patients frequently self-diagnose and self-treat based on WhatsApp health misinformation before ever seeing a doctor. Physicians report patients arriving "more scared than sick" from misread health content.
- Real competitor isn't Watchdoq or Evaakil — it's bad information people already trust. This raises the trust bar: users have likely been burned by a WhatsApp health forward before, so first impression matters more than the original roadmap accounted for.

**Regulatory tailwind — two independent signals, not one:**
- BIS introduced a voluntary standardized hospital billing format nationwide; may become mandatory by 2027.
- Separately, India's National Health Claims Exchange (NHCX) already exists as live infrastructure for digital claims interoperability — insurers and TPAs (e.g. MDIndia) are actively integrating with it.
- FY2024 IRDAI data: health claim rejections rose 19.1% year-on-year to ₹26,000 crore, largely traced to documentation errors — meaning the price-transparency/data-layer version of this idea (Phase 6, insurer/TPA API) has a real, funded market with existing rails, not just a mentioned "someday" feature. Correctly firewalled from MVP scope, but genuinely real if pursued later.

**Biggest technical risk — confirmed, underweighted in original roadmap:**
- OCR on handwritten Indian medical documents is an active, unsolved academic research problem, not a solved commodity API call. Multiple 2024–2026 papers confirm handwriting recognition in prescriptions remains challenging due to inconsistent formats and handwriting variability, with real risk of misinterpretation.
- Printed/itemised hospital bills are a meaningfully easier OCR target than handwritten prescriptions. These should not be scoped together.

---

## 4. Idea Pressure Test

**Reframe:** What's being asked for is a bill/test explainer feature. What's underneath it: a moment of confusion and fear when someone can't tell what they're being charged for or whether it's fair, with no one to ask right then.

**Forcing questions:**

| Question | Answer |
|---|---|
| Who hits this, how often? | Wider than assumed — 73%/53% data confirms most hospital visits, most people, not a rare annual event per family. Still not daily-use; growth must be word-of-mouth/forward-driven. |
| What do they do today? | Self-diagnose off WhatsApp misinformation, ask a relative, or just pay and move on. Real competitor is bad trusted information, not other apps. |
| Narrowest version still useful tomorrow? | OCR + fuzzy match + MedlinePlus explain, English only, **printed bills only** (not handwritten), no price layer, no Tamil, no WhatsApp card. Buildable in days. |
| What's the 10x version? | Live price-transparency API for insurers/TPAs, riding on NHCX. Real, fundable, different company with different data-liability needs. Keep out of MVP. |
| What happens if skipped entirely? | Nothing breaks today — no user queue, no customer waiting. Validated pain, not urgent fire. |

**Premises challenged:**
1. "Empty competitive lane → good idea" — pain is now population-scale validated by independent published data, not just a hunch. Validation risk is low.
2. "OCR will work well enough on messy bills" — this is the single biggest technical risk in the project, confirmed by current research as a genuinely open problem for handwriting. Should gate the build, not sit buried in Phase 2. Printed bills are a much safer first target.
3. CGHS-vs-private-hospital price comparison risk — showing a stark price gap without disclaimer implies overcharging without saying it; the "never claim unnecessary" rule doesn't fully cover this.
4. Bandwidth — this is a 5th concurrent active track (alongside Kaggriculture, ARI security audit, WealthLoop, One More Try, college). With no monetization pressure, the main real constraint is time, not money.

**Recommendation:** Narrowest first — printed hospital bill photo → OCR → fuzzy match → plain-English MedlinePlus explanation. English only. No Tamil, no price layer, no WhatsApp card, no handwriting support in v1. Defer everything else explicitly, including Phase 5/6.

---

## 5. Startup Idea Evaluator — Scores

*(Re-scored after confirming no monetization intent — this is a public-good/portfolio build, not a venture. Monetization dimension marked N/A rather than scored as a weakness.)*

| Dimension | Score | Reasoning |
|---|---|---|
| Problem validation | 6/10 | Independent, large-sample published data (73%, 53%, 74%) confirms population-scale pain. Willingness-to-pay is irrelevant since monetization isn't a goal. |
| Market size / reachability | 6/10 | Huge population, real friction, but no clear channel to reach someone mid-bill-panic at scale without partnerships you're deliberately avoiding. |
| Differentiation | 5/10 | Real-time + multilingual + India-priced + consumer-first combo is currently uncopied. OCR-on-messy-documents being genuinely hard cuts both ways — harder to build, harder to clone. |
| Why now | 6/10 | Two independent regulatory/infra signals pointing the same direction: BIS standardized billing format + live NHCX claims infrastructure. |
| Monetization path | N/A | Not applicable — explicitly not monetizing. |
| Execution fit | 6/10 | Stack fits (Next.js, OCR, LLM, GCP), but OCR-on-handwriting is confirmed harder than a simple API call, and this is competing for hours against 4 other active commitments. |
| Speed to signal | 6/10 | Scoped to printed bills only, real signal achievable in days. Handwriting inclusion would push this out significantly. |

**Biggest risk (revised):** Not "no payer" — that's moot now. The real risk is scope creep against a hard time budget: OCR-on-handwriting alone could absorb weeks that don't exist alongside Kaggriculture, the ARI audit, WealthLoop, and college.

**Verdict: BUILD SMALL, NOT VALIDATE.**
With monetization off the table, the pressure-test's core recommendation stands as the build plan: printed-bills-only, English-only, no infra beyond a hardcoded test list and MedlinePlus lookup. Treat Tamil, price layer, WhatsApp card, and handwriting OCR as explicitly deferred, not core scope.

---

## 6. Status

Demo is reportedly ready. Recommended before expanding scope further:
- Confirm the demo's OCR path was tested against printed hospital bills, not handwritten prescriptions — if it works on handwriting already, that's a stronger result than the research base would predict and worth noting as a differentiator.
- Decide explicitly: portfolio piece / one-off ship-and-forget / long-term maintained tool — this determines whether Tamil, price layer, and WhatsApp card are worth the additional hours.
