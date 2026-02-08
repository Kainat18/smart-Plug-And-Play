import type { DemoMode } from "./DemoControlBar";
import heroImage from "@/assets/hero-monitor.jpg";
import { motion, AnimatePresence } from "framer-motion";

interface HeroContent {
  headline: string;
  subheadline: string;
  cta: string;
  badges: string[];
}

const heroVariants: Record<DemoMode, HeroContent> = {
  default: {
    headline: "Premium Displays for Professionals",
    subheadline: "Experience stunning clarity and color accuracy with UltraView monitors, designed for creators, gamers, and professionals.",
    cta: "Shop Now",
    badges: ["4K Ultra HD", "HDR 600", "USB-C Connectivity"],
  },
  gaming: {
    headline: "Dominate Every Frame",
    subheadline: "Ultra-fast 240Hz refresh rate with 1ms response time. Built for competitive gamers who demand victory.",
    cta: "Shop Gaming Monitors",
    badges: ["240Hz Refresh", "1ms Response", "G-Sync Compatible"],
  },
  professional: {
    headline: "Precision Color for Creators",
    subheadline: "100% sRGB and DCI-P3 coverage with factory-calibrated accuracy. Your vision, perfectly displayed.",
    cta: "Explore Pro Displays",
    badges: ["100% sRGB", "Factory Calibrated", "USB-C Hub"],
  },
  budget: {
    headline: "Quality Displays, Smart Prices",
    subheadline: "Get premium features without the premium price tag. UltraView Budget series starts at just $199.",
    cta: "See Deals",
    badges: ["Starting at $199", "Free Shipping", "3-Year Warranty"],
  },
};

interface HeroSectionProps {
  mode: DemoMode;
}

const HeroSection = ({ mode }: HeroSectionProps) => {
  const content = heroVariants[mode];

  return (
    <section id="hero-container" className="relative w-full h-[720px] overflow-hidden">
      {/* Background image */}
      <img
        id="hero-image"
        src="/images/hero-monitor.jpg"
        alt="UltraView premium monitor display"
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />

      {/* Dark overlay — balanced for image visibility + text readability */}
      <div className="absolute inset-0 bg-background/40" />
      <div className="absolute inset-0 hero-overlay" />

      {/* Soft ambient glow */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[160px]" />
      <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-accent/[0.03] rounded-full blur-[160px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-block text-primary text-[11px] font-semibold tracking-[0.3em] uppercase mb-8 px-5 py-2 rounded-full border border-primary/15 bg-primary/[0.06]"
            >
              UltraView Monitors
            </motion.span>

            <h1
              id="hero-headline"
              className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground mb-6 max-w-4xl leading-[1.08] tracking-tight"
            >
              {content.headline}
            </h1>

            <p
              id="hero-subheadline"
              className="text-base sm:text-lg text-muted-foreground mb-12 max-w-xl leading-relaxed"
            >
              {content.subheadline}
            </p>

            <motion.button
              id="hero-cta"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary text-primary-foreground px-10 py-4 rounded-xl text-base font-bold mb-12 transition-all duration-300 hover:shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.5)]"
            >
              {content.cta}
            </motion.button>

            <div
              id="hero-badges"
              className="flex flex-wrap justify-center gap-3"
            >
              {content.badges.map((badge, i) => (
                <motion.span
                  key={badge}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                  className="glass-dark text-foreground/60 px-5 py-2 rounded-full text-sm font-medium"
                >
                  {badge}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;


