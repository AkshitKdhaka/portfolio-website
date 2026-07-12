import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

const MODEL_NAME = 'gemini-2.5-flash';

// Extracts an HTTP-ish status code from a thrown GoogleGenAI ApiError.
function getErrorStatus(error: any): number | undefined {
  if (typeof error?.status === 'number') return error.status;
  if (typeof error?.code === 'number') return error.code;
  const nested = error?.error?.code ?? error?.error?.error?.code;
  return typeof nested === 'number' ? nested : undefined;
}

const RETRYABLE_STATUSES = new Set([429, 500, 503]);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Retries a transient-failure-prone call with exponential backoff + jitter.
async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const status = getErrorStatus(error);
      const isLastAttempt = attempt === maxAttempts - 1;
      if (isLastAttempt || (status !== undefined && !RETRYABLE_STATUSES.has(status))) {
        throw error;
      }
      const backoff = 2 ** attempt * 500 + Math.floor(Math.random() * 250);
      console.warn(`Gemini request failed (status ${status}). Retrying in ${backoff}ms...`);
      await sleep(backoff);
    }
  }
  throw lastError;
}

const RESUME_DATA_CONTEXT = `
Full Name: AKSHIT KUMAR DHAKA
Profession: Full Stack Developer
Bio: Full Stack Developer with 2+ years of experience building scalable web applications using Next.js, React, TypeScript, Node.js, NestJS, Prisma, PostgreSQL, and MongoDB. Experienced in developing REST APIs, integrating Microsoft Graph API, implementing secure authentication systems, optimizing SEO, and deploying scalable cloud-native applications using AWS and Azure with CI/CD pipelines. Passionate about building performant, secure, and user-centric applications.
Location: Noida, India (current role remote for Tedekstra Limited, UK)
Contact:
- Phone: 9997386442
- Email: akshitkumardhaka99@gmail.com
- LinkedIn: https://www.linkedin.com/in/akshit-kumar-dhaka-a38028238/
- GitHub: https://github.com/AkshitKdhaka

Technical Skills:
- Languages: JavaScript, TypeScript, Java, SQL, HTML5, CSS3
- Frontend: React.js, Next.js, Tailwind CSS, Responsive Design, SSR, SSG
- Backend: Node.js, NestJS, Express.js, REST APIs, JWT, RBAC, Microservices
- Developer Tools: Git, GitHub, VS Code, Postman, Figma, Google Analytics, Lighthouse
- Database & ORM: MongoDB, PostgreSQL, Prisma ORM, MySQL, Redis
- Cloud & DevOps: AWS EC2, GitHub Actions, CI/CD Pipelines, Nginx, PM2, SSH, Docker, Environment Configuration
- Platform & Integrations: SEO Optimization, Microsoft Graph API, Azure Communication Services, Firebase, Technical SEO

Professional Experience:
1. Full Stack Developer at Tedekstra Limited (Remote, UK) | Nov 2025 - Present
   - Designed OAuth mailbox integration using Microsoft Graph API and Azure, automating calendar processing while ensuring GDPR-compliant workflows.
   - Designed and ran production Node-Cron job systems for quote reminders, installation reviews, product expiry alerts, lead reactivation, lead contact reminders, contract expiration checks, and referrer reconciliation—automating over 80% of recurring tasks.
   - Implemented secure JWT authentication and granular RBAC (superadmin, admin and staff data scoping) across leads, customers, quotes, contracts, residuals, and support tickets, reducing unauthorized access risk and speeding role-based workflows by ~30%.
   - Developed multi-provider payment residual processing (Trust Payments, Clover, Modern World) with Excel parsing, batch deduplication, commission aggregation, and PDF reports, processing 1,000+ rows per upload and improving report turnaround by 3x.
   - Built a scalable CDR/SDR usage-to-invoice ETL pipeline with charge-matrix rating, VAT/margin logic, unmatched-usage reconciliation, and PDF invoicing, improving billing throughput by ~50% and cutting manual finance work by ~40%.
   - Engineered category-based quote/contract PDF generation and e-signature workflows (mobile, broadband, payments, insurance), including payment-mandate capture, reducing contract cycle time by ~35%.
   - Built outbound email workflows with Microsoft 365 / Microsoft Graph API (with Azure Communication Services fallback) for quotes, lead alerts, renewals, and operational notifications, improving delivery reliability by ~25%.
   - Delivered end-to-end CRM modules for lead pipeline, product catalog, multi-site customers, referrer commissions, profit tracking, and CI/CD deployments, sustaining 3x traffic spikes while keeping API response times improved by ~50% on critical endpoints.
   - Integrated Next.js frontend with NestJS microservices using Prisma ORM, enabling scalable and type-safe API communication.
   - Tech Stack: Next.js, NestJS, Prisma, TypeScript, Microsoft Graph API, Azure, JWT, RBAC, Node-Cron, PostgreSQL

2. Software Developer (SDE-1) at Genius Labs (Noida, India) | Jul 2024 - Jun 2025
   - Built and maintained web applications using Next.js and MongoDB, improving page load times by 30%.
   - Automated CI/CD deployments on AWS EC2 using GitHub Actions, reducing deployment time by 70% and enabling faster production releases.
   - Integrated Firebase JWT authentication into Next.js, reducing unauthorized login attempts and enabling secure, seamless login experiences akin to streaming services.
   - Integrated Easebuzz payment gateway and TrustSignal SMS OTP verification, improving transaction success rate by 25%.
   - Integrated Google Analytics, JSON-LD structured data and Next.js App Router, achieving a 98/100 Lighthouse SEO score.
   - Tech Stack: Next.js, MongoDB, AWS EC2, Firebase, GitHub Actions, Easebuzz, Google Analytics

3. Web Developer at Freelance (Noida, India) | Mar 2023 - May 2023
   - Developed and maintained responsive Next.js applications, improving page performance by 30% through SSR, SSG and code optimization.
   - Implemented API integration enabling secure, type-safe and efficient frontend-backend communication in a full-stack application.
   - Integrated third-party RESTful APIs to manage customer data, inventory, and workflows, reducing API response time by 20%.
   - Converted UI/UX designs into pixel-perfect, mobile-first interfaces while improving performance and accessibility.
   - Delivered responsive and SEO-friendly web solutions by collaborating directly with clients and meeting project deadlines.
   - Tech Stack: Next.js, REST APIs, SSR, SSG, SEO, Responsive Design

Key Projects:
1. Global News Live (https://globalnews.live) | Real-Time News Aggregation Platform
   - Built a production-ready news aggregation platform using Next.js, TypeScript, and Tailwind CSS, integrating NewsAPI, deployed on AWS EC2 with GitHub Actions CI/CD pipeline achieving 99.9% uptime, enabling zero-downtime deployments on every push or merge to the main branch.
   - Configured Nginx reverse proxy for routing traffic and PM2 for process management, ensuring automatic app recovery after crashes or reboots. Managed environment variables securely using .env.local and GitHub Secrets for deployment.
   - Implemented server-side API routes with secure SSR to fetch and aggregate news data, reducing API response time by 35% and eliminating client-side API key exposure; advanced search with pagination and category filtering across 7+ major categories.
   - Tech Stack: Next.js, TypeScript, NewsAPI, Nginx, PM2, AWS EC2, GitHub Actions, Tailwind CSS
   - Metric: 99.9% Uptime

2. SEO-Optimized Educational Blog Platform | Search-Engine Optimized Educational CMS
   - Developed an SEO-optimized educational blog platform using Next.js, React, TypeScript, and Tailwind CSS, significantly boosting online presence and organic traffic.
   - Optimized performance and accessibility with Server Components, SSG, JSON-LD schemas, dynamic metadata, automated sitemap and robots.txt, semantic HTML, and WCAG compliance for improved Core Web Vitals.
   - Tech Stack: Next.js, React, TypeScript, JSON-LD, SSG, Tailwind CSS, SEO

3. Adaptive Learning Platform | Personalized Exam Preparation Framework
   - Developed a secure, personalized exam preparation framework for grades 9–12, achieving a 92% user satisfaction rate and a 35% improvement in test readiness among students.
   - Implemented adaptive learning that monitored student progress with 97% accuracy, dynamically adjusting content complexity to boost engagement by 50% and reduce cognitive overload by 30%.
   - Tech Stack: React, JavaScript, Adaptive Learning, Algorithms
   - Metric: 35% Readiness Lift

Education:
- B.Tech in Computer Science Engineering | Delhi Technical Campus, Noida (2020 - 2024) | Grade: 8.99 CGPA
- Senior Secondary Education (Mathematics and Computer Science) | St Mary's School (ICSE), Bijnor (2018 - 2019) | Grade: 8.02 CGPA

Certifications & Training:
- Certification of Training: Web Development (Internshala, 2022)
- Certificate of Internship: Python (Core and Advanced) (Edufabrica Pvt Ltd, 2022)
- NPTEL Certification: Data Structure and Algorithms Using Java (NPTEL, 2023)
- Certificate of Internship: Software Developer Intern (STEM Quest Education Pvt Ltd, 2024)
`;

