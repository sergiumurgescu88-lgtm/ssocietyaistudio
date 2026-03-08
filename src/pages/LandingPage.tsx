import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Mic, Video, Image, Music, FileText, Bot, BarChart3, Users, Shield,
  ChevronRight, Check, X, Star, Play, Menu, XIcon, ArrowRight,
  Zap, Clock, Globe, Mail, Phone, MapPin, ChevronDown,
  Twitter, Linkedin, Youtube, Github, MessageCircle,
  Sparkles, Target, TrendingUp, Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// ─── Fade-in wrapper ───
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── 1. NAVIGATION ───
const Navigation = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { label: "Features", id: "features" },
    { label: "Pricing", id: "pricing" },
    { label: "Use Cases", id: "usecases" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-primary-foreground text-lg font-['Montserrat']">S</div>
          <span className="font-['Montserrat'] font-bold text-lg text-foreground">SSociety AI Studio</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium story-link">
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate("/login")} className="text-muted-foreground hover:text-foreground">Sign In</Button>
          <Button onClick={() => navigate("/login")} className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90">
            Get Started Free <ArrowRight className="ml-1 w-4 h-4" />
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-4 pb-4 space-y-3">
          {links.map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className="block w-full text-left text-muted-foreground hover:text-foreground py-2">{l.label}</button>
          ))}
          <Button onClick={() => navigate("/login")} className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground">Get Started Free</Button>
        </motion.div>
      )}
    </nav>
  );
};

