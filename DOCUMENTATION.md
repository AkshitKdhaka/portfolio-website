# 🌌 Full System Architecture & Engineering Documentation

This documentation provides an exhaustive, multi-layered breakdown of **Akshit Kumar Dhaka's** 3D Interactive Portfolio Venture. The system is designed using a modern full-stack architecture powered by **Next.js 15+ (App Router)** and **React 19**, styled using **Tailwind CSS v4**, animated with state-of-the-art **Framer Motion**, rendered on a high-fidelity `<canvas>` with physical 2D/3D wave simulations, and integrated with **Google Gemini 3.5 AI** and **GitHub Developer APIs**.

---

## 🗺️ Table of Contents

1. [System High-Level Architecture](#1-system-high-level-architecture)
2. [Unified Scroll System & State Bus (`App.tsx`)](#2-unified-scroll-system--state-bus-apptsx)
3. [Component Documentation](#3-component-documentation)
    - [3.1 WaterBackground (`WaterBackground.tsx`)](#31-waterbackground-waterbackgroundtsx)
    - [3.2 HeroSect (`HeroSect.tsx`)](#32-herosect-herosecttsx)
    - [3.3 JourneySect (`JourneySect.tsx`)](#33-journeysect-journeysecttsx)
    - [3.4 WorkshopSect (`WorkshopSect.tsx`)](#34-workshopsect-workshopsecttsx)
    - [3.5 FoundationSect (`FoundationSect.tsx`)](#35-foundationsect-foundationsecttsx)
    - [3.6 AiCopilotSect (`AiCopilotSect.tsx`)](#36-aicopilotsect-aicopilottsx)
    - [3.7 SourceOverlay (`SourceOverlay.tsx`)](#37-sourceoverlay-sourceoverlaytsx)
    - [3.8 InteractiveFooter (`InteractiveFooter.tsx`)](#38-interactivefooter-interactivefooterttsx)
4. [Backend API Routes (Serverless Handles)](#4-backend-api-routes-serverless-handles)
    - [4.1 `/api/gemini` Route Handler](#41-apigemini-route-handler)
    - [4.2 `/api/github` Route Handler](#42-apigithub-route-handler)
5. [Core Offline Utilities](#5-core-offline-utilities)
    - [5.1 PDF Generation Engine (`pdfGenerator.ts`)](#51-pdf-generation-engine-pdfgeneratorts)
6. [TypeScript Data Schemas (`types.ts` & `data.ts`)](#6-typescript-data-schemas-typests--datats)

---

## 1. System High-Level Architecture

The portfolio application is engineered with a strict boundary between the server execution context and standard client interactions to maintain the highest standard of security for secret API keys.

```
       +---------------------------------------------+
       |             CLIENT WEB ENVIRONMENT          |
       |                                             |
       |   +------------------+   +---------------+  |
       |   |   Water Portal   |   |   Intro &     |  |
       |   |   Interactive    |   |  Timeline UI  |  |
       |   +--------+---------+   +-------+-------+  |
       |            |                     |          |
       |            v                     v          |
       |   +--------------------------------------+  |
       |   | Scroll Bus & High-Precision Tracking |  |
       |   +------------------+-------------------+  |
       |                      |                      |
       |                      v                      |
       |   +--------------------------------------+  |
       |   | Floating 'Jump' & Sidebar Nav Docks  |  |
       |   +------------------+-------------------+  |
       |                      |                      |
       +----------------------|----------------------+
                              |  Secure proxy calls
                              |  (Fetch JSON payload)
                              v
       +---------------------------------------------+
       |             SERVERLESS SECURE LAYER         |
       |                                             |
       |   +------------------+   +---------------+  |
       |   |  /api/github     |   |  /api/gemini  |  |
       |   |  REST Scrapers   |   |  3.5 Proxy &  |  |
       |   |  & API Handlers  |   | Persona Promps|  |
       |   +--------+---------+   +-------+-------+  |
       |            |                     |          |
       +------------|---------------------|----------+
                    v                     v
              [ GitHub API ]       [ Google GenAI ]
```

### Static vs Client Boundaries (`"use client"`)
To comply with Next.js 15 App Router architecture:
- **`src/app/layout.tsx`** remains a server component which structures the core layout metadata, handles localized font installations (like *Inter* sans-serif and *JetBrains Mono* code-accent fonts), and initializes standard server side tags.
- **`src/app/page.tsx`** imports and holds the primary client-side React App container, leveraging NextJS `dynamic` importing on heavier modules to prevent Hydration mismatches.
- **`src/App.tsx`** is decorated with `"use client"`, acting as the main state bus. This configuration is necessary because the application manages real-time mouse coordinate captures, scrolled layout positions, view state modifications, toggle operations, and custom event controllers.

---

## 2. Unified Scroll System & State Bus (`App.tsx`)

`App.tsx` serves as the central manager of the client experience. It initiates global viewport listeners and distributes events across all children.

### Core Architecture and State Handlers
* **`activeSection` (Number):** Represents the currently centered page element (0: Water Portal, 1: Introduction, 2: Journey Timeline, 3: Project Workshop, 4: System Foundation, 5: AI Co-pilot, 6: Secure Handshake/Footer).
* **`mousePos` ({ x, y }):** Normalized mouse coordinates mapped between `-1` and `1` on screen interactions. Enables premium parallax tilting across other overlay items.
* **`isSourceOpen` (Boolean):** Flag responsible for showing or concealing the developer JSON source code drawer containing CV meta schema.
* **`webGlSupported` (Boolean):** Runs a localized graphics test upon mounting. If standard high-end canvas methods fail, the background gracefully degrades to maintain CPU efficiency.

### High-Precision Scroll Position Calculator
Instead of standard low-frequency observers, the scroll system operates with standard window triggers mapped against active section coordinates:
```typescript
useEffect(() => {
  const handleScroll = () => {
    const sections = [
      { ref: portalRef, index: 0 },
      { ref: heroRef, index: 1 },
      { ref: journeyRef, index: 2 },
      { ref: workshopRef, index: 3 },
      { ref: foundationRef, index: 4 },
      { ref: aiCopilotRef, index: 5 },
      { ref: contactRef, index: 6 }
    ];

    // Absolute page bottom edge-case check (auto-triggers final section focus)
    const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 15;
    if (isAtBottom) {
      setActiveSection(6);
      return;
    }

    const viewportHeight = window.innerHeight;
    const triggerPoint = viewportHeight * 0.45; // 45% trigger line from viewport top

    for (let i = 0; i < sections.length; i++) {
      const ref = sections[i].ref;
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
          setActiveSection(sections[i].index);
          break;
        }
      }
    }
  };

  handleScroll(); // Run initial calc
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll);
  return () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleScroll);
  };
}, []);
```
This guarantees crisp, immediate updates to active navigation indicators.

### Floating Tactical Navigation Bars, Docks, and Keyboard Navigation
1. **Vertical Right Sidebar:** Displays a stacked cyberpunk coordinate array (`00` to `06`). Toggling sections on this sidebar plays customized scroll triggers.
2. **Horizontal Bottom Floating Jump Bar:** Added at the bottom of the layout, fading/sliding in dynamically when `activeSection > 0`. Each button rendering is coupled with standard `lucide-react` graphics (**Home**, **User**, **History**, **Briefcase**, **Layers**, **Sparkles**, **ShieldCheck**).
   * **Active pill layout transition:** Framer Motion’s `layoutId="bottom-nav-active-pill"` and `layout="position"` dynamically recalculates the background highlight capsule's location, sliding it smoothly behind selected icons without jerky delays or page lag.
3. **High-Fidelity Keyboard Navigation:** Fully supports quick keyboard sweeps using the **Up Arrow** and **Down Arrow** keys.
   * **Typing Interruption Escapes:** Standard checks review the active DOM focus target. If a visitor is actively feeding standard `INPUT`, `TEXTAREA`, or elements decorated with `contentEditable`, the navigation listener triggers a graceful bypass to protect core user typing fields inside the Gemini Chat, Contact form boxes, and search modules.

---

## 3. Component Documentation

### 3.1 WaterBackground (`WaterBackground.tsx`)
A cinematic graphic layer rendering an interactive vector-mesh simulation of a cyberocean floor.

#### Continuous Droplet Loop State Machine
The core droplet sequence simulates high-speed water drops falling, hitting the water surface, creating a vertical spout, shooting up a single daughter bead, and cycling continuously:
```typescript
const dropletStateRef = useRef({
  phase: 'falling', // 'falling' | 'impact' | 'rebound' | 'bead_rise' | 'bead_fall' | 'secondary_impact' | 'done'
  y: -30,
  vy: 1.5,
  spoutHeight: 0,
  beadY: 0,
  beadVy: 0,
  beadVisible: false,
  cooldown: 90
});
```
* **Gravity Acceleration:** In `'falling'` phase, downwards velocity `vy` increases by `0.42` frames until hitting the center-aligned baseline `targetY`.
* **Impact & Spout:** Spout rebounds upwards through velocity `vy = 8.5`. Once height matches maximum threshold, the spout collapses, pinching off a tiny spherical daughter bead (`'bead_rise'`).
* **Securing Cycles:** When droplet cycle completes (`'done'`), it counts down an active `cooldown` parameter. Once `cooldown` becomes zero, if the observer is still on the top screen `activeSection === 0`, it resets parameters and starts a fresh elegant drop.
* **Ref-Coupled State Optimization:** Decoupled from state renders using `useRef(activeSection)` and synchronized via a standard hook. This guarantees that when a user scrolls down, the droplet ceases immediately to conserve system canvas paint time, resuming seamlessly when the user returns to the top section.

#### Mouse Tracker Vector Field Interaction
Tracks custom mouse movements dynamically across canvas boundaries. If a user swings their cursor across target grids, localized physics cells calculate interactive push force vectors and create concentric radial ripples using dynamic wave simulation formulas.

---

### 3.2 HeroSect (`HeroSect.tsx`)
Section 1 structures the focal profile point of Akshit Kumar Dhaka.
* **Terminal Frame:** Surrounded by a modular frame adorned with pulsing lights and custom styled submenus.
* **Quick CV Action Trigger:** Seamlessly couples with client side libraries to invoke `src/lib/pdfGenerator.ts` on simple click behaviors.
* **Interactive social columns:** Generates deep hover states mapping LinkedIn, GitHub, and custom electronic email addresses.

---

### 3.3 JourneySect (`JourneySect.tsx`)
Section 2 presents an interactive chronological ledger detailing professional employment achievements.
* **Horizontal Step Controllers:** Toggling items reveals customized company divisions (**Tedekstra Limited**, **Genius Labs**, **Freelance**).
* **Staggered Badges:** Loops over relevant tech stacks (`Next.js`, `TypeScript`, `AWS`, `CI/CD`), rendering standard high-contrast tags.

---

### 3.4 WorkshopSect (`WorkshopSect.tsx`)
Section 3 maps core production case studies (e.g., *Global News Live*, *SEO Blog Platform*, *Adaptive Prep Framework*).
* **Metric Dials:** Renders custom circular key-performance-indicators (KPIs) like **99.9% Uptime** or **98/100 Lighthouse** scores.
* **Interactive Previews:** Clicking project items triggers a full-width immersive backdrop-blurred detail modal displaying granular technical workflows.

---

### 3.5 FoundationSect (`FoundationSect.tsx`)
Section 4 structures the skills database and Developer Reputation telemetry.

#### Multi-Year GitHub Contribution Heatmap (2022 to 2026)
* **Custom Scraper Integration:** Connects with the application's proxy route handling to supply authentic year contribution arrays.
* **Year Selector Controls:** Interactive buttons spanning from 2022 to 2026. Custom calendar calculations map days into standard coordinate columns.
* **Staggered Grid Animation:** The individual calendar square boxes (`bg-[#121217]/40`) animate using Framer Motion staggered variants:
  * `whileHover={{ scale: 1.2, zIndex: 10 }}`
  * `transition={{ type: "spring", stiffness: 400, damping: 17 }}`
  This delivers tactile responsive pop outcomes on cursor hovers without disrupting grid layouts.
* **Monthly Headers Alignment:** Places accurate standard abbreviation markers (**Jan-Dec**) aligned precisely above standard weekly calendar grids.
* **Luminous Cyberpunk Loading Veil:** Triggers an elegant backdrop-blurred, high-tech matrix log terminal grid when switching between years:
  ```typescript
  {refreshing && (
    <div className="absolute inset-0 bg-[#07070a]/90 backdrop-blur-sm z-40 rounded-xl flex flex-col items-center justify-center ...">
  )}
  ```

---

### 3.6 AiCopilotSect (`AiCopilotSect.tsx`)
Section 5 is a fully interactive terminal suite hosting Google Gemini 3.5 models. It is divided into three sections:
1. **Recruiter Chat (`💬 Recruiter Chat`):** Dynamic chat console populated with predefined quick inquiry buttons. Feeds historical message logs internally.
2. **Resume Tailor (`🎯 Resume Tailor`):** Recruiters enter target company details and raw text descriptions. The proxy formats a targeted prompt structure comparing Akshit’s actual JSON experience schema database and renders direct recommendations.
3. **Cloud Architect Sandbox (`☁️ Cloud Architect`):** An interactive workload audit tool comparing technical architectural layouts against extreme operational scenarios (e.g., configuring multi-region AWS configurations or standard load mitigations).

---

### 3.7 SourceOverlay (`SourceOverlay.tsx`)
An immersive, modal drawer displaying clean, pretty-printed representations of Akshit's resume payload data structure. Shows real raw attributes used uniformly across the portfolio environment, styled using standard high-contrast monospace code colors.

---

### 3.8 InteractiveFooter (`InteractiveFooter.tsx`)
Structures the secure ending frame of the journey. Coordinates custom quick links, developer bio footnotes, and an operational contact submission form.
* **Email Copy Helper Button:** Placed inside the email address banner to prevent manual mouse selection errors.
  * **Function:** Calls `navigator.clipboard.writeText(...)` to place the email address into the system clipboard.
  * **State Changes:** Switches helper text dynamically from `Copy` (+ standard icon) to `Copied!` (+ standard **Check** checkmark icon), resetting smoothly after a `2000` ms timeout.
* **AI Polish Assist Form:** The messages entered into the text body are piped to Gemini server-side. Clicking "AI Polish" reconstructs simple descriptions into elegant, professional narratives.

---

## 4. Backend API Routes (Serverless Handles)

All server-side operations are handled within specialized Next.js Edge-compatible route protocols found in `/src/app/api`.

### 4.1 `/api/gemini` Route Handler
* **Path:** `/src/app/api/gemini/route.ts`
* **Technology:** `@google/genai` (SDK) & `gemini-3.5-flash` model.
* **Safety Protocols:** Reads the private parameter `process.env.GEMINI_API_KEY` exclusively on the server side to protect it from public client exposures.
* **Execution Schema:**
  ```typescript
  import { GoogleGenAI } from "@google/genai";
  import { NextRequest, NextResponse } from "next/server";

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  ```
* **Payload Types:** Determines incoming action attributes (`chat` | `tailor` | `cloud` | `polish`) and applies customized persona prompts.
* **System Persona Injection:** Instructs the Gemini model to respond as Akshit Kumar Dhaka’s personal technical agent with an eloquent, highly technical, professional, and composed style.

---

### 4.2 `/api/github` Route Handler
* **Path:** `/src/app/api/github/route.ts`
* **Access Tokens:** Authenticates requests via `process.env.GITHUB_TOKEN` to bypass default REST API public throttling limits.
* **Functionality:** Proxies profile stats and computes synthetic Contribution Calendars for active cycles (2022-2026). If the outer network fails or triggers a throttle state, the system gracefully processes static, highly structured fallback telemetry matrices.

---

## 5. Core Offline Utilities

### 5.1 PDF Generation Engine (`pdfGenerator.ts`)
An in-memory, client-side executive CV generator utilizing standard programmatic `jspdf` canvas drawings.

* **Pixel-Perfect Placement Math:** Uses physical coordinate drawing matrices (`doc.text()`, `doc.rect()`, `doc.line()`) to compile an elegant single-page corporate CV.
* **Structure Alignment Framework:**
  * **Left Column:** Dedicated block outlining professional contacts, technical skill trees, languages, databases, cloud coordinates and online profiles.
  * **Right Column:** High-density chronology displaying current and previous engineering highlights.
* **In-Memory Delivery:** Automatically compiles pages to dynamic BLOB elements, prompting standard web browser download dialogs:
  `doc.save("Akshit_Kumar_Dhaka_Resume.pdf")`

---

## 6. TypeScript Data Schemas (`types.ts` & `data.ts`)

#### `types.ts`
Establishes rigid TypeScript interfaces for type safety across components and data arrays:
```typescript
export interface Experience {
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  highlights: string[];
  techStack: string[];
}

export interface Project {
  name: string;
  subtitle: string;
  summary: string;
  details: string[];
  imageUrl: string;
  url?: string;
  tags: string[];
  metric?: string;
  metricLabel?: string;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  location: string;
  start: string;
  end: string;
  grade: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date?: string;
}

export interface TechnicalSkills {
  languages: string[];
  frameworks_and_tools: string[];
  databases: string[];
  devops_and_cloud: string[];
  other: string[];
}
```

These strict definitions prevent runtime exceptions and ensure seamless rendering throughout the application.

---

### 5.2 Ambient Synthesizer Engine (`ambientSynth.ts`)
An offline-first, client-side synthesized instrumental module leveraging the **Web Audio API** to generate safe atmospheric sound drones.

* **Oscillator Detuning Blend:** Utilizes a dual-oscillator framework (a C2-frequency Triangle Wave and a detuned Chorus-frequency Sine Wave) to produce a rich, space-like corporate synth drone.
* **Resonant Lowpass Filter:** Constrains high-frequency audio components using a steep 220Hz cutoff filter with Q resonance of 2.0.
* **Volume LFO Modulation:** Links an independent sub-audible Low-Frequency Oscillator (LFO) cycling at 0.09Hz to modulate master amplitude, delivering a gentle, breath-like expansion and compression cycle.
* **Real-time Visualization:** Integrates with the fixed global header to render dynamic CSS-animated soundwave equalizers that respond directly to the active playing state of the synthesizer.

---

### 5.3 Scroll Velocity-Based Motion Blur Effect
Implements an organic cinematic motion blur that scales with scroll physics dynamically using **Framer Motion**:

* **Velocity Estimation hook:** Hooks directly into vertical viewport scroll speed using `useScroll` and `useVelocity(scrollY)`.
* **Smooth Spring Interpolation:** Translates raw velocity inputs (spanning [-3000, 3000]) into an appropriate pixel blur radius (0px to 6px) through `useTransform` and dampens flicker spikes using `useSpring(rawBlur, { stiffness: 75, damping: 28 })`.
* **Hardware Accelerated CSS Filter:** Maps values directly to `style={{ filter: blurFilter }}` on the main wrapper, causing content on the page to naturally "motion blur" during heavy transitions or fast scrolls and instantly snap back into razor-sharp focus upon stabilizing.

---

### 5.4 High-Precision Inertial Swipe Gesture Support
For fluid screen swiping on touch-enabled smartphone and tablet devices:

* **Dynamic Pan-End Detection:** Integrates Framer Motion's standard `onPanEnd` gesture recognizer on `<motion.main>`.
* **Displacement & Velocity Vectors:** Analyzes touch gestures by comparing vertical displacement `info.offset.y` against a 60px minimum boundary and sweep velocity `info.velocity.y` against a 400px/second trigger rate.
* **Intelligent Scroll-Hijack Protections:** Automatically releases touch controls if actions originate inside interactive components (e.g. Chat scroll lists, Project workflow modals, or raw code blocks), guaranteeing standard scroll inputs remain completely native and uninterrupted on heavy fields.

---

### 5.5 Low-Volume Section Transition Sound Triggers
To enhance immersive interaction, the platform features a physical Web Audio API audio-pulse generator:

* **Pure Sine Oscillation:** Spawns a high-fidelity oscillator with an initial pitch mapping of 640Hz (E5 note).
* **Exponential Pitch Gliding:** Glides the frequency up to 1100Hz exponentially over a rapid 0.12 second window to represent a cyberpunk systems boot update.
* **Intelligent Decoupled Cleanup:** Destroys and closes temporary audio contexts in less than 300ms to guarantee zero sound overlaps or memory leaks.
* **State Drift Ref Guard:** Leverages a custom previous-section Ref buffer to selectively play chime triggers ONLY when active sections change, bypassing initial mounts or redundant events.

---

### 5.6 Mobile Overlay Sidebar Navigation Drawer
When screen dimensions restrict standard dock layouts on mobile viewports:

* **Auto-Replacement Layouts:** CSS `hidden sm:block` hides the horizontal floating capsule menu under smaller device layouts.
* **Compact Slide-in drawer:** Deploys a vertical sidebar navigation deck translating in smoothly from `x: "100%"` to `x: 0` utilizing Framer Motion's physics-driven springs.
* **Large Touch targets:** Increases button heights and layouts to match the exact 44px ergonomics requirement for painless single-tap navigation loops.

---

### 5.7 Vertical Scroll Snap Realignment Layouts
To align active narratives perfectly with incoming section boundaries:

* **Viewport Scroll Snapping:** Applied `scroll-snap-type: y mandatory` globally on the root HTML layer.
* **Stiff Margin realignments:** Employs `.snap-section { scroll-snap-align: start; scroll-snap-stop: always; }` properties on key page panels, stopping manual scrolls right at the origin boundary of each incoming screen section.

---

### 5.8 Haptic High-Frequency Auditory Click Snaps
To reinforce visceral physical feed loops as the user transitions:

* **Crisp Dual-Tone Waveform:** Triggers a sub-100ms sinusoidal oscillator pulse starting at 2500Hz and gliding down exponentially to 1250Hz.
* **Ultra-Faint Presence:** Designed with an instantaneous 0.8% peak amplitude scale, guaranteeing the audio acts like an organic phone hum or gentle haptic tap rather than an intrusive auditory distraction.

---

### 5.9 Real-Time Aesthetic Telemetry Velocity HUD
Adds a military-grade monitoring interface in the viewport margin:

* **Momentum Subscription Hooks:** Captures continuous velocity values via Framer Motion's `useVelocity` change observers inside client components.
* **Aesthetic Diagnostic Readings:** Renders instantaneous pixel-per-second values, current displacement pulse statuses, and active sensory flags directly in the unused bottom-left corner of primary desktop viewports to match technical cyberpunk aesthetics.

---

### 5.10 Real-Time Timezone-Calibrated Background Glow Recalibration
Integrates professional local time tracking to dynamically align the ambient rendering colors with the visitor's biological time context:

* **Unified 1Hz Time Synchronizer:** Sets up a secure 1-second interval clock hook that maps continuous hours, minutes, and seconds, updating the telemetry HUD instantly without introducing thread-blocking lag.
* **Four-Phase Color Space Matrix:** Resolves the local hour into four distinct cinematic light profiles:
  * **DAWN_SUNRISE (05:00 - 11:00):** Warm golden-orange solar ambiance (`#ff9c3a`) backed by rich earthen background gradient coordinates.
  * **OCEAN_OCEANIC (11:00 - 17:00):** Cinematic high-contrast cyberocean cyan rendering (`#00d1ff`) over deep sapphire oceanic trenches.
  * **SUNSET_TWILIGHT (17:00 - 21:00):** Moody purple-to-magenta neon gradient displays (`#ff3b94`) that mimic deep shore evenings.
  * **MIDNIGHT_NEBULA (21:00 - 05:00):** Restorative cosmic ultraviolet halos (`#7a46ff`) over deep abyss dark spaces.
* **Ref-Cached Canvas Vector Refactoring:** Pipes the active hours value seamlessly down to the `<WaterBackground>` component. It replaces all hardcoded cyan variables inside specular reflections, mouse spotlights, ambient space particles, splash rings, and fluid teardrop simulations, establishing a unified time-calibrated rendering experience.
