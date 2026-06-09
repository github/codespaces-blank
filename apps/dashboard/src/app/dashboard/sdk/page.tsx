"use client";

import { Code, Terminal, Copy, Check, ExternalLink, Key, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SDKPage() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Developer SDK</h1>
          <p className="text-neutral-400">Integrate WorldAutomate agentic intelligence into your own applications.</p>
        </div>
        <Button className="bg-white text-black hover:bg-neutral-200 gap-2">
          <Zap className="h-4 w-4 fill-current" />
          Generate API Key
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Quick Start Guide</CardTitle>
            <CardDescription className="text-neutral-500">Get up and running in less than 2 minutes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="text-sm font-medium text-neutral-300">1. Install the SDK via NPM</div>
              <div className="relative group">
                <div className="p-4 rounded-lg bg-black border border-neutral-800 font-mono text-sm text-blue-400">
                  npm install @world-automate/sdk
                </div>
                <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-neutral-300">2. Initialize the Client</div>
              <div className="relative group">
                <pre className="p-4 rounded-lg bg-black border border-neutral-800 font-mono text-sm text-blue-400 overflow-x-auto">
                  {`import { WorldAutomate } from '@world-automate/sdk';

const client = new WorldAutomate({
  apiKey: process.env.WORLD_AUTOMATE_KEY,
});

// Run a specialized agent
const insight = await client.runAgent('sales-analyst', {
  query: 'Why did churn increase in April?'
});`}
                </pre>
                <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="h-4 w-4 text-neutral-400" />
                Active API Keys
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-black border border-neutral-800 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-neutral-400">wa_live_••••••••4f2a</div>
                  <div className="text-[10px] text-neutral-600">Production Key • Created 12d ago</div>
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px]">Active</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Terminal className="h-4 w-4 text-neutral-400" />
                Useful Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="link" className="p-0 h-auto text-blue-400 hover:text-blue-300 text-sm justify-start">
                Full API Reference <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
              <Button variant="link" className="p-0 h-auto text-blue-400 hover:text-blue-300 text-sm justify-start">
                Agent Capability Matrix <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
              <Button variant="link" className="p-0 h-auto text-blue-400 hover:text-blue-300 text-sm justify-start">
                GCP Integration Guide <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
