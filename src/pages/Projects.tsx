import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen, Search, Filter, Clock, MoreHorizontal, Plus, Eye, Pencil, BarChart3,
  Copy, Trash2, RefreshCw, ChevronDown, X, ExternalLink, Download, FileText
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { firebaseService } from "@/services/firebase";
import { useNavigate } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";

type ProjectStatus = "draft" | "in_progress" | "published" | "failed" | "scheduled";

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  published: { label: "Published", color: "bg-success/10 text-success", icon: "🟢" },
  in_progress: { label: "In Progress", color: "bg-primary/10 text-primary", icon: "🟡" },
  draft: { label: "Draft", color: "bg-muted text-muted-foreground", icon: "📝" },
  failed: { label: "Failed", color: "bg-destructive/10 text-destructive", icon: "🔴" },
  scheduled: { label: "Scheduled", color: "bg-warning/10 text-warning", icon: "📅" },
};

const statusFilters = [
  { value: "all", label: "All" },
  { value: "published", label: "🟢 Published" },
  { value: "in_progress", label: "🟡 In Progress" },
  { value: "failed", label: "🔴 Failed" },
  { value: "draft", label: "📝 Draft" },
];

const sortOptions = [
  { value: "updated_at", label: "Last Updated" },
  { value: "created_at", label: "Date Created" },
  { value: "name", label: "Name (A-Z)" },
];

export default function Projects() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated_at");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [deleteProject, setDeleteProject] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      const data = await firebaseService.getProjects();
      setProjects(data || []);
    } catch {
      toast({ title: "Error loading projects", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filtered = projects
    .filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      return new Date(b[sortBy] || 0).getTime() - new Date(a[sortBy] || 0).getTime();
    });

  const statusCounts = {
    total: projects.length,
    published: projects.filter((p) => p.status === "published").length,
    in_progress: projects.filter((p) => p.status === "in_progress").length,
    failed: projects.filter((p) => p.status === "failed").length,
    draft: projects.filter((p) => p.status === "draft").length,
  };

  const handleDelete = async () => {
    if (!deleteProject) return;
    setDeleting(true);
    try {
      await firebaseService.deleteProject(deleteProject.id);
      setProjects((prev) => prev.filter((p) => p.id !== deleteProject.id));
      toast({ title: "Project deleted" });
    } catch {
      toast({ title: "Failed to delete project", variant: "destructive" });
    } finally {
      setDeleting(false);
      setDeleteProject(null);
    }
  };

  const handleDuplicate = async (project: any) => {
    try {
      const { id, created_at, updated_at, ...rest } = project;
      await firebaseService.createProject({ ...rest, name: `${project.name} (Copy)`, status: "draft" });
      await loadProjects();
      toast({ title: "Project duplicated" });
    } catch {
      toast({ title: "Failed to duplicate", variant: "destructive" });
    }
  };

  const sc = (status: string) => statusConfig[status] || statusConfig.draft;

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-primary" /> Projects & Promotions
        </h1>
        <Button onClick={() => navigate("/create")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" /> Create New
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted border-border"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-44 bg-muted border-border">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              statusFilter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f.label}
            {f.value !== "all" && (
              <span className="ml-1 opacity-70">
                ({statusCounts[f.value as keyof typeof statusCounts] || 0})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-lg p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-lg p-12 text-center"
        >
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="font-heading text-lg font-bold text-foreground mb-2">
            {search || statusFilter !== "all" ? "No matching projects" : "No projects yet!"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Create your first AI-powered marketing video in minutes.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => navigate("/create")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Create Your First Project
            </Button>
            <Button onClick={() => navigate("/templates")} variant="outline">
              Browse Templates
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((p, i) => {
              const cfg = sc(p.status);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass rounded-lg p-5 hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer"
                  onClick={() => setSelectedProject(p)}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FolderOpen className="w-5 h-5 text-primary" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground truncate">{p.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${cfg.color}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>
                      {p.description && (
                        <p className="text-xs text-muted-foreground truncate mb-2">{p.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(p.updated_at || p.created_at), { addSuffix: true })}
                        </span>
                        {p.duration && <span>{p.duration}s duration</span>}
                      </div>
                      {p.status === "in_progress" && (
                        <Progress value={50} className="mt-2 h-1.5" />
                      )}
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <button className="p-1.5 rounded-md hover:bg-muted transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedProject(p); }}>
                          <Eye className="w-4 h-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate("/create"); }}>
                          <Pencil className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate("/analytics"); }}>
                          <BarChart3 className="w-4 h-4 mr-2" /> Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicate(p); }}>
                          <Copy className="w-4 h-4 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => { e.stopPropagation(); setDeleteProject(p); }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Summary */}
      {projects.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Total", value: statusCounts.total, icon: "📁" },
            { label: "Published", value: statusCounts.published, icon: "🟢" },
            { label: "In Progress", value: statusCounts.in_progress, icon: "🟡" },
            { label: "Failed", value: statusCounts.failed, icon: "🔴" },
            { label: "Draft", value: statusCounts.draft, icon: "📝" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-foreground">{s.icon} {s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Project Details Modal */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Project Details</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Full details for this project
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{selectedProject.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc(selectedProject.status).color}`}>
                    {sc(selectedProject.status).icon} {sc(selectedProject.status).label}
                  </span>
                </div>
                {selectedProject.description && (
                  <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="glass rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="font-medium text-foreground">
                    {format(new Date(selectedProject.created_at), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
                <div className="glass rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Updated</p>
                  <p className="font-medium text-foreground">
                    {format(new Date(selectedProject.updated_at), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
                {selectedProject.duration && (
                  <div className="glass rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium text-foreground">{selectedProject.duration}s</p>
                  </div>
                )}
                {selectedProject.audience?.length > 0 && (
                  <div className="glass rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Audience</p>
                    <p className="font-medium text-foreground">{selectedProject.audience.join(", ")}</p>
                  </div>
                )}
              </div>

              {selectedProject.script && (
                <div className="glass rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Script
                  </p>
                  <p className="text-xs text-foreground line-clamp-4">{selectedProject.script}</p>
                </div>
              )}

              {(selectedProject.female_speaker_name !== "Alina" || selectedProject.male_speaker_name !== "Sergiu") && (
                <div className="glass rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">🎙️ Speakers</p>
                  <p className="text-sm text-foreground">
                    {selectedProject.female_speaker_name} + {selectedProject.male_speaker_name}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={() => { setSelectedProject(null); navigate("/create"); }}>
              Edit Project
            </Button>
            <Button variant="secondary" onClick={() => { setSelectedProject(null); navigate("/analytics"); }}>
              <BarChart3 className="w-4 h-4 mr-1" /> Analytics
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteProject} onOpenChange={(open) => !open && setDeleteProject(null)}>
        <DialogContent className="max-w-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Project</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete "{deleteProject?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
