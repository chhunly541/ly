export type Language = 'km' | 'en';

export interface LocalizedText {
  km: string;
  en: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  telegram: string;
  location: LocalizedText;
  website: string;
  github: string;
  linkedin: string;
  availability: LocalizedText;
}

export interface StudyItem {
  id: string;
  degree: LocalizedText;
  institution: LocalizedText;
  location: LocalizedText;
  period: string;
  gpaOrHonors: LocalizedText;
  focus: LocalizedText;
}

export interface ExperienceItem {
  id: string;
  role: LocalizedText;
  company: LocalizedText;
  location: LocalizedText;
  period: string;
  employmentType: LocalizedText;
  summary: LocalizedText;
  highlights: {
    km: string[];
    en: string[];
  };
}

export type ProjectCategory = 'web' | 'design' | 'systems';

export interface ProjectItem {
  id: string;
  title: LocalizedText;
  category: ProjectCategory;
  year: string;
  role: LocalizedText;
  stack: string;
  summary: LocalizedText;
  description: LocalizedText;
  outcome: LocalizedText;
  imageUrl: string;
  liveUrl: string;
  repoUrl: string;
}

export interface SkillEntry {
  name: string;
  level: LocalizedText;
  years: string;
  proficiency: number; // 1 to 100
}

export interface SkillGroup {
  id: string;
  title: LocalizedText;
  items: SkillEntry[];
}

export interface CVHighlightStat {
  value: string;
  label: LocalizedText;
}

export interface CVProfile {
  fullName: LocalizedText;
  brandWordmark: LocalizedText;
  headline: LocalizedText;
  tagline: LocalizedText;
  portraitUrl: string;
  highlights: CVHighlightStat[];
  contact: ContactInfo;
  about: {
    summary: LocalizedText;
    philosophy: LocalizedText;
    languagesSpoken: LocalizedText;
    interests: LocalizedText;
  };
  study: StudyItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillGroup[];
}
