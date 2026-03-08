import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, Mic2, Headphones, Image, Video,
  Search, Share2, CheckCircle2, Rocket, ArrowLeft, ArrowRight,
  Check, RefreshCw, Edit3, Sparkles, Globe, Tag, Users, Target,
  HelpCircle, Copy, Lock, MessageSquare, Loader2, Clock, AlignLeft,
  Play, Pause, Volume2, VolumeX, Upload, Settings2, SkipBack, SkipForward,
  ExternalLink, BarChart3, Plus, AlertCircle, Wifi, WifiOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip, TooltipContent, TooltipTrigger
} from "@/components/ui/tooltip";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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

/* ──────────────────────────────────
   Shared types
   ────────────────────────────────── */

interface ToolFormData {
  toolName: string;
  toolUrl: string;
  description: string;
  targetAudience: string[];
  primaryGoal: string;
  videoDuration: string;
  category: string;
}

const audienceOptions = ["B2B", "B2C", "Agencies", "Freelancers"];
const goalOptions = ["Awareness", "Lead Generation", "Sales", "Demo Signups"];
const durationOptions = [
  { value: "60", label: "60s — Short" },
  { value: "180", label: "180s — Standard" },
  { value: "300", label: "300s — Deep Dive" },
];
const categoryOptions = [
  "Marketing", "SEO", "Automation", "Real Estate", "Finance",
  "E-commerce", "SaaS", "Health & Fitness", "Education", "AI/Tech"
];

function FieldTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50 cursor-help" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[220px] text-xs">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

/* ──────────────────────────────────
   STEP 1: Tool Input Form
   ────────────────────────────────── */
