import { motion } from "framer-motion";
import { FolderOpen, Search, Filter, Clock, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const projects = [
  { id: 1, name: "AI Automation Tool Launch", status: "Published", platforms: 5, date: "Mar 6, 2026", views: "2.4K" },
  { id: 2, name: "SaaS Marketing Podcast", status: "In Progress", platforms: 3, date: "Mar 5, 2026", views: "—" },
  { id: 3, name: "Product Hunt Campaign", status: "Draft", platforms: 7, date: "Mar 4, 2026", views: "—" },
  { id: 4, name: "Q1 Growth Strategy", status: "Published", platforms: 6, date: "Feb 28, 2026", views: "8.1K" },
  { id: 5, name: "Founder Interview Series", status: "Published", platforms: 4, date: "Feb 20, 2026", views: "5.6K" },
  { id: 6, name: "Feature Release Announcement", status: "Scheduled", platforms: 5, date: "Mar 10, 2026", views: "—" },
];

const statusColor: Record<string, string> = {
  Published: "bg-success/10 text-success",
  "In Progress": "bg-primary/10 text-primary",
  Draft: "bg-muted text-muted-foreground",
  Scheduled: "bg-warning/10 text-warning",
};

export default function Projects() {
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold text-foreground">Projects</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search projects..." className="pl-9 bg-muted border-border w-64" />
          </div>
          <Button variant="outline" size="icon" className="border-border text-foreground hover:bg-muted">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="glass rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Project</th>
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Platforms</th>
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Views</th>
              <th className="px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Date</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FolderOpen className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[p.status]}`}>{p.status}</span>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground hidden md:table-cell">{p.platforms}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground hidden md:table-cell">{p.views}</td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> {p.date}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <button className="p-1 rounded hover:bg-muted transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
