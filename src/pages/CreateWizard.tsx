import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, Mic2, Headphones, Image, Video,
  Search, Share2, CheckCircle2, Rocket, ArrowLeft, ArrowRight,
  Check, RefreshCw, Edit3, Sparkles, Globe, Tag, Users, Target,
  HelpCircle, Copy, Lock, MessageSquare, Loader2, Clock, AlignLeft,
  Play, Pause, Volume2, VolumeX, Upload, Settings2, SkipBack, SkipForward
} from "lucide-react";
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
   Generic Step Placeholder
   ────────────────────────────────── */
function StepPlaceholder({ stepIndex }: { stepIndex: number }) {
  const s = steps[stepIndex];
  const Icon = s.icon;
  const descriptions: Record<number, string> = {
    0: "Set up your project basics and target platforms.",
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
