import { motion } from "framer-motion";
import { User, Bell, Palette, Link2, CreditCard, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const sections = [
  { icon: User, label: "Profile", id: "profile" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: Link2, label: "Integrations", id: "integrations" },
  { icon: CreditCard, label: "Billing", id: "billing" },
];

const integrations = [
  { name: "Google Cloud TTS", connected: true },
  { name: "Gemini AI", connected: true },
  { name: "Kie.ai Video", connected: false },
  { name: "Botato Publishing", connected: false },
  { name: "YouTube", connected: true },
  { name: "TikTok", connected: false },
];

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in max-w-4xl">
      <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-heading font-bold text-foreground">Profile</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Display Name</label>
            <Input defaultValue="Sergiu" className="bg-muted border-border" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
            <Input defaultValue="sergiu@ssociety.hub" className="bg-muted border-border" />
          </div>
        </div>
        <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-heading font-bold text-foreground">Notifications</h2>
        </div>
        <div className="space-y-4">
          {["Project completed", "Publishing status", "Weekly analytics report"].map((n) => (
            <div key={n} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{n}</span>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Integrations */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-heading font-bold text-foreground">Integrations</h2>
        </div>
        <div className="space-y-3">
          {integrations.map((int) => (
            <div key={int.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm font-medium text-foreground">{int.name}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${int.connected ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                {int.connected ? "Connected" : "Not Connected"}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Billing */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-heading font-bold text-foreground">Billing</h2>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div>
            <p className="text-sm font-medium text-foreground">Current Plan: <span className="text-primary">Free</span></p>
            <p className="text-xs text-muted-foreground mt-0.5">1 project/month • Basic features</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm">Upgrade to Pro</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <p className="text-sm font-medium text-foreground">Pro — €49/mo</p>
            <p className="text-xs text-muted-foreground mt-0.5">10 projects/month, all features</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <p className="text-sm font-medium text-foreground">Enterprise — €199/mo</p>
            <p className="text-xs text-muted-foreground mt-0.5">Unlimited, white-label, API</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
