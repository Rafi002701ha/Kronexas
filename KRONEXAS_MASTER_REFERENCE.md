# 🗂️ KRONEXAS — Complete Project Reference
> **Team:** Lazy Stars | **Competition:** The Infinity AI BuildFest 2026
> **Built with:** Claude (Anthropic) across 6+ sessions
> **Last updated:** May 2026

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Final Tech Stack](#2-final-tech-stack)
3. [Repository Structure](#3-repository-structure)
4. [Live URLs & Services](#4-live-urls--services)
5. [Environment Variables & Keys](#5-environment-variables--keys)
6. [User Flow](#6-user-flow)
7. [AI Tutor System](#7-ai-tutor-system)
8. [Database Schema (Supabase)](#8-database-schema-supabase)
9. [Cloudflare Setup](#9-cloudflare-setup)
10. [Frontend Architecture](#10-frontend-architecture)
11. [Subject & Curriculum Structure](#11-subject--curriculum-structure)
12. [Quiz System](#12-quiz-system)
13. [Platform Migration History](#13-platform-migration-history)
14. [All Errors & Fixes](#14-all-errors--fixes)
15. [Build Journey (Parts 1–6)](#15-build-journey-parts-16)
16. [Team](#16-team)
17. [Submission Details](#17-submission-details)
18. [Future Roadmap](#18-future-roadmap)

---

## 1. Project Overview

**Kronexas** is Bangladesh's first AI-powered learning platform built specifically for SSC and HSC students.

| Field | Value |
|---|---|
| **Product Name** | Kronexas |
| **Tagline** | Empowering Minds, Shaping Futures |
| **Target Users** | SSC & HSC students in Bangladesh |
| **Languages** | Bangla + English (bilingual) |
| **Streams** | Science, Arts, Commerce |
| **Levels** | SSC, HSC |
| **AI Model** | Llama 3.3-70B Versatile (via Groq) |
| **Hosting** | Cloudflare Pages |
| **Database** | Supabase (PostgreSQL) |
| **Cost to run** | $0 (all free tiers) |

### Problem Solved
- 3M+ students sit SSC/HSC every year with zero personalised AI support
- Quality coaching costs 3,000–10,000 BDT/month — unaffordable for most
- Global EdTech platforms are English-only, ignoring Bangla-medium students
- Generic study materials don't adapt to stream or level

### Solution
4-stage personalisation: **Phone/Email → Language → Level → Stream**
Everything adapts: subjects, AI tutor context, quiz content, resources.

---

## 2. Final Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JS | Single `index.html` file |
| **AI Model** | Llama 3.3-70B Versatile | Open-weight Meta model |
| **AI Provider** | Groq API | Free tier, 100k req/day |
| **Backend** | Cloudflare Pages Functions | `functions/chat.js` |
| **Database** | Supabase (PostgreSQL) | Free tier, 500MB |
| **Hosting** | Cloudflare Pages | Auto-deploy from GitHub |
| **Fonts** | Google Fonts | Syne, Poppins, Inter |
| **Dev Tools** | Claude Artifacts, Gemini Canvas | UI generation & iteration |

### Previous Providers (Abandoned)
| Provider | Reason Abandoned |
|---|---|
| Anthropic Claude API | No free tier — requires $5 minimum top-up |
| Google Gemini API | Quota exhausted / not available in Bangladesh |
| Vercel | `.vercel.app` blocked by Bangladeshi ISPs |
| Netlify | Free function execution limit hit |
| Cloudflare Workers | Wrong project type — doesn't support Pages Functions |

---

## 3. Repository Structure

```
Kronexas/                          ← GitHub repo: Rafi002701ha/Kronexas
├── index.html                     ← Entire frontend (single file, ~3.5MB)
├── docs.html                      ← /docs page (live documentation)
├── functions/
│   └── chat.js                    ← Cloudflare Pages serverless function
└── team/                          ← Team member photos (add manually)
    ├── rafi.jpg
    ├── safa.jpg
    ├── abhijeet.jpg
    ├── tasnima.jpg
    ├── eusha.jpg
    └── natik.jpg
```

**Important:** Do NOT add `wrangler.json` or `wrangler.jsonc` to the repo root — it will break Cloudflare Pages Functions routing.

---

## 4. Live URLs & Services

| Service | URL / Details |
|---|---|
| **Production site** | https://kronexas.pages.dev |
| **Docs page** | https://kronexas.pages.dev/docs |
| **GitHub repo** | https://github.com/Rafi002701ha/Kronexas |
| **Supabase project** | https://supabase.com/dashboard/project/lvfghdezyopklgossuam |
| **Cloudflare dashboard** | https://dash.cloudflare.com → Workers & Pages → kronexas |
| **Groq console** | https://console.groq.com |

---

## 5. Environment Variables & Keys

### Cloudflare Pages Environment Variables
| Key | Where to set | Notes |
|---|---|---|
| `GROQ_API_KEY` | Cloudflare → kronexas project → Settings → Environment Variables | Secret, never in code |

### Supabase (Frontend — Public Keys)
| Key | Value |
|---|---|
| **Project URL** | `https://lvfghdezyopklgossuam.supabase.co` |
| **Anon Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2ZmdoZGV6eW9wa2xnb3NzdWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NTk3NjMsImV4cCI6MjA5NTQzNTc2M30.bZIx4BsIoLmMXEzWSw0piEX1aKqFRWK5DcfwMn3O4S4` |

> ⚠️ The anon key is safe to use in frontend code — it's a public key. The Groq API key must NEVER be in frontend code.

### Docs Admin Panel
| Field | Value |
|---|---|
| **Password** | `KronexasDocs@2026` |
| **Default availability** | June 10, 2026 00:00 → June 14, 2026 23:59 |

---

## 6. User Flow

```
authScreen
  → Enter phone number + email
  → Saved to Supabase users table
  ↓
langScreen
  → Choose: Bangla Medium / English Version
  ↓
levelScreen
  → Choose: SSC / HSC
  ↓
streamScreen
  → Choose: Science / Arts / Commerce
  ↓
mainScreen (everything personalised)
  ├── Hero section
  ├── Subject cards (level+stream aware)
  ├── AI Tutor (Groq API)
  ├── MCQ Quiz (no answer reveal until submit)
  ├── Dashboard (XP, streaks, progress)
  ├── Study Tracker (weekly hours)
  ├── Leaderboard
  ├── Notes & Resources
  ├── Achievements & Badges
  └── Footer
```

### Key JS State Object
```javascript
const S = {
  phone: '',        // from auth
  email: '',        // from auth
  lang: '',         // 'bangla' or 'english'
  level: '',        // 'ssc' or 'hsc'
  stream: '',       // 'science' / 'arts' / 'commerce'
  chatHistory: [],  // last 8 messages for AI context
  xp: 0,
  streak: 0,
}
```

---

## 7. AI Tutor System

### How It Works
```
Student types question
    ↓
index.html fetch('/chat', { POST })
    ↓
functions/chat.js (Cloudflare Pages Function)
    ↓
Groq API — Llama 3.3-70B Versatile
    ↓
Response extracted from data.choices[0].message.content
    ↓
fmtAI() — markdown → HTML conversion
    ↓
Rendered in chat UI
```

### Key Lines in index.html
```javascript
// Line 1651 — fetch URL (MUST be /chat not /functions/chat)
const res = await fetch('/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama-3.3-70b-versatile',   // line 1654
    max_tokens: 1000,
    system: `...personalised system prompt...`,
    messages: S.chatHistory.slice(-8)
  })
});

// Line 1660 — multi-format reply parsing
const reply = data.content?.map(c => c.text || '').join('')
  || data.choices?.[0]?.message?.content
  || data.error
  || 'I could not process your request. Please try again.';
```

### Working functions/chat.js
```javascript
export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const messages = body.messages || [];
    const systemPrompt = body.system || '';
    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({ role: msg.role, content: msg.content }))
    ];
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${context.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });
    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || JSON.stringify(data);
    return new Response(
      JSON.stringify({ content: [{ type: 'text', text }] }),
      { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }}
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ content: [{ type: 'text', text: 'Error: ' + error.message }] }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }}
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
```

### AI Tutor Parameters
| Setting | Value | Reason |
|---|---|---|
| Model | `llama-3.3-70b-versatile` | Replaced decommissioned `llama3-70b-8192` |
| Max tokens | 1000 | Stay within free tier |
| Temperature | 0.7 | Consistent educational responses |
| Context window | Last 8 messages | Prevent unbounded growth |
| System prompt | Dynamic | Injects level + stream + language |

### 4-Step Response Format
Every AI answer follows: **Explanation → Formula → Worked Example → Exam Tip**

---

## 8. Database Schema (Supabase)

### Tables

#### `users`
```sql
CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  phone text,
  email text,
  created_at timestamptz DEFAULT now()
);
-- RLS: DISABLED (allows public insert)
```

#### `contents`
```sql
CREATE TABLE contents (
  id serial PRIMARY KEY,
  subject text,
  topic text,
  level text,        -- 'ssc' or 'hsc'
  stream text,       -- 'science' / 'arts' / 'commerce'
  content_type text, -- 'formula' or 'note'
  body text,
  language text      -- 'english' or 'bangla'
);
```

#### `chat_sessions` (in progress)
```sql
-- Planned: store AI tutor conversations per user
```

#### `quiz_scores` (in progress)
```sql
-- Planned: store quiz results per user per subject
```

#### `leaderboard`
```sql
-- Leaderboard data
```

### Sample Content Data
```sql
INSERT INTO contents (subject, topic, level, stream, content_type, body, language) VALUES
('Physics', 'Newton''s Laws of Motion', 'ssc', 'science', 'formula',
 'First Law: An object stays at rest or in motion unless acted upon by a force.
  Second Law: F = ma.
  Third Law: Every action has an equal and opposite reaction.', 'english'),
-- 18+ entries covering Physics, Chemistry, Math, Biology, Bangla, English,
-- Accounting, Economics across SSC/HSC, Science/Arts/Commerce
```

---

## 9. Cloudflare Setup

### How to Deploy (From Scratch)
1. Go to **Cloudflare Dashboard → Workers & Pages → Create application**
2. Click **"Get started"** under **Pages** (NOT Workers)
3. Connect to GitHub → select `Rafi002701ha/Kronexas`
4. Leave ALL build settings blank (no build command, no output directory)
5. Add environment variable: `GROQ_API_KEY` = your key
6. Deploy

### Critical Rules
- ❌ Do NOT add `wrangler.json` or `wrangler.jsonc` to repo root
- ❌ Do NOT create the project as a Worker (must be Pages)
- ✅ Functions file must be at `functions/chat.js` (exactly this path)
- ✅ Fetch URL in `index.html` must be `/chat` (not `/functions/chat`)
- ✅ Always test on `https://kronexas.pages.dev` (not preview URLs)

### Cloudflare Function Routing (Confirmed Working)
```json
{
  "routes": [
    { "routePath": "/chat", "method": "OPTIONS", "module": ["chat.js:onRequestOptions"] },
    { "routePath": "/chat", "method": "POST",    "module": ["chat.js:onRequestPost"] }
  ]
}
```

### Free Tier Limits
| Resource | Limit |
|---|---|
| Pages Functions requests | 100,000 / day |
| Build minutes | 500 / month |
| Bandwidth | Unlimited |

---

## 10. Frontend Architecture

### Design Tokens
```css
:root {
  --bg: #0a0f1e;                    /* Main background */
  --bg2: #0d1628;                   /* Secondary bg */
  --glass: rgba(255,255,255,.04);   /* Glassmorphism */
  --c1: #00C9FF;                    /* Primary cyan */
  --c2: #7D5CFF;                    /* Secondary purple */
  --c3: #00E6B8;                    /* Tertiary teal */
  --c4: #38BDF8;                    /* Sky blue */
  --c5: #A5B4FC;                    /* Light purple */
}
```

### Key Patterns
```css
/* Glassmorphism Card */
.card {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Gradient Text */
.grad-text {
  background: linear-gradient(135deg, #00C9FF, #7D5CFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Particle System
```javascript
const colors = ['#00C9FF', '#7D5CFF', '#00E6B8', '#38BDF8', '#A5B4FC'];
// 110 particles, connecting lines for particles < 80px apart
// Canvas refreshes every frame via requestAnimationFrame
```

### iOS Safari Fixes
```css
input { font-size: 16px; }              /* Prevents zoom on focus */
height: -webkit-fill-available;         /* Full height fix */
-webkit-backdrop-filter: blur(20px);    /* Glassmorphism fix */
touch-action: manipulation;             /* Removes 300ms tap delay */
```

### Supabase Integration
```javascript
// Initialised at top of script block
const SUPABASE_URL = 'https://lvfghdezyopklgossuam.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGc...';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// doAuth() — saves user on login
async function doAuth() {
  const ph = document.getElementById('ph').value.trim();
  const em = document.getElementById('em').value.trim();
  if (!ph) { alert('Please enter your phone number.'); return }
  if (!em || !em.includes('@')) { alert('Please enter a valid email.'); return }
  S.phone = ph; S.email = em;
  try { await db.from('users').insert({ phone: ph, email: em }) }
  catch(e) { console.log('User save error:', e) }
  showScreen('langScreen');
}
```

---

## 11. Subject & Curriculum Structure

```javascript
const SUBJECTS = {
  science: {
    // Same for both SSC and HSC
    subjects: ['Bangla', 'English', 'Mathematics*', 'Physics', 'Chemistry', 'Biology']
    // * Math opens sub-modal: General Math OR Higher Math
  },
  arts: {
    ssc: ['Bangla', 'English', 'General Mathematics', 'Economics', 'Sociology', 'History', 'Psychology'],
    hsc: ['Bangla', 'English', 'Economics', 'Sociology', 'History', 'Psychology']
    // NO Mathematics for HSC Arts
  },
  commerce: {
    ssc: ['Bangla', 'English', 'General Mathematics', 'Finance', 'Accounting', 'Statistics', 'Marketing'],
    hsc: ['Bangla', 'English', 'Finance', 'Accounting', 'Statistics', 'Marketing']
    // NO Mathematics for HSC Commerce
  }
}
```

### Subject Color Themes
| Subject | Colors |
|---|---|
| Bangla | Red & Green |
| English | Royal Blue & White |
| Mathematics | Purple futuristic |
| Physics | Dark Blue + particles |
| Chemistry | Cyan + lab-inspired |
| Biology | Green nature |

---

## 12. Quiz System

### Critical Rule
> ⚠️ **Correct answers must NEVER be shown before full submission.**
> Options show `sel` class on click only. `rev-ok`/`rev-bad` classes added ONLY after `finalizeQuiz()`.

### Quiz State Machine
```
UNANSWERED
    ↓ (click option)
ANSWERED — sel class only, no correct/wrong reveal
    ↓ (click next)
NEXT QUESTION
    ↓ (all questions answered)
SUBMIT available
    ↓ (finalizeQuiz())
SUBMITTED → reveal correct/wrong for ALL questions
    → Show score, breakdown, results
```

### Weak Area Detection
```javascript
// If subject score < threshold → flag as weak area
// Displayed on dashboard with visual alert
// Rule-based heuristic — no ML required
```

---

## 13. Platform Migration History

```
Vercel
  ✗ .vercel.app domain blocked by Bangladeshi ISPs (Grameenphone, Robi, BTCL)

Netlify
  ✗ Free function execution limit hit after heavy testing

Cloudflare Workers (first attempt)
  ✗ Wrong project type — Workers don't support functions/chat.js routing
  ✗ Fix: delete project, create NEW Pages project specifically

Cloudflare Pages ✅ (CURRENT)
  ✓ 100k function requests/day free
  ✓ Not blocked in Bangladesh
  ✓ Auto-deploy from GitHub
  ✓ No build step needed
```

### AI Provider History
```
Anthropic Claude API
  ✗ No free tier — requires minimum $5 credit top-up

Google Gemini 2.0 Flash
  ✗ Quota exhausted / unavailable in Bangladesh region

Groq — Llama 3.3-70B Versatile ✅ (CURRENT)
  ✓ Completely free (100k req/day)
  ✓ Fast LPU inference
  ✓ OpenAI-compatible API format
  ✓ No Bangladesh restrictions
```

---

## 14. All Errors & Fixes

| # | Error | Cause | Fix |
|---|---|---|---|
| 1 | Wrong Cloudflare project type | Created Workers instead of Pages | Delete project, create new Pages project |
| 2 | `wrangler.json` conflict | Old wrangler config left in repo | Delete `wrangler.json` / `wrangler.jsonc` from GitHub |
| 3 | `405 Method Not Allowed` | Wrong fetch URL + wrangler conflict | Fix URL to `/chat`, delete wrangler config |
| 4 | Wrong fetch URL | `index.html` fetching `/functions/chat` | Change to `/chat` (Cloudflare strips prefix) |
| 5 | Decommissioned model | `llama3-70b-8192` shut down by Groq | Switch to `llama-3.3-70b-versatile` |
| 6 | Syntax error in chat.js | Extra `}` at line 60 | Remove extra closing brace |
| 7 | API key exposed in screenshot | Cloudflare screenshot showed key | Regenerate key at console.groq.com |
| 8 | Testing wrong URL | Testing preview URL instead of production | Always test `kronexas.pages.dev` |
| 9 | Model name in one file only | Updated `chat.js` but not `index.html` | Update model in BOTH files |
| 10 | Missing CORS headers | No `Access-Control-Allow-Origin` | Add CORS headers + `onRequestOptions` handler |
| 11 | Silent response failure | Fallback message hid Groq errors | Change fallback to `JSON.stringify(data)` |
| 12 | Gemini quota exceeded | Free tier exhausted / Bangladesh region | Switched to Groq |
| 13 | Vercel ISP block | `.vercel.app` blocked in Bangladesh | Migrated to Netlify then Cloudflare |

---

## 15. Build Journey (Parts 1–6)

### Part 1 — Initial Build
- Started as "EduVerse" — renamed to **Kronexas**
- Built: auth screen, language/level/stream selection, subject cards
- UI: glassmorphism, particle canvas, dark/light mode
- Quiz system with deferred answer reveal
- AI Analysis panel, Study Tracker, Leaderboard, Achievements

### Part 2 — Deployment
- Deployed to Vercel — blocked by Bangladeshi ISPs
- Migrated to Netlify — works in Bangladesh
- Created `api/chat.js` proxy for Anthropic API
- Changed fetch URL from direct Anthropic to `/api/chat`
- Anthropic requires $5 minimum — switched to Gemini

### Part 3 — Gemini Integration
- Switched to Google Gemini 2.0 Flash (free tier)
- Built `netlify/functions/chat.js` in Gemini format
- Gemini quota exhausted — planned switch to Groq

### Part 4 — Groq Migration + Feature Refinement
- Switched to Groq Llama 3 (free, fast)
- Netlify function limit hit — triggered Cloudflare migration

### Part 5 — Supabase Integration
- Added Supabase SDK to `index.html`
- Created `users`, `contents`, `chat_sessions`, `quiz_scores` tables
- `doAuth()` now saves phone + email to Supabase on login
- Seeded `contents` table with 18+ SSC/HSC curriculum entries
- RLS disabled on `users` table for public insert

### Part 6 — Cloudflare + Final Fixes
- Deleted Netlify, created Cloudflare Pages project
- Fixed 405 error (wrangler.json conflict)
- Fixed fetch URL `/functions/chat` → `/chat`
- Fixed decommissioned model → `llama-3.3-70b-versatile`
- Fixed syntax error (extra `}` in chat.js)
- Added CORS headers + OPTIONS handler
- Fixed reply parsing to handle multiple response formats
- ✅ **Platform live and working at kronexas.pages.dev**

### BuildFest Submission Phase
- Created 8-slide pitch deck (PPTX)
- Created 3-minute speech script
- Built full `/docs` page with 15 sections + admin panel
- Filled all submission form fields
- Uploaded to competition portal

---

## 16. Team

**Team Name:** Lazy Stars
**Competition:** The Infinity AI BuildFest 2026
**Motto:** *"Efficiency is just calculated laziness."*

| Name | Role | Type |
|---|---|---|
| **Rafiul Islam Rafi** | Team Leader · Full Stack · Backend · UI/UX | In-person |
| **Safa Samad** | UI/UX · Frontend Developer | In-person |
| **Abhijeet S** | UI/UX · Frontend Developer | In-person |
| **Tasnima Mahi** | Business Analyst · Data Scientist | In-person |
| **Kazi Eamin Azad Eusha** | Business Analyst · Data Scientist | In-person |
| **Natik As Sami** | UI/UX · Frontend Developer | Virtual |

---

## 17. Submission Details

### Competition
- **Name:** The Infinity AI BuildFest 2026
- **Submission portal:** cloudcampbd.com
- **Team:** Lazy Stars (Lead: Rafiul Islam Rafi)

### Key Submission Fields Filled
| Section | Status |
|---|---|
| Project name, pitch, summary | ✅ |
| Problem & solution statement | ✅ |
| Data lifecycle | ✅ |
| AI models (Groq Llama 3.3-70B) | ✅ |
| Prompt library (3 prompts added) | ✅ |
| Token optimisation | ✅ |
| Retrieval & RAG (planned) | ✅ |
| Frontend AI builders (Claude Artifacts, Gemini Canvas) | ✅ |
| Tech stack, IDE, deployment method | ✅ |
| Data & AI provenance | ✅ |
| Responsible AI | ✅ |
| Open source tools | ✅ |
| YouTube demo video | 🔲 Record using presentation + screen recording |
| Live site URL | ✅ kronexas.pages.dev |
| GitHub URL | ✅ github.com/Rafi002701ha/Kronexas |
| /docs page | ✅ kronexas.pages.dev/docs |

### Presentation Files
| File | Location |
|---|---|
| `Kronexas_Pitch_Deck.pptx` | 8-slide deck matching BuildFest 180-second format |
| `Kronexas_Speech_Script.md` | 3-minute narration script slide by slide |
| `docs.html` | Live /docs documentation page |

---

## 18. Future Roadmap

### Phase 2 — Database Completion (Next)
- [ ] Chat session persistence in Supabase
- [ ] Quiz score history and analytics
- [ ] User progress tracking across sessions
- [ ] Leaderboard with real stored scores

### Phase 3 — RAG Pipeline
- [ ] pgvector embeddings on Supabase `contents` table
- [ ] Semantic retrieval injected into Groq system prompt
- [ ] Curriculum-grounded answers with source citations

### Phase 4 — Scale
- [ ] Mobile PWA with offline mode
- [ ] Teacher portal — PDF upload + parsing into Supabase
- [ ] School partnership white-label version
- [ ] Premium tier features

### Phase 5 — AI Improvement
- [ ] Fine-tune Llama on Bangladesh SSC/HSC curriculum data
- [ ] Multi-turn memory with user-specific learning profiles
- [ ] Adaptive difficulty based on quiz performance history

---

## 📝 Quick Reference — Things to Remember

### If AI Tutor Stops Working
1. Check Groq dashboard — has quota been hit?
2. Check Cloudflare Pages → Functions → chat.js is deployed
3. Check `GROQ_API_KEY` env variable is set in Cloudflare
4. Check model name — if Groq decommissions it, update to new model in BOTH `chat.js` AND `index.html`
5. Always test at `kronexas.pages.dev` not preview URLs

### If Deployment Breaks
1. Check build log in Cloudflare for errors
2. Make sure no `wrangler.json` in repo root
3. Check `functions/chat.js` exists at exactly that path
4. Fetch URL in `index.html` must be `/chat` not `/functions/chat`

### If Supabase Insert Fails
1. Go to Supabase → Authentication → Policies → `users` table
2. Make sure RLS is disabled OR an anon insert policy exists
3. Run: `ALTER TABLE users DISABLE ROW LEVEL SECURITY;`

### To Regenerate Groq API Key
1. Go to console.groq.com → API Keys
2. Create new key
3. Update in Cloudflare Pages → Settings → Environment Variables
4. Trigger redeploy

---

*Generated by Claude (Anthropic) — Kronexas Complete Project Reference*
*Team: Lazy Stars | BuildFest 2026 | May 2026*
