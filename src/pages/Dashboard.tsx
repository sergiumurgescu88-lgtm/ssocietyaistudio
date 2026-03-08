import { motion } from "framer-motion";
import { Plus, FolderOpen, BarChart3, Clock, TrendingUp, Eye, ThumbsUp, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";

const recentProjects = [
  { id: 1, name: "AI Automation Tool Launch", status: "Published", platforms: 5, date: "2 hours ago" },
  { id: 2, name: "SaaS Marketing Podcast", status: "In Progress", platforms: 3, date: "5 hours ago" },
  { id: 3, name: "Product Hunt Campaign", status: "Draft", platforms: 7, date: "Yesterday" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground text-sm mt-1">Your AI content factory is ready to produce.</p>
        </div>
        <Button
          onClick={() => navigate("/create")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
        >
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FolderOpen} label="Total Projects" value="24" change="+3 this week" positive />
        <StatCard icon={Eye} label="Total Views" value="12.4K" change="+18%" positive />
        <StatCard icon={ThumbsUp} label="Engagement" value="3.2K" change="+12%" positive />
        <StatCard icon={TrendingUp} label="Growth Rate" value="24%" change="+5%" positive />
      </div>

      {/* Quick Actions + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-lg p-6"
        >
          <h2 className="font-heading font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { icon: Zap, label: "Create from Template", desc: "Start with a proven format", to: "/templates" },
              { icon: Plus, label: "Blank Project", desc: "Full custom creation", to: "/create" },
              { icon: BarChart3, label: "View Analytics", desc: "Check performance", to: "/analytics" },
            ].map(({ icon: Icon, label, desc, to }) => (
              <button
                key={label}
                onClick={() => navigate(to)}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-lg p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-foreground">Recent Projects</h2>
            <button onClick={() => navigate("/projects")} className="text-xs text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {recentProjects.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {p.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{p.platforms} platforms</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    p.status === "Published" ? "bg-success/10 text-success" :
                    p.status === "In Progress" ? "bg-primary/10 text-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
