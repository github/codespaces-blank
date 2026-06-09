"use client";

import { Layers, ShieldCheck, Bot, Search, Filter, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Agent, AgentHeader, AgentContent } from "@/components/ai-elements/agent";
import { motion } from "motion/react";

const registryItems = [
  { name: "Lead Qualifier", type: "Support Agent", model: "GPT-4o", status: "Verified", updated: "3 min ago" },
  { name: "Market Scanner", type: "Research Agent", model: "Gemini 1.5 Pro", status: "Verified", updated: "1h ago" },
  { name: "Blog Writer", type: "Content Agent", model: "Claude 3.5 Sonnet", status: "Staged", updated: "2 days ago" },
];

export default function RegistryPage() {
  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-slate-500 font-medium">
            <span>Governance</span>
            <span className="text-slate-800">/</span>
            <span className="text-slate-300">Registry</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Service Registry</h1>
          <p className="text-slate-400 text-sm max-w-xl">Audit and manage verified AI models, integrations, and agent architectures.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <Input className="h-9 w-64 pl-9 rounded-xl border-white/5 bg-white/[0.02] text-xs" placeholder="Search registry..." />
          </div>
          <Button className="rounded-xl bg-white px-5 text-xs font-semibold text-black hover:bg-slate-200 transition-all">
            Add Service
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { title: "Active Registrations", value: "34", icon: Bot, color: "text-blue-400" },
          { title: "Security Audits", value: "12", icon: ShieldCheck, color: "text-emerald-400" },
          { title: "Catalog Items", value: "156", icon: Layers, color: "text-purple-400" },
        ].map((metric) => (
          <div key={metric.title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{metric.title}</p>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Registry Table/Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex gap-6">
            <button className="text-xs font-medium text-white border-b border-white pb-4 -mb-[17px]">Verified Models</button>
            <button className="text-xs font-medium text-slate-500 pb-4 hover:text-slate-300">Integrations</button>
            <button className="text-xs font-medium text-slate-500 pb-4 hover:text-slate-300">Templates</button>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-500 text-[10px] uppercase tracking-wider">
            <Filter className="h-3 w-3 mr-2" /> Filter Registry
          </Button>
        </div>

        <div className="grid gap-4">
          {registryItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative rounded-2xl border border-white/5 bg-white/[0.01] p-5 hover:bg-white/[0.03] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/[0.05] flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
                    <Bot className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                      {item.name}
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{item.type} · {item.model}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden md:block">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Last Update</p>
                    <p className="text-xs text-slate-300">{item.updated}</p>
                  </div>
                  <Badge variant="outline" className={`rounded-lg py-1 px-3 ${item.status === 'Verified' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-amber-500/20 text-amber-400 bg-amber-500/5'}`}>
                    {item.status}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-xl text-slate-500 hover:text-white hover:bg-white/10">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
