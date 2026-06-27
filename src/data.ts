import { Experience, Project, Education, Certification, TechnicalSkills } from './types';

export const fullName = "AKSHIT KUMAR DHAKA";
export const mainTitle = "Full Stack Developer & Technical Architect";
export const bioSummary = "Engineering high-performance digital solutions with absolute precision and modern institutional aesthetics.";

export const contactInfo = {
  email: "akshitkumardhaka99@gmail.com",
  linkedin: "https://www.linkedin.com/in/akshit-kumar-dhaka-a38028238/",
  github: "https://github.com/AkshitKdhaka"
};

export const technicalSkills: TechnicalSkills = {
  languages: ["HTML", "CSS", "Java", "JavaScript", "TypeScript", "SQL"],
  frameworks_and_tools: [
    "Node.js",
    "Next.js",
    "React",
    "Tailwind CSS",
    "GitHub",
    "VS Code",
    "Postman"
  ],
  databases: ["MongoDB", "MySQL"],
  devops_and_cloud: [
    "AWS EC2",
    "GitHub Actions",
    "CI/CD Pipelines",
    "Nginx",
    "PM2",
    "SSH",
    "Let's Encrypt",
    "Certbot",
    "Environment Config"
  ],
  other: [
    "Git",
    "API Integration",
    "SEO Optimization",
    "Performance Tuning",
    "Server Monitoring"
  ]
};

export const experiences: Experience[] = [
  {
    title: "Full Stack Developer",
    company: "Tedekstra Limited",
    location: "Noida, India",
    start: "Nov 2025",
    end: "Present",
    highlights: [
      "Developed responsive, SEO-optimized web application using Next.js and TypeScript, improving page performance by 30%.",
      "Created server-side rendered (SSR) and static site generation (SSG) pages to optimize rendering speeds across global devices.",
      "Engineered high performance RESTful APIs to manage customer data, workflows, and inventory, reducing response margins by 20%.",
      "Delivered a unified stack utilizing Next.js, NestJS, and Prisma, ensuring outstanding type safety and consistent code hygiene."
    ],
    techStack: ["Next.js", "TypeScript", "NestJS", "Prisma", "Tailwind CSS", "REST APIs"]
  },
  {
    title: "Software Developer (SDE-1)",
    company: "Genius Labs",
    location: "Noida, India",
    start: "Jul 2024",
    end: "Jun 2025",
    highlights: [
      "Built and maintained core web applications using Next.js and MongoDB, boosting core loading response times by 30%.",
      "Automated CI/CD workflows via GitHub Actions for AWS EC2, guaranteeing secure, fast, and automated application releases.",
      "Integrated Firebase Authentication with customizable roles, delivering secure and seamless login workflows.",
      "Achieved a 98/100 Google Lighthouse score by utilizing the Next.js App Router and dynamic structured metadata standard schemas."
    ],
    techStack: ["React", "Next.js", "MongoDB", "AWS EC2", "Firebase", "GitHub Actions"]
  },
  {
    title: "Web Developer",
    company: "Freelance",
    location: "Noida, India",
    start: "Mar 2023",
    end: "May 2023",
    highlights: [
      "Built beautiful high-efficiency client websites using HTML5, CSS3, and modern interactive JavaScript with optimized load metrics.",
      "Worked closely with clients and design teams to translate creative UX mocks into beautiful fully response layouts.",
      "Optimized cross-browser assets and layouts, delivering crisp visual precision and flawless mobile behavior."
    ],
    techStack: ["HTML5", "CSS3", "JavaScript", "SEO", "Responsive Design"]
  }
];

