import { Experience, Project, Education, Certification, TechnicalSkills, SkillCategory } from './types';

export const fullName = "AKSHIT KUMAR DHAKA";
export const mainTitle = "Full Stack Developer";
export const bioSummary =
  "Full Stack Developer with 2+ years of experience building scalable web applications using Next.js, React, TypeScript, Node.js, NestJS, Prisma, PostgreSQL, and MongoDB. Experienced in developing REST APIs, integrating Microsoft Graph API, implementing secure authentication systems, optimizing SEO, and deploying scalable cloud-native applications using AWS and Azure with CI/CD pipelines. Passionate about building performant, secure, and user-centric applications.";

export const contactInfo = {
  email: "akshitkumardhaka99@gmail.com",
  phone: "9997386442",
  linkedin: "https://www.linkedin.com/in/akshit-kumar-dhaka-a38028238/",
  github: "https://github.com/AkshitKdhaka"
};

/** Resume-aligned technical skills — each field stays in its own category. */
export const technicalSkills: TechnicalSkills = {
  languages: ["JavaScript", "TypeScript", "Java", "SQL", "HTML5", "CSS3"],
  frontend: ["React.js", "Next.js", "Tailwind CSS", "Responsive Design", "SSR", "SSG"],
  backend: ["Node.js", "NestJS", "Express.js", "REST APIs", "JWT", "RBAC", "Microservices"],
  developer_tools: ["Git", "GitHub", "VS Code", "Postman", "Figma", "Google Analytics", "Lighthouse"],
  databases_and_orm: ["MongoDB", "PostgreSQL", "Prisma ORM", "MySQL", "Redis"],
  cloud_and_devops: [
    "AWS EC2",
    "GitHub Actions",
    "CI/CD Pipelines",
    "Nginx",
    "PM2",
    "SSH",
    "Docker",
    "Environment Configuration"
  ],
  platform_and_integrations: [
    "SEO Optimization",
    "Microsoft Graph API",
    "Azure Communication Services",
    "Firebase",
    "Technical SEO"
  ]
};

/** Display order and labels for The Foundation tech-stack grid. */
export const skillCategories: SkillCategory[] = [
  {
    key: "languages",
    title: "Languages",
    description: "Core languages used across full-stack product work."
  },
  {
    key: "frontend",
    title: "Frontend",
    description: "Modern React/Next.js UI with SSR, SSG, and responsive design."
  },
  {
    key: "backend",
    title: "Backend",
    description: "APIs, auth, and microservice patterns with Node and NestJS."
  },
  {
    key: "developer_tools",
    title: "Developer Tools",
    description: "Day-to-day tooling for build, debug, design, and measurement."
  },
  {
    key: "databases_and_orm",
    title: "Database & ORM",
    description: "SQL, NoSQL, cache, and type-safe Prisma data access."
  },
  {
    key: "cloud_and_devops",
    title: "Cloud & DevOps",
    description: "AWS hosting, CI/CD, reverse proxies, and process management."
  },
  {
    key: "platform_and_integrations",
    title: "Platform & Integrations",
    description: "SEO, Microsoft Graph, Azure, Firebase, and platform services."
  }
];

