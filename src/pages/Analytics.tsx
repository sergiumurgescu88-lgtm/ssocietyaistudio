import { motion } from "framer-motion";
import { Eye, ThumbsUp, Share2, TrendingUp } from "lucide-react";
import StatCard from "@/components/StatCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const viewsData = [
  { name: "Mon", views: 400, engagement: 120 },
  { name: "Tue", views: 600, engagement: 200 },
  { name: "Wed", views: 800, engagement: 280 },
  { name: "Thu", views: 1200, engagement: 400 },
  { name: "Fri", views: 900, engagement: 350 },
  { name: "Sat", views: 1100, engagement: 420 },
  { name: "Sun", views: 1400, engagement: 500 },
];

const platformData = [
  { platform: "YouTube", views: 4200 },
  { platform: "TikTok", views: 3800 },
  { platform: "Instagram", views: 2900 },
  { platform: "LinkedIn", views: 1800 },
  { platform: "Twitter", views: 1200 },
  { platform: "Facebook", views: 900 },
];

export default function Analytics() {
  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-foreground">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Total Views" value="14.8K" change="+22%" positive />
        <StatCard icon={ThumbsUp} label="Engagement" value="4.2K" change="+15%" positive />
        <StatCard icon={Share2} label="Shares" value="892" change="+8%" positive />
        <StatCard icon={TrendingUp} label="Growth" value="28%" change="+5%" positive />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-6">
          <h2 className="font-heading font-bold text-foreground mb-4">Views & Engagement</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={viewsData}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(214 84% 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(214 84% 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(155 100% 41%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(155 100% 41%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(232 25% 26%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(233 20% 72%)", fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(233 20% 72%)", fontSize: 12 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(232 30% 18%)", border: "1px solid hsl(232 25% 26%)", borderRadius: 8, color: "#fff" }} />
              <Area type="monotone" dataKey="views" stroke="hsl(214 84% 50%)" fill="url(#viewsGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="engagement" stroke="hsl(155 100% 41%)" fill="url(#engGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-lg p-6">
          <h2 className="font-heading font-bold text-foreground mb-4">By Platform</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={platformData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(232 25% 26%)" />
              <XAxis type="number" tick={{ fill: "hsl(233 20% 72%)", fontSize: 12 }} axisLine={false} />
              <YAxis dataKey="platform" type="category" tick={{ fill: "hsl(233 20% 72%)", fontSize: 12 }} axisLine={false} width={80} />
              <Tooltip contentStyle={{ background: "hsl(232 30% 18%)", border: "1px solid hsl(232 25% 26%)", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="views" fill="hsl(214 84% 50%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
