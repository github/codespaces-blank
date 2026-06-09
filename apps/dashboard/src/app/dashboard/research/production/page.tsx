"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import {
  ShieldCheck, Activity, Rocket, ArrowUpRight,
  Filter, Search, Clock, CheckCircle2,
  Lock, Globe, Database, FileCheck
} from "lucide-react";
import { Artifact, ArtifactHeader, ArtifactTitle, ArtifactContent } from "@/components/ai-elements/artifact";

const productionArtifacts = [
  { 
    title: "Market Compliance Report v2.1", 
    type: "Certified Report",
    status: "Validated",
    confidence: "99.8%",
    lastUpdated: "2 hours ago",
    deployment: "Main Instance"
  },
  { 
    title: "Competitor Pricing Strategy (Q2)", 
    type: "Market Intelligence",
    status: "Stable",
    confidence: "98.5%",
    lastUpdated: "1 day ago",
    deployment: "Strategy Engine"
  },
  { 
    title: "Global Supply Chain Risks", 
    type: "Risk Assessment",
    status: "Validated",
    confidence: "99.2%",
    lastUpdated: "3 days ago",
    deployment: "Logistics Agent"
  },
];

const metrics = [
  { label: "Stability Index", value: "99.9%", icon: ShieldCheck, color: "text-emerald-400" },
  { label: "Active Monitors", value: "14", icon: Activity, color: "text-blue-400" },
  { label: "Auto-Deployments", value: "128", icon: Rocket, color: "text-purple-400" },
];

export default function ProductionZonePage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-slate-500 font-medium">
            <span>Research Lab</span>
            <span className="text-slate-800">/</span>
            <span className="text-emerald-500/80">Production Zone</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Production Intelligence
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] px-2 rounded-full uppercase tracking-widest py-0">Verified</Badge>
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">High-confidence research artifacts currently serving live production systems and automated agents.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-slate-500 text-[10px] uppercase tracking-wider hover:text-white">
            <Lock className="h-3.5 w-3.5 mr-2" /> Security Audit
          </Button>
          <Button className="rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all text-xs font-bold px-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            Configure Sync
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-white/[0.03] ${m.color}`}>
              <m.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">{m.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-6">
              <button className="text-xs font-bold text-white border-b border-white pb-4 -mb-[17px]">Live Artifacts</button>
              <button className="text-xs font-medium text-slate-500 pb-4 hover:text-slate-300">History</button>
              <button className="text-xs font-medium text-slate-500 pb-4 hover:text-slate-300">Integrations</button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search production..." 
                className="bg-white/[0.03] border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4">
            {productionArtifacts.map((art, i) => (
              <motion.div
                key={art.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Artifact className="border-white/5 bg-[#09090f] hover:border-emerald-500/20 transition-all group overflow-hidden rounded-[1.5rem]">
                  <ArtifactHeader className="py-4 px-6 border-b border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <FileCheck className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <ArtifactTitle className="text-sm font-bold tracking-tight">{art.title}</ArtifactTitle>
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] h-4 py-0 px-2 rounded-full uppercase tracking-tighter">
                            {art.status}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">{art.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-right">
                      <div className="space-y-0.5 hidden sm:block">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Confidence</p>
                        <p className="text-xs font-mono text-emerald-400">{art.confidence}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-white/5 group-hover:text-emerald-400 transition-colors">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </ArtifactHeader>
                </Artifact>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" /> Deployment Health
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sync Status</span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Healthy</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-emerald-500" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Engines</p>
                <div className="grid gap-2">
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.01] border border-white/5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-300 font-medium">Main_Intel_Cluster</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.01] border border-white/5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-300 font-medium">Risk_Analysis_S1</span>
                  </div>
                </div>
              </div>
            </div>
            <Button className="w-full rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-all h-10">
              System Logs
            </Button>
          </div>

          <div className="p-6 rounded-[2rem] bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <h4 className="text-sm font-bold text-white">Promotion Hub</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              New artifacts from the Exploration Hub are pending validation for production deployment.
            </p>
            <Button variant="outline" className="w-full rounded-xl border-emerald-500/30 bg-transparent text-xs font-bold text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500 transition-all">
              Review Promotions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
