"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import {
  Workflow, Plus, Play, ArrowRight, Clock, CheckCircle2,
  AlertCircle, Zap, Mail, Database, Globe, Bot
} from "lucide-react";

const workflowTemplates = [
  { id: "lead", name: "Lead Capture → CRM", steps: 4, icon: Mail, desc: "Auto-qualify leads and push to your CRM" },
  { id: "content", name: "Content Pipeline", steps: 6, icon: Globe, desc: "Generate → Review → Publish content workflow" },
  { id: "agent", name: "AI Agent Trigger", steps: 3, icon: Bot, desc: "Trigger AI agents based on events" },
  { id: "data", name: "Data Sync Pipeline", steps: 5, icon: Database, desc: "Sync data between Firebase and external APIs" },
];

const myWorkflows = [
  {
    id: "1",
    name: "New Customer Onboarding",
    status: "active",
    steps: ["Webhook", "Validate Email", "Create User", "Send Welcome", "Notify Slack"],
    runs: 234,
    lastRun: "3 min ago",
    success: 98,
  },
  {
    id: "2",
    name: "Weekly Research Report",
    status: "active",
    steps: ["Cron Trigger", "Exa Search", "AI Summarize", "Email Report"],
    runs: 12,
    lastRun: "1 day ago",
    success: 100,
  },
  {
    id: "3",
    name: "Content Moderation",
    status: "error",
    steps: ["New Post", "AI Review", "Flag/Approve", "Notify Admin"],
    runs: 891,
    lastRun: "5 min ago",
    success: 94,
  },
];

export default function WorkflowsPage() {
  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Workflow className="h-8 w-8 text-indigo-400" /> Workflows
          </h1>
          <p className="text-slate-400 mt-1">Automate business processes with Vercel-powered workflow pipelines</p>
        </div>
        <Button
          onClick={() => setShowTemplates(!showTemplates)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" /> New Workflow
        </Button>
      </div>

      {/* Templates */}
      {showTemplates && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border-none rounded-[2rem] p-8 space-y-6"
        >
          <h2 className="text-xl font-bold text-white">Workflow Templates</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowTemplates.map((t) => (
              <button
                key={t.id}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-indigo-600/10 hover:border-indigo-600/30 transition-all space-y-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <t.icon className="h-6 w-6" />
                </div>
                <div className="font-semibold text-white">{t.name}</div>
                <div className="text-slate-400 text-sm">{t.desc}</div>
                <div className="text-indigo-400 text-xs font-medium">{t.steps} steps</div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Active Workflows */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Active Workflows</h2>
        <div className="space-y-4">
          {myWorkflows.map((wf, i) => (
            <motion.div
              key={wf.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass border-none rounded-2xl p-6 space-y-4"
            >
              {/* Top row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    wf.status === "error" ? "bg-red-600/20" : "bg-indigo-600/20"
                  }`}>
                    <Workflow className={`h-5 w-5 ${wf.status === "error" ? "text-red-400" : "text-indigo-400"}`} />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{wf.name}</div>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                      <Clock className="h-3 w-3" /> Last run: {wf.lastRun}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-400">
                    <span className="text-white font-medium">{wf.runs}</span> runs
                  </div>
                  <div className="text-sm text-slate-400">
                    <span className="text-green-400 font-medium">{wf.success}%</span> success
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${
                    wf.status === "active"
                      ? "bg-green-400/10 text-green-400"
                      : "bg-red-400/10 text-red-400"
                  }`}>
                    {wf.status === "active"
                      ? <><CheckCircle2 className="h-3 w-3" /> Active</>
                      : <><AlertCircle className="h-3 w-3" /> Error</>
                    }
                  </span>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10 h-8 w-8 p-0">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Pipeline Steps */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pl-1">
                {wf.steps.map((step, si) => (
                  <div key={si} className="flex items-center gap-2 shrink-0">
                    <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-medium">
                      {step}
                    </div>
                    {si < wf.steps.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-slate-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
