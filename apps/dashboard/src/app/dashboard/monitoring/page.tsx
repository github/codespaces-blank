"use client";

import { Activity, ShieldCheck, Zap, Server, Globe, AlertTriangle, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MonitoringPage() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">System Monitoring</h1>
          <p className="text-neutral-400">Real-time health and performance of your agentic infrastructure.</p>
        </div>
        <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10 px-3 py-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
          All Systems Operational
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">API Latency</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">42ms</div>
            <p className="text-xs text-neutral-500 mt-1">Global average response time</p>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Agent Uptime</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">99.98%</div>
            <p className="text-xs text-neutral-500 mt-1">Autonomous roles availability</p>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Active SDK Instances</CardTitle>
            <Globe className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,204</div>
            <p className="text-xs text-neutral-500 mt-1">Live client integrations</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Service Health</h2>
        <div className="grid gap-4">
          {[
            { name: "BigQuery Connector", status: "Healthy", load: "12%", icon: Server },
            { name: "AI Orchestrator (Gemini)", status: "Healthy", load: "45%", icon: Zap },
            { name: "PostgreSQL Database", status: "Warning", load: "89%", icon: Database },
          ].map((service, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-neutral-900 border border-neutral-800">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-black rounded-md">
                  <service.icon className="h-5 w-5 text-neutral-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{service.name}</div>
                  <div className="text-xs text-neutral-500">Current Load: {service.load}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {service.status === 'Warning' && (
                  <div className="flex items-center text-yellow-500 text-xs gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    High Resource Usage
                  </div>
                )}
                <Badge className={service.status === 'Healthy' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}>
                  {service.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