function StepToolInput({
  form, setForm, onGenerate
}: {
  form: ToolFormData;
  setForm: React.Dispatch<React.SetStateAction<ToolFormData>>;
  onGenerate: () => void;
}) {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Partial<Record<keyof ToolFormData, string>>>({});
  const [autoSaved, setAutoSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Auto-save draft every 5 seconds when form changes
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem("wizard_draft", JSON.stringify(form));
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 2000);
      } catch { /* ignore */ }
    }, 5000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [form]);

  // Load draft on mount
  useEffect(() => {
    try {
      const draft = localStorage.getItem("wizard_draft");
      if (draft) {
        const parsed = JSON.parse(draft);
        setForm((prev) => ({ ...prev, ...parsed }));
      }
    } catch { /* ignore */ }
  }, [setForm]);

  const validate = useCallback((): boolean => {
    const e: typeof errors = {};
    if (form.toolName.length < 3 || form.toolName.length > 100) e.toolName = "Tool name must be 3-100 characters";
    try { if (!form.toolUrl) throw 0; new URL(form.toolUrl); } catch { e.toolUrl = "Enter a valid URL (https://...)"; }
    if (form.description.length < 100 || form.description.length > 1000) e.description = "Description must be 100-1000 characters";
    if (form.targetAudience.length === 0) e.targetAudience = "Select at least one audience";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast({ title: "Please fix the errors", description: "Some required fields need attention.", variant: "destructive" });
    }
    return Object.keys(e).length === 0;
  }, [form, toast]);

  const toggleAudience = (val: string) => {
    setForm((f) => ({
      ...f,
      targetAudience: f.targetAudience.includes(val)
        ? f.targetAudience.filter((a) => a !== val)
        : [...f.targetAudience, val]
    }));
  };

  const handleGenerate = () => {
    if (validate()) onGenerate();
  };

  const descLen = form.description.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">Tool / Product Details</h3>
          <p className="text-sm text-muted-foreground">Fill in your product info once — we'll generate everything from this.</p>
        </div>
        <AnimatePresence>
          {autoSaved && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-success flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Draft saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Tool Name */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-primary" /> Tool Name *
              <FieldTooltip text="The name of the tool or product you want to promote." />
            </label>
            <Input
              value={form.toolName}
              onChange={(e) => setForm((f) => ({ ...f, toolName: e.target.value }))}
              placeholder="e.g., ContentAI Pro"
              className={`bg-muted border-border h-11 ${errors.toolName ? "border-accent" : ""}`}
              maxLength={100}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.toolName && <p className="text-xs text-accent">{errors.toolName}</p>}
              <span className="text-[10px] text-muted-foreground ml-auto">{form.toolName.length}/100</span>
            </div>
          </div>

          {/* Tool URL */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-primary" /> Tool URL *
              <FieldTooltip text="The website URL of the product. Must be a valid URL starting with https://." />
            </label>
            <Input
              value={form.toolUrl}
              onChange={(e) => setForm((f) => ({ ...f, toolUrl: e.target.value }))}
              placeholder="https://..."
              className={`bg-muted border-border h-11 ${errors.toolUrl ? "border-accent" : ""}`}
            />
            {errors.toolUrl && <p className="text-xs text-accent mt-1">{errors.toolUrl}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <AlignLeft className="w-3.5 h-3.5 text-primary" /> Description *
              <FieldTooltip text="Detailed description of what your tool does, key features, and unique value. 100-1000 characters." />
            </label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What does your product do? Key features, target audience, unique value proposition..."
              className={`bg-muted border-border min-h-[120px] ${errors.description ? "border-accent" : ""}`}
              maxLength={1000}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.description && <p className="text-xs text-accent">{errors.description}</p>}
              <span className={`text-[10px] ml-auto ${descLen < 100 ? "text-accent" : descLen > 900 ? "text-warning" : "text-muted-foreground"}`}>
                {descLen}/1000 {descLen < 100 && `(${100 - descLen} more needed)`}
              </span>
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-primary" /> Target Audience *
              <FieldTooltip text="Select all audience types that apply to your product." />
            </label>
            <div className="flex flex-wrap gap-2">
              {audienceOptions.map((a) => {
                const active = form.targetAudience.includes(a);
                return (
                  <button
                    key={a}
                    onClick={() => toggleAudience(a)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                      active
                        ? "bg-primary/15 border-primary text-primary"
                        : "bg-muted/50 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {active && <Check className="w-3 h-3 inline mr-1.5" />}
                    {a}
                  </button>
                );
              })}
            </div>
            {errors.targetAudience && <p className="text-xs text-accent mt-1">{errors.targetAudience}</p>}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Primary Goal */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-primary" /> Primary Goal *
              <FieldTooltip text="What's the main objective of your content campaign?" />
            </label>
            <select
              value={form.primaryGoal}
              onChange={(e) => setForm((f) => ({ ...f, primaryGoal: e.target.value }))}
              className="w-full h-11 rounded-lg bg-muted border border-border px-3 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
            >
              {goalOptions.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Video Duration */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-primary" /> Video Duration *
              <FieldTooltip text="Choose the target duration for the generated podcast/video content." />
            </label>
            <div className="grid grid-cols-3 gap-2">
              {durationOptions.map((d) => {
                const active = form.videoDuration === d.value;
                return (
                  <button
                    key={d.value}
                    onClick={() => setForm((f) => ({ ...f, videoDuration: d.value }))}
                    className={`py-3 rounded-lg text-center border transition-all duration-200 ${
                      active
                        ? "bg-primary/15 border-primary text-primary"
                        : "bg-muted/50 border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <span className="text-lg font-bold block">{d.value}s</span>
                    <span className="text-[10px]">{d.label.split("—")[1]?.trim()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-primary" /> Category *
              <FieldTooltip text="The industry/niche category of your product." />
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full h-11 rounded-lg bg-muted border border-border px-3 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
            >
              {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Summary Card */}
          <div className="glass rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tool</span>
                <span className="text-foreground font-medium truncate ml-4 max-w-[180px]">{form.toolName || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Goal</span>
                <span className="text-foreground font-medium">{form.primaryGoal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="text-foreground font-medium">{form.videoDuration}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Audience</span>
                <span className="text-foreground font-medium">{form.targetAudience.join(", ") || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="text-foreground font-medium">{form.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex items-center justify-center pt-2">
        <Button
          onClick={handleGenerate}
          size="lg"
          className="gap-2 font-semibold text-foreground px-8 h-12"
          style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
        >
          <Sparkles className="w-5 h-5" /> Generate Script
        </Button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────
   STEP 2: Script Generation
   ────────────────────────────────── */

const mockScript = [
  { speaker: "Alina" as const, text: "Bună tuturor și bine ați revenit la S Society Tech Talk! Astăzi am un invitat special — Sergiu, fondatorul unui tool AI incredibil. Sergiu, bine ai venit!" },
  { speaker: "Sergiu" as const, text: "Mulțumesc, Alina! Mă bucur foarte mult să fiu aici. Am lucrat la acest proiect luni de zile și sunt entuziasmat să-l prezint." },
  { speaker: "Alina" as const, text: "Spune-ne, ce face exact tool-ul tău? Am auzit că schimbă complet jocul pentru marketeri." },
  { speaker: "Sergiu" as const, text: "Sigur! Practic, am construit o platformă de automatizare a conținutului bazată pe AI. Introduci detaliile produsului o singură dată și sistemul generează totul automat — scripturi, video, thumbnail-uri, conținut SEO — pentru fiecare platformă de social media." },
  { speaker: "Alina" as const, text: "Totul dintr-un singur input? Asta pare un game changer. Cum funcționează concret?" },
  { speaker: "Sergiu" as const, text: "Exact! Folosim Gemini 2.5 Pro pentru generarea de conținut, Google Cloud TTS pentru audio și Kie.ai pentru producția video. E un pipeline complet care gestionează totul end-to-end." },
  { speaker: "Alina" as const, text: "Am și un exemplu real! Unul dintre clienții noștri, o agenție de marketing din București, a redus timpul de creare a conținutului cu 80% folosind platforma." },
  { speaker: "Sergiu" as const, text: "Da! Și nu e doar despre viteză. Calitatea conținutului generat este comparabilă cu ce ar produce o echipă de 5 persoane. Plus, totul este optimizat SEO din start." },
  { speaker: "Alina" as const, text: "Hai să recapitulăm cele 3 beneficii principale: economisești timp, crești engagement-ul și scalezi producția de conținut fără efort suplimentar." },
  { speaker: "Sergiu" as const, text: "Perfect rezumat! Și pentru cei care vor să testeze — avem un free tier disponibil. Mergeți pe site și creați primul vostru proiect gratuit!" },
  { speaker: "Alina" as const, text: "Link-ul va fi în descriere. Mulțumim că ne-ați urmărit! Dacă v-a plăcut, dați like și subscribe. Ne vedem la următorul episod! 🚀" },
];

function StepScript({
  form, onApprove
}: {
  form: ToolFormData;
  onApprove: () => void;
}) {
  const { toast } = useToast();
  const [state, setState] = useState<"idle" | "loading" | "done" | "editing">("idle");
  const [progress, setProgress] = useState(0);
  const [refineOpen, setRefineOpen] = useState(false);
  const [refineText, setRefineText] = useState("");
  const [editableScript, setEditableScript] = useState(mockScript);
  const [locked, setLocked] = useState(false);

  const totalWords = editableScript.reduce((sum, l) => sum + l.text.split(/\s+/).length, 0);
  const estimatedDuration = Math.round(totalWords / 2.5); // ~150wpm, in seconds

  const generate = () => {
    setState("loading");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setState("done"); return 100; }
        return p + Math.random() * 3 + 1;
      });
    }, 300);
  };

  const handleCopy = () => {
    const text = editableScript.map((l) => `[${l.speaker}]: ${l.text}`).join("\n\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Script copied to clipboard." });
  };

  const handleApprove = () => {
    setLocked(true);
    toast({ title: "Script Approved ✓", description: "Locked and ready for audio generation." });
    setTimeout(onApprove, 600);
  };

  const handleRefine = () => {
    setRefineOpen(false);
    setRefineText("");
    setState("loading");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setState("done"); return 100; }
        return p + Math.random() * 4 + 2;
      });
    }, 250);
  };

  // Idle - prompt to generate
  if (state === "idle") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">Podcast Script Generation</h3>
          <p className="text-sm text-muted-foreground">AI generates a 2-speaker podcast script (Alina 🎙️ + Sergiu 🎤) in Romanian.</p>
        </div>

        <div className="glass rounded-xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}>
            <Sparkles className="w-8 h-8 text-foreground" />
          </div>
          <h4 className="font-heading font-bold text-foreground text-lg mb-2">Generate with Gemini 2.5 Pro</h4>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">
            Based on your input for <span className="text-foreground font-medium">{form.toolName || "your tool"}</span>,
            we'll create an engaging {form.videoDuration}s podcast script.
          </p>

          <div className="glass rounded-lg p-4 max-w-md mx-auto mb-6 text-left">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">Prompt Preview</p>
            <p className="text-xs text-muted-foreground leading-relaxed font-mono">
              Podcast script for <span className="text-primary">{form.toolName || "[Tool Name]"}</span>.{" "}
              Speakers: Alina (host), Sergiu (founder). Romanian. {form.videoDuration}s.
              Include client story, 3 benefits, CTA. Goal: {form.primaryGoal}.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <Badge variant="outline" className="border-border text-xs">🎙️ 2 speakers</Badge>
            <Badge variant="outline" className="border-border text-xs">🇷🇴 Romanian</Badge>
            <Badge variant="outline" className="border-border text-xs">⏱️ ~{form.videoDuration}s</Badge>
            <Badge variant="outline" className="border-border text-xs">📖 Hook + CTA</Badge>
          </div>

          <Button
            onClick={generate}
            size="lg"
            className="gap-2 font-semibold text-foreground px-8"
            style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
          >
            <Sparkles className="w-5 h-5" /> Generate Script
          </Button>
        </div>
      </div>
    );
  }

  // Loading
  if (state === "loading") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">Generating Script...</h3>
          <p className="text-sm text-muted-foreground">Gemini 2.5 Pro is crafting your podcast script. This takes 30-60 seconds.</p>
        </div>

        <div className="glass rounded-xl p-10 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6"
          >
            <div className="w-full h-full rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}>
              <Sparkles className="w-8 h-8 text-foreground" />
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="max-w-sm mx-auto mb-4">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, hsl(214 84% 50%), hsl(155 100% 41%))", width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{Math.round(Math.min(progress, 100))}% complete</p>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            {progress > 10 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>📝 Analyzing tool information...</motion.p>}
            {progress > 35 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>🎭 Creating speaker dialogue...</motion.p>}
            {progress > 60 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>📖 Adding client story & benefits...</motion.p>}
            {progress > 85 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>✨ Polishing & adding CTA...</motion.p>}
          </div>
        </div>
      </div>
    );
  }

  // Done / Editing
  const isEditing = state === "editing";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">
            {locked ? "🔒 Script Approved" : isEditing ? "✏️ Editing Script" : "📝 Script Preview"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locked ? "Script is locked. Proceeding to audio generation." : "Review, edit, or refine the generated script."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-border text-xs">{totalWords} words</Badge>
          <Badge variant="outline" className="border-border text-xs">~{estimatedDuration}s</Badge>
          <Badge className="bg-success/10 text-success border-0 text-xs font-semibold">Generated ✓</Badge>
        </div>
      </div>

      {/* Script Body */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="flex items-center gap-4 px-5 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-primary font-medium">Alina (Host)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-success" />
            <span className="text-success font-medium">Sergiu (Founder)</span>
          </div>
        </div>

        <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto">
          {editableScript.map((line, i) => {
            const isAlina = line.speaker === "Alina";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex gap-3 ${isAlina ? "" : "flex-row-reverse"}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-foreground ${
                  isAlina ? "bg-primary/20" : "bg-success/20"
                }`}>
                  {line.speaker[0]}
                </div>
                <div className={`flex-1 max-w-[85%] ${isAlina ? "" : "flex flex-col items-end"}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${isAlina ? "text-primary" : "text-success"}`}>
                    {line.speaker}
                  </p>
                  {isEditing && !locked ? (
                    <Textarea
                      value={line.text}
                      onChange={(e) => {
                        const updated = [...editableScript];
                        updated[i] = { ...updated[i], text: e.target.value };
                        setEditableScript(updated);
                      }}
                      className={`bg-muted/50 border-border text-sm leading-relaxed ${isAlina ? "" : "text-right"}`}
                      rows={2}
                    />
                  ) : (
                    <p className={`text-sm text-foreground/90 leading-relaxed rounded-lg px-3 py-2 ${
                      isAlina ? "bg-primary/5 border-l-2 border-primary/30" : "bg-success/5 border-r-2 border-success/30"
                    }`}>
                      {line.text}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      {!locked && (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleApprove}
            className="gap-2 font-semibold text-foreground"
            style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
          >
            <Lock className="w-4 h-4" /> Approve & Continue
          </Button>
          <Button
            variant="outline"
            onClick={() => setRefineOpen(true)}
            className="gap-1.5 border-border text-foreground hover:bg-muted"
          >
            <MessageSquare className="w-4 h-4" /> Refine Prompt
          </Button>
          <Button
            variant="outline"
            onClick={() => setState(isEditing ? "done" : "editing")}
            className="gap-1.5 border-border text-foreground hover:bg-muted"
          >
            <Edit3 className="w-4 h-4" /> {isEditing ? "Done Editing" : "Edit Manually"}
          </Button>
          <Button
            variant="outline"
            onClick={generate}
            className="gap-1.5 border-border text-foreground hover:bg-muted"
          >
            <RefreshCw className="w-4 h-4" /> Regenerate
          </Button>
          <Button
            variant="outline"
            onClick={handleCopy}
            className="gap-1.5 border-border text-foreground hover:bg-muted ml-auto"
          >
            <Copy className="w-4 h-4" /> Copy
          </Button>
        </div>
      )}

      {/* Refine Modal */}
      <Dialog open={refineOpen} onOpenChange={setRefineOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-heading text-foreground">Refine Script</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-3">
            Describe what changes you'd like. The AI will regenerate based on your feedback.
          </p>
          <Textarea
            value={refineText}
            onChange={(e) => setRefineText(e.target.value)}
            placeholder="e.g., Make it more energetic, add more technical details, shorter intro..."
            className="bg-muted border-border min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefineOpen(false)} className="border-border text-foreground hover:bg-muted">Cancel</Button>
            <Button
              onClick={handleRefine}
              disabled={!refineText.trim()}
              className="gap-2 text-foreground font-semibold"
              style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
            >
              <RefreshCw className="w-4 h-4" /> Regenerate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ──────────────────────────────────
   STEP 3: Audio Generation
   ────────────────────────────────── */

function StepAudio({ form, onApprove }: { form: ToolFormData; onApprove: () => void }) {
  const { toast } = useToast();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [locked, setLocked] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    alinaVoice: "ro-RO-Wavenet-A",
    sergiuVoice: "ro-RO-Wavenet-B",
    speed: [1.0],
    pitch: [0],
    sampleRate: "48000",
  });

  const duration = parseInt(form.videoDuration) || 180;
  const playIntervalRef = useRef<ReturnType<typeof setInterval>>();

  const generate = () => {
    setState("loading");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setState("done"); return 100; }
        return p + Math.random() * 2 + 0.8;
      });
    }, 400);
  };

  const togglePlay = () => {
    if (playing) {
      clearInterval(playIntervalRef.current);
      setPlaying(false);
    } else {
      setPlaying(true);
      playIntervalRef.current = setInterval(() => {
        setCurrentTime((t) => {
          if (t >= duration) {
            clearInterval(playIntervalRef.current);
            setPlaying(false);
            return 0;
          }
          return t + 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    return () => { if (playIntervalRef.current) clearInterval(playIntervalRef.current); };
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const handleApprove = () => {
    setLocked(true);
    setPlaying(false);
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    toast({ title: "Audio Approved ✓", description: "Locked. Proceeding to thumbnail generation." });
    setTimeout(onApprove, 600);
  };

  const handleUpload = () => {
    toast({ title: "Upload Custom Audio", description: "File picker would open here. Supported: WAV, MP3, M4A." });
  };

  // Generate mock waveform bars
  const waveformBars = useRef(
    Array.from({ length: 80 }, () => 0.15 + Math.random() * 0.85)
  ).current;

  if (state === "idle") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">Audio Generation</h3>
          <p className="text-sm text-muted-foreground">Google Cloud TTS converts your approved script into natural-sounding audio.</p>
        </div>

        <div className="glass rounded-xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}>
            <Headphones className="w-8 h-8 text-foreground" />
          </div>
          <h4 className="font-heading font-bold text-foreground text-lg mb-2">Generate with Google Cloud TTS</h4>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">
            Two distinct voices for Alina (host) and Sergiu (founder) in Romanian, optimized for podcast quality.
          </p>

          <div className="glass rounded-lg p-4 max-w-sm mx-auto mb-6 text-left space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">TTS Configuration</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Language</span><span className="text-foreground font-medium">ro-RO</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Encoding</span><span className="text-foreground font-medium">LINEAR16</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Sample Rate</span><span className="text-foreground font-medium">48kHz</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="text-foreground font-medium">~{form.videoDuration}s</span></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <Badge variant="outline" className="border-border text-xs">🎙️ Wavenet Voices</Badge>
            <Badge variant="outline" className="border-border text-xs">🇷🇴 Romanian</Badge>
            <Badge variant="outline" className="border-border text-xs">🎵 48kHz Studio</Badge>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={generate}
              size="lg"
              className="gap-2 font-semibold text-foreground px-8"
              style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
            >
              <Sparkles className="w-5 h-5" /> Generate Audio
            </Button>
            <Button
              variant="outline"
              onClick={handleUpload}
              className="gap-2 border-border text-foreground hover:bg-muted"
            >
              <Upload className="w-4 h-4" /> Upload Custom
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">Generating Audio...</h3>
          <p className="text-sm text-muted-foreground">Google Cloud TTS is synthesizing your podcast audio. This may take 30-60 seconds.</p>
        </div>

        <div className="glass rounded-xl p-10 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6"
          >
            <div className="w-full h-full rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}>
              <Headphones className="w-8 h-8 text-foreground" />
            </div>
          </motion.div>

          <div className="max-w-sm mx-auto mb-4">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, hsl(214 84% 50%), hsl(155 100% 41%))", width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{Math.round(Math.min(progress, 100))}% complete</p>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            {progress > 10 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>🔊 Initializing voice models...</motion.p>}
            {progress > 30 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>🎙️ Synthesizing Alina's voice (ro-RO-Wavenet-A)...</motion.p>}
            {progress > 55 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>🎤 Synthesizing Sergiu's voice (ro-RO-Wavenet-B)...</motion.p>}
            {progress > 75 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>🎵 Mixing & mastering audio tracks...</motion.p>}
            {progress > 90 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>✨ Final quality check...</motion.p>}
          </div>
        </div>
      </div>
    );
  }

  // Done state — audio player
  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">
            {locked ? "🔒 Audio Approved" : "🎧 Audio Preview"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locked ? "Audio is locked. Proceeding to thumbnail." : "Listen, adjust, or upload your own audio."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-border text-xs">🎵 48kHz</Badge>
          <Badge variant="outline" className="border-border text-xs">⏱️ {formatTime(duration)}</Badge>
          <Badge className="bg-success/10 text-success border-0 text-xs font-semibold">Generated ✓</Badge>
        </div>
      </div>

      {/* Waveform Player */}
      <div className="glass rounded-xl overflow-hidden">
        {/* Waveform visualization */}
        <div
          className="px-5 pt-5 pb-2 cursor-pointer"
          onClick={(e) => {
            if (locked) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            setCurrentTime(Math.round(pct * duration));
          }}
        >
          <div className="flex items-end gap-[2px] h-20 relative">
            {waveformBars.map((h, i) => {
              const barPct = (i / waveformBars.length) * 100;
              const isPast = barPct <= progressPct;
              const isCurrent = Math.abs(barPct - progressPct) < 2;
              return (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{
                    scaleY: playing && isCurrent ? [h, h * 0.6, h] : h,
                  }}
                  transition={playing && isCurrent ? { duration: 0.4, repeat: Infinity } : { duration: 0.3, delay: i * 0.005 }}
                  className="flex-1 rounded-full origin-bottom transition-colors duration-150"
                  style={{
                    height: "100%",
                    background: isPast
                      ? "linear-gradient(to top, hsl(214 84% 50%), hsl(155 100% 50%))"
                      : "hsl(232, 25%, 28%)",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="px-5 pb-5 pt-2">
          {/* Time display */}
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Playback controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                disabled={locked}
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={togglePlay}
                disabled={locked}
                className="w-11 h-11 rounded-full flex items-center justify-center text-foreground transition-all hover:brightness-110"
                style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
              >
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button
                onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                disabled={locked}
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => setMuted(!muted)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <Slider
                value={muted ? [0] : volume}
                onValueChange={(v) => { setVolume(v); if (muted) setMuted(false); }}
                max={100}
                step={1}
                className="w-20"
              />
            </div>

            {/* Speaker indicators */}
            <div className="flex items-center gap-3 ml-auto text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Alina</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="text-muted-foreground">Sergiu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Settings Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mic2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Alina (Host)</p>
              <p className="text-[10px] text-muted-foreground">{voiceSettings.alinaVoice}</p>
            </div>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground"><span>Speed</span><span className="text-foreground">{voiceSettings.speed[0]}x</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Pitch</span><span className="text-foreground">{voiceSettings.pitch[0] > 0 ? "+" : ""}{voiceSettings.pitch[0]}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Sample Rate</span><span className="text-foreground">{voiceSettings.sampleRate}Hz</span></div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <Mic2 className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Sergiu (Founder)</p>
              <p className="text-[10px] text-muted-foreground">{voiceSettings.sergiuVoice}</p>
            </div>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground"><span>Speed</span><span className="text-foreground">{voiceSettings.speed[0]}x</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Pitch</span><span className="text-foreground">{voiceSettings.pitch[0] > 0 ? "+" : ""}{voiceSettings.pitch[0]}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Sample Rate</span><span className="text-foreground">{voiceSettings.sampleRate}Hz</span></div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {!locked && (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleApprove}
            className="gap-2 font-semibold text-foreground"
            style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
          >
            <Lock className="w-4 h-4" /> Approve & Continue
          </Button>
          <Button
            variant="outline"
            onClick={() => setSettingsOpen(true)}
            className="gap-1.5 border-border text-foreground hover:bg-muted"
          >
            <Settings2 className="w-4 h-4" /> Adjust Voice
          </Button>
          <Button
            variant="outline"
            onClick={handleUpload}
            className="gap-1.5 border-border text-foreground hover:bg-muted"
          >
            <Upload className="w-4 h-4" /> Upload Custom
          </Button>
          <Button
            variant="outline"
            onClick={() => { setState("loading"); setProgress(0); setCurrentTime(0); setPlaying(false); generate(); }}
            className="gap-1.5 border-border text-foreground hover:bg-muted"
          >
            <RefreshCw className="w-4 h-4" /> Regenerate
          </Button>
        </div>
      )}

      {/* Voice Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-foreground">Voice Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-2">
            {/* Alina Voice */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Alina (Host)
              </p>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Voice Model</label>
                <select
                  value={voiceSettings.alinaVoice}
                  onChange={(e) => setVoiceSettings((s) => ({ ...s, alinaVoice: e.target.value }))}
                  className="w-full h-10 rounded-lg bg-muted border border-border px-3 text-sm text-foreground"
                >
                  <option value="ro-RO-Wavenet-A">ro-RO-Wavenet-A (Female, Warm)</option>
                  <option value="ro-RO-Wavenet-C">ro-RO-Wavenet-C (Female, Bright)</option>
                  <option value="ro-RO-Standard-A">ro-RO-Standard-A (Female, Standard)</option>
                </select>
              </div>
            </div>

            {/* Sergiu Voice */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-success" /> Sergiu (Founder)
              </p>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Voice Model</label>
                <select
                  value={voiceSettings.sergiuVoice}
                  onChange={(e) => setVoiceSettings((s) => ({ ...s, sergiuVoice: e.target.value }))}
                  className="w-full h-10 rounded-lg bg-muted border border-border px-3 text-sm text-foreground"
                >
                  <option value="ro-RO-Wavenet-B">ro-RO-Wavenet-B (Male, Deep)</option>
                  <option value="ro-RO-Wavenet-D">ro-RO-Wavenet-D (Male, Bright)</option>
                  <option value="ro-RO-Standard-B">ro-RO-Standard-B (Male, Standard)</option>
                </select>
              </div>
            </div>

            {/* Shared Settings */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-muted-foreground">Speed</label>
                  <span className="text-xs text-foreground font-medium">{voiceSettings.speed[0]}x</span>
                </div>
                <Slider
                  value={voiceSettings.speed}
                  onValueChange={(v) => setVoiceSettings((s) => ({ ...s, speed: v }))}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-muted-foreground">Pitch</label>
                  <span className="text-xs text-foreground font-medium">{voiceSettings.pitch[0] > 0 ? "+" : ""}{voiceSettings.pitch[0]}</span>
                </div>
                <Slider
                  value={voiceSettings.pitch}
                  onValueChange={(v) => setVoiceSettings((s) => ({ ...s, pitch: v }))}
                  min={-5}
                  max={5}
                  step={0.5}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Sample Rate</label>
                <select
                  value={voiceSettings.sampleRate}
                  onChange={(e) => setVoiceSettings((s) => ({ ...s, sampleRate: e.target.value }))}
                  className="w-full h-10 rounded-lg bg-muted border border-border px-3 text-sm text-foreground"
                >
                  <option value="24000">24kHz (Standard)</option>
                  <option value="48000">48kHz (Studio Quality)</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)} className="border-border text-foreground hover:bg-muted">Cancel</Button>
            <Button
              onClick={() => {
                setSettingsOpen(false);
                toast({ title: "Settings Updated", description: "Voice settings saved. Regenerate to apply." });
              }}
              className="gap-2 text-foreground font-semibold"
              style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
            >
              <Check className="w-4 h-4" /> Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ──────────────────────────────────
   STEP 4: Thumbnail Generation
   ────────────────────────────────── */

import thumbVar1 from "@/assets/thumb-variation-1.jpg";
import thumbVar2 from "@/assets/thumb-variation-2.jpg";
import thumbVar3 from "@/assets/thumb-variation-3.jpg";

const thumbnailVariations = [
  { id: 1, src: thumbVar1, label: "Variation A — AI Content Factory", style: "Tech Futuristic" },
  { id: 2, src: thumbVar2, label: "Variation B — Tech Talk Podcast", style: "Podcast Themed" },
  { id: 3, src: thumbVar3, label: "Variation C — Automate Content", style: "Bold Headline" },
];

function StepThumbnail({ form, onApprove }: { form: ToolFormData; onApprove: () => void }) {
  const { toast } = useToast();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [refineOpen, setRefineOpen] = useState(false);
  const [refineText, setRefineText] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");

  const generate = () => {
    setState("loading");
    setProgress(0);
    setSelected(null);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setState("done"); return 100; }
        return p + Math.random() * 3 + 1.5;
      });
    }, 350);
  };

  const handleApprove = () => {
    if (selected === null) {
      toast({ title: "Select a thumbnail", description: "Please select one of the variations first.", variant: "destructive" });
      return;
    }
    setLocked(true);
    toast({ title: "Thumbnail Approved ✓", description: "Locked. Proceeding to video generation." });
    setTimeout(onApprove, 600);
  };

  const handleRefine = () => {
    setRefineOpen(false);
    setRefineText("");
    generate();
  };

  if (state === "idle") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">Thumbnail Generation</h3>
          <p className="text-sm text-muted-foreground">Gemini Image AI creates 3 professional thumbnail variations for your content.</p>
        </div>

        <div className="glass rounded-xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}>
            <Image className="w-8 h-8 text-foreground" />
          </div>
          <h4 className="font-heading font-bold text-foreground text-lg mb-2">Generate with Gemini Image</h4>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">
            Three unique thumbnail styles for <span className="text-foreground font-medium">{form.toolName || "your tool"}</span>. Professional, high-contrast, optimized for YouTube (1280×720).
          </p>

          <div className="glass rounded-lg p-4 max-w-md mx-auto mb-6 text-left">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">Prompt Preview</p>
            <p className="text-xs text-muted-foreground leading-relaxed font-mono">
              YouTube thumbnail for <span className="text-primary">{form.toolName || "[Tool Name]"}</span>.
              Professional, high contrast, tech modern. Colors: #1a73e8 blue, #00d084 green.
              Include: Tool name, benefit, logo. 1280×720
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <Badge variant="outline" className="border-border text-xs">🖼️ 3 Variations</Badge>
            <Badge variant="outline" className="border-border text-xs">📐 1280×720</Badge>
            <Badge variant="outline" className="border-border text-xs">🎨 On-brand colors</Badge>
          </div>

          <Button
            onClick={generate}
            size="lg"
            className="gap-2 font-semibold text-foreground px-8"
            style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
          >
            <Sparkles className="w-5 h-5" /> Generate Thumbnails
          </Button>
        </div>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">Generating Thumbnails...</h3>
          <p className="text-sm text-muted-foreground">Gemini Image is creating 3 unique variations. This takes 20-40 seconds.</p>
        </div>
        <div className="glass rounded-xl p-10 text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 mx-auto mb-6">
            <div className="w-full h-full rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}>
              <Image className="w-8 h-8 text-foreground" />
            </div>
          </motion.div>
          <div className="max-w-sm mx-auto mb-4">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, hsl(214 84% 50%), hsl(155 100% 41%))", width: `${Math.min(progress, 100)}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{Math.round(Math.min(progress, 100))}% complete</p>
          </div>
          <div className="space-y-2 text-xs text-muted-foreground">
            {progress > 10 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>🎨 Composing visual elements...</motion.p>}
            {progress > 35 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>🖼️ Rendering Variation A...</motion.p>}
            {progress > 55 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>🖼️ Rendering Variation B...</motion.p>}
            {progress > 75 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>🖼️ Rendering Variation C...</motion.p>}
            {progress > 90 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>✨ Optimizing quality...</motion.p>}
          </div>
        </div>
      </div>
    );
  }

  // Done — show 3 variations
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">
            {locked ? "🔒 Thumbnail Approved" : "🖼️ Select a Thumbnail"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locked ? "Thumbnail locked. Proceeding to video generation." : "Click to select your preferred variation. Hover to preview."}
          </p>
        </div>
        <Badge className="bg-success/10 text-success border-0 text-xs font-semibold">3 Variations Generated ✓</Badge>
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {thumbnailVariations.map((thumb) => {
          const isSelected = selected === thumb.id;
          const isHovered = hoveredId === thumb.id;
          return (
            <motion.div
              key={thumb.id}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onHoverStart={() => setHoveredId(thumb.id)}
              onHoverEnd={() => setHoveredId(null)}
              onClick={() => !locked && setSelected(thumb.id)}
              className={`glass rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                isSelected ? "ring-2 ring-primary glow-primary" : "hover:ring-1 hover:ring-border"
              } ${locked && !isSelected ? "opacity-40" : ""}`}
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={thumb.src}
                  alt={thumb.label}
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
                />
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
                  >
                    <Check className="w-4 h-4 text-foreground" />
                  </motion.div>
                )}
                {/* Expand preview button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewSrc(thumb.src);
                    setPreviewOpen(true);
                  }}
                  className="absolute bottom-3 right-3 w-7 h-7 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-all opacity-0 group-hover:opacity-100"
                  style={{ opacity: isHovered ? 1 : 0 }}
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-medium text-foreground">{thumb.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{thumb.style} • 1280×720</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Actions */}
      {!locked && (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleApprove}
            disabled={selected === null}
            className="gap-2 font-semibold text-foreground"
            style={{ background: selected !== null ? "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" : undefined }}
          >
            <Lock className="w-4 h-4" /> Select & Continue
          </Button>
          <Button variant="outline" onClick={() => setRefineOpen(true)} className="gap-1.5 border-border text-foreground hover:bg-muted">
            <MessageSquare className="w-4 h-4" /> Refine Prompt
          </Button>
          <Button
            variant="outline"
            onClick={() => toast({ title: "Canva Integration", description: "This would open the selected thumbnail in Canva for editing." })}
            className="gap-1.5 border-border text-foreground hover:bg-muted"
          >
            <Edit3 className="w-4 h-4" /> Edit in Canva
          </Button>
          <Button variant="outline" onClick={generate} className="gap-1.5 border-border text-foreground hover:bg-muted">
            <RefreshCw className="w-4 h-4" /> Regenerate All
          </Button>
        </div>
      )}

      {/* Full Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="bg-card border-border max-w-3xl p-2">
          <img src={previewSrc} alt="Thumbnail preview" className="w-full h-auto rounded-lg" />
        </DialogContent>
      </Dialog>

      {/* Refine Dialog */}
      <Dialog open={refineOpen} onOpenChange={setRefineOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-heading text-foreground">Refine Thumbnails</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-3">Describe the changes you'd like for the next batch of thumbnails.</p>
          <Textarea
            value={refineText}
            onChange={(e) => setRefineText(e.target.value)}
            placeholder="e.g., More vibrant colors, add person's face, bigger text, different layout..."
            className="bg-muted border-border min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefineOpen(false)} className="border-border text-foreground hover:bg-muted">Cancel</Button>
            <Button
              onClick={handleRefine}
              disabled={!refineText.trim()}
              className="gap-2 text-foreground font-semibold"
              style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
            >
              <RefreshCw className="w-4 h-4" /> Regenerate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ──────────────────────────────────
   STEP 5: Video Generation (Kie.ai)
   ────────────────────────────────── */

import videoPreviewLandscape from "@/assets/video-preview-landscape.jpg";
import videoPreviewPortrait from "@/assets/video-preview-portrait.jpg";

interface VideoVariant {
  id: string;
  platform: string;
  aspect: string;
  resolution: string;
  preview: string;
  icon: string;
}

const videoVariants: VideoVariant[] = [
  { id: "yt", platform: "YouTube", aspect: "16:9", resolution: "1920×1080", preview: videoPreviewLandscape, icon: "▶️" },
  { id: "tt", platform: "TikTok", aspect: "9:16", resolution: "1080×1920", preview: videoPreviewPortrait, icon: "🎵" },
  { id: "ig", platform: "Instagram Reels", aspect: "9:16", resolution: "1080×1920", preview: videoPreviewPortrait, icon: "📸" },
  { id: "li", platform: "LinkedIn", aspect: "16:9", resolution: "1920×1080", preview: videoPreviewLandscape, icon: "💼" },
  { id: "fb", platform: "Facebook", aspect: "16:9", resolution: "1920×1080", preview: videoPreviewLandscape, icon: "👥" },
  { id: "tw", platform: "Twitter/X", aspect: "16:9", resolution: "1920×1080", preview: videoPreviewLandscape, icon: "🐦" },
];

const kieTools = [
  { value: "text-to-video", label: "Text to Video" },
  { value: "image-to-video", label: "Image to Video" },
  { value: "audio-to-video", label: "Audio to Video (Sync)" },
  { value: "template-video", label: "Template Based" },
];

interface SceneData {
  id: number;
  label: string;
  duration: string;
  description: string;
  selected: boolean;
}

function StepVideo({ form, onApprove }: { form: ToolFormData; onApprove: () => void }) {
  const { toast } = useToast();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [locked, setLocked] = useState(false);
  const [kieTool, setKieTool] = useState("audio-to-video");
  const [activeVariant, setActiveVariant] = useState("yt");
  const [playing, setPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [subtitlesOn, setSubtitlesOn] = useState(true);
  const [scenesOpen, setScenesOpen] = useState(false);
  const playRef = useRef<ReturnType<typeof setInterval>>();

  const duration = parseInt(form.videoDuration) || 180;
  const currentVariant = videoVariants.find((v) => v.id === activeVariant)!;

  const [scenes, setScenes] = useState<SceneData[]>([
    { id: 1, label: "Intro Hook", duration: "0:00 – 0:15", description: "Alina introduces the episode with an engaging hook", selected: false },
    { id: 2, label: "Product Overview", duration: "0:15 – 0:45", description: "Sergiu explains what the tool does", selected: false },
    { id: 3, label: "Key Features", duration: "0:45 – 1:30", description: "Deep dive into top 3 features with visuals", selected: false },
    { id: 4, label: "Client Story", duration: "1:30 – 2:15", description: "Real-world use case and results", selected: false },
    { id: 5, label: "Benefits Recap", duration: "2:15 – 2:45", description: "Summary of 3 main benefits", selected: false },
    { id: 6, label: "CTA & Outro", duration: "2:45 – 3:00", description: "Call to action and closing", selected: false },
  ]);

  const generate = () => {
    setState("loading");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setState("done"); return 100; }
        return p + Math.random() * 1.5 + 0.5;
      });
    }, 500);
  };

  const togglePlay = () => {
    if (playing) {
      clearInterval(playRef.current);
      setPlaying(false);
    } else {
      setPlaying(true);
      playRef.current = setInterval(() => {
        setVideoTime((t) => {
          if (t >= duration) { clearInterval(playRef.current); setPlaying(false); return 0; }
          return t + 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const progressPct = duration > 0 ? (videoTime / duration) * 100 : 0;

  const handleApprove = () => {
    setLocked(true);
    setPlaying(false);
    if (playRef.current) clearInterval(playRef.current);
    toast({ title: "Videos Approved ✓", description: "All variants locked. Proceeding to SEO content." });
    setTimeout(onApprove, 600);
  };

  const handleDownloadAll = () => {
    toast({ title: "Downloading...", description: `Preparing ${videoVariants.length} video files for download.` });
  };

  // Idle
  if (state === "idle") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">Video Generation</h3>
          <p className="text-sm text-muted-foreground">Kie.ai creates professional videos for every platform from your script and audio.</p>
        </div>

        <div className="glass rounded-xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}>
            <Video className="w-8 h-8 text-foreground" />
          </div>
          <h4 className="font-heading font-bold text-foreground text-lg mb-2">Generate with Kie.ai</h4>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">
            {videoVariants.length} platform variants for <span className="text-foreground font-medium">{form.toolName || "your tool"}</span> — auto-synced with your approved audio and thumbnails.
          </p>

          {/* Kie.ai Tool Selector */}
          <div className="max-w-sm mx-auto mb-6">
            <label className="text-xs text-muted-foreground mb-1.5 block text-left">Kie.ai Tool</label>
            <select
              value={kieTool}
              onChange={(e) => setKieTool(e.target.value)}
              className="w-full h-11 rounded-lg bg-muted border border-border px-3 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
            >
              {kieTools.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          {/* Config preview */}
          <div className="glass rounded-lg p-4 max-w-md mx-auto mb-6 text-left space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Kie.ai Configuration</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Tool</span><span className="text-foreground font-medium">{kieTools.find((t) => t.value === kieTool)?.label}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Format</span><span className="text-foreground font-medium">MP4</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Resolution</span><span className="text-foreground font-medium">1080p</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">FPS</span><span className="text-foreground font-medium">30</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="text-foreground font-medium">{form.videoDuration}s</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Variants</span><span className="text-foreground font-medium">{videoVariants.length} platforms</span></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {videoVariants.map((v) => (
              <Badge key={v.id} variant="outline" className="border-border text-xs">{v.icon} {v.platform}</Badge>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={generate}
              size="lg"
              className="gap-2 font-semibold text-foreground px-8"
              style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
            >
              <Sparkles className="w-5 h-5" /> Generate All Videos
            </Button>
            <Button variant="outline" onClick={() => toast({ title: "Upload Custom", description: "File picker: MP4, MOV, WebM supported." })} className="gap-2 border-border text-foreground hover:bg-muted">
              <Upload className="w-4 h-4" /> Upload Custom
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (state === "loading") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">Generating Videos...</h3>
          <p className="text-sm text-muted-foreground">Kie.ai is rendering {videoVariants.length} platform variants. This may take 1-3 minutes.</p>
        </div>
        <div className="glass rounded-xl p-10 text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 mx-auto mb-6">
            <div className="w-full h-full rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}>
              <Video className="w-8 h-8 text-foreground" />
            </div>
          </motion.div>
          <div className="max-w-sm mx-auto mb-4">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, hsl(214 84% 50%), hsl(155 100% 41%))", width: `${Math.min(progress, 100)}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{Math.round(Math.min(progress, 100))}% complete</p>
          </div>
          <div className="space-y-2 text-xs text-muted-foreground">
            {progress > 5 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>🎬 Syncing audio with script timeline...</motion.p>}
            {progress > 20 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>🖼️ Compositing scenes with thumbnails...</motion.p>}
            {progress > 40 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>▶️ Rendering YouTube (16:9)...</motion.p>}
            {progress > 55 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>🎵 Rendering TikTok (9:16)...</motion.p>}
            {progress > 70 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>📸 Rendering Instagram Reels (9:16)...</motion.p>}
            {progress > 82 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>💼 Rendering LinkedIn, Facebook, Twitter...</motion.p>}
            {progress > 92 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>📝 Generating auto-subtitles...</motion.p>}
          </div>
        </div>
      </div>
    );
  }

  // Done — Video player + variants + scenes
  const isPortrait = currentVariant.aspect === "9:16";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">
            {locked ? "🔒 Videos Approved" : "🎬 Video Preview"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locked ? "All variants locked. Proceeding to SEO." : `${videoVariants.length} platform variants generated. Select to preview.`}
          </p>
        </div>
        <Badge className="bg-success/10 text-success border-0 text-xs font-semibold">{videoVariants.length} Variants Generated ✓</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Video Player — takes 2 cols */}
        <div className="lg:col-span-2 glass rounded-xl overflow-hidden">
          {/* Video area */}
          <div className={`relative bg-background/50 flex items-center justify-center overflow-hidden ${isPortrait ? "max-h-[420px]" : ""}`}>
            <img
              src={currentVariant.preview}
              alt={currentVariant.platform}
              className={`object-cover ${isPortrait ? "h-[400px] w-auto" : "w-full aspect-video"}`}
            />
            {/* Play overlay */}
            {!playing && (
              <button
                onClick={togglePlay}
                disabled={locked}
                className="absolute inset-0 flex items-center justify-center bg-background/30 transition-opacity hover:bg-background/20"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm" style={{ background: "linear-gradient(135deg, hsl(214 84% 50% / 0.9), hsl(155 100% 41% / 0.9))" }}>
                  <Play className="w-7 h-7 text-foreground ml-1" />
                </div>
              </button>
            )}
            {/* Subtitle overlay */}
            {subtitlesOn && playing && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2 max-w-[80%]">
                <p className="text-sm text-foreground text-center">
                  {videoTime < 15 ? "Bună tuturor și bine ați revenit la S Society Tech Talk!" :
                   videoTime < 45 ? "Astăzi vorbim despre un tool AI incredibil..." :
                   videoTime < 90 ? "Am construit o platformă de automatizare a conținutului..." :
                   "Folosim Gemini 2.5 Pro pentru generarea de conținut..."}
                </p>
              </div>
            )}
            {/* Platform badge */}
            <div className="absolute top-3 left-3 bg-background/70 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs font-medium text-foreground">
              {currentVariant.icon} {currentVariant.platform} • {currentVariant.aspect}
            </div>
          </div>

          {/* Player controls */}
          <div className="px-4 py-3 border-t border-border">
            {/* Progress bar */}
            <div
              className="h-1.5 rounded-full bg-muted mb-3 cursor-pointer overflow-hidden"
              onClick={(e) => {
                if (locked) return;
                const pct = (e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth;
                setVideoTime(Math.round(pct * duration));
              }}
            >
              <div className="h-full rounded-full transition-all" style={{ background: "linear-gradient(90deg, hsl(214 84% 50%), hsl(155 100% 41%))", width: `${progressPct}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => setVideoTime(Math.max(0, videoTime - 10))} disabled={locked} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button onClick={togglePlay} disabled={locked} className="w-10 h-10 rounded-full flex items-center justify-center text-foreground" style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}>
                  {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button onClick={() => setVideoTime(Math.min(duration, videoTime + 10))} disabled={locked} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
                <span className="text-xs text-muted-foreground font-mono ml-1">{formatTime(videoTime)} / {formatTime(duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSubtitlesOn(!subtitlesOn)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${subtitlesOn ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  CC
                </button>
                <span className="text-[10px] text-muted-foreground">{currentVariant.resolution} • 30fps</span>
              </div>
            </div>
          </div>
        </div>

        {/* Platform variants sidebar */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Platform Variants</h4>
            <div className="space-y-2">
              {videoVariants.map((v) => {
                const active = activeVariant === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => { setActiveVariant(v.id); setVideoTime(0); setPlaying(false); if (playRef.current) clearInterval(playRef.current); }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 text-left ${
                      active ? "bg-primary/10 ring-1 ring-primary" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="w-12 h-8 rounded overflow-hidden shrink-0">
                      <img src={v.preview} alt={v.platform} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{v.icon} {v.platform}</p>
                      <p className="text-[10px] text-muted-foreground">{v.aspect} • {v.resolution}</p>
                    </div>
                    {active && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scene editor toggle */}
          <button
            onClick={() => setScenesOpen(!scenesOpen)}
            className="w-full glass rounded-xl p-4 text-left hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Scene Editor</span>
              </div>
              <span className="text-xs text-muted-foreground">{scenes.length} scenes</span>
            </div>
          </button>
        </div>
      </div>

      {/* Scene Editor Panel */}
      <AnimatePresence>
        {scenesOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-heading font-bold text-foreground text-sm">Scene Editor</h4>
                <p className="text-xs text-muted-foreground">Select scenes to regenerate</p>
              </div>
              <div className="space-y-2">
                {scenes.map((scene) => (
                  <div
                    key={scene.id}
                    onClick={() => !locked && setScenes((s) => s.map((sc) => sc.id === scene.id ? { ...sc, selected: !sc.selected } : sc))}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      scene.selected ? "bg-primary/10 ring-1 ring-primary/30" : "bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 transition-colors ${
                      scene.selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {scene.selected ? <Check className="w-3.5 h-3.5" /> : <span className="text-xs">{scene.id}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{scene.label}</p>
                        <span className="text-[10px] text-muted-foreground font-mono">{scene.duration}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{scene.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              {scenes.some((s) => s.selected) && !locked && (
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                  <Button
                    onClick={() => {
                      toast({ title: "Regenerating Scenes", description: `${scenes.filter((s) => s.selected).length} scene(s) will be regenerated.` });
                      setScenes((s) => s.map((sc) => ({ ...sc, selected: false })));
                    }}
                    size="sm"
                    className="gap-1.5 text-foreground font-semibold"
                    style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Regenerate Selected
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setScenes((s) => s.map((sc) => ({ ...sc, selected: false })))} className="border-border text-foreground hover:bg-muted">
                    Clear Selection
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      {!locked && (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleApprove}
            className="gap-2 font-semibold text-foreground"
            style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
          >
            <Lock className="w-4 h-4" /> Approve & Continue
          </Button>
          <Button variant="outline" onClick={() => setScenesOpen(true)} className="gap-1.5 border-border text-foreground hover:bg-muted">
            <Edit3 className="w-4 h-4" /> Adjust Scenes
          </Button>
          <Button variant="outline" onClick={() => toast({ title: "Upload Custom", description: "File picker: MP4, MOV, WebM supported." })} className="gap-1.5 border-border text-foreground hover:bg-muted">
            <Upload className="w-4 h-4" /> Upload Custom
          </Button>
          <Button variant="outline" onClick={generate} className="gap-1.5 border-border text-foreground hover:bg-muted">
            <RefreshCw className="w-4 h-4" /> Regenerate All
          </Button>
          <Button variant="outline" onClick={handleDownloadAll} className="gap-1.5 border-border text-foreground hover:bg-muted ml-auto">
            <ArrowRight className="w-4 h-4 rotate-90" /> Download All
          </Button>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────
   STEP 6: SEO Content
   ────────────────────────────────── */

const seoTabs = ["YouTube", "Blog", "Social", "Email"] as const;
type SeoTab = typeof seoTabs[number];

const defaultSeoContent: Record<SeoTab, { title: string; body: string; tags: string }> = {
  YouTube: {
    title: "🚀 AI Content Factory — Automatizează-ți Tot Conținutul | S Society Tech Talk",
    body: `Descoperă cum poți automatiza complet crearea de conținut video, audio și text cu ajutorul AI.

În acest episod, Alina discută cu Sergiu, fondatorul platformei de automatizare a conținutului bazată pe AI, despre cum tool-ul lor folosește Gemini 2.5 Pro, Google Cloud TTS și Kie.ai pentru a genera automat tot ce ai nevoie — de la scripturi de podcast la videoclipuri optimizate pentru fiecare platformă.

📌 Ce vei învăța:
• Cum funcționează pipeline-ul AI end-to-end
• Studiu de caz real: reducerea timpului de creare cu 80%
• Cele 3 beneficii principale ale automatizării conținutului
• Cum să începi gratuit cu free tier-ul disponibil

🔗 Link-uri utile:
• Website: https://example.com
• Free Trial: https://example.com/signup
• Blog: https://example.com/blog

⏰ Timestamps:
0:00 - Intro
0:30 - Ce face tool-ul
1:30 - Demo live
2:30 - Studiu de caz
3:00 - CTA & Încheiere

#AIContent #Automatizare #ContentCreation #MarketingDigital #SocietyTechTalk`,
    tags: "AI content, automatizare conținut, marketing digital, Gemini AI, content creation, podcast, tech talk",
  },
  Blog: {
    title: "Cum să Automatizezi Crearea de Conținut cu AI — Ghid Complet 2025",
    body: `Crearea de conținut de calitate pentru multiple platforme este una dintre cele mai mari provocări pentru marketeri în 2025. Ce ar fi dacă ai putea introduce informațiile o singură dată și să primești automat tot ce ai nevoie?

## De ce contează automatizarea conținutului

Echipele de marketing petrec în medie 15-20 ore pe săptămână doar pe crearea de conținut. Cu o platformă bazată pe AI, acest timp se reduce dramatic.

## Cum funcționează

Pipeline-ul nostru folosește trei tehnologii principale:
1. **Gemini 2.5 Pro** — pentru generarea de scripturi și texte
2. **Google Cloud TTS** — pentru audio de calitate studio
3. **Kie.ai** — pentru producție video multi-platform

## Rezultate reale

O agenție de marketing din București a redus timpul de creare a conținutului cu 80%, menținând calitatea comparabilă cu o echipă de 5 persoane.

## Începe astăzi

Platforma oferă un free tier complet funcțional. Creează-ți primul proiect în mai puțin de 5 minute.`,
    tags: "automatizare conținut, AI marketing, content strategy, blog, ghid",
  },
  Social: {
    title: "LinkedIn / Instagram / Twitter Posts",
    body: `🔥 LinkedIn:
Am redus timpul de creare a conținutului cu 80% folosind AI. Iată cum:

Platforma noastră generează automat:
✅ Scripturi de podcast
✅ Audio cu voci distincte
✅ Video pentru 6+ platforme
✅ SEO optimizat

Rezultat? O agenție din București produce acum conținut pentru 10 clienți cu o echipă de 2 persoane.

#AIContent #MarketingAutomation #ContentCreation

---

📸 Instagram:
Automatizează-ți conținutul cu AI! 🤖✨
De la script la video publicat — totul într-un singur click.

Link in bio 👆

---

🐦 Twitter/X:
🚀 Just launched: AI-powered content factory

One input → Script + Audio + Video + SEO for 6 platforms

80% time savings. Real results.

Try free → link`,
    tags: "social media, linkedin, instagram, twitter, content automation",
  },
  Email: {
    title: "Subject: Automatizează-ți Conținutul — Încearcă Gratuit",
    body: `Salut {{name}},

Știu cât de greu este să creezi conținut de calitate pentru toate platformele. De aceea am construit ceva care te va ajuta.

Cu noua noastră platformă AI poți:
→ Genera scripturi de podcast în câteva secunde
→ Crea video-uri optimizate pentru YouTube, TikTok, Instagram
→ Obține texte SEO-ready pentru fiecare platformă

Un client real a redus timpul de producție cu 80%.

Încearcă gratuit aici: [CTA Button]

Cu drag,
Echipa S Society`,
    tags: "email marketing, newsletter, automation, AI",
  },
};

function StepSeo({ form, onApprove }: { form: ToolFormData; onApprove: () => void }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<SeoTab>("YouTube");
  const [content, setContent] = useState(defaultSeoContent);
  const [seoScore, setSeoScore] = useState(78);
  const [locked, setLocked] = useState(false);

  const current = content[activeTab];
  const titleLimit = activeTab === "YouTube" ? 100 : activeTab === "Email" ? 60 : 70;
  const bodyLimit = activeTab === "YouTube" ? 5000 : activeTab === "Blog" ? 10000 : 2200;

  const handleApprove = () => {
    setLocked(true);
    toast({ title: "SEO Content Approved ✓", description: "All platform content locked. Proceeding to social connections." });
    setTimeout(onApprove, 600);
  };

  const updateField = (field: "title" | "body" | "tags", value: string) => {
    setContent((c) => ({ ...c, [activeTab]: { ...c[activeTab], [field]: value } }));
    // Simulate score change
    setSeoScore(Math.min(100, Math.max(40, 78 + Math.floor(Math.random() * 10 - 5))));
  };

  const scoreColor = seoScore >= 80 ? "text-success" : seoScore >= 60 ? "text-warning" : "text-accent";
  const scoreBg = seoScore >= 80 ? "bg-success" : seoScore >= 60 ? "bg-warning" : "bg-accent";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">
            {locked ? "🔒 SEO Content Approved" : "🔍 SEO Content Generation"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locked ? "All content locked. Proceeding to social connections." : "AI-optimized copy for every platform. Edit inline."}
          </p>
        </div>
        {/* SEO Score */}
        <div className="flex items-center gap-3">
          <div className="glass rounded-lg px-4 py-2 flex items-center gap-3">
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke={seoScore >= 80 ? "hsl(var(--success))" : seoScore >= 60 ? "hsl(var(--warning))" : "hsl(var(--accent))"} strokeWidth="3" strokeDasharray={`${seoScore * 0.942} 100`} strokeLinecap="round" />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${scoreColor}`}>{seoScore}</span>
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">SEO Score</p>
              <p className={`text-[10px] font-medium ${scoreColor}`}>{seoScore >= 80 ? "Excellent" : seoScore >= 60 ? "Good" : "Needs Work"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="flex border-b border-border">
          {seoTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              {tab === "YouTube" && "📺 "}{tab === "Blog" && "📝 "}{tab === "Social" && "📱 "}{tab === "Email" && "✉️ "}{tab}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-foreground">Title</label>
              <span className={`text-[10px] ${current.title.length > titleLimit ? "text-accent" : "text-muted-foreground"}`}>
                {current.title.length}/{titleLimit}
              </span>
            </div>
            <Input
              value={current.title}
              onChange={(e) => updateField("title", e.target.value)}
              disabled={locked}
              className="bg-muted border-border"
            />
          </div>

          {/* Body */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-foreground">Content</label>
              <span className={`text-[10px] ${current.body.length > bodyLimit ? "text-accent" : "text-muted-foreground"}`}>
                {current.body.length}/{bodyLimit}
              </span>
            </div>
            <Textarea
              value={current.body}
              onChange={(e) => updateField("body", e.target.value)}
              disabled={locked}
              className="bg-muted border-border min-h-[280px] font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-foreground">Tags / Keywords</label>
              <span className="text-[10px] text-muted-foreground">{current.tags.split(",").length} tags</span>
            </div>
            <Input
              value={current.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              disabled={locked}
              className="bg-muted border-border text-xs"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      {!locked && (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleApprove}
            className="gap-2 font-semibold text-foreground"
            style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
          >
            <Lock className="w-4 h-4" /> Approve & Continue
          </Button>
          <Button variant="outline" onClick={() => toast({ title: "Regenerating SEO content...", description: "AI will create fresh optimized copy." })} className="gap-1.5 border-border text-foreground hover:bg-muted">
            <RefreshCw className="w-4 h-4" /> Regenerate
          </Button>
          <Button variant="outline" onClick={() => { navigator.clipboard.writeText(`${current.title}\n\n${current.body}\n\nTags: ${current.tags}`); toast({ title: "Copied!" }); }} className="gap-1.5 border-border text-foreground hover:bg-muted ml-auto">
            <Copy className="w-4 h-4" /> Copy {activeTab}
          </Button>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────
   STEP 7: Social Media Connections
   ────────────────────────────────── */

interface PlatformConnection {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  scheduleTime: string;
  enabled: boolean;
}

const defaultPlatforms: PlatformConnection[] = [
  { id: "youtube", name: "YouTube", icon: "📺", connected: true, scheduleTime: "immediate", enabled: true },
  { id: "facebook", name: "Facebook", icon: "📘", connected: true, scheduleTime: "+5min", enabled: true },
  { id: "instagram", name: "Instagram", icon: "📸", connected: true, scheduleTime: "+10min", enabled: true },
  { id: "tiktok", name: "TikTok", icon: "🎵", connected: true, scheduleTime: "+15min", enabled: true },
  { id: "pinterest", name: "Pinterest", icon: "📌", connected: true, scheduleTime: "+30min", enabled: true },
  { id: "linkedin", name: "LinkedIn", icon: "💼", connected: false, scheduleTime: "+20min", enabled: false },
  { id: "twitter", name: "Twitter/X", icon: "🐦", connected: false, scheduleTime: "+25min", enabled: false },
];

const scheduleOptions = [
  { value: "immediate", label: "Immediately" },
  { value: "+5min", label: "+5 minutes" },
  { value: "+10min", label: "+10 minutes" },
  { value: "+15min", label: "+15 minutes" },
  { value: "+20min", label: "+20 minutes" },
  { value: "+25min", label: "+25 minutes" },
  { value: "+30min", label: "+30 minutes" },
  { value: "+1hr", label: "+1 hour" },
  { value: "+2hr", label: "+2 hours" },
  { value: "custom", label: "Custom time..." },
];

function StepSocial({ form, onApprove }: { form: ToolFormData; onApprove: () => void }) {
  const { toast } = useToast();
  const [platforms, setPlatforms] = useState(defaultPlatforms);
  const [locked, setLocked] = useState(false);
  const [bulkTime, setBulkTime] = useState("");

  const connectedCount = platforms.filter((p) => p.connected).length;
  const enabledCount = platforms.filter((p) => p.enabled).length;

  const handleConnect = (id: string) => {
    toast({ title: "OAuth Flow", description: `Redirecting to ${id} authorization... (simulated)` });
    setTimeout(() => {
      setPlatforms((ps) => ps.map((p) => p.id === id ? { ...p, connected: true, enabled: true } : p));
      toast({ title: "Connected!", description: `${id} account successfully connected.` });
    }, 1500);
  };

  const handleApprove = () => {
    if (enabledCount === 0) {
      toast({ title: "No platforms enabled", description: "Enable at least one platform to continue.", variant: "destructive" });
      return;
    }
    setLocked(true);
    toast({ title: "Platforms Configured ✓", description: `${enabledCount} platforms scheduled. Proceeding to final review.` });
    setTimeout(onApprove, 600);
  };

  const handleBulkSchedule = () => {
    if (!bulkTime) return;
    setPlatforms((ps) => ps.map((p) => p.connected && p.enabled ? { ...p, scheduleTime: bulkTime } : p));
    toast({ title: "Bulk Schedule Applied", description: `All enabled platforms set to ${scheduleOptions.find((o) => o.value === bulkTime)?.label}.` });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">
            {locked ? "🔒 Platforms Configured" : "🔗 Social Media Connections"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locked ? `${enabledCount} platforms scheduled.` : "Connect and schedule publishing for each platform."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-success/30 text-success text-xs">{connectedCount} connected</Badge>
          <Badge variant="outline" className="border-primary/30 text-primary text-xs">{enabledCount} enabled</Badge>
        </div>
      </div>

      {/* Bulk schedule */}
      {!locked && (
        <div className="glass rounded-xl p-4 flex items-center gap-3 flex-wrap">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground font-medium">Bulk Schedule:</span>
          <select
            value={bulkTime}
            onChange={(e) => setBulkTime(e.target.value)}
            className="h-9 rounded-lg bg-muted border border-border px-3 text-sm text-foreground"
          >
            <option value="">Select time...</option>
            {scheduleOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <Button size="sm" variant="outline" onClick={handleBulkSchedule} disabled={!bulkTime} className="border-border text-foreground hover:bg-muted">
            Apply to All
          </Button>
        </div>
      )}

      {/* Platform list */}
      <div className="space-y-2">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={`glass rounded-xl p-4 flex items-center gap-4 transition-all duration-200 ${
              locked && !platform.enabled ? "opacity-40" : ""
            } ${platform.enabled ? "ring-1 ring-primary/20" : ""}`}
          >
            {/* Icon + Name */}
            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-xl shrink-0">
              {platform.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{platform.name}</p>
                {platform.connected ? (
                  <Badge className="bg-success/10 text-success border-0 text-[10px]">✓ Connected</Badge>
                ) : (
                  <Badge className="bg-warning/10 text-warning border-0 text-[10px]">⚠ Not Connected</Badge>
                )}
              </div>
              {platform.connected && platform.enabled && (
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Scheduled: {scheduleOptions.find((o) => o.value === platform.scheduleTime)?.label || platform.scheduleTime}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {!platform.connected ? (
                <Button
                  size="sm"
                  onClick={() => handleConnect(platform.id)}
                  disabled={locked}
                  className="gap-1.5 text-foreground font-semibold text-xs"
                  style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
                >
                  <Share2 className="w-3.5 h-3.5" /> Connect
                </Button>
              ) : (
                <>
                  <select
                    value={platform.scheduleTime}
                    onChange={(e) => !locked && setPlatforms((ps) => ps.map((p) => p.id === platform.id ? { ...p, scheduleTime: e.target.value } : p))}
                    disabled={locked || !platform.enabled}
                    className="h-8 rounded-lg bg-muted border border-border px-2 text-xs text-foreground"
                  >
                    {scheduleOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <button
                    onClick={() => !locked && setPlatforms((ps) => ps.map((p) => p.id === platform.id ? { ...p, enabled: !p.enabled } : p))}
                    disabled={locked}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      platform.enabled ? "bg-success" : "bg-muted"
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${
                      platform.enabled ? "left-[22px]" : "left-0.5"
                    }`} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      {!locked && (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleApprove}
            className="gap-2 font-semibold text-foreground"
            style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
          >
            <Lock className="w-4 h-4" /> Confirm & Continue
          </Button>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────
   STEP 8: Final Review + Botato
   ────────────────────────────────── */

interface ReviewSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  step: number;
  status: "ready" | "needs-edit";
  summary: string;
}

function StepReview({ form, onBack, onPublish }: { form: ToolFormData; onBack: (step: number) => void; onPublish: () => void }) {
  const { toast } = useToast();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [autoEngagement, setAutoEngagement] = useState(true);

  const sections: ReviewSection[] = [
    { id: "script", label: "Script", icon: <FileText className="w-4 h-4" />, step: 2, status: "ready", summary: "11 dialogue lines • ~180s • Romanian • 2 speakers" },
    { id: "audio", label: "Audio", icon: <Headphones className="w-4 h-4" />, step: 3, status: "ready", summary: "48kHz WAV • Wavenet voices • 180s duration" },
    { id: "thumbnail", label: "Thumbnail", icon: <Image className="w-4 h-4" />, step: 4, status: "ready", summary: "Variation A selected • 1280×720 • Professional style" },
    { id: "video", label: "Video", icon: <Video className="w-4 h-4" />, step: 5, status: "ready", summary: "6 platform variants • 1080p • Auto-subtitles ON" },
    { id: "seo", label: "SEO Content", icon: <Search className="w-4 h-4" />, step: 6, status: "ready", summary: "YouTube, Blog, Social, Email • Score: 78/100" },
    { id: "platforms", label: "Platforms", icon: <Share2 className="w-4 h-4" />, step: 7, status: "ready", summary: "5 platforms connected • Staggered schedule" },
  ];

  const handlePublish = () => onPublish();

  const handleDraft = () => {
    toast({ title: "Draft Saved", description: "Your project has been saved as a draft. Resume anytime from the Projects page." });
  };


  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">📋 Final Review</h3>
          <p className="text-sm text-muted-foreground">Review all generated content. Click [Edit] to return to any step.</p>
        </div>
        <Badge className="bg-success/10 text-success border-0 text-xs font-semibold">All Steps Complete ✓</Badge>
      </div>

      {/* Content Summary Sections */}
      <div className="space-y-2">
        {sections.map((section) => {
          const isExpanded = expandedSection === section.id;
          return (
            <div key={section.id} className="glass rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/20 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {section.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{section.label}</p>
                    <Badge className="bg-success/10 text-success border-0 text-[10px]">Ready</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{section.summary}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); onBack(section.step); }}
                  className="border-border text-foreground hover:bg-muted text-xs shrink-0"
                >
                  <Edit3 className="w-3 h-3 mr-1" /> Edit
                </Button>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-muted-foreground">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0 border-t border-border">
                      <div className="bg-muted/30 rounded-lg p-3 mt-3">
                        <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                          {section.id === "script" && "11 dialogue lines between Alina (Host) and Sergiu (Founder). Includes hook, benefits, client story, and CTA. Language: Romanian."}
                          {section.id === "audio" && "Generated via Google Cloud TTS. Voices: ro-RO-Wavenet-A (Alina), ro-RO-Wavenet-B (Sergiu). Sample rate: 48kHz. Duration: ~180s."}
                          {section.id === "thumbnail" && "3 variations generated via Gemini Image. Selected: Variation A (Tech Futuristic). Resolution: 1280×720. On-brand colors applied."}
                          {section.id === "video" && "6 platform variants rendered by Kie.ai. YouTube (16:9), TikTok (9:16), Instagram Reels (9:16), LinkedIn (16:9), Facebook (16:9), Twitter (16:9). All with auto-subtitles."}
                          {section.id === "seo" && "Platform-specific content generated: YouTube description (5000 chars), Blog post (2500 words), Social media posts (LinkedIn, Instagram, Twitter), Email newsletter template."}
                          {section.id === "platforms" && "5 platforms connected and enabled: YouTube (immediate), Facebook (+5min), Instagram (+10min), TikTok (+15min), Pinterest (+30min). LinkedIn & Twitter pending connection."}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Botato Integration */}
      <div className="glass rounded-xl p-5 space-y-4" style={{ borderColor: "hsl(var(--primary) / 0.3)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}>
            🤖
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Botato Workflow</p>
            <p className="text-xs text-muted-foreground">Automated cross-platform publishing & engagement</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-foreground">5</p>
            <p className="text-[10px] text-muted-foreground">Posts Scheduled</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-success">ON</p>
            <p className="text-[10px] text-muted-foreground">Auto-Engagement</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-primary">50K-100K</p>
            <p className="text-[10px] text-muted-foreground">Est. Impressions</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-foreground">30min</p>
            <p className="text-[10px] text-muted-foreground">Publish Window</p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-muted/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">Auto-Engagement</span>
            <span className="text-xs text-muted-foreground">(Likes, comments, shares automation)</span>
          </div>
          <button
            onClick={() => setAutoEngagement(!autoEngagement)}
            className={`w-10 h-5 rounded-full transition-colors relative ${autoEngagement ? "bg-success" : "bg-muted"}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${autoEngagement ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Reach Estimator */}
      <div className="glass rounded-xl p-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">📊 Estimated Reach</h4>
        <div className="space-y-2">
          {[
            { platform: "📺 YouTube", reach: "20K-40K views", engagement: "2.5% CTR" },
            { platform: "📘 Facebook", reach: "10K-20K reach", engagement: "3.1% engagement" },
            { platform: "📸 Instagram", reach: "8K-15K reach", engagement: "4.2% engagement" },
            { platform: "🎵 TikTok", reach: "15K-30K views", engagement: "5.8% engagement" },
            { platform: "📌 Pinterest", reach: "5K-10K impressions", engagement: "1.8% saves" },
          ].map((item) => (
            <div key={item.platform} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-foreground">{item.platform}</span>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">{item.reach}</span>
                <Badge variant="outline" className="border-border text-[10px]">{item.engagement}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={handlePublish}
          size="lg"
          className="gap-2 font-semibold text-foreground px-8"
          style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
        >
          <Rocket className="w-5 h-5" /> Publish 🚀
        </Button>
        <Button variant="outline" onClick={handleDraft} className="gap-2 border-border text-foreground hover:bg-muted">
          <FileText className="w-4 h-4" /> Save as Draft
        </Button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────
   STEP 9: Publishing + Tracking
   ────────────────────────────────── */

interface PlatformPublishStatus {
  id: string;
  name: string;
  emoji: string;
  status: "pending" | "publishing" | "published" | "failed" | "scheduled";
  scheduledTime?: string;
  publishedUrl?: string;
  progress: number;
}

function StepPublish({ form }: { form: ToolFormData }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [platforms, setPlatforms] = useState<PlatformPublishStatus[]>([
    { id: "youtube", name: "YouTube", emoji: "📺", status: "pending", progress: 0 },
    { id: "facebook", name: "Facebook", emoji: "📘", status: "pending", progress: 0 },
    { id: "instagram", name: "Instagram", emoji: "📸", status: "pending", progress: 0 },
    { id: "tiktok", name: "TikTok", emoji: "🎵", status: "scheduled", scheduledTime: "10:15 AM", progress: 0 },
    { id: "pinterest", name: "Pinterest", emoji: "📌", status: "scheduled", scheduledTime: "10:30 AM", progress: 0 },
  ]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [botatoActive, setBotatoActive] = useState(true);
  const [analyticsReady, setAnalyticsReady] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval>>();

  // Simulated publishing poll every 1.5s
  useEffect(() => {
    pollingRef.current = setInterval(() => {
      setPlatforms((prev) => {
        const updated = prev.map((p) => {
          if (p.status === "published" || p.status === "failed") return p;
          if (p.status === "scheduled") return p; // scheduled ones stay until their time

          if (p.status === "pending") {
            return { ...p, status: "publishing" as const, progress: 10 };
          }

          // publishing → increment
          const newProgress = Math.min(p.progress + Math.random() * 18 + 8, 100);
          if (newProgress >= 100) {
            return {
              ...p,
              status: "published" as const,
              progress: 100,
              publishedUrl: `https://${p.id}.com/watch?v=demo_${form.toolName.replace(/\s/g, "_")}`,
            };
          }
          return { ...p, progress: newProgress };
        });

        // After first 3 are published, start scheduled ones
        const publishedCount = updated.filter((p) => p.status === "published").length;
        if (publishedCount >= 3) {
          return updated.map((p) =>
            p.status === "scheduled" && p.progress === 0
              ? { ...p, status: "publishing" as const, progress: 5 }
              : p
          );
        }
        return updated;
      });
    }, 1500);

    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [form.toolName]);

  // Track overall progress
  useEffect(() => {
    const total = platforms.reduce((sum, p) => sum + p.progress, 0);
    const avg = total / platforms.length;
    setOverallProgress(avg);

    if (platforms.every((p) => p.status === "published" || p.status === "failed")) {
      if (pollingRef.current) clearInterval(pollingRef.current);
      setAnalyticsReady(true);
      toast({ title: "🎉 All platforms published!", description: "Your content is live everywhere." });
    }
  }, [platforms, toast]);

  const allDone = platforms.every((p) => p.status === "published" || p.status === "failed");
  const publishedCount = platforms.filter((p) => p.status === "published").length;
  const failedCount = platforms.filter((p) => p.status === "failed").length;

  const statusIcon = (status: PlatformPublishStatus["status"]) => {
    switch (status) {
      case "published": return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "publishing": return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case "failed": return <AlertCircle className="w-5 h-5 text-destructive" />;
      case "scheduled": return <Clock className="w-5 h-5 text-warning" />;
      default: return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const statusLabel = (p: PlatformPublishStatus) => {
    switch (p.status) {
      case "published": return "Published";
      case "publishing": return `Publishing... ${Math.round(p.progress)}%`;
      case "failed": return "Failed";
      case "scheduled": return `Scheduled ${p.scheduledTime}`;
      default: return "Pending";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">
            {allDone ? "🎉 Published!" : "🚀 Publishing in Progress..."}
          </h3>
          <p className="text-sm text-muted-foreground">
            {allDone
              ? "Your content is now live across all platforms."
              : "Distributing content to all connected platforms via Botato."}
          </p>
        </div>
        {allDone && (
          <Badge className="bg-success/10 text-success border-0 text-sm font-semibold px-3 py-1">
            {publishedCount}/{platforms.length} Live ✓
          </Badge>
        )}
      </div>

      {/* Overall Progress */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-foreground">Overall Progress</p>
          <span className="text-sm font-bold text-primary">{Math.round(overallProgress)}%</span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
            animate={{ width: `${Math.min(overallProgress, 100)}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-success" /> {publishedCount} Published</span>
          {failedCount > 0 && <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3 text-destructive" /> {failedCount} Failed</span>}
          <span className="flex items-center gap-1"><Loader2 className="w-3 h-3" /> {platforms.filter((p) => p.status === "publishing").length} In Progress</span>
        </div>
      </div>

      {/* Per-platform Status */}
      <div className="space-y-3">
        {platforms.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-4">
              {/* Platform icon & name */}
              <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-lg shrink-0">
                {p.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <div className="flex items-center gap-2">
                    {statusIcon(p.status)}
                    <span className={`text-xs font-medium ${
                      p.status === "published" ? "text-success" :
                      p.status === "failed" ? "text-destructive" :
                      p.status === "publishing" ? "text-primary" :
                      "text-muted-foreground"
                    }`}>
                      {statusLabel(p)}
                    </span>
                  </div>
                </div>
                {/* Progress bar per platform */}
                {(p.status === "publishing" || p.status === "published") && (
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: p.status === "published"
                          ? "hsl(var(--success))"
                          : "linear-gradient(90deg, hsl(214 84% 50%), hsl(155 100% 41%))",
                      }}
                      animate={{ width: `${p.progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </div>
              {/* View link */}
              {p.status === "published" && p.publishedUrl && (
                <a
                  href={p.publishedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 shrink-0"
                >
                  View <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {p.status === "failed" && (
                <Button size="sm" variant="outline" className="text-xs border-destructive/30 text-destructive hover:bg-destructive/10 shrink-0">
                  <RefreshCw className="w-3 h-3 mr-1" /> Retry
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Botato Status */}
      <div className="glass rounded-xl p-5 space-y-3" style={{ borderColor: "hsl(var(--primary) / 0.3)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}>
            🤖
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Botato Workflow</p>
            <p className="text-xs text-muted-foreground">
              {allDone ? "Auto-engagement active across all platforms" : "Waiting for all platforms to publish..."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {botatoActive ? (
              <Badge className="bg-success/10 text-success border-0 text-[10px]">
                <Wifi className="w-3 h-3 mr-1" /> Active
              </Badge>
            ) : (
              <Badge variant="outline" className="border-muted text-muted-foreground text-[10px]">
                <WifiOff className="w-3 h-3 mr-1" /> Inactive
              </Badge>
            )}
          </div>
        </div>
        {allDone && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-3">
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-foreground">{publishedCount}</p>
              <p className="text-[10px] text-muted-foreground">Posts Live</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-success">ON</p>
              <p className="text-[10px] text-muted-foreground">Auto-Engagement</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-primary">50K-100K</p>
              <p className="text-[10px] text-muted-foreground">Est. Impressions</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Analytics Notice */}
      <div className="glass rounded-xl p-5 text-center">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 mx-auto mb-3 flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          {analyticsReady ? "Analytics are being collected" : "📊 Analytics available in 24 hours"}
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Track views, engagement, and conversions across all platforms in real-time.
        </p>
      </div>

      {/* Final Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => navigate("/analytics")}
          className="gap-2 font-semibold text-foreground"
          style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
        >
          <BarChart3 className="w-4 h-4" /> View Analytics
        </Button>
        <Button
          onClick={() => navigate("/create")}
          variant="outline"
          className="gap-2 border-border text-foreground hover:bg-muted"
        >
          <Plus className="w-4 h-4" /> Create New
        </Button>
        <Button
          variant="outline"
          className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
        >
          🤖 Botato Dashboard
        </Button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────
   Generic Step Placeholder
   ────────────────────────────────── */
function StepPlaceholder({ stepIndex }: { stepIndex: number }) {
  const s = steps[stepIndex];
  const Icon = s.icon;
  const descriptions: Record<number, string> = {
    0: "Set up your project basics and target platforms.",
    9: "Launch across all platforms simultaneously. Track publishing status in real-time.",
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-xl font-bold text-foreground mb-1">{s.label}</h3>
        <p className="text-sm text-muted-foreground">{descriptions[stepIndex] || "Coming soon."}</p>
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

/* ──────────────────────────────────
   Main Wizard
   ────────────────────────────────── */
export default function CreateWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<ToolFormData>({
    toolName: "",
    toolUrl: "",
    description: "",
    targetAudience: [],
    primaryGoal: "Awareness",
    videoDuration: "180",
    category: "Marketing",
  });

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepPlaceholder stepIndex={0} />;
      case 1: return <StepToolInput form={form} setForm={setForm} onGenerate={() => setCurrentStep(2)} />;
      case 2: return <StepScript form={form} onApprove={() => setCurrentStep(3)} />;
      case 3: return <StepAudio form={form} onApprove={() => setCurrentStep(4)} />;
      case 4: return <StepThumbnail form={form} onApprove={() => setCurrentStep(5)} />;
      case 5: return <StepVideo form={form} onApprove={() => setCurrentStep(6)} />;
      case 6: return <StepSeo form={form} onApprove={() => setCurrentStep(7)} />;
      case 7: return <StepSocial form={form} onApprove={() => setCurrentStep(8)} />;
      case 8: return <StepReview form={form} onBack={(step) => setCurrentStep(step)} onPublish={() => setCurrentStep(9)} />;
      case 9: return <StepPublish form={form} />;
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
            transition={{ duration: 0.25, ease: "easeOut" }}
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
            {currentStep >= 2 && currentStep < 8 && (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                variant="outline"
                className="gap-2 border-success/30 text-success hover:bg-success/10"
              >
                <Check className="w-4 h-4" /> Approve & Next
              </Button>
            )}
            {currentStep < 8 && (
              <Button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
                className="gap-2 font-semibold text-foreground"
                style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
