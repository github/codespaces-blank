"use client";

import { Cloud, Database, ExternalLink, Plus, Search, Shield, RefreshCcw, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";

export default function CloudPage() {
  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-slate-500 font-medium">
            <span>Infrastructure</span>
            <span className="text-slate-800">/</span>
            <span className="text-slate-300">Cloud Connections</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Infrastructure</h1>
          <p className="text-slate-400 text-sm max-w-xl">Provision and monitor enterprise cloud integrations and BigQuery data lakes.</p>
        </div>
        <Button className="rounded-xl bg-white px-5 text-xs font-semibold text-black hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <Plus className="h-4 w-4 mr-2" /> Connect Service
        </Button>
      </div>

      {/* Connection Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* GCP / BigQuery */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative rounded-[2rem] border border-white/10 bg-[#09090f] p-8 space-y-6 hover:border-white/20 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Database className="h-6 w-6 text-blue-500" />
            </div>
            <Badge variant="outline" className="rounded-lg border-emerald-500/20 text-emerald-400 bg-emerald-500/5 py-1 px-3 text-[10px] font-bold uppercase tracking-wider">
              Connected
            </Badge>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Google BigQuery</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Enterprise data warehouse for autonomous agent intelligence extraction.</p>
          </div>
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Sync</span>
            </div>
            <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5">
              Configure
            </Button>
          </div>
        </motion.div>

        {/* AWS Infrastructure */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group relative rounded-[2rem] border border-white/10 bg-[#09090f] p-8 space-y-6 hover:border-white/20 transition-all opacity-60"
        >
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <Cloud className="h-6 w-6 text-orange-500" />
            </div>
            <Badge variant="outline" className="rounded-lg border-white/10 text-slate-500 bg-white/5 py-1 px-3 text-[10px] font-bold uppercase tracking-wider">
              Offline
            </Badge>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">AWS S3 / Redshift</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Scalable cloud storage and data lake orchestration for agent training.</p>
          </div>
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">No Active Links</span>
            <Button variant="outline" size="sm" className="h-8 rounded-lg border-white/10 text-[10px] uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5">
              Initialize
            </Button>
          </div>
        </motion.div>

        {/* Placeholder / Add New */}
        <button className="flex flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed border-white/5 bg-transparent p-12 hover:border-white/20 hover:bg-white/[0.01] transition-all group">
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="h-6 w-6 text-slate-500" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Connect Provider</p>
        </button>
      </div>

      {/* Activity Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
            <RefreshCcw className="h-3 w-3" /> Synchronization Audit
          </h2>
          <Button variant="ghost" size="sm" className="text-[10px] text-slate-500 uppercase tracking-widest hover:text-white">Full Logs</Button>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden">
          <table className="w-full text-left text-xs text-slate-400">
            <thead className="bg-white/[0.02] text-slate-500 uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4 font-bold text-[10px]">Source Provider</th>
                <th className="px-6 py-4 font-bold text-[10px]">Integration Type</th>
                <th className="px-6 py-4 font-bold text-[10px]">Status</th>
                <th className="px-6 py-4 font-bold text-[10px] text-right">Last Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { source: "BigQuery", type: "SQL Extraction", status: "Success", time: "2m ago" },
                { source: "BigQuery", type: "Market Intelligence", status: "Success", time: "15m ago" },
                { source: "AWS S3", type: "Artifact Storage", status: "Warning", time: "1h ago" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span className="text-white font-semibold">{row.source}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{row.type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-tighter ${row.status === 'Success' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500 group-hover:text-slate-300 transition-colors">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
