import { Code, ShieldCheck, Server, Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const apiKeys = [
  { id: "api_01", name: "Dashboard key", created: "2 weeks ago", status: "Active" },
  { id: "api_02", name: "Reporting key", created: "1 month ago", status: "Revoked" },
];

export default function APIsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">APIs</h1>
          <p className="text-neutral-400">Monitor endpoints, keys, and usage for your AI platform.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 shadow-lg shadow-blue-600/20">
          <Key className="h-4 w-4" /> Create API Key
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Requests / month", value: "92.4k", icon: Server },
          { title: "Average latency", value: "42ms", icon: ShieldCheck },
          { title: "Errors", value: "1.2%", icon: Code },
        ].map((metric) => (
          <Card key={metric.title} className="bg-neutral-900 border-neutral-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-neutral-400">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <metric.icon className="h-5 w-5 text-slate-400" />
                <div className="text-xl font-semibold text-white">{metric.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Active endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { path: "/api/agents", desc: "Agent orchestration and status", status: "Stable" },
              { path: "/api/research", desc: "Research intelligence queries", status: "Stable" },
              { path: "/api/workflows", desc: "Workflow execution pipeline", status: "Warning" },
            ].map((endpoint) => (
              <div key={endpoint.path} className="rounded-3xl bg-black/40 border border-neutral-800 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{endpoint.path}</p>
                    <p className="text-sm text-slate-500">{endpoint.desc}</p>
                  </div>
                  <Badge className={endpoint.status === "Stable" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}>
                    {endpoint.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">API keys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiKeys.map((key) => (
              <div key={key.id} className="rounded-3xl bg-black/40 border border-neutral-800 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{key.name}</p>
                    <p className="text-sm text-slate-500">Created {key.created}</p>
                  </div>
                  <Badge className={key.status === "Active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}>
                    {key.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
