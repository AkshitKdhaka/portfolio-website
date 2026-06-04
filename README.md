# 🌌 3D Portfolio Narrative of Akshit Kumar Dhaka

An immersive, production-grade, full-stack 3D vertical scrolling portfolio narrative showcasing **Akshit Kumar Dhaka's** technical achievements, engineering experience, and system designs. Built with **Next.js 15+ (App Router)**, **React 19**, **Framer Motion**, **Three.js / React Three Fiber**, **Tailwind CSS v4**, and leveraging **Google Gemini AI 3.5** as a server-side recruiter companion.

---

## 🚀 Live Environment & Deployments

- **Development URL:** [ais-dev-dglmfj3l5orihlk7sj667t-221515204811.asia-southeast1.run.app](https://ais-dev-dglmfj3l5orihlk7sj667t-221515204811.asia-southeast1.run.app)
- **Shared Production URL:** [ais-pre-dglmfj3l5orihlk7sj667t-221515204811.asia-southeast1.run.app](https://ais-pre-dglmfj3l5orihlk7sj667t-221515204811.asia-southeast1.run.app)
- **Primary Contact E-mail:** [akshitkumardhaka99@gmail.com](mailto:akshitkumardhaka99@gmail.com)

---

## 🛠️ Global Technical Stack

```
   [ CLIENT LAYER ]
   ├─► React 19 & Next.js 15 App Router
   ├─► Framer Motion (micro-animations, entrance cues, parallax)
   ├─► Three.js / @react-three/fiber (interactive 3D graphics)
   └─► Tailwind CSS v4 (fluid layouts, responsive grids)
   
   [ SERVER LAYER ]
   ├─► Next.js App Router API Routes (Route Handlers)
   ├─► Google Gen AI SDK (@google/genai 3.5 models)
   ├─► GitHub REST API integrations
   └─► jsPDF engine (dynamic on-the-fly resume rendering)
```

| Technology | Category | Purpose |
| :--- | :--- | :--- |
| **Next.js 15** | Framework | Server-Side Rendering (SSR), App Router API routing, optimized bundles. |
| **Three.js / R3F** | Graphics | Custom 3D interactive wave grid simulation matching mouse momentum. |
| **Framer Motion** | Animation | Advanced viewport entrance triggers, slide-ins, and step-based timeline. |
| **Tailwind v4** | Styling | Modern CSS styling with instant fluid utility classes. |
| **Gemini 3.5 Flash** | Artificial Intelligence | Server-side API powering Chat, Resume Tailoring, and Architecture audits. |
| **GitHub REST API** | Integrations | Real-time user statistics syncing (repositories, stars, followers). |
| **jsPDF** | Utility | Instant offline CV generation from native JSON metadata structures. |

---

## 📁 Repository Directory Structure

The codebase is organized with high-cohesion, modular patterns:

```
├── .env.example              # Environment variables template for Gemini API & GitHub Token
├── metadata.json             # AI Studio App name, permissions, and major capabilities
├── package.json              # Direct and dev dependencies, compiler & runner commands
├── tsconfig.json             # TypeScript static typing presets
├── postcss.config.mjs        # PostCSS configuration using Tailwind CSS v4
├── src/
│   ├── App.tsx               # Main application container, scroll event bus, and theme states
│   ├── index.css             # Main stylesheet containing light & dark theme CSS overloads
│   ├── types.ts              # Absolute typescript structure declarations for resume, data elements
│   ├── data.ts               # Core CV data source: experiences, project metrics, education, profile
│   ├── app/
│   │   ├── layout.tsx        # HTML wrapper layout configuring font faces and global schemas
│   │   ├── page.tsx          # Dynamic entry page pulling client elements with Next SSR safety
│   │   └── api/
│   │       ├── gemini/       # POST Route: Proxies chatbot, tailor, and architecture calls safely
│   │       └── github/       # GET Route: Hydrates real-time developer statistics
│   ├── components/
│   │   ├── WaterBackground.tsx   # Custom 3D-like, theme-adapted, mouse-tracking cyber grid canvas
│   │   ├── HeroSect.tsx          # Section 0: Fullscreen entrance portal & quick links console
│   │   ├── JourneySect.tsx       # Section 1: Interactive step-based professional achievements
│   │   ├── WorkshopSect.tsx      # Section 2: Core case studies with metric dials & tech stacks
│   │   ├── FoundationSect.tsx    # Section 3: Technical skills bento, live git statistics, credentials
│   │   ├── AiCopilotSect.tsx     # Section 4: Interactive Gemini chatbot tab console suite
│   │   ├── SourceOverlay.tsx     # Hidden developer overlay showing structural payload details
│   │   └── InteractiveFooter.tsx # Responsive footer displaying credits & quick contacts
│   └── lib/
│       └── pdfGenerator.ts   # jsPDF engine script executing absolute pixel layout canvas draw
```

---

## 🎯 Groundbreaking Features in Detail

### 1. 🏞️ Theme-Adaptive 3D Cinematic Cyber-Ocean Canvas
Designed in `src/components/WaterBackground.tsx`, a raw `<canvas>` context simulates an interactive 3D perspective holographic cyber mesh. 
- **Interactive Fluid Forces:** Tracks user mouse coordinates with dynamic friction updates. Moving your mouse creates concentric ripple waves on the grid lines.
- **Scroll Parallax Resonance:** As the user scrolls through the portfolio, the canvas's radial ocean-floor gradient smoothly interpolates between different colors matching the vibe of each active division (e.g., journey transition, database workshop, AI workspace).
- **Theme Coupling:** Automatically adjusts its color schemes when the theme is toggled. In light mode, grid lines soften into a premium sky-blue hue (`rgba(2, 132, 199, 0.08)`), and the dark backdrop transitions to an elegant off-white canvas.

### 2. 🌓 Dual High-Contrast Theme System
Fully integrated in `src/index.css` and managed via a synchronized parent state in `src/App.tsx`. 
- **Light Theme Override:** Pure white background card blocks (`#ffffff`) bounded by clean, high-contrast borders (`#cbd5e1`), utilizing high-visibility text coloring (`#0f172a` for display headers, `#334155` for descriptions).
- **Cyber Dark Theme:** Rich deep-space black backing (`#030406`) accented with fluorescent cyan highlights (`#00d1ff`).
- **Persistence:** Integrates instant local storage matching client state so reload actions retain user preferences natively.

### 3. 🤖 Section 4: AI Recruiter Companion (Gemini 3.5 API)
All Gemini queries are proxied via **server-side routes** under `/src/app/api/gemini/route.ts` to keep API keys absolute secrets. The visual dashboard is divided into three functional sub-tabs:
- **💬 Recruiter Chat:** Recruiters can ask direct inquiries about technical frameworks, engineering background, or credentials. Includes pre-seeded quick-answer prompt chips.
- **🎯 Resume Tailor:** Allows users to paste any raw job requirement statement. The server-side LLM parses the description and isolates matching experience bullet-points from Akshit's dataset, offering strategic interview advice.
- **☁️ Cloud Architect Deep-Dive:** Interactive architectural validation panel simulating hypothetical workloads (e.g., scaling to 10M page views with Redis caching, writing multi-region failover configurations, or conducting secure SSL/TLS audits).

### 4. 📊 Live GitHub API Telemetry Hub & Dynamic Heatmap Visualizer
Integrated onto the **Foundation** layout bento array, fetching real-time reputation parameters of Akshit Kumar Dhaka straight from the GitHub Public API and scraping active year contribution metrics:
- **API Cache Strategy:** Configured with server-side proxy routes using `cache: 'no-store'` and cache-busting search parameters to bypass stale CDN caches on hot refreshes.
- **Dynamic Multi-Year Heatmap:** A detailed, responsive contribution calendar representing active years 2022 to 2026. Custom controls allow frictionless switching between years.
- **Month Indicators & Layout Reflows:** Maps absolute calendar days into standard GitHub-style column grids, featuring precise monthly marker alignment (Jan-Dec) with localized formatting.
- **Staggered & Scale Hover-Tactile Response:** Leverages Framer Motion staggered grid cascades when entering the viewport, plus elegant `whileHover={{ scale: 1.2, zIndex: 10 }}` configurations on individual day tiles to offer interactive visual depth.
- **Cyberpunk Glowing Loading Veil:** When switching years, a beautiful backdrop-blurred loading overlay with neon cyan accents, animated spinner rings, and pulsing active terminal logs is deployed dynamically over the grid space to ensure zero blinking or blank states.
- **Micro-Animations & Key Synchronization:** Leveraging Framer Motion staggered transition variants. Explicitly bound to the active custom key `key={selectedYear}` to reset and play immersive entrance reveal sweeps upon every year filter update.
- **Graceful Telemetry Fallbacks:** In case of API rate throttles or network issues, a deterministic fallback scraper algorithm generates realistic and perfectly structured activity blocks to keep the layout complete and operational.

### 5. 📄 Offline PDF Resume Generation Engine (`src/lib/pdfGenerator.ts`)
Using the client-side `jspdf` package, clicking the **Download CV** trigger instantly generates a professionally structured, single-page, multi-column executive resume.
- **Design Layout:** Employs precise programmatic pixel placements establishing crisp grid sections, custom color labels, margin constraints, and text size standards.
- **Performance:** Executes entirely in-memory without necessitating server-side file buffers or secondary file storage layers.

### 6. 🧭 Floating Tactical Navigation Dock Bar
Complementing the standard vertical sidebar indicator, a sleek horizontal "Jump to Section" nav dock floats persistently at the bottom center of the screen once scrolling past the initial water landing portal.
- **Visual Feedback:** Shows active glowing status on current sections.
- **Layout Constraint Preservation:** Uses Framer Motion's shared layout layoutId capsule to smoothly glide selection indicators between buttons without jumpy page lags.

### 7. 💧 Continuous Splash Loop Physics (Water Portal)
The landing page background features a premium theme-adaptive physical pixel droplet drop machine:
- **Loop continuous drops:** Always outputs and drops water elements consecutively, restarting cleanly over a programmed frame cooldown.
- **Performance decoupled optimizations:** Uses background thread references to halt canvas calculations as soon as the viewport scrolls away, guaranteeing zero lag or excess CPU usage when looking at project works or text sections.

### 8. 📋 Clip Copy Email Assist
Located next to the email coordinate inside the contact sector, a localized button copies the address to system memory with a click. Instantly replaces labels with a checks icon and updates labels to "Copied!" for responsive recruiter feedback, fading back cleanly after 2 seconds.

---

## 🏛️ Comprehensive Architecture Documentation

For a detailed breakdown of all code internals, files, and engineering methods, read the specialized **[System Architecture & File Manual (DOCUMENTATION.md)](/DOCUMENTATION.md)**.


---

## 🛠️ Environmental Settings & Configuration

Add your credentials in `.env` or inject them directly via the Cloud developer settings console:

```env
# .env.example
# Your private API secret key. Never prefix with NEXT_PUBLIC_!
GEMINI_API_KEY="your-google-gemini-api-key-here"

# (Optional) GitHub Token to prevent public REST API rate limiting 
GITHUB_TOKEN="your-github-personal-access-token-here"

# Dynamic system URL injected during container startup
APP_URL="https://ais-pre-dglmfj3l5orihlk7sj667t-221515204811.asia-southeast1.run.app"
```

---

## 🚀 Execution & Developer Manual

To spin up, verify, and modify the application locally, run standard npm scripts:

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Server
Starts the full-stack Next.js dev server on port `3000`:
```bash
npm run dev
```

### 3. Trigger Code Validation (Linter)
Validate module imports, React hooks dependency arrays, and syntax formatting rules:
```bash
npm run lint
```

### 4. Direct Production Build
Build the application statically and compile serverless API route handlers under `.next/`:
```bash
npm run build
```

---

## 🏅 Developer Credentials Summary (Akshit Kumar Dhaka)

- **Role:** Full Stack Developer & Technical Architect
- **Education:** B.Tech in Computer Science Engineering (Delhi Technical Campus), **8.99 CGPA**
- **Experience:**
  - *Tedekstra Limited (Nov 2025 - Present):* Heavy SSR optimizations with Next.js & NestJS, boosting system velocities by up to 30%.
  - *Genius Labs (Jul 2024 - Jun 2025):* Automated CI/CD pipelines via GitHub Actions on AWS EC2, automated Firebase authentication, and achieved lighthouse scores exceeding 98/100.
- **Top Competencies:** React 19, TypeScript, Node.js, Next.js, Next App Router, MongoDB, AWS EC2, Nginx, PM2, GitHub Actions, Redis architectures.

---

*Formulated with absolute technical precision. Porting raw engineering excellence into immersive visual spaces.*
