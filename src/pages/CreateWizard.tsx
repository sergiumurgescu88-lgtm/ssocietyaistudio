import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, Mic2, Headphones, Image, Video,
  Search, Share2, CheckCircle2, Rocket, ArrowLeft, ArrowRight,
  Check, RefreshCw, Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const steps = [
  { icon: LayoutDashboard, label: "Overview", description: "Project setup" },
  { icon: FileText, label: "Tool Input", description: "Enter product details" },
  { icon: Mic2, label: "Script", description: "AI-generated podcast script" },
  { icon: Headphones, label: "Audio", description: "Text-to-speech generation" },
  { icon: Image, label: "Thumbnail", description: "AI thumbnail creation" },
  { icon: Video, label: "Video", description: "Video generation" },
  { icon: Search, label: "SEO Content", description: "Platform-optimized copy" },
  { icon: Share2, label: "Connections", description: "Link social platforms" },
  { icon: CheckCircle2, label: "Review", description: "Final approval" },
  { icon: Rocket, label: "Publish", description: "Go live everywhere" },
];

function StepContent({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-2">Project Overview</h3>
          <p className="text-sm text-muted-foreground">Set up your content project. Everything starts here.</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Project Name</label>
            <Input placeholder="e.g., AI Tool Launch Campaign" className="bg-muted border-border" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Category</label>
            <select className="w-full h-10 rounded-lg bg-muted border border-border px-3 text-sm text-foreground">
              <option>SaaS Product</option>
              <option>E-commerce</option>
              <option>Personal Brand</option>
              <option>Agency</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
  if (step === 1) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-2">Tool / Product Information</h3>
          <p className="text-sm text-muted-foreground">Enter your product details once. We'll generate everything from this.</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Product Name</label>
            <Input placeholder="e.g., ContentAI Pro" className="bg-muted border-border" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Website URL</label>
            <Input placeholder="https://..." className="bg-muted border-border" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
            <Textarea placeholder="What does your product do? Key features, target audience..." className="bg-muted border-border min-h-[120px]" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Key Benefits (comma-separated)</label>
            <Input placeholder="e.g., Saves time, Increases engagement, AI-powered" className="bg-muted border-border" />
          </div>
        </div>
      </div>
    );
  }
  // Generic step content for steps 2-9
  const { icon: Icon, label, description } = steps[step];
  const mockContent: Record<number, string> = {
    2: "The AI will generate a podcast-style script featuring Alina (host) and Sergiu (founder) discussing your product. The script includes engaging dialogue, key talking points, and natural transitions.",
    3: "Google Cloud Text-to-Speech will convert your script into natural-sounding audio with distinct voices for each speaker. Preview and adjust tone, speed, and emphasis.",
    4: "Gemini Image AI will create eye-catching thumbnails optimized for each platform. Multiple variations will be generated for A/B testing.",
    5: "Kie.ai will generate professional videos in multiple formats: 16:9 for YouTube/LinkedIn, 9:16 for TikTok/Reels. Includes animations, captions, and branding.",
    6: "AI-optimized content for every platform: YouTube descriptions, Instagram captions, LinkedIn articles, tweet threads, Pinterest pins, and more.",
    7: "Connect your social media accounts via Botato for automated cross-platform publishing. Set up scheduling and posting preferences.",
    8: "Review all generated content before publishing. Make final edits, approve each asset, and set your publishing schedule.",
    9: "Launch your content across all platforms simultaneously. Track publishing status in real-time and monitor initial engagement.",
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-xl font-bold text-foreground mb-2">{label}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="glass rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">AI Processing</p>
            <p className="text-xs text-muted-foreground">Ready to generate</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{mockContent[step]}</p>
        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1 border-border text-foreground hover:bg-muted">
            <RefreshCw className="w-3 h-3" /> Regenerate
          </Button>
          <Button variant="outline" size="sm" className="gap-1 border-border text-foreground hover:bg-muted">
            <Edit3 className="w-3 h-3" /> Edit
          </Button>
        </div>
      </div>
      {step >= 2 && step <= 5 && (
        <div className="glass rounded-lg p-4">
          <div className="h-48 rounded-lg bg-muted/50 flex items-center justify-center border border-dashed border-border">
            <p className="text-sm text-muted-foreground">Preview will appear here after generation</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-foreground">Create Content</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].label}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex items-center gap-1 min-w-max">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const done = i < currentStep;
              const active = i === currentStep;
              return (
                <button
                  key={i}
                  onClick={() => i <= currentStep && setCurrentStep(i)}
                  className="flex items-center gap-1"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                    done ? "bg-success text-success-foreground" :
                    active ? "bg-primary text-primary-foreground animate-pulse-glow" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {done ? <Check className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-6 h-0.5 ${done ? "bg-success" : "bg-border"}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <StepContent step={currentStep} />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
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
              <Button variant="outline" className="gap-2 border-success/50 text-success hover:bg-success/10">
                <Check className="w-4 h-4" /> Approve & Continue
              </Button>
            )}
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {currentStep === steps.length - 1 ? "Publish" : "Next"} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