// ─── 2. HERO ───
const Hero = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const badges = [
    "10-Step Wizard", "AI Script Gen", "Auto-Posting",
    "Kie.ai Video", "Multi-Platform", "Real-Time Analytics"
  ];

  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Rocket className="w-4 h-4" /> AI-Powered Content Factory
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-extrabold font-['Montserrat'] leading-tight mb-6"
        >
          Create, Publish & Track{" "}
          <span className="gradient-text">Marketing Content</span>{" "}
          Automatically
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          From idea to published across all platforms in 15 minutes. AI scripts, professional video, auto-posting — all in one studio.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto mb-8"
        >
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            type="email"
            className="h-12 bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
          <Button
            onClick={() => navigate("/login")}
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold hover:opacity-90 h-12 px-8 whitespace-nowrap"
          >
            Start Free <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {badges.map(b => (
            <span key={b} className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-secondary" /> {b}
            </span>
          ))}
        </motion.div>

        {/* Animated flow preview - all 10 steps visible */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="glass rounded-2xl p-8 max-w-5xl mx-auto"
        >
          <p className="text-xs text-muted-foreground text-center mb-6 uppercase tracking-widest font-semibold">Your Content Pipeline — 10 Steps, Full Control</p>
          <div className="grid grid-cols-5 gap-y-6 gap-x-0 items-center">
            {[
              { label: "Input", icon: "🔗", desc: "Enter URL" },
              { label: "Script", icon: "📝", desc: "AI generates" },
              { label: "Audio", icon: "🎙️", desc: "TTS voices" },
              { label: "Thumbnail", icon: "🎨", desc: "3 variations" },
              { label: "Video", icon: "🎬", desc: "Kie.ai render" },
              { label: "SEO", icon: "🔍", desc: "Optimize" },
              { label: "Social", icon: "📱", desc: "Captions" },
              { label: "Review", icon: "👁️", desc: "Preview all" },
              { label: "Publish", icon: "🚀", desc: "Auto-post" },
              { label: "Track", icon: "📊", desc: "Analytics" },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center justify-center">
                <div className="flex items-center gap-1">
                  {/* Step card */}
                  <div className="flex flex-col items-center gap-1.5 group">
                    <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-sm transition-transform group-hover:scale-110 ${
                      i < 5 ? "bg-primary/20 text-primary border border-primary/30" : i < 8 ? "bg-secondary/20 text-secondary border border-secondary/30" : "bg-accent/20 text-accent border border-accent/30"
                    }`}>
                      <span className="text-base leading-none">{step.icon}</span>
                      <span className="text-[10px] font-bold leading-none mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <span className="text-xs font-semibold text-foreground">{step.label}</span>
                    <span className="text-[10px] text-muted-foreground">{step.desc}</span>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <Check className="w-3 h-3 text-secondary" />
                      <span className="text-[9px] text-secondary font-medium">Confirm</span>
                    </div>
                  </div>

                  {/* Arrow between steps (not after last in row or last overall) */}
                  {i !== 4 && i !== 9 && (
                    <ArrowRight className={`w-4 h-4 mx-1 shrink-0 ${i < 5 ? "text-primary/50" : i < 8 ? "text-secondary/50" : "text-accent/50"}`} />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary/40" /> Steps 1-5: Creation</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary/40" /> Steps 6-8: Optimization</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-accent/40" /> Steps 9-10: Distribution</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-8 flex items-center justify-center gap-1">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
          <span className="text-muted-foreground text-sm ml-2">4.9/5 from 500+ creators</span>
        </motion.div>
      </div>
    </section>
  );
};

// ─── 3. TRUST BADGES ───
const TrustBadges = () => {
  const brands = ["Google Gemini", "Firebase", "Kie.ai", "Botato", "YouTube", "Meta", "TikTok", "LinkedIn"];
  return (
    <section className="py-12 border-y border-border/50 overflow-hidden">
      <p className="text-center text-muted-foreground text-sm mb-8">Powered by Industry-Leading AI & Automation</p>
      <div className="flex animate-[scroll_20s_linear_infinite] whitespace-nowrap">
        {[...brands, ...brands].map((b, i) => (
          <span key={i} className="inline-block mx-8 text-muted-foreground/50 hover:text-foreground transition-colors text-lg font-semibold font-['Montserrat'] cursor-default">{b}</span>
        ))}
      </div>
    </section>
  );
};

// ─── 4. PROBLEM / SOLUTION ───
const ProblemSolution = () => {
  const comparisons = [
    { before: "40 hours/week writing scripts", after: "2 hours/week — AI generates" },
    { before: "$5,000+ video production", after: "€49/month unlimited" },
    { before: "7 platforms, manual posting", after: "1 click, auto-post all" },
    { before: "Guessing analytics", after: "Real-time insights" },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Montserrat'] text-center mb-4">
            The Content Creation <span className="gradient-text">Problem</span>
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">See how SSociety transforms your workflow</p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6">
          <FadeIn delay={0.1}>
            <div className="glass rounded-2xl p-8 border-destructive/20">
              <h3 className="text-destructive font-bold text-lg mb-6 flex items-center gap-2"><X className="w-5 h-5" /> BEFORE</h3>
              <div className="space-y-4">
                {comparisons.map((c, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{c.before}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="glass rounded-2xl p-8 border-secondary/20 glow-success">
              <h3 className="text-secondary font-bold text-lg mb-6 flex items-center gap-2"><Check className="w-5 h-5" /> AFTER</h3>
              <div className="space-y-4">
                {comparisons.map((c, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-foreground">{c.after}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// ─── 5. FEATURES GRID ───
const features = [
  { icon: Mic, title: "AI Scripts", desc: "Podcast-style 2-speaker scripts powered by Gemini AI", color: "primary" },
  { icon: Video, title: "Kie.ai Video", desc: "Professional video generation in 16:9 and 9:16 formats", color: "secondary" },
  { icon: Image, title: "Thumbnails", desc: "AI-generated thumbnails with 3 variations per project", color: "primary" },
  { icon: Music, title: "Google TTS", desc: "Natural multi-speaker voices at 48kHz studio quality", color: "secondary" },
  { icon: FileText, title: "SEO Content", desc: "YouTube descriptions, blog posts, social captions & email sequences", color: "primary" },
  { icon: Bot, title: "Botato Auto-Post", desc: "Automated publishing to 7+ platforms on schedule", color: "secondary" },
  { icon: BarChart3, title: "Analytics", desc: "Real-time dashboards with ROI tracking across platforms", color: "primary" },
  { icon: Users, title: "Team Collab", desc: "Multi-user workspaces with approval workflows", color: "secondary" },
  { icon: Shield, title: "Enterprise Security", desc: "SOC 2 ready, GDPR compliant, SSO support", color: "primary" },
];

const FeaturesGrid = () => (
  <section id="features" className="py-24 px-4">
    <div className="max-w-6xl mx-auto">
      <FadeIn>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-['Montserrat'] text-center mb-4">
          Everything You Need in <span className="gradient-text">One Platform</span>
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">25+ features designed to automate your entire content pipeline</p>
      </FadeIn>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <FadeIn key={f.title} delay={i * 0.05}>
            <div className="glass rounded-2xl p-6 hover:scale-[1.03] transition-transform duration-300 group cursor-default h-full">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color === "primary" ? "bg-primary/15 text-primary" : "bg-secondary/15 text-secondary"} group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-foreground mb-2 font-['Montserrat']">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// ─── 6. HOW IT WORKS ───
const steps = [
  { num: "01", label: "Input", desc: "Enter your product URL or description" },
  { num: "02", label: "Script", desc: "AI generates podcast-style script" },
  { num: "03", label: "Audio", desc: "Google TTS creates natural voiceover" },
  { num: "04", label: "Thumbnail", desc: "AI designs 3 thumbnail variations" },
  { num: "05", label: "Video", desc: "Kie.ai produces professional video" },
  { num: "06", label: "SEO", desc: "Optimized descriptions & metadata" },
  { num: "07", label: "Social", desc: "Platform-specific captions generated" },
  { num: "08", label: "Review", desc: "Preview and edit before publishing" },
  { num: "09", label: "Publish", desc: "Auto-post to 7+ platforms" },
  { num: "10", label: "Track", desc: "Monitor real-time performance" },
];

const HowItWorks = () => (
  <section className="py-24 px-4 bg-card/30">
    <div className="max-w-6xl mx-auto">
      <FadeIn>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-['Montserrat'] text-center mb-4">
          From Idea to Published in <span className="gradient-text">10 Steps</span>
        </h2>
        <p className="text-center text-muted-foreground mb-16">Average time: 15 minutes from start to published</p>
      </FadeIn>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {steps.map((s, i) => (
          <FadeIn key={s.num} delay={i * 0.05}>
            <div className="glass rounded-xl p-4 text-center hover:glow-primary transition-all duration-300 group cursor-default">
              <div className="text-2xl font-extrabold font-['Montserrat'] gradient-text mb-2">{s.num}</div>
              <div className="font-semibold text-foreground text-sm mb-1">{s.label}</div>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={0.5}>
        <div className="mt-10 flex items-center justify-center gap-2 text-muted-foreground">
          <Clock className="w-5 h-5 text-secondary" />
          <span className="text-sm">⏱️ Average time: <strong className="text-foreground">15 minutes</strong> from start to published</span>
        </div>
      </FadeIn>
    </div>
  </section>
);

// ─── 7. LIVE DEMO ───
const LiveDemo = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Montserrat'] mb-4">
            See It <span className="gradient-text">In Action</span>
          </h2>
          <p className="text-muted-foreground mb-12">Watch how SSociety transforms a simple URL into a full marketing campaign</p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="glass rounded-2xl p-8 lg:p-12 relative overflow-hidden group cursor-pointer" onClick={() => navigate("/login")}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-10 h-10 text-primary ml-1" />
              </div>
              <h3 className="font-bold text-xl text-foreground mb-2 font-['Montserrat']">Interactive Demo</h3>
              <p className="text-muted-foreground mb-6">Enter a product URL → Watch AI generate a full campaign in real-time</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                  Try Interactive Demo <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground">
                  <Play className="mr-2 w-4 h-4" /> Watch Video Tour (2 min)
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

// ─── 8. USE CASES ───
const useCases = [
  {
    tab: "Marketing", icon: Target,
    title: "Marketing Teams",
    quote: "Create 10x more content with the same team size",
    items: ["Product launch videos", "Social media campaigns", "Email video content", "Ad variations for A/B testing"],
  },
  {
    tab: "E-commerce", icon: Globe,
    title: "E-commerce Brands",
    quote: "Turn product listings into viral video content",
    items: ["Product demo videos", "Unboxing style content", "Platform-specific ads", "Seasonal campaigns"],
  },
  {
    tab: "SaaS", icon: Zap,
    title: "SaaS Companies",
    quote: "Scale content marketing without scaling your team",
    items: ["Feature announcement videos", "Tutorial content", "Customer testimonials", "Release notes videos"],
  },
  {
    tab: "Agency", icon: TrendingUp,
    title: "Digital Agencies",
    quote: "Deliver 5x more client content in half the time",
    items: ["Multi-client campaigns", "White-label content", "Social media management", "Performance reporting"],
  },
];

const UseCases = () => {
  const [active, setActive] = useState(0);
  const uc = useCases[active];
  return (
    <section id="usecases" className="py-24 px-4 bg-card/30">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Montserrat'] text-center mb-4">
            Built for <span className="gradient-text">Every Industry</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12">See how teams like yours are using SSociety</p>
        </FadeIn>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {useCases.map((u, i) => (
            <button
              key={u.tab}
              onClick={() => setActive(i)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${i === active ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"}`}
            >
              {u.tab}
            </button>
          ))}
        </div>

        <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary"><uc.icon className="w-5 h-5" /></div>
            <h3 className="font-bold text-xl text-foreground font-['Montserrat']">{uc.title}</h3>
          </div>
          <p className="text-muted-foreground italic mb-6">"{uc.quote}"</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {uc.items.map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-secondary shrink-0" /> {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── 9. PRICING ───
const plans = [
  {
    name: "Free", icon: "🆓", price: "€0", period: "/month",
    features: ["1 project", "Basic features", "Watermark on video", "Community support"],
    cta: "Get Started", highlight: false,
  },
  {
    name: "Pro", icon: "⭐", price: "€49", period: "/month",
    features: ["10 projects", "All features", "No watermark", "Priority support", "Analytics dashboard", "Custom voices"],
    cta: "Start Free Trial", highlight: true,
  },
  {
    name: "Enterprise", icon: "🏢", price: "€199", period: "/month",
    features: ["Unlimited projects", "White-label", "API access", "Dedicated manager", "SSO & SAML", "Custom integrations"],
    cta: "Contact Us", highlight: false,
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Montserrat'] text-center mb-4">
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="text-center text-muted-foreground mb-8">Start free, scale as you grow</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex items-center justify-center gap-3 mb-12">
            <span className={`text-sm ${!annual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
            <button onClick={() => setAnnual(!annual)} className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-primary" : "bg-muted"}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${annual ? "left-6" : "left-0.5"}`} />
            </button>
            <span className={`text-sm ${annual ? "text-foreground" : "text-muted-foreground"}`}>Annual <span className="text-secondary text-xs font-semibold">Save 20%</span></span>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.1}>
              <div className={`glass rounded-2xl p-8 relative h-full flex flex-col ${plan.highlight ? "ring-2 ring-primary glow-primary scale-[1.02]" : ""}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">Most Popular</div>
                )}
                <div className="text-2xl mb-2">{plan.icon}</div>
                <h3 className="font-bold text-xl text-foreground font-['Montserrat'] mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold font-['Montserrat'] text-foreground">
                    {annual ? `€${Math.round(parseInt(plan.price.replace("€", "")) * 0.8)}` : plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <div className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-secondary shrink-0" /> {f}
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => navigate("/login")}
                  className={`w-full ${plan.highlight ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground" : ""}`}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-secondary" /> 14-day free trial</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-secondary" /> Cancel anytime</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-secondary" /> No credit card required</span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

// ─── 10. TESTIMONIALS ───
const testimonials = [
  {
    quote: "SSociety AI Studio cut our content production time by 80%. We now publish 5x more videos per week.",
    name: "Maria Popescu",
    role: "Marketing Director @ TechStart",
    stars: 5,
  },
  {
    quote: "The Kie.ai integration is a game-changer. Video quality is professional-grade, and auto-posting saves us hours every week.",
    name: "Andrei Ionescu",
    role: "Agency Owner @ DigitalPro",
    stars: 5,
  },
  {
    quote: "We went from creating 2 videos a month to 20. The ROI is incredible — our leads tripled in the first quarter.",
    name: "Elena Dumitrescu",
    role: "CEO @ GrowthHack Studio",
    stars: 5,
  },
];

const Testimonials = () => (
  <section className="py-24 px-4 bg-card/30">
    <div className="max-w-6xl mx-auto">
      <FadeIn>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-['Montserrat'] text-center mb-4">
          Loved by <span className="gradient-text">500+ Creators</span>
        </h2>
        <p className="text-center text-muted-foreground mb-16">See what content creators and marketing teams are saying</p>
      </FadeIn>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <FadeIn key={t.name} delay={i * 0.1}>
            <div className="glass rounded-2xl p-6 h-full flex flex-col">
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.stars)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-foreground mb-6 flex-1 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// ─── 11. FAQ ───
const faqs = [
  { q: "How does the 14-day free trial work?", a: "Sign up for free — no credit card required. You get full access to all Pro features for 14 days. After the trial, choose the plan that fits your needs or continue with our free tier." },
  { q: "Is my data secure?", a: "Absolutely. We use enterprise-grade encryption, SOC 2 compliance standards, and GDPR-compliant data handling. Your content and data are yours — we never share it with third parties." },
  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time with no penalties. You'll continue to have access until the end of your billing period." },
  { q: "What platforms do you support?", a: "SSociety publishes to YouTube, Facebook, Instagram, TikTok, LinkedIn, Twitter/X, and more via our Botato integration. We're constantly adding new platforms." },
  { q: "How does the Kie.ai video generation work?", a: "Kie.ai transforms your AI-generated script and audio into professional-quality video. Choose between landscape (16:9) or portrait (9:16) formats optimized for each platform." },
  { q: "Can I customize the AI script voices?", a: "Yes! You can set custom speaker names, choose voice styles, and adjust the script tone. Our Google TTS integration supports multiple languages and natural-sounding voices." },
  { q: "What happens if I exceed my plan limits?", a: "We'll notify you before you hit your limit. You can upgrade your plan anytime, or wait for the next billing cycle. We never charge overage fees without your consent." },
];

const FAQ = () => (
  <section id="faq" className="py-24 px-4">
    <div className="max-w-3xl mx-auto">
      <FadeIn>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-['Montserrat'] text-center mb-4">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12">Everything you need to know to get started</p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="glass rounded-xl border-none px-6">
              <AccordionTrigger className="text-foreground font-medium text-left hover:no-underline py-5">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </FadeIn>
    </div>
  </section>
);

// ─── 12. FINAL CTA ───
const FinalCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Montserrat'] mb-4">
            Ready to Transform Your <span className="gradient-text">Content?</span>
          </h2>
          <p className="text-muted-foreground mb-10">Join 500+ creators automating their marketing with AI</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto mb-8">
            <Input placeholder="Enter your email" type="email" className="h-12 bg-card border-border text-foreground placeholder:text-muted-foreground" />
            <Button onClick={() => navigate("/login")} size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold h-12 px-8 whitespace-nowrap">
              Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-secondary" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-secondary" /> Cancel anytime</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-secondary" /> 24/7 support</span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

// ─── 13. FOOTER ───
const Footer = () => (
  <footer className="border-t border-border py-16 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-primary-foreground text-lg font-['Montserrat']">S</div>
            <span className="font-['Montserrat'] font-bold text-lg text-foreground">SSociety AI Studio</span>
          </div>
          <p className="text-muted-foreground text-sm mb-4 max-w-xs">Automate Your Content. Scale Your Business. The complete AI content factory.</p>
          <div className="flex items-center gap-3">
            {[Twitter, Linkedin, Youtube, Github, MessageCircle].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: "Product", links: ["Features", "Pricing", "Use Cases", "Changelog"] },
          { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
          { title: "Resources", links: ["Blog", "Help Center", "API Docs", "Community"] },
        ].map(col => (
          <div key={col.title}>
            <h4 className="font-semibold text-foreground mb-4 text-sm">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map(link => (
                <li key={link}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} SSociety AI Studio. All rights reserved.</span>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">GDPR</a>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> sergiusociety@gmail.com</span>
          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +40 768 676 141</span>
        </div>
      </div>

      <div className="border-t border-border mt-8 pt-6 text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          Powered by{" "}
          <a href="https://ssociety.eu" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-foreground transition-colors font-medium">ssociety.eu</a>
          {" "}· SSocietyHUB
        </p>
        <div className="text-[11px] text-muted-foreground/70 space-y-0.5">
          <p className="font-medium text-muted-foreground/80">MURSE ADVERTISING S.R.L.</p>
          <p>CUI: 44923890 · J40/16148/2021 · EUID: ROONRC.J40/16148/2021</p>
          <p>Înființată: 17.09.2021</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Made with ❤️ in Romania</p>
      </div>
    </div>
  </footer>
);

// ─── MAIN PAGE ───
const LandingPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navigation />
    <Hero />
    <TrustBadges />
    <ProblemSolution />
    <FeaturesGrid />
    <HowItWorks />
    <LiveDemo />
    <UseCases />
    <Pricing />
    <Testimonials />
    <FAQ />
    <FinalCTA />
    <Footer />
  </div>
);

export default LandingPage;
