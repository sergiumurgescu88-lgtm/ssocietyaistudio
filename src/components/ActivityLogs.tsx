import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Download, Trash2, RefreshCw, Shield, Clapperboard, Send, AlertTriangle, Save, Settings, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { activityLogService, type ActivityType } from "@/services/activityLog";
import { format, formatDistanceToNow } from "date-fns";

const typeConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  auth: { icon: <Shield className="w-4 h-4" />, label: "Auth", color: "text-primary" },
  generation: { icon: <Clapperboard className="w-4 h-4" />, label: "Generation", color: "text-primary" },
  publishing: { icon: <Send className="w-4 h-4" />, label: "Publishing", color: "text-success" },
  error: { icon: <AlertTriangle className="w-4 h-4" />, label: "Error", color: "text-destructive" },
  save: { icon: <Save className="w-4 h-4" />, label: "Save", color: "text-muted-foreground" },
  delete: { icon: <Trash2 className="w-4 h-4" />, label: "Delete", color: "text-destructive" },
  settings: { icon: <Settings className="w-4 h-4" />, label: "Settings", color: "text-muted-foreground" },
  billing: { icon: <CreditCard className="w-4 h-4" />, label: "Billing", color: "text-warning" },
};

const statusBadge: Record<string, { label: string; color: string }> = {
  success: { label: "SUCCESS", color: "bg-success/10 text-success" },
  warning: { label: "WARNING", color: "bg-warning/10 text-warning" },
  error: { label: "ERROR", color: "bg-destructive/10 text-destructive" },
};

const typeFilters: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "auth", label: "🔐 Auth" },
  { value: "generation", label: "🎬 Generation" },
  { value: "publishing", label: "📤 Publishing" },
  { value: "error", label: "⚠️ Errors" },
];

export default function ActivityLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [summary, setSummary] = useState({ success: 0, error: 0, auth: 0, publishing: 0, generation: 0 });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const typeFilter = filter !== "all" ? filter as ActivityType : undefined;
      const { logs: data } = await activityLogService.getLogs({ type: typeFilter, limit: 50 });
      setLogs(data);
      const summaryData = await activityLogService.getSummary();
      setSummary(summaryData);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, [filter]);

  const filtered = search
    ? logs.filter((l) =>
        l.title?.toLowerCase().includes(search.toLowerCase()) ||
        l.description?.toLowerCase().includes(search.toLowerCase())
      )
    : logs;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Successes", value: summary.success, icon: "✅" },
          { label: "Errors", value: summary.error, icon: "⚠️" },
          { label: "Logins", value: summary.auth, icon: "🔐" },
          { label: "Published", value: summary.publishing, icon: "📤" },
          { label: "Generated", value: summary.generation, icon: "🎬" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-foreground">{s.icon} {s.value}</p>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted border-border"
          />
        </div>
        <Button variant="outline" size="sm" onClick={fetchLogs} className="shrink-0">
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {typeFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Logs */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-lg p-4 animate-pulse h-20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-lg p-8 text-center">
          <p className="text-muted-foreground text-sm">No activity logs found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((log, i) => {
            const tc = typeConfig[log.type] || typeConfig.save;
            const sb = statusBadge[log.status] || statusBadge.success;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="glass rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${tc.color}`}>{tc.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sb.color}`}>
                        {sb.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), "yyyy-MM-dd HH:mm:ss")}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-foreground">{log.title}</h4>
                    {log.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{log.description}</p>
                    )}
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {Object.entries(log.metadata).map(([key, val]) => (
                          <span key={key} className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
                            {key}: {String(val)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
