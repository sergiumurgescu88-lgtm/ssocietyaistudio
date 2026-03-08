import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, Mic2, Headphones, Image, Video,
  Search, Share2, CheckCircle2, Rocket, ArrowLeft, ArrowRight,
  Check, RefreshCw, Edit3, Sparkles, Globe, Tag, Users, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const steps = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: FileText, label: "Tool Input" },
  { icon: Mic2, label: "Script" },
  { icon: Headphones, label: "Audio" },
  { icon: Image, label: "Thumbnail" },
  { icon: Video, label: "Video" },
  { icon: Search, label: "SEO" },
  { icon: Share2, label: "Social" },
  { icon: CheckCircle2, label: "Review" },
  { icon: Rocket, label: "Publish" },
];

/* ─────── Step 1: Overview ─────── */
function StepOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-xl font-bold text-foreground mb-1">Project Setup</h3>
        <p className="text-sm text-muted-foreground">Define your project basics. Everything starts here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Project Name *</label>
            <Input placeholder="e.g., AI Automation Tool Launch" className="bg-muted border-border h-11" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Category</label>
            <select className="w-full h-11 rounded-lg bg-muted border border-border px-3 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-shadow">
              <option>SaaS Product</option>
              <option>E-commerce</option>
              <option>Personal Brand</option>
              <option>Agency</option>
              <option>AI/Tech Tool</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Content Type</label>
            <select className="w-full h-11 rounded-lg bg-muted border border-border px-3 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-shadow">
              <option>Full Suite (Podcast + Video + Social)</option>
              <option>Podcast Only</option>
              <option>Video Only</option>
              <option>Social Content Only</option>
            </select>
          </div>
        </div>

        <div className="glass rounded-lg p-5 space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> Target Platforms
          </h4>
          <div className="flex flex-wrap gap-2">
            {["YouTube", "TikTok", "Instagram", "LinkedIn", "Facebook", "Twitter/X", "Pinterest"].map((p) => (
              <Badge
                key={p}
                variant="outline"
                className="cursor-pointer border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors px-3 py-1.5 text-xs"
              >
                {p}
              </Badge>
            ))}
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Target Audience</label>
            <Input placeholder="e.g., Startup founders, marketers" className="bg-muted/50 border-border" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────── Step 2: Tool Input ─────── */
function StepToolInput() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-xl font-bold text-foreground mb-1">Product / Tool Details</h3>
        <p className="text-sm text-muted-foreground">Enter your product info once — we'll generate all content from this.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2 ">
              <Globe className="w-3.5 h-3.5 text-primary" /> Product Name *
            </label>
            <Input placeholder="e.g., ContentAI Pro" className="bg-muted border-border h-11" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2 ">
              <Globe className="w-3.5 h-3.5 text-primary" /> Website URL
            </label>
            <Input placeholder="https://..." className="bg-muted border-border h-11" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2 ">
              <Users className="w-3.5 h-3.5 text-primary" /> Founder / Speaker Name
            </label>
            <Input placeholder="e.g., Sergiu" className="bg-muted border-border h-11" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-primary" /> Key Benefits
            </label>
            <Input placeholder="Saves time, AI-powered, Easy to use" className="bg-muted border-border h-11" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Product Description *</label>
            <Textarea
              placeholder="What does your product do? Key features, target audience, unique value proposition..."
              className="bg-muted border-border min-h-[140px]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Tone of Voice</label>
            <select className="w-full h-11 rounded-lg bg-muted border border-border px-3 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-shadow">
              <option>Professional & Engaging</option>
              <option>Casual & Friendly</option>
              <option>Technical & Detailed</option>
              <option>Hype & Energetic</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Competitor URLs (optional)</label>
            <Input placeholder="https://competitor1.com, https://competitor2.com" className="bg-muted border-border h-11" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────── Step 3: Script Generation ─────── */
