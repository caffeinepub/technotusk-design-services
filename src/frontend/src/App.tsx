import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  ChevronRight,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Phone,
  Shield,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ProjectType } from "./backend.d";
import { useSubmitInquiry } from "./hooks/useQueries";
import { generateUUID } from "./utils/uuid";

// ─── Fade-in section wrapper ─────────────────────────────────────────────────
function FadeInSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <span
      ref={ref}
      className="stat-counter text-5xl md:text-6xl text-brand-orange"
    >
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "Why Us", href: "#why-us" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-nav shadow-deep" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3"
          >
            <img
              src="/assets/generated/technotusk-logo-transparent.dim_400x120.png"
              alt="Technotusk Design Services"
              className="h-12 w-auto object-contain"
            />
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm font-semibold uppercase tracking-widest text-foreground/70 hover:text-brand-orange transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => scrollTo("#contact")}
              className="btn-primary text-xs"
            >
              Get a Quote
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-20 left-0 right-0 z-40 glass-nav overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left text-lg font-semibold uppercase tracking-widest text-foreground/80 hover:text-brand-orange transition-colors py-2 border-b border-border/30"
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => scrollTo("#contact")}
                className="btn-primary mt-2 w-full justify-center"
              >
                Get a Free Quote
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-steel-construction.dim_1600x900.jpg')",
        }}
      />
      {/* Multi-layer overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      {/* Steel grid texture overlay */}
      <div className="absolute inset-0 steel-grid opacity-30" />

      {/* Orange accent stripe */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-orange" />

      <div className="container mx-auto px-6 relative z-10 pt-24">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] border border-brand-orange/50 text-brand-orange bg-brand-orange/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
            Structural Steel Detailing Experts
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="heading-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-6"
          >
            Designing
            <br />
            <span className="text-brand-orange">Trust</span>
            <br />
            <span className="text-foreground/80">in Every Beam</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg md:text-xl text-foreground/70 max-w-xl mb-10 leading-relaxed"
          >
            Accurate, code-compliant structural steel detailing — trusted by
            fabricators, engineers & architects across the US.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-wrap gap-4"
          >
            <button
              type="button"
              onClick={() => scrollTo("#contact")}
              className="btn-primary text-sm"
            >
              Get a Free Quote
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => scrollTo("#services")}
              className="btn-secondary text-sm"
            >
              View Our Work
            </button>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="flex flex-wrap gap-3 mt-12"
          >
            {[
              "Tekla Certified",
              "AISC / CISC / Eurocode",
              "Fast Turnaround",
              "Shop Drawings",
            ].map((pill) => (
              <span
                key={pill}
                className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-foreground/5 border border-foreground/15 text-foreground/60"
              >
                {pill}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-foreground/40 uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.4,
            ease: "easeInOut",
          }}
          className="w-px h-10 bg-gradient-to-b from-brand-orange to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: 500, suffix: "+", label: "Projects Completed" },
    { value: 10, suffix: "+", label: "Years of Experience" },
    { value: 3, suffix: "", label: "Continents Served" },
    { value: 100, suffix: "%", label: "Code Compliant" },
  ];

  return (
    <section className="relative bg-gradient-to-r from-brand-navy via-brand-navy-mid to-brand-navy py-16 overflow-hidden">
      {/* Decorative line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-30" />

      {/* Grid texture */}
      <div className="absolute inset-0 steel-grid opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <FadeInSection key={stat.label} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center gap-2 group">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <div className="w-8 h-0.5 bg-brand-orange/50 group-hover:w-12 transition-all duration-300" />
                <p className="text-sm md:text-base font-medium text-foreground/60 uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Services Section ─────────────────────────────────────────────────────────
function ServicesSection() {
  const services = [
    {
      name: "Commercial",
      description:
        "Warehouses, outdoor structures, malls, and large-scale commercial facilities requiring precision steel framing and detailed fabrication drawings.",
      image: "/assets/generated/service-commercial.dim_800x600.jpg",
      tags: ["Warehouses", "Retail", "Outdoor Structures"],
    },
    {
      name: "Residential",
      description:
        "Neighborhoods, multiple homes, and renovations. Precision detailing for residential steel structures of all scales and complexities.",
      image: "/assets/generated/service-residential.dim_800x600.jpg",
      tags: ["Homes", "Renovations", "Multi-Unit"],
    },
    {
      name: "Industrial",
      description:
        "Chemical plants, piping skids, mining towers — heavy industrial facilities demanding the highest accuracy and code compliance.",
      image: "/assets/generated/service-industrial.dim_800x600.jpg",
      tags: ["Chemical Plants", "Mining", "Piping Skids"],
    },
  ];

  return (
    <section
      id="services"
      className="section-padding bg-background relative overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 steel-grid opacity-15" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <FadeInSection className="mb-16 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-orange mb-4">
            <span className="w-6 h-px bg-brand-orange" />
            What We Deliver
          </span>
          <h2 className="heading-section text-4xl md:text-5xl text-foreground title-underline">
            Our Services
          </h2>
          <p className="mt-8 text-lg text-foreground/60 leading-relaxed">
            End-to-end structural steel detailing tailored for every project
            type — from concept to fabrication-ready drawings.
          </p>
        </FadeInSection>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <FadeInSection key={service.name} delay={i * 0.15}>
              <div className="group relative overflow-hidden h-[480px] md:h-[520px] cursor-pointer">
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${service.image}')` }}
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent" />

                {/* Orange accent top bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-brand-orange transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-brand-orange/20 text-brand-orange border border-brand-orange/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="heading-section text-3xl text-foreground mb-3 group-hover:text-brand-orange transition-colors duration-300">
                    {service.name}
                  </h3>
                  <p className="text-sm text-foreground/60 leading-relaxed mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Learn more */}
                  <div className="flex items-center gap-2 text-brand-orange text-sm font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    Learn More
                    <ChevronRight size={14} />
                  </div>
                </div>

                {/* Side accent */}
                <div className="absolute top-0 right-0 bottom-0 w-1 bg-brand-orange/0 group-hover:bg-brand-orange/60 transition-colors duration-500" />
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Choose Us ────────────────────────────────────────────────────────────
function WhyUs() {
  const features = [
    {
      icon: <Award className="w-7 h-7" />,
      title: "Tekla Expertise",
      description:
        "Proficient in Tekla Structures with AISC, CISC, and Eurocode compliance — industry-leading modeling precision.",
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Fast Turnaround",
      description:
        "Rapid delivery without sacrificing accuracy. We understand project timelines and consistently meet them.",
    },
    {
      icon: <FileText className="w-7 h-7" />,
      title: "Shop & Fabrication Drawings",
      description:
        "Complete fabrication-ready drawing packages — shop drawings, erection sets, and connection details.",
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Code-Compliant Precision",
      description:
        "Every drawing reviewed for code compliance. Your projects pass inspections the first time, every time.",
    },
  ];

  return (
    <section id="why-us" className="section-padding relative overflow-hidden">
      {/* Dark background with texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy-mid via-background to-brand-navy" />
      <div className="absolute inset-0 steel-grid opacity-20" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-orange/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-brand-orange/5 blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: heading */}
          <FadeInSection>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-orange mb-4">
              <span className="w-6 h-px bg-brand-orange" />
              Our Advantage
            </span>
            <h2 className="heading-section text-4xl md:text-5xl text-foreground mb-6 title-underline">
              Why Technotusk?
            </h2>
            <p className="text-lg text-foreground/60 leading-relaxed mt-8">
              We combine deep technical expertise with a relentless commitment
              to quality — delivering structural steel detailing that
              fabricators trust and engineers rely on.
            </p>

            {/* Visual metric */}
            <div className="mt-10 p-6 border border-brand-orange/20 bg-brand-orange/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-orange" />
              <p className="text-sm text-foreground/50 uppercase tracking-widest mb-1 font-semibold">
                Our Commitment
              </p>
              <p className="text-2xl font-bold text-foreground">
                "Quality, Timeliness,
                <br />
                and Precision in every project"
              </p>
            </div>
          </FadeInSection>

          {/* Right: feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature, i) => (
              <FadeInSection key={feature.title} delay={i * 0.1}>
                <div className="group p-6 border border-border/50 bg-card/50 hover:border-brand-orange/40 hover:bg-card transition-all duration-300 relative overflow-hidden">
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-brand-orange/0 group-hover:border-brand-orange/60 transition-all duration-300" />

                  <div className="w-12 h-12 flex items-center justify-center bg-brand-orange/10 border border-brand-orange/20 text-brand-orange mb-4 group-hover:bg-brand-orange/20 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-2 group-hover:text-brand-orange transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-foreground/55 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Quote Form ───────────────────────────────────────────────────────────────
function QuoteForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutate: submitInquiry, isPending } = useSubmitInquiry();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectType) {
      toast.error("Please select a project type.");
      return;
    }

    const id = generateUUID();

    submitInquiry(
      { id, name, email, projectType: projectType as ProjectType, message },
      {
        onSuccess: () => {
          setSubmitted(true);
          setName("");
          setEmail("");
          setProjectType("");
          setMessage("");
          toast.success(
            "Your inquiry was sent successfully! We'll be in touch soon.",
          );
        },
        onError: () => {
          toast.error(
            "Something went wrong. Please try again or email us directly.",
          );
        },
      },
    );
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-steel-construction.dim_1600x900.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
      <div className="absolute inset-0 steel-grid opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <FadeInSection>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-orange mb-4">
              <span className="w-6 h-px bg-brand-orange" />
              Start Your Project
            </span>
            <h2 className="heading-section text-4xl md:text-5xl text-foreground mb-6">
              Get a Free Quote
            </h2>
            <p className="text-lg text-foreground/60 leading-relaxed mb-10">
              Tell us about your project and we'll get back to you within 24
              hours with a detailed proposal.
            </p>

            {/* Contact info */}
            <div className="space-y-5">
              {[
                {
                  icon: <Phone size={18} />,
                  label: "Phone",
                  value: "+91-2079624076",
                  href: "tel:+912079624076",
                },
                {
                  icon: <Mail size={18} />,
                  label: "Email",
                  value: "services@technotusk.com",
                  href: "mailto:services@technotusk.com",
                },
                {
                  icon: <MapPin size={18} />,
                  label: "Address",
                  value:
                    "302, 29/7, NIBM Rd, Kondhwa, Pune, Maharashtra 411048",
                  href: null,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 flex items-center justify-center bg-brand-orange/10 border border-brand-orange/25 text-brand-orange shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 uppercase tracking-widest font-semibold mb-0.5">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm text-foreground/75 hover:text-brand-orange transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-foreground/75">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </FadeInSection>

          {/* Right: Form */}
          <FadeInSection delay={0.2}>
            <div className="relative bg-card/80 border border-border/60 p-8 md:p-10 backdrop-blur-sm">
              {/* Orange corner accent */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-brand-orange" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-brand-orange" />

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center gap-4"
                  >
                    <div className="w-16 h-16 flex items-center justify-center bg-brand-orange/20 border-2 border-brand-orange text-brand-orange text-3xl font-bold">
                      ✓
                    </div>
                    <h3 className="heading-section text-2xl text-foreground">
                      Inquiry Sent!
                    </h3>
                    <p className="text-foreground/60 max-w-xs">
                      We'll review your project details and get back to you
                      within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="btn-secondary text-xs mt-4"
                    >
                      Submit Another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="name"
                          className="text-xs uppercase tracking-widest text-foreground/50 font-semibold"
                        >
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Smith"
                          className="bg-background/60 border-border/60 focus:border-brand-orange focus-visible:ring-brand-orange/30 rounded-none h-11"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="email"
                          className="text-xs uppercase tracking-widest text-foreground/50 font-semibold"
                        >
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@company.com"
                          className="bg-background/60 border-border/60 focus:border-brand-orange focus-visible:ring-brand-orange/30 rounded-none h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="project-type"
                        className="text-xs uppercase tracking-widest text-foreground/50 font-semibold"
                      >
                        Project Type *
                      </Label>
                      <Select
                        value={projectType}
                        onValueChange={(v) => setProjectType(v as ProjectType)}
                      >
                        <SelectTrigger
                          id="project-type"
                          className="bg-background/60 border-border/60 focus:border-brand-orange rounded-none h-11 text-sm"
                        >
                          <SelectValue placeholder="Select project type..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-none bg-popover border-border">
                          <SelectItem value={ProjectType.commercial}>
                            Commercial
                          </SelectItem>
                          <SelectItem value={ProjectType.residential}>
                            Residential
                          </SelectItem>
                          <SelectItem value={ProjectType.industrial}>
                            Industrial
                          </SelectItem>
                          <SelectItem value={ProjectType.other}>
                            Other
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="message"
                        className="text-xs uppercase tracking-widest text-foreground/50 font-semibold"
                      >
                        Project Details *
                      </Label>
                      <Textarea
                        id="message"
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your project scope, timeline, and any special requirements..."
                        rows={5}
                        className="bg-background/60 border-border/60 focus:border-brand-orange focus-visible:ring-brand-orange/30 rounded-none resize-none text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="btn-primary w-full justify-center text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Inquiry
                          <ChevronRight size={16} />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-center text-foreground/35">
                      We respond within 24 hours. No spam, ever.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}

// ─── About / Credentials Strip ────────────────────────────────────────────────
function AboutStrip() {
  return (
    <section
      id="about"
      className="py-16 bg-brand-navy-mid relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/40 to-transparent" />
      <div className="absolute inset-0 steel-grid opacity-15" />

      <div className="container mx-auto px-6 relative z-10">
        <FadeInSection>
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="heading-section text-2xl md:text-3xl text-foreground mb-3">
                Trusted Across{" "}
                <span className="text-brand-orange">3 Continents</span>
              </h3>
              <p className="text-foreground/60 text-base leading-relaxed">
                From Pune to North America, our Tekla-certified team delivers
                fabrication-ready structural steel drawings that meet AISC,
                CISC, and Eurocode standards — on time, every time.
              </p>
            </div>

            {/* Standards badges */}
            <div className="flex flex-wrap gap-4">
              {["AISC", "CISC", "Eurocode", "Tekla"].map((std) => (
                <div
                  key={std}
                  className="px-6 py-3 border border-brand-orange/30 bg-brand-orange/10 text-brand-orange font-bold text-sm tracking-widest uppercase"
                >
                  {std}
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent" />
      <div className="absolute inset-0 steel-grid opacity-10" />

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand column */}
          <div>
            <img
              src="/assets/generated/technotusk-logo-transparent.dim_400x120.png"
              alt="Technotusk Design Services"
              className="h-12 w-auto object-contain mb-4"
            />
            <p className="text-sm text-foreground/50 leading-relaxed max-w-xs mt-2">
              Quality, Timeliness, and Precision in every project. Your trusted
              partner for structural steel detailing.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange mb-5">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Services", href: "#services" },
                { label: "Why Us", href: "#why-us" },
                { label: "About", href: "#about" },
                { label: "Get a Quote", href: "#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-foreground/55 hover:text-brand-orange transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange mb-5">
              Head Office
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-foreground/55">
                <MapPin
                  size={15}
                  className="text-brand-orange shrink-0 mt-0.5"
                />
                302, 29/7, NIBM Rd, Kondhwa, Pune, Maharashtra 411048
              </li>
              <li>
                <a
                  href="tel:+912079624076"
                  className="flex items-center gap-3 text-sm text-foreground/55 hover:text-brand-orange transition-colors"
                >
                  <Phone size={15} className="text-brand-orange" />
                  +91-2079624076
                </a>
              </li>
              <li>
                <a
                  href="mailto:services@technotusk.com"
                  className="flex items-center gap-3 text-sm text-foreground/55 hover:text-brand-orange transition-colors"
                >
                  <Mail size={15} className="text-brand-orange" />
                  services@technotusk.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-foreground/35">
            © {year} Technotusk Design Services. All rights reserved.
          </p>
          <p className="text-xs text-foreground/30">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-orange transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Toaster position="top-right" theme="dark" />
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <ServicesSection />
        <WhyUs />
        <AboutStrip />
        <QuoteForm />
      </main>
      <Footer />
    </div>
  );
}
