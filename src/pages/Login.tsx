import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Loader2, Sparkles, Radio, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const features = [
  { icon: Sparkles, label: "AI Intelligence", desc: "Powered by Gemini 2.5 Pro" },
  { icon: Radio, label: "Auto-Posting", desc: "Botato Integration" },
  { icon: Shield, label: "Enterprise Ready", desc: "Secure & Scalable" },
];

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Simulate auth — replace with Firebase signInWithPopup
      await new Promise((r) => setTimeout(r, 1500));
      toast({ title: "Welcome back!", description: "Signed in successfully." });
      navigate("/dashboard");
    } catch {
      toast({ title: "Sign-in failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-success/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-2xl w-full max-w-md relative"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Gradient top border */}
        <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl" style={{ background: "linear-gradient(90deg, hsl(214 84% 50%), hsl(155 100% 41%))" }} />

        <div className="p-10 text-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center relative"
            style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
          >
            <Zap className="w-8 h-8 text-foreground" />
            <div className="absolute inset-0 rounded-2xl animate-pulse-glow" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <h1 className="font-heading text-3xl font-bold text-foreground">S Society Hub</h1>
            <p className="text-sm font-semibold tracking-[0.2em] uppercase mt-1 gradient-text">AI Content Factory PRO</p>
          </motion.div>

          {/* Feature badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 space-y-2.5"
          >
            {features.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.1 }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-muted/40 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground leading-tight">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }} className="mt-8">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-12 rounded-lg font-semibold text-sm flex items-center justify-center gap-3 transition-all duration-200 hover:brightness-110 disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-foreground" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-foreground">Continue with Google</span>
                  <ArrowRight className="w-4 h-4 text-foreground" />
                </>
              )}
            </button>
          </motion.div>

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-xs text-muted-foreground"
          >
            By continuing, you agree to our{" "}
            <button className="text-primary hover:underline">Terms</button> &{" "}
            <button className="text-primary hover:underline">Privacy Policy</button>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
