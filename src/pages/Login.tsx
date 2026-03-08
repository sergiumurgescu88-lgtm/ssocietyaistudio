import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--gradient-hero)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-2xl p-10 w-full max-w-md text-center"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
          <Zap className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">S Society Hub</h1>
        <p className="text-muted-foreground mb-1 text-sm font-medium tracking-wider uppercase">AI Content Factory PRO</p>
        <p className="text-muted-foreground text-sm mb-8">
          One input. Every platform. Fully automated.
        </p>

        <Button
          onClick={() => navigate("/dashboard")}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </Button>

        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mx-auto"
        >
          Continue as guest <ArrowRight className="w-3 h-3" />
        </button>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span>🎙️ Podcasts</span>
            <span>🎬 Videos</span>
            <span>📱 Social</span>
            <span>📊 Analytics</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
