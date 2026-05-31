import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

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

    if (action === 'chat') {
      const { userMessage, chatHistory } = payload;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `Here is the full background data and portfolio content of Akshit Kumar Dhaka:\n\n${RESUME_DATA_CONTEXT}\n\nPlease act as Akshit's professional Recruiter AI Companion. Direct, helpful, honest, and technically precise. Answer the recruiter's inquiry with clarity, focusing purely on his genuine capabilities, projects, education, and experience. Do not hallucinate skills or certificates he doesn't have.\n\nRecruiter ask: ${userMessage}` }]
          }
        ],
        config: {
          systemInstruction: 'You are an elite Recruiter AI Companion for Akshit Kumar Dhaka. Answer questions precisely based on Akshit\'s portfolio. Keep responses concise, objective, and styled cleanly with markdown formatting. Use bullet points where appropriate.'
        }
      });

      return NextResponse.json({ text: response.text });
    }

    if (action === 'tailor') {
      const { jobDescription } = payload;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `We need to tailor Akshit's profile to this Job Description:\n\n---\n${jobDescription}\n---\n\nAkshit's Background:\n${RESUME_DATA_CONTEXT}\n\nPlease analyze matching, extract gaps if any, and suggest how to pitch his profile. Provide 3 clean sections: 1) Matches of Core Strengths, 2) Tailored Professional Summary pitch, 3) Recommended Resume Bullets to highlight.` }]
          }
        ],
        config: {
          systemInstruction: 'You are a veteran resume compiler and tech recruitment specialist analyzing matching. Format matches neatly into 3 distinct sections using markdown headers.'
        }
      });

      return NextResponse.json({ text: response.text });
    }

    if (action === 'explain') {
      const { projectName, architectureQuery } = payload;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `Project: ${projectName}\nInquiry: ${architectureQuery}\n\nAkshit's Project Context:\n${RESUME_DATA_CONTEXT}\n\nProvide an immersive system architecture explanation detailing: how Akshit built it, how to scale it using microservices/containers (e.g. AWS, Nginx, PM2, Docker, Redis), and provide a brief ASCII diagram of the scaled topology followed by detailed architectural guidelines.` }]
          }
        ],
        config: {
          systemInstruction: 'You are a Principal Software Architect. Explain modular scaling and topologies. Provide precise blueprints. Use ASCII code blocks for flow diagrams and maintain high professional engineering language.'
        }
      });

      return NextResponse.json({ text: response.text });
    }

    if (action === 'polish_email') {
      const { name, company, email, rawMessage } = payload;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `Recruiter Name: ${name}\nCompany: ${company || 'Enterprise Partner'}\nRecruiter Email: ${email}\nRaw Draft Message:\n${rawMessage}\n\nAkshit's Background: ${RESUME_DATA_CONTEXT}\n\nPlease take this raw draft and polish it into a crisp, exceptionally professional, high-impact introductory outreach email from the recruiter to Akshit, showing deep technical matching with his Next.js, DevOps, or Node.js background. Only output the polished email body text (no subject line or meta-introduction), written in a polished and professional recruiter tone.` }]
          }
        ],
        config: {
          systemInstruction: 'You are a Senior Executive Recruiter. Polish raw drafts to make them highly professional, persuasive, and engaging. Avoid any meta introductions or wrappers; just output the polished text itself.'
        }
      });

      return NextResponse.json({ text: response.text });
    }

    return NextResponse.json({ error: 'Invalid action parameter specified' }, { status: 400 });

  } catch (error: any) {
    console.error('Gemini Back-end Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal connection failure' }, { status: 500 });
  }
}