export const experiences: Experience[] = [
  {
    title: "Full Stack Developer",
    company: "Tedekstra Limited",
    location: "Remote, UK",
    start: "Nov 2025",
    end: "Present",
    highlights: [
      "Designed OAuth mailbox integration using Microsoft Graph API and Azure, automating calendar processing while ensuring GDPR-compliant workflows.",
      "Designed and ran production Node-Cron job systems for quote reminders, installation reviews, product expiry alerts, lead reactivation, lead contact reminders, contract expiration checks, and referrer reconciliation—automating over 80% of recurring tasks.",
      "Implemented secure JWT authentication and granular RBAC (superadmin, admin and staff data scoping) across leads, customers, quotes, contracts, residuals, and support tickets, reducing unauthorized access risk and speeding role-based workflows by ~30%.",
      "Developed multi-provider payment residual processing (Trust Payments, Clover, Modern World) with Excel parsing, batch deduplication, commission aggregation, and PDF reports, processing 1,000+ rows per upload and improving report turnaround by 3x.",
      "Built a scalable CDR/SDR usage-to-invoice ETL pipeline with charge-matrix rating, VAT/margin logic, unmatched-usage reconciliation, and PDF invoicing, improving billing throughput by ~50% and cutting manual finance work by ~40%.",
      "Engineered category-based quote/contract PDF generation and e-signature workflows (mobile, broadband, payments, insurance), including payment-mandate capture, reducing contract cycle time by ~35%.",
      "Built outbound email workflows with Microsoft 365 / Microsoft Graph API (with Azure Communication Services fallback) for quotes, lead alerts, renewals, and operational notifications, improving delivery reliability by ~25%.",
      "Delivered end-to-end CRM modules for lead pipeline, product catalog, multi-site customers, referrer commissions, profit tracking, and CI/CD deployments, sustaining 3x traffic spikes while keeping API response times improved by ~50% on critical endpoints.",
      "Integrated Next.js frontend with NestJS microservices using Prisma ORM, enabling scalable and type-safe API communication."
    ],
    techStack: [
      "Next.js",
      "NestJS",
      "Prisma",
      "TypeScript",
      "Microsoft Graph API",
      "Azure",
      "JWT",
      "RBAC",
      "Node-Cron",
      "PostgreSQL"
    ]
  },
  {
    title: "Software Developer (SDE-1)",
    company: "Genius Labs",
    location: "Noida, India",
    start: "Jul 2024",
    end: "Jun 2025",
    highlights: [
      "Built and maintained web applications using Next.js and MongoDB, improving page load times by 30%.",
      "Automated CI/CD deployments on AWS EC2 using GitHub Actions, reducing deployment time by 70% and enabling faster production releases.",
      "Integrated Firebase JWT authentication into Next.js, reducing unauthorized login attempts and enabling secure, seamless login experiences akin to streaming services.",
      "Integrated Easebuzz payment gateway and TrustSignal SMS OTP verification, improving transaction success rate by 25%.",
      "Integrated Google Analytics, JSON-LD structured data and Next.js App Router, achieving a 98/100 Lighthouse SEO score."
    ],
    techStack: [
      "Next.js",
      "MongoDB",
      "AWS EC2",
      "Firebase",
      "GitHub Actions",
      "Easebuzz",
      "Google Analytics"
    ]
  },
  {
    title: "Web Developer",
    company: "Freelance",
    location: "Noida, India",
    start: "Mar 2023",
    end: "May 2023",
    highlights: [
      "Developed and maintained responsive Next.js applications, improving page performance by 30% through SSR, SSG and code optimization.",
      "Implemented API integration enabling secure, type-safe and efficient frontend-backend communication in a full-stack application.",
      "Integrated third-party RESTful APIs to manage customer data, inventory, and workflows, reducing API response time by 20%.",
      "Converted UI/UX designs into pixel-perfect, mobile-first interfaces while improving performance and accessibility.",
      "Delivered responsive and SEO-friendly web solutions by collaborating directly with clients and meeting project deadlines."
    ],
    techStack: ["Next.js", "REST APIs", "SSR", "SSG", "SEO", "Responsive Design"]
  }
];

