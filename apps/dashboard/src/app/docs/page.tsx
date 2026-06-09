import { Timeline } from "@/components/ui/timeline";
import { LandingHeader } from "@/app/components/landing-header";
import { Zap, Bot, Search, Workflow, Shield, Globe } from "lucide-react";

export default function DocsPage() {
  const data = [
    {
      title: "Getting Started",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-500 text-sm md:text-base">
            Welcome to World Automate documentation. Our platform is designed to help agencies scale through autonomous AI orchestration.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <Bot className="h-6 w-6 text-white mb-2" />
              <p className="text-white text-sm font-medium">Create Agents</p>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <Workflow className="h-6 w-6 text-white mb-2" />
              <p className="text-white text-sm font-medium">Build Flows</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "AI Infrastructure",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-500 text-sm md:text-base">
            We provide enterprise-grade infrastructure including real-time market intelligence and secure agent execution environments.
          </p>
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-neutral-400" />
              <span className="text-white text-sm">Deep-web research via Exa AI</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-neutral-400" />
              <span className="text-white text-sm">SOC2 & HIPAA Compliant Data Layers</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Deployment",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-500 text-sm md:text-base">
            Deploy your agents to production in minutes. Our CI/CD pipeline handles scaling, monitoring, and automatic failover.
          </p>
          <div className="h-40 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <Zap className="h-12 w-12 text-neutral-700 animate-pulse" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] selection:bg-neutral-800">
      <LandingHeader />
      <div className="pt-32">
        <Timeline data={data} />
      </div>
    </div>
  );
}