export const projects: Project[] = [
  {
    name: "Global News Live",
    subtitle: "Real-Time News Aggregation Platform",
    summary: "Production-ready news aggregation platform deploying server-side rendered contents with state-of-the-art system durability.",
    details: [
      "Configured Nginx reverse proxy and PM2 process manager for automatic process crash recovery, achieving 99.9% system uptime.",
      "Implemented server-side API endpoints with Next.js SSR, reducing server response time by 35% and keeping critical secrets safe from public browser exposure.",
      "Created dynamic pagination, custom categorizations (7+ divisions), and robust user queries with clean UI feedback loops."
    ],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoo8RRPpRwi3J9URGvmncAlVIDjmhnRsN8jkRd7LS41MARACBIua7aBX6qKlCw4JRg03k6IKJ_hqWXT8UpOG8PV6I5pktjo9RW-CiNJSVpeJuB-M6LcuODL2qu7Zd15fv03LS8kRW1GZPNfIJFlRuqCb7qq-GF5nEhD6doU-e4x4Pz2jJ5-Qm7Yl0hS6c3OF3FZ3-QbA82MM83UjdYOMrB2cJbKgGpiaNe1KMnDtQdXF2RJdBx8GyBuVvJBB-LA0Sf9BYvX8BmuQuA",
    url: "https://globalnews.live",
    tags: ["Next.js", "TypeScript", "Nginx", "PM2", "AWS EC2", "Tailwind CSS"],
    metric: "99.9%",
    metricLabel: "Uptime"
  },
  {
    name: "SEO Blog Platform",
    subtitle: "Educational Search-Engine Optimized CMS",
    summary: "High-performance publishing platform crafted to drive massive search engine exposure and robust core web vitals.",
    details: [
      "Configured advanced JSON-LD structured schema metadata and semantic HTML tags to maximize accessibility and visibility indexes.",
      "Utilized Next.js Server Components, static site caching optimizations, automatic XML sitemaps, and strict WCAG mobile compliance.",
      "Designed clean editorial reading experiences that achieved perfect Core Web Vitals rankings and lightning fast execution."
    ],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaZUWsOGJgk4NWRdGWvGjnqMbpRCEAYMC2mbKDLwE1wRvQoezSylFg-iyiRmgl9ytbd8WEMcD_Lsm3Y3kQuOvipnKjVamiQAk8b-E07Ua8pmYts-Rj6WFliY8sKnBDc8PW0w3JW3ySUN7wZ351e4YXGpPoTK1kFcgWOw0M4kiS7K8JtXzpM3UD6AsAff1ZQq6l4csRWC5VU1Gd8IiEQvAb0s4Ee_Lcs5Xc68MYkUsU5kUfjFWwlWCa5VqYneXKZ2jVfyNPRqt3m9HS",
    tags: ["Next.js", "React", "TypeScript", "JSON-LD", "SSG", "Tailwind CSS"],
    metric: "98/100",
    metricLabel: "Lighthouse"
  },
  {
    name: "Adaptive Prep Framework",
    subtitle: "Secure Student Exam Platform",
    summary: "Personalized exam preparation framework for students, yielding exceptional interactive training and dynamic complexity adjustments.",
    details: [
      "Engineered adaptive complexity modules tracking user assessment performance with 97% accuracy, reducing cognitive stress by 30%.",
      "Achieved a 92% student satisfaction rate and a 35% measurable upgrade in state exam readiness benchmarks.",
      "Optimized client response layers to accommodate real-time interactive exam countdowns and responsive graphic score reviews."
    ],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    tags: ["React", "JavaScript", "CSS3", "Algorithms", "Adaptive Tech"],
    metric: "35%+",
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
    name: "Web Development Training Certification",
    issuer: "Internshala",
    year: "2022"
  },
  {
    name: "Python (Core and Advanced) Internship Certification",
    issuer: "Edufabrica Pvt Ltd",
    year: "2022"
  },
  {
    name: "Data Structures & Algorithms Using Java",
    issuer: "NPTEL",
    year: "2023"
  },
  {
    name: "Software Developer Intern Certification",
    issuer: "STEM Quest Education Pvt Ltd",
    year: "2024"
  }
];
