import { motion } from "framer-motion";
import {
  Plus, FolderOpen, BarChart3, Clock, TrendingUp, Eye,
  ThumbsUp, Zap, FileText, ArrowRight, CheckCircle2,
  Loader2, MoreHorizontal, ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from "recharts";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

const stats = [
  { icon: FolderOpen, label: "Total Projects", value: "24", change: "+3", positive: true, color: "primary" },
  { icon: CheckCircle2, label: "Published", value: "18", change: "+2", positive: true, color: "success" },
  { icon: Loader2, label: "In Progress", value: "6", change: "Active", positive: true, color: "warning" },
  { icon: TrendingUp, label: "Total Reach", value: "245K", change: "+18%", positive: true, color: "info" },
];

const colorMap: Record<string, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  success: { bg: "bg-success/10", text: "text-success" },
  warning: { bg: "bg-warning/10", text: "text-warning" },
  info: { bg: "bg-info/10", text: "text-info" },
};

const recentProjects = [
  { id: 1, name: "One Image AI Tool", status: "Published", step: "Done", modified: "2h ago", views: "2.4K", color: "success" },
  { id: 2, name: "SEO Audit Podcast", status: "In Progress", step: "Step 5/10", modified: "1d ago", views: "—", color: "warning" },
  { id: 3, name: "Product Hunt Launch", status: "Draft", step: "Step 2/10", modified: "3d ago", views: "—", color: "muted" },
  { id: 4, name: "SaaS Growth Campaign", status: "Published", step: "Done", modified: "5d ago", views: "8.1K", color: "success" },
  { id: 5, name: "Founder Interview #3", status: "Scheduled", step: "Ready", modified: "1w ago", views: "—", color: "info" },
];

const statusStyles: Record<string, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  muted: "bg-muted text-muted-foreground",
  info: "bg-info/10 text-info",
};

const weeklyData = [
  { day: "Mon", views: 1200, engagement: 320 },
  { day: "Tue", views: 1800, engagement: 480 },
  { day: "Wed", views: 2400, engagement: 640 },
  { day: "Thu", views: 3100, engagement: 820 },
  { day: "Fri", views: 2700, engagement: 710 },
  { day: "Sat", views: 3400, engagement: 900 },
  { day: "Sun", views: 4200, engagement: 1100 },
];

const platformData = [
  { platform: "YouTube", views: 4200 },
  { platform: "TikTok", views: 3800 },
  { platform: "Instagram", views: 2900 },
  { platform: "LinkedIn", views: 1800 },
  { platform: "Twitter/X", views: 1200 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 lg:p-8 space-y-8"
    >
      {/* Welcome Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
            👋 Welcome back, <span className="gradient-text">Sergiu</span>!
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Your AI content factory is ready. Let's create something amazing.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate("/create")}
            className="gap-2 font-semibold text-foreground"
            style={{ background: "linear-gradient(135deg, hsl(214 84% 50%), hsl(155 100% 41%))" }}
          >
            <Zap className="w-4 h-4" /> Create New Content
          </Button>
          <Button
            onClick={() => navigate("/templates")}
            variant="outline"
            className="gap-2 border-border text-foreground hover:bg-muted"
          >
            <FileText className="w-4 h-4" /> Templates
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const c = colorMap[s.color];
          return (
            <motion.div
              key={s.label}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="glass rounded-xl p-5 group hover:glow-primary transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${c.text}`} />
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.positive ? "bg-success/10 text-success" : "bg-accent/10 text-accent"}`}>
                  {s.change}
                </span>
              </div>
              <p className="text-3xl font-heading font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Projects Table */}
      <motion.div variants={item} className="glass rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-primary" />
            <h2 className="font-heading font-bold text-foreground">Recent Projects</h2>
          </div>
          <button onClick={() => navigate("/projects")} className="text-xs text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-6 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Project</th>
                <th className="text-left px-6 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Step</th>
                <th className="text-left px-6 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Views</th>
                <th className="text-left px-6 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Modified</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((p) => (
                <tr key={p.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors group cursor-pointer">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FolderOpen className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${statusStyles[p.color]}`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-muted-foreground hidden md:table-cell">{p.step}</td>
                  <td className="px-6 py-3.5 text-sm text-muted-foreground hidden lg:table-cell">{p.views}</td>
                  <td className="px-6 py-3.5 hidden md:table-cell">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {p.modified}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Open">
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="More">
                        <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Analytics Preview */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <h2 className="font-heading font-bold text-foreground">Weekly Performance</h2>
            </div>
            <button onClick={() => navigate("/analytics")} className="text-xs text-primary hover:underline">Details →</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="dashViewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(214, 84%, 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(214, 84%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dashEngGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(155, 100%, 41%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(155, 100%, 41%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(232, 25%, 22%)" />
              <XAxis dataKey="day" tick={{ fill: "hsl(233, 20%, 60%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(233, 20%, 60%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(232, 30%, 16%)", border: "1px solid hsl(232, 25%, 26%)", borderRadius: 10, color: "#fff", fontSize: 12 }}
                labelStyle={{ color: "hsl(233, 20%, 72%)" }}
              />
              <Area type="monotone" dataKey="views" stroke="hsl(214, 84%, 50%)" fill="url(#dashViewsGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="engagement" stroke="hsl(155, 100%, 41%)" fill="url(#dashEngGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Views
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-success" /> Engagement
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h2 className="font-heading font-bold text-foreground">By Platform</h2>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={platformData} layout="vertical" barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(232, 25%, 22%)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "hsl(233, 20%, 60%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="platform" type="category" tick={{ fill: "hsl(233, 20%, 60%)", fontSize: 11 }} axisLine={false} tickLine={false} width={75} />
              <Tooltip
                contentStyle={{ background: "hsl(232, 30%, 16%)", border: "1px solid hsl(232, 25%, 26%)", borderRadius: 10, color: "#fff", fontSize: 12 }}
                cursor={{ fill: "hsl(232, 25%, 20%)" }}
              />
              <Bar dataKey="views" fill="hsl(214, 84%, 50%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}
