import { Settings2, Sun, Lock, Bell, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
          <p className="text-neutral-400">Configure your workspace, security, and notification preferences.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 shadow-lg shadow-blue-600/20">
          <Settings2 className="h-4 w-4" /> Update settings
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { title: "Account", description: "Manage profile, display name and authentication.", icon: User },
          { title: "Security", description: "Enable multi-factor login and API safeguards.", icon: Lock },
          { title: "Notifications", description: "Control alerts for agents, invoices, and system events.", icon: Bell },
        ].map((card) => (
          <Card key={card.title} className="bg-neutral-900 border-neutral-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-neutral-400">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <card.icon className="h-5 w-5 text-slate-400" />
              <p className="text-sm text-slate-300">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-3xl bg-black/40 border border-neutral-800 p-5">
            <div>
              <p className="font-medium text-white">Theme</p>
              <p className="text-sm text-slate-500">Using dark mode across the dashboard.</p>
            </div>
            <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">Dark</Badge>
          </div>
          <div className="flex items-center justify-between rounded-3xl bg-black/40 border border-neutral-800 p-5">
            <div>
              <p className="font-medium text-white">System preferences</p>
              <p className="text-sm text-slate-500">Fallback to system theme if available.</p>
            </div>
            <Sun className="h-5 w-5 text-slate-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
