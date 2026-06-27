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
Profession: Full Stack Developer & Technical Architect
Bio: Engineering high-performance digital solutions with absolute precision and modern institutional aesthetics.
Location: Noida, India
Contact:
- Email: akshitkumardhaka99@gmail.com
- Phone: +91-9997386442
- LinkedIn: https://www.linkedin.com/in/akshit-kumar-dhaka-a38028238/
- GitHub: https://github.com/AkshitKdhaka

Technical Skills:
- Languages: HTML, CSS, Java, JavaScript, TypeScript, SQL
- Frameworks & Tools: Node.js, Next.js, React, Tailwind CSS, GitHub, VS Code, Postman, NestJS, Prisma
- Databases: MongoDB, MySQL
- DevOps & Cloud: AWS EC2, GitHub Actions, CI/CD Pipelines, Nginx, PM2, SSH, Let's Encrypt, Certbot, Environ config
- Other Core Skills: Git, API Integration, SEO Optimization, Performance Tuning, Server Monitoring, SSR, SSG

Professional Experience:
1. Full Stack Developer at Tedekstra Limited (Noida, India) | Nov 2025 - Present
   - Developed responsive, SEO-optimized web application using Next.js and TypeScript, improving page performance by 30%.
   - Created server-side rendered (SSR) and static site generation (SSG) pages to optimize rendering speeds across global devices.
   - Engineered high performance RESTful APIs to manage customer data, workflows, and inventory, reducing response margins by 20%.
   - Delivered a unified stack utilizing Next.js, NestJS, and Prisma, ensuring outstanding type safety and consistent code hygiene.
   - Tech Stack: Next.js, TypeScript, NestJS, Prisma, Tailwind CSS, REST APIs

2. Software Developer (SDE-1) at Genius Labs (Noida, India) | Jul 2024 - Jun 2025
   - Built and maintained core web applications using Next.js and MongoDB, boosting core loading response times by 30%.
   - Automated CI/CD workflows via GitHub Actions for AWS EC2, guaranteeing secure, fast, and automated application releases.
   - Integrated Firebase Authentication with customizable roles, delivering secure and seamless login workflows.
   - Achieved a 98/100 Google Lighthouse score by utilizing the Next.js App Router and dynamic structured metadata standard schemas.
   - Tech Stack: React, Next.js, MongoDB, AWS EC2, Firebase, GitHub Actions

3. Web Developer at Freelance (Noida, India) | Mar 2023 - May 2023
   - Built beautiful high-efficiency client websites using HTML5, CSS3, and modern interactive JavaScript with optimized load metrics.
   - Worked closely with clients and design teams to translate creative UX mocks into beautiful fully response layouts.
   - Optimized cross-browser assets and layouts, delivering crisp visual precision and flawless mobile behavior.
   - Tech Stack: HTML5, CSS3, JavaScript, SEO, Responsive Design

Key Projects:
1. Global News Live (https://globalnews.live) | Real-Time News Aggregation Platform
   - Configured Nginx reverse proxy and PM2 process manager for automatic process crash recovery, achieving 99.9% system uptime.
   - Implemented server-side API endpoints with Next.js SSR, reducing server response time by 35% and keeping critical secrets safe from public browser exposure.
   - Created dynamic pagination, custom categorizations (7+ divisions), and robust user queries with clean UI feedback loops.
   - Tech Stack: Next.js, TypeScript, Nginx, PM2, AWS EC2, Tailwind CSS
   - Metric: 99.9% Uptime achievement

2. SEO Blog Platform | Educational Search-Engine Optimized CMS
   - Configured advanced JSON-LD structured schema metadata and semantic HTML tags to maximize accessibility and visibility indexes.
   - Utilized Next.js Server Components, static site caching optimizations, automatic XML sitemaps, and strict WCAG mobile compliance.
   - Designed clean editorial reading experiences that achieved perfect Core Web Vitals rankings and lightning fast execution.
   - Tech Stack: Next.js, React, TypeScript, JSON-LD, SSG, Tailwind CSS
   - Metric: 98/100 Lighthouse score

3. Adaptive Prep Framework | Secure Student Exam Platform
   - Engineered adaptive complexity modules tracking user assessment performance with 97% accuracy, reducing cognitive stress by 30%.
   - Achieved a 92% student satisfaction rate and a 35% measurable upgrade in state exam readiness benchmarks.
   - Optimized client response layers to accommodate real-time interactive exam countdowns and responsive graphic score reviews.
   - Tech Stack: React, JavaScript, CSS3, Algorithms, Adaptive Tech
   - Metric: 35%+ Readiness Lift

Education:
- B.Tech in Computer Science Engineering | Delhi Technical Campus, Noida (2020 - 2024) | Grade: 8.99 CGPA
- Senior Secondary Education (Mathematics and Computer Science) | St Mary's School, Bijnor (2018 - 2019) | Grade: 8.02 CGPA

Certifications & Training:
- Web Development Training Certification (Internshala, 2022)
- Python (Core and Advanced) Internship Certification (Edufabrica Pvt Ltd, 2022)
- Data Structures & Algorithms Using Java (NPTEL, 2023)
- Software Developer Intern Certification (STEM Quest Education Pvt Ltd, 2024)
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
        error: 'Gemini API Key is not configured. Please add GEMINI_API_KEY to your Secrets or Environment variables.'
      }, { status: 401 });
    }

    // Initialize GoogleGenAI client lazily within request execution
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
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