export async function POST(req: NextRequest) {
  try {
    const { action, payload } = await req.json();

    // Guard to check query limit (max 10)
    const cookie = req.cookies.get('ai_query_count');
    const currentCount = cookie ? parseInt(cookie.value, 10) : 0;
    if (currentCount >= 10) {
      return NextResponse.json({
        error: 'Limit Reached: You have reached the limit of 10 free AI queries to prevent misuse.'
      }, { status: 403 });
    }

    // Guard representing missing API keys to provide clear developer workflow
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      return NextResponse.json({
        error: 'Gemini API Key is not configured. Please add GEMINI_API_KEY to your .env file.'
      }, { status: 401 });
    }

    // Initialize GoogleGenAI client lazily within request execution
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'akshit-portfolio/1.0',
        },
      },
    });

    let contents: any = [];
    let systemInstruction = '';
    let generationConfig: { temperature: number; maxOutputTokens: number; topP: number } = {
      temperature: 0.4,
      maxOutputTokens: 600,
      topP: 0.9,
    };

    // Shared output rules so every answer stays precise, factual, and renders
    // cleanly in the plain-text UI (no raw markdown symbols leaking through).
    const PLAIN_TEXT_RULES =
      'OUTPUT RULES: Write in clean plain text only. Do NOT use markdown symbols such as **, ##, *, backticks, or tables. ' +
      'For lists, start each line with a simple dash (-). Keep paragraphs short. Be concise and precise. ' +
      'Only state facts present in the provided portfolio data; never invent skills, tools, dates, employers, metrics, or certifications. ' +
      'If something is not in the data, say it is not specified rather than guessing.';

    if (action === 'chat') {
      const { userMessage } = payload;

      contents = [
        {
          role: 'user',
          parts: [{ text: `PORTFOLIO DATA (the only source of truth):\n${RESUME_DATA_CONTEXT}\n\nRecruiter question: ${userMessage}` }]
        }
      ];
      systemInstruction =
        `You are the Recruiter AI Companion for Akshit Kumar Dhaka. Answer ONLY from the portfolio data below. ` +
        `Give a direct, focused answer in 2-5 short sentences or up to 5 short bullet points. Do not pad with generic filler or repeat the question. ` +
        PLAIN_TEXT_RULES;
      generationConfig = { temperature: 0.3, maxOutputTokens: 400, topP: 0.9 };
    } else if (action === 'tailor') {
      const { jobDescription } = payload;

      contents = [
        {
          role: 'user',
          parts: [{ text: `JOB DESCRIPTION:\n${jobDescription}\n\nPORTFOLIO DATA (the only source of truth):\n${RESUME_DATA_CONTEXT}` }]
        }
      ];
      systemInstruction =
        `You are a technical recruitment specialist matching Akshit's profile to a job description. ` +
        `Respond with exactly three short sections, each introduced by a plain uppercase label on its own line:\n` +
        `MATCHING STRENGTHS (3-5 dash bullets)\nTAILORED SUMMARY (2-3 sentences)\nRESUME BULLETS TO HIGHLIGHT (3-5 dash bullets). ` +
        `Keep it tight and specific to the job. ` +
        PLAIN_TEXT_RULES;
      generationConfig = { temperature: 0.4, maxOutputTokens: 650, topP: 0.9 };
    } else if (action === 'explain') {
      const { projectName, architectureQuery } = payload;

      contents = [
        {
          role: 'user',
          parts: [{ text: `PROJECT: ${projectName}\nQUESTION: ${architectureQuery}\n\nPORTFOLIO DATA (the only source of truth):\n${RESUME_DATA_CONTEXT}` }]
        }
      ];
      systemInstruction =
        `You are a senior software architect answering a specific question about Akshit's project. ` +
        `Give a focused, practical answer in under 200 words: a short explanation followed by 3-6 dash bullets of concrete steps or components ` +
        `(e.g. AWS, Nginx, PM2, Docker, Redis where relevant). Optionally include one small ASCII diagram inside a plain code block. Stay on the asked question only. ` +
        PLAIN_TEXT_RULES;
      generationConfig = { temperature: 0.4, maxOutputTokens: 600, topP: 0.9 };
    } else if (action === 'polish_email') {
      const { name, company, email, rawMessage } = payload;

      contents = [
        {
          role: 'user',
          parts: [{ text: `Recruiter Name: ${name}\nCompany: ${company || 'Enterprise Partner'}\nRecruiter Email: ${email}\n\nRaw draft to polish:\n${rawMessage}` }]
        }
      ];
      systemInstruction =
        `You are a professional editor. Rewrite the recruiter's raw draft into a polished, concise outreach email body addressed to Akshit. ` +
        `Keep it under 120 words, warm but professional, and preserve the sender's original intent and facts. ` +
        `Output ONLY the email body text. No subject line, no greetings labels, no commentary, no markdown symbols.`;
      generationConfig = { temperature: 0.6, maxOutputTokens: 350, topP: 0.95 };
    } else {
      return NextResponse.json({ error: 'Invalid action parameter specified' }, { status: 400 });
    }

    const responseStream = await withRetry(() =>
      ai.models.generateContentStream({
        model: MODEL_NAME,
        contents,
        config: {
          systemInstruction,
          temperature: generationConfig.temperature,
          maxOutputTokens: generationConfig.maxOutputTokens,
          topP: generationConfig.topP,
        },
      })
    );

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
        } catch (err: any) {
          console.error("Stream reader error:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      }
    });

    const nextCount = currentCount + 1;

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Set-Cookie': `ai_query_count=${nextCount}; Path=/; Max-Age=31536000; SameSite=Lax`,
      },
    });

  } catch (error: any) {
    console.error('Gemini Back-end Route Error:', error);

    const status = getErrorStatus(error);

    if (status === 503 || status === 429) {
      return NextResponse.json(
        {
          error:
            'The AI service is experiencing high demand right now. Please wait a few seconds and try again.',
        },
        { status: 503 }
      );
    }

    if (status === 401 || status === 403) {
      return NextResponse.json(
        { error: 'AI service authentication failed. Please check the configured API key.' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: error?.message || 'Internal connection failure' },
      { status: 500 }
    );
  }
}
