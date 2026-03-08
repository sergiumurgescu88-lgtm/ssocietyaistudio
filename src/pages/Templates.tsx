import { motion } from "framer-motion";
import { Mic2, Video, FileText, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const templates = [
  { icon: Mic2, name: "Product Podcast", desc: "2-speaker podcast reviewing a SaaS tool", category: "Audio", color: "bg-primary/10 text-primary" },
  { icon: Video, name: "Product Launch Video", desc: "Multi-platform launch campaign", category: "Video", color: "bg-success/10 text-success" },
  { icon: FileText, name: "SEO Blog Bundle", desc: "Blog + social posts + newsletter", category: "Content", color: "bg-warning/10 text-warning" },
  { icon: TrendingUp, name: "Growth Campaign", desc: "Full funnel content for user acquisition", category: "Marketing", color: "bg-accent/10 text-accent" },
  { icon: Zap, name: "Quick Social Pack", desc: "Fast content for all social platforms", category: "Social", color: "bg-info/10 text-info" },
  { icon: Mic2, name: "Interview Format", desc: "Q&A style conversation about a topic", category: "Audio", color: "bg-primary/10 text-primary" },
];

export default function Templates() {
  const navigate = useNavigate();

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Templates</h1>
        <p className="text-sm text-muted-foreground mt-1">Start with a proven content format.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate("/create")}
              className="glass rounded-lg p-6 text-left hover:glow-primary transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-lg ${t.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{t.category}</span>
              </div>
              <h3 className="font-heading font-bold text-foreground mb-1">{t.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t.desc}</p>
              <div className="flex items-center gap-1 text-xs text-primary font-medium group-hover:gap-2 transition-all">
                Use Template <ArrowRight className="w-3 h-3" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
