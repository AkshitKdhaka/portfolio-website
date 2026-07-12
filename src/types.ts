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
  subtitle?: string;
  summary: string;
  details: string[];
  url?: string;
  imageUrl?: string;
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
  year: string;
}

export interface TechnicalSkills {
  languages: string[];
  frontend: string[];
  backend: string[];
  developer_tools: string[];
  databases_and_orm: string[];
  cloud_and_devops: string[];
  platform_and_integrations: string[];
}

export interface SkillCategory {
  key: keyof TechnicalSkills;
  title: string;
  description: string;
}