function StepScript() {
  const [generated, setGenerated] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-xl font-bold text-foreground mb-1">Podcast Script</h3>
        <p className="text-sm text-muted-foreground">AI generates a 2-speaker podcast script (Alina host + Sergiu founder).</p>
      </div>

      {!generated ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-xl p-8 text-center"
        >
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}>
            <Sparkles className="w-8 h-8 text-foreground" />
          </div>
          <h4 className="font-heading font-bold text-foreground text-lg mb-2">Generate with Gemini 2.5 Pro</h4>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Our AI will craft an engaging podcast-style script with natural dialogue between Alina (host) and Sergiu (founder).
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-xs text-muted-foreground">
            <Badge variant="outline" className="border-border">~5 min read</Badge>
            <Badge variant="outline" className="border-border">2 speakers</Badge>
            <Badge variant="outline" className="border-border">Hook + CTA included</Badge>
          </div>
          <Button
            onClick={() => setGenerated(true)}
            className="gap-2 font-semibold text-foreground"
            style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
          >
            <Sparkles className="w-4 h-4" /> Generate Script
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Script Preview */}
          <div className="glass rounded-xl p-6 space-y-4 max-h-[400px] overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-success/10 text-success border-0 font-semibold text-xs">Generated ✓</Badge>
              <Badge variant="outline" className="border-border text-xs">1,247 words</Badge>
              <Badge variant="outline" className="border-border text-xs">~5 min</Badge>
            </div>

            {[
              { speaker: "Alina", text: "Hey everyone, welcome back to S Society Tech Talk! Today I'm super excited because we have Sergiu here, the founder of an incredible new AI tool. Sergiu, welcome!" },
              { speaker: "Sergiu", text: "Thanks Alina! Great to be here. I've been working on this for months and I'm really excited to share it with everyone." },
              { speaker: "Alina", text: "So tell us, what exactly does your tool do? I've been hearing a lot of buzz about it." },
              { speaker: "Sergiu", text: "Sure! So basically, we've built an AI-powered content automation platform. You input your product details once, and it generates everything — podcast scripts, videos, thumbnails, SEO content — for every social media platform automatically." },
              { speaker: "Alina", text: "Wait, everything from one input? That sounds like a game changer for marketers. How does it actually work?" },
              { speaker: "Sergiu", text: "Exactly! We use Gemini 2.5 Pro for content generation, Google Cloud TTS for audio, and Kie.ai for video production. It's a full pipeline that handles everything end-to-end." },
            ].map((line, i) => (
              <div key={i} className={`flex gap-3 ${line.speaker === "Alina" ? "" : "flex-row-reverse text-right"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-foreground ${
                  line.speaker === "Alina" ? "bg-primary/20" : "bg-success/20"
                }`}>
                  {line.speaker[0]}
                </div>
                <div className={`flex-1 ${line.speaker === "Alina" ? "" : "flex flex-col items-end"}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${line.speaker === "Alina" ? "text-primary" : "text-success"}`}>
                    {line.speaker}
                  </p>
                  <p className="text-sm text-foreground/90 leading-relaxed">{line.text}</p>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground italic text-center pt-2">... Script continues with more dialogue, key benefits, and CTA ...</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1 border-border text-foreground hover:bg-muted">
              <RefreshCw className="w-3 h-3" /> Regenerate
            </Button>
            <Button variant="outline" size="sm" className="gap-1 border-border text-foreground hover:bg-muted">
              <Edit3 className="w-3 h-3" /> Edit Script
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─────── Generic Step Placeholder ─────── */
function StepPlaceholder({ stepIndex }: { stepIndex: number }) {
  const s = steps[stepIndex];
  const Icon = s.icon;
  const descriptions: Record<number, string> = {
    3: "Google Cloud TTS converts your script into natural audio with distinct voices for Alina and Sergiu.",
    4: "Gemini Image AI generates eye-catching thumbnails optimized for each platform format.",
    5: "Kie.ai creates professional videos in 16:9 and 9:16 with captions and branding.",
    6: "AI-optimized copy for YouTube descriptions, Instagram captions, LinkedIn posts, tweets, and more.",
    7: "Connect your social media accounts via Botato for automated cross-platform publishing.",
    8: "Review all generated content. Make final edits and approve each asset before publishing.",
    9: "Launch across all platforms simultaneously. Track publishing status in real-time.",
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-xl font-bold text-foreground mb-1">{s.label}</h3>
        <p className="text-sm text-muted-foreground">{descriptions[stepIndex]}</p>
      </div>
      <div className="glass rounded-xl p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 mx-auto mb-4 flex items-center justify-center">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground mb-4">Ready to generate when previous steps are approved.</p>
        <Button
          className="gap-2 font-semibold text-foreground"
          style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
        >
          <Sparkles className="w-4 h-4" /> Generate {s.label}
        </Button>
      </div>
    </div>
  );
}

export default function CreateWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepOverview />;
      case 1: return <StepToolInput />;
      case 2: return <StepScript />;
      default: return <StepPlaceholder stepIndex={currentStep} />;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Create Content</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Step {currentStep + 1} of {steps.length} — {steps[currentStep].label}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="glass rounded-xl p-4 overflow-x-auto">
          <div className="flex items-center gap-0 min-w-max">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const done = i < currentStep;
              const active = i === currentStep;
              return (
                <div key={i} className="flex items-center">
                  <button
                    onClick={() => i <= currentStep && setCurrentStep(i)}
                    className="flex flex-col items-center gap-1.5 group"
                    disabled={i > currentStep}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      done ? "bg-success text-success-foreground" :
                      active ? "text-primary-foreground animate-pulse-glow" :
                      "bg-muted/60 text-muted-foreground"
                    }`} style={active ? { background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" } : undefined}>
                      {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-[10px] font-medium whitespace-nowrap transition-colors ${
                      done ? "text-success" : active ? "text-primary" : "text-muted-foreground/60"
                    }`}>{s.label}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <div className={`w-8 lg:w-12 h-[2px] mx-1 mt-[-16px] rounded-full transition-colors ${done ? "bg-success" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="gap-2 border-border text-foreground hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex items-center gap-3">
            {currentStep >= 2 && currentStep < 9 && (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                variant="outline"
                className="gap-2 border-success/30 text-success hover:bg-success/10"
              >
                <Check className="w-4 h-4" /> Approve & Next
              </Button>
            )}
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="gap-2 font-semibold text-foreground"
              style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
            >
              {currentStep === 9 ? "🚀 Publish" : "Next"} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