export const projects: Project[] = [
  {
    name: "Global News Live",
    subtitle: "Real-Time News Aggregation Platform",
    summary:
      "Production-ready news aggregation platform built with Next.js, TypeScript, and Tailwind CSS, integrating NewsAPI and deployed on AWS EC2 with GitHub Actions CI/CD for 99.9% uptime.",
    details: [
      "Built a production-ready news aggregation platform using Next.js, TypeScript, and Tailwind CSS, integrating NewsAPI, deployed on AWS EC2 with GitHub Actions CI/CD pipeline achieving 99.9% uptime, enabling zero-downtime deployments on every push or merge to the main branch.",
      "Configured Nginx reverse proxy for routing traffic and PM2 for process management, ensuring automatic app recovery after crashes or reboots. Managed environment variables securely using .env.local and GitHub Secrets for deployment.",
      "Implemented server-side API routes with secure server-side rendering to fetch and aggregate news data, reducing API response time by 35% and improving security by eliminating client-side API key exposure; integrated advanced search with pagination and category-based filtering across 7+ major categories."
    ],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCoo8RRPpRwi3J9URGvmncAlVIDjmhnRsN8jkRd7LS41MARACBIua7aBX6qKlCw4JRg03k6IKJ_hqWXT8UpOG8PV6I5pktjo9RW-CiNJSVpeJuB-M6LcuODL2qu7Zd15fv03LS8kRW1GZPNfIJFlRuqCb7qq-GF5nEhD6doU-e4x4Pz2jJ5-Qm7Yl0hS6c3OF3FZ3-QbA82MM83UjdYOMrB2cJbKgGpiaNe1KMnDtQdXF2RJdBx8GyBuVvJBB-LA0Sf9BYvX8BmuQuA",
    url: "https://globalnews.live",
    tags: ["Next.js", "TypeScript", "NewsAPI", "Nginx", "PM2", "AWS EC2", "GitHub Actions", "Tailwind CSS"],
    metric: "99.9%",
    metricLabel: "Uptime"
  },
  {
    name: "SEO-Optimized Educational Blog Platform",
    subtitle: "Search-Engine Optimized Educational CMS",
    summary:
      "SEO-optimized educational blog platform using Next.js, React, TypeScript, and Tailwind CSS, built to boost organic traffic and Core Web Vitals.",
    details: [
      "Developed an SEO-optimized educational blog platform using Next.js, React, TypeScript, and Tailwind CSS, significantly boosting online presence and organic traffic.",
      "Optimized performance and accessibility by utilizing Server Components, Static Site Generation (SSG), and comprehensive SEO strategies with JSON-LD schemas, dynamic metadata, automated sitemap and robots.txt, semantic HTML, and WCAG-compliant accessibility features."
    ],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBaZUWsOGJgk4NWRdGWvGjnqMbpRCEAYMC2mbKDLwE1wRvQoezSylFg-iyiRmgl9ytbd8WEMcD_Lsm3Y3kQuOvipnKjVamiQAk8b-E07Ua8pmYts-Rj6WFliY8sKnBDc8PW0w3JW3ySUN7wZ351e4YXGpPoTK1kFcgWOw0M4kiS7K8JtXzpM3UD6AsAff1ZQq6l4csRWC5VU1Gd8IiEQvAb0s4Ee_Lcs5Xc68MYkUsU5kUfjFWwlWCa5VqYneXKZ2jVfyNPRqt3m9HS",
    tags: ["Next.js", "React", "TypeScript", "JSON-LD", "SSG", "Tailwind CSS", "SEO"],
    metric: "CWV",
    metricLabel: "Optimized"
  },
  {
    name: "Adaptive Learning Platform",
    subtitle: "Personalized Exam Preparation Framework",
    summary:
      "Secure, personalized exam preparation framework for grades 9–12 with adaptive complexity and measurable readiness gains.",
    details: [
      "Developed a secure, personalized exam preparation framework for grades 9–12, achieving a 92% user satisfaction rate and a 35% improvement in test readiness among students.",
      "Implemented an adaptive learning platform that monitored student progress with 97% accuracy, dynamically adjusting content complexity to boost engagement by 50% and reduce cognitive overload by 30%."
    ],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    tags: ["React", "JavaScript", "Adaptive Learning", "Algorithms"],
    metric: "35%",
    metricLabel: "Readiness Lift"
  }
];

export const education: Education[] = [
  {
    degree: "Bachelor of Technology",
    field: "Computer Science Engineering",
    institution: "Delhi Technical Campus",
    location: "Noida, India",
    start: "2020",
    end: "2024",
    grade: "8.99 CGPA"
  },
  {
    degree: "Senior Secondary Education",
    field: "Mathematics and Computer Science",
    institution: "St Mary's School (ICSE)",
    location: "Bijnor, India",
    start: "2018",
    end: "2019",
    grade: "8.02 CGPA"
  }
];

export const certifications: Certification[] = [
  {
    name: "Certification of Training: Web Development",
    issuer: "Internshala",
    year: "2022"
  },
  {
    name: "Certificate of Internship: Python (Core and Advanced)",
    issuer: "Edufabrica Pvt Ltd",
    year: "2022"
  },
  {
    name: "NPTEL Certification: Data Structure and Algorithms Using Java",
    issuer: "NPTEL",
    year: "2023"
  },
  {
    name: "Certificate of Internship: Software Developer Intern",
    issuer: "STEM Quest Education Pvt Ltd",
    year: "2024"
  }
];
