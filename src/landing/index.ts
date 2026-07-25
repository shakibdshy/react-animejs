export { LandingPage } from "./components/templates/landing-page";

export { Btn } from "./components/ui/btn";
export { SectionLabel } from "./components/ui/section-label";
export { SectionHeading } from "./components/ui/section-heading";
export { SectionDescription } from "./components/ui/section-description";
export { SectionHeader } from "./components/ui/section-header";
export { BackToTop } from "./components/ui/back-to-top";
export { LandingContainer } from "./components/ui/landing-container";
export { CodeBlock } from "./components/ui/code-block";
export { ScrollIndicator } from "./components/ui/scroll-indicator";
export { ErrorBoundary } from "./components/ui/error-boundary";

export { FeatureCard } from "./components/base/feature-card";
export { DemoBox } from "./components/base/demo-box";
export { DemoCard } from "./components/base/demo-card";
export { TestimonialCard } from "./components/base/testimonial-card";
export { MagneticArea } from "./components/base/magnetic-area";
export { DemoBtn } from "./components/base/demo-btn";

export { LandingHeader } from "./components/containers/landing-header";
export { HeroSection } from "./components/containers/hero-section";
export { MarqueeSection } from "./components/containers/marquee-section";
export { FeaturesSection } from "./components/containers/features-section";
export { DemosSection } from "./components/containers/demos-section";
export { CodeShowcaseSection } from "./components/containers/code-showcase-section";
export { StatsSection } from "./components/containers/stats-section";
export { TestimonialsSection } from "./components/containers/testimonials-section";
export { CtaSection } from "./components/containers/cta-section";
export { FooterSection } from "./components/containers/footer-section";

export { useScrollReveal } from "./hooks/use-scroll-reveal";
export { useMagnetic } from "./hooks/use-magnetic";
export { useCopyToClipboard } from "./hooks/use-copy-to-clipboard";

export { cn } from "./utils/cn";
export {
  revealFromBelow,
  revealFromBelowSmall,
  heroCharReveal,
  fadeInDelay,
  staggerFadeInUp,
} from "./utils/landing-animations";

export type {
  LandingBaseProps,
  LandingContainerProps,
  SectionMeta,
  FeatureItem,
  TestimonialItem,
  CodeSnippet,
  NavItem,
  FooterColumn,
  HeroProps,
  DemoBoxVariant,
  MagneticAreaProps,
  CodeBlockProps,
  CopyToClipboardResult,
  ScrollRevealOptions,
  ThemeContextValue,
} from "./types";
