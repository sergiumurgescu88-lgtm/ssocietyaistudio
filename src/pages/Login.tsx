import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Loader2, Sparkles, Radio, Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { firebaseService } from "@/services/firebase";

const features = [
  { icon: Sparkles, label: "AI Intelligence", desc: "Powered by Gemini 2.5 Pro" },
  { icon: Radio, label: "Auto-Posting", desc: "Botato Integration" },
  { icon: Shield, label: "Enterprise Ready", desc: "Secure & Scalable" },
];

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await firebaseService.signUp(email, password);
        toast({ title: "Cont creat!", description: "Verifică-ți email-ul pentru confirmare." });
      } else {
        await firebaseService.signIn(email, password);
        toast({ title: "Bine ai revenit!", description: "Autentificare reușită." });
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({ title: "Introdu email-ul", description: "Completează câmpul de email mai întâi.", variant: "destructive" });
      return;
    }
    try {
      await firebaseService.resetPassword(email);
      toast({ title: "Email trimis!", description: "Verifică inbox-ul pentru link-ul de resetare." });
    } catch (err: any) {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-success/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-2xl w-full max-w-md relative"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl" style={{ background: "linear-gradient(90deg, hsl(214 84% 50%), hsl(155 100% 41%))" }} />

        <div className="p-10 text-center">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 space-y-2">
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

          {/* Auth Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="mt-6 space-y-3"
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 pl-10 pr-4 rounded-lg bg-muted/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Parolă"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full h-11 pl-10 pr-10 rounded-lg bg-muted/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {!isSignUp && (
              <div className="text-right">
                <button type="button" onClick={handleForgotPassword} className="text-xs text-primary hover:underline">
                  Am uitat parola
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 disabled:opacity-70 text-foreground"
              style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Creează cont" : "Autentifică-te"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.form>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-4 text-sm text-muted-foreground">
            {isSignUp ? "Ai deja cont?" : "Nu ai cont?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline font-medium">
              {isSignUp ? "Autentifică-te" : "Creează cont"}
            </button>
          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-4 text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <button className="text-primary hover:underline">Terms</button> &{" "}
            <button className="text-primary hover:underline">Privacy Policy</button>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
