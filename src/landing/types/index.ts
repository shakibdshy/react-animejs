import type { ReactNode } from "react";

export interface LandingBaseProps {
  className?: string;
  children?: ReactNode;
}

export interface LandingContainerProps extends LandingBaseProps {
  as?: "div" | "section" | "footer";
  id?: string;
}

export interface SectionMeta {
  label: string;
  title: string;
  description?: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface TestimonialItem {
  text: string;
  authorInitials: string;
  authorName: string;
  authorRole: string;
}

export interface CodeSnippet {
  language: string;
  title: string;
  code: ReactNode;
  rawText?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: NavItem[];
}

export interface HeroProps {
  eyebrow: string;
  words: string[];
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export interface DemoBoxVariant {
  size?: "sm" | "md" | "lg";
  outline?: boolean;
  muted?: boolean;
}

export interface MagneticAreaProps {
  strength?: number;
  radius?: number;
}

export interface CodeBlockProps {
  language: string;
  title: string;
  children: ReactNode;
  rawText?: string;
}

export interface CopyToClipboardResult {
  copied: boolean;
  copy: (text: string) => Promise<void>;
}

export interface ScrollRevealOptions {
  threshold?: number;
  delay?: number;
}

export interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}
