import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Loader2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { firebaseService } from "@/services/firebase";
import { supabase } from "@/integrations/supabase/client";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    } else {
      // Also listen for PASSWORD_RECOVERY event
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setReady(true);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await firebaseService.updatePassword(password);
      toast({ title: "Parolă actualizată!", description: "Te poți autentifica acum." });
      navigate("/login");
    } catch (err: any) {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--gradient-hero)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl w-full max-w-md p-10 text-center"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}>
          <Zap className="w-7 h-7 text-foreground" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Resetare parolă</h1>
        <p className="text-sm text-muted-foreground mb-6">Introdu noua ta parolă</p>

        <form onSubmit={handleReset} className="space-y-3">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="Parolă nouă"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-muted/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 text-foreground hover:brightness-110 disabled:opacity-70"
            style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Actualizează parola"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
