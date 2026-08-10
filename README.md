# BillSense | Multilingual Medical Bill & Test Explainer

> **Understand what you are being charged for, in plain language.**

> **Status**: Live Demo: Built for HackFusion 2026 (Round 1). Full product in development.

---

## 1. The Problem

Healthcare pricing and medical bill jargon in India create extreme cognitive and financial strain for patients and families. Most hospital invoices list diagnostic procedures as abbreviated medical acronyms without plain-language explanations or reference price benchmarks:

- **73% of patients** couldn't understand their hospital bill, even after discharge (*Source: Public Health Foundation of India, 2023*).
- **53% of patients** did not receive a fully itemised hospital bill (*Source: LocalCircles survey across 35,000+ citizens in 329 districts*).
- **₹26,000 crore** in health insurance claims were rejected in FY2024 (up 19.1% YoY), largely resulting from documentation errors and itemization ambiguities (*Source: IRDAI*).

---

## 2. What It Does (Current Working Demo)

BillSense is a consumer-first medical bill analyzer that breaks down hospital invoices and diagnostic prescriptions into accessible information:

1. **Live Camera Capture & Upload**: Capture hospital bills directly using mobile camera or upload saved photos/files.
2. **AI OCR & Test Matching**: Powered by Google Gemini 3.6 Flash to extract line items and fuzzy-match them against a curated dataset (`data/tests.json`).
3. **Plain-Language Explanations**: Converts complex medical terms (e.g. *Lipid Profile*, *HbA1c*, *CBC w/ Diff*) into simple everyday English and Tamil.
4. **CGHS Reference Price Check**: Compares billed prices against Central Government Health Scheme (CGHS) benchmark rates to flag items as **Fair Price**, **Higher Than Reference**, or **No Price Data**.
5. **Shareable Summary Card**: Generates a clean, downloadable summary card for WhatsApp and social sharing (`html2canvas`).
6. **Site-Wide AI Chatbot**: Interactive assistant with dual-context capability (General FAQ mode + Scanned Bill context mode to answer follow-up questions about scanned line items).
7. **Feedback System**: Site-wide feedback widget that sends email notifications and auto-replies via Resend, and appends submissions to Google Sheets (`googleapis`).

---

## 3. Explicitly Out of Scope for This Demo

To set clear expectations for judges and reviewers, the following features are explicitly out of scope for the current hackathon build:

- **Live Government API Integration**: The current build uses a curated ~20-test demonstration dataset (`data/tests.json`), not a live API connection to official CGHS or IRDAI databases.
- **Handwritten Prescription OCR**: Restricted to printed hospital bills and printed diagnostic prescriptions. Handwritten OCR is a known, unsolved computer vision research problem and is deliberately deferred.
- **Crowdsourced Pricing Data**: No user-submitted price submissions in this stage.
- **Languages Beyond English & Tamil**: Regional languages (Hindi, Telugu, Bengali, Marathi) are planned for future expansion batches.
- **User Accounts & Authentication**: No login or sign-up required. Public, friction-free demo.
- **Monetization**: Free-forever public-good utility. No subscription or fee structure planned.

---

## 4. Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 / 16 (App Router, Server & Client Components) |
| **Language** | TypeScript |
| **Styling & UI** | Tailwind CSS + Custom Apple-inspired fluid design system |
| **Animation** | Motion (`motion/react` spring physics) |
| **AI / OCR** | Google Gemini 3.6 Flash (`@google/generative-ai`) |
| **Image Storage** | Supabase Storage (`bill-uploads` public bucket) |
| **Integrations** | Resend API (email notifications) + Google Sheets API v4 (`googleapis`) |
| **Deployment** | Vercel |

---

## 5. Local Setup & Installation

### Prerequisites
- Node.js 18+ installed
- npm, yarn, or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/mohanprasath21/billsense.git
cd billsense
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in the required API keys in `.env.local`:

| Variable | Description | Required / Optional |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Required for Storage |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public Anon Key | Required for Storage |
| `GEMINI_API_KEY` | Google Gemini API Key | Required for AI OCR & Chatbot |
| `RESEND_API_KEY` | Resend Email API Key | Optional (Feedback emails) |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service Account Email | Optional (Google Sheets sync) |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Service Account Private Key | Optional (Google Sheets sync) |

> **Note**: If using Google Sheets sync, share Google Sheet ID `1WzOJrhMehkjMkzD5NUFOpvG2UNWGxCxS8jEIU6XuDt8` with your service account email as **Editor**.

### 3. Install Dependencies & Run
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Roadmap & Future Stages

### Phase 1: Near-Term
- Expand curated test dataset beyond ~20 entries to cover the top 100 diagnostic procedures.
- Integrate official published CGHS rate lists across Tier 1, Tier 2, and Tier 3 cities.
- Fine-tune OCR preprocessing for low-light printed hospital receipts.

### Phase 2: Mid-Term
- Roll out additional Indian regional languages (Hindi, Telugu, Bengali, Marathi).
- Implement crowdsourced patient price reporting flow.
- Add patient bill history caching (local device storage).

### Deferred (Explicitly Not Next)
- **Handwritten Prescription OCR**: Confirmed hard research problem. Printed medical bills remain the primary focus.

### Long-Term / Optional Track
- **NHCX Price Transparency Layer**: Insurer / TPA price-transparency data layer riding on India's National Health Claims Exchange (NHCX) infrastructure.

---

## 7. Non-Negotiables & Principles

1. **Informational Only**: BillSense is strictly an informational clarity tool. It does NOT provide medical advice, diagnosis, or treatment recommendations.
2. **Liability Guardrail**: Never claim a test ordered by a doctor is "unnecessary".
3. **Accuracy Review**: All medical explanations and translation dictionaries undergo human medical review before production deployment.
4. **Native Speaker Quality**: No language toggle ships without verification by native speakers.

---

## 8. Team & Contact

- **Mohan Prasath**: Founder & Developer | [LinkedIn Profile](https://www.linkedin.com/in/mohanprasath21/)
- **Thejashree J P**: Team Member
- **Agency / Studio**: [TaskDrift](https://taskdrift.in)
- **Email**: info.taskdrift@gmail.com

---

## 9. License

This project is licensed under the **MIT License**.
