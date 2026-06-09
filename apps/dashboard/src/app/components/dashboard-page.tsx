"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Bot,
  ClipboardList,
  Play,
  TrendingUp,
  Zap,
  BarChart3,
  Cpu,
  ArrowUpRight,
  ListFilter
} from "lucide-react";

/* ─── Recharts-based chart component ─── */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";

function WeeklyChart({ chartData }: { chartData: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 11, fontFamily: "inherit" }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 11, fontFamily: "inherit" }}
          domain={[0, 100]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2 text-xs text-white shadow-xl">
                  <span className="text-slate-400">{payload[0].payload.day}: </span>
                  <span className="font-semibold">{payload[0].value}</span>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={32} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#60a5fa"
          strokeWidth={2}
          dot={{ fill: "#0f172a", stroke: "#60a5fa", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "#60a5fa", strokeWidth: 2, fill: "#0f172a" }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/* ─── Glass card primitive ─── */
function GlassCard({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl 
        bg-white/[0.02] 
        border border-white/[0.08]
        backdrop-blur-sm
        ${hover ? "transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.04]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/* ─── Metric item ─── */
function Metric({
  label,
  value,
  delta,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  delta: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">
            {label}
          </p>
          <div className="flex items-baseline gap-2.5">
            <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
            <span className="text-[11px] text-slate-500 font-semibold">{delta}</span>
          </div>
        </div>
        <div
          className={`rounded-2xl bg-white/[0.03] p-3 transition-colors ${color}`}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
      </div>
    </GlassCard>
  );
}

function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-4 border-white/10 border-t-white animate-spin" />
    </div>
  );
}

function DashboardContent({ user }: { user: any }) {
  const [agentLogs, setAgentLogs] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    activeAgents: 0,
    workflowsLive: 0,
    currentTasks: 0,
    systemHealth: "0%",
  });
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    fetch("/api/activity-logs", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setAgentLogs(data);
          setLogsLoading(false);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError" && !cancelled) {
          console.error("Failed to fetch activity logs:", err);
          setLogsLoading(false);
        }
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setChartData([
      { day: "Mon", value: 45 },
      { day: "Tue", value: 52 },
      { day: "Wed", value: 48 },
      { day: "Thu", value: 61 },
      { day: "Fri", value: 55 },
      { day: "Sat", value: 67 },
      { day: "Sun", value: 72 },
    ]);
    setMetrics({
      activeAgents: 12,
      workflowsLive: 8,
      currentTasks: 24,
      systemHealth: "98.5%",
    });
  }, []);

  return (
    <div className="min-h-screen text-white selection:bg-blue-500/20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 pb-20">
        
        {/* ── Header ── */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">
              <span>Enterprise</span>
              <span className="text-slate-800">/</span>
              <span className="text-slate-300">Overview</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Systems Control
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-500">
              Welcome back, {user.displayName || user.email?.split("@")[0]}. Monitoring autonomous agents and system-wide execution health.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl border-white/10 bg-white/5 px-4 text-xs font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-all"
            >
              Systems Status
            </Button>
            <Button className="rounded-xl bg-white px-5 text-xs font-bold text-black hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Initialize Agent
            </Button>
          </div>
        </div>

        {/* ── Top Metrics Row ── */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Metric 
            label="Active Agents" 
            value={metrics.activeAgents.toString()} 
            delta={`+${Math.max(0, Math.floor(Math.random() * 5))} this week`} 
            icon={Bot} 
            color="text-blue-400" 
          />
          <Metric 
            label="Workflows Live" 
            value={metrics.workflowsLive.toString()} 
            delta="Stable" 
            icon={ClipboardList} 
            color="text-emerald-400" 
          />
          <Metric 
            label="Current Tasks" 
            value={metrics.currentTasks.toString()} 
            delta={`+${Math.floor(Math.random() * 8)}`} 
            icon={Play} 
            color="text-amber-400" 
          />
          <Metric 
            label="System Health" 
            value={metrics.systemHealth} 
            delta="Optimal" 
            icon={Activity} 
            color="text-purple-400" 
          />
        </div>

        {/* ── Main Layout (Non-Bento) ── */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          
          {/* Activity Pulse Chart */}
          <GlassCard className="lg:col-span-2 flex flex-col min-h-[450px]">
            <div className="px-6 pt-6 pb-4 border-b border-white/5 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-400" /> Activity Pulse
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Request volume and decision frequency.</p>
              </div>
              <Badge variant="outline" className="rounded-lg border-white/10 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Live</Badge>
            </div>
            <div className="flex-1 p-6 min-h-[300px]">
              <WeeklyChart chartData={chartData} />
            </div>
          </GlassCard>

          {/* System Load & Efficiency */}
          <div className="space-y-6 flex flex-col">
            <GlassCard className="flex-1 p-8 flex flex-col justify-center items-center space-y-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                <Cpu className="h-4 w-4 text-blue-400" /> Compute Load
              </div>
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
                <div className="text-6xl font-black text-white tracking-tighter">64%</div>
              </div>
              <div className="w-full space-y-3">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-600 font-bold">
                  <span>Utilization</span>
                  <span>8.2 TFLOPS</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full w-[64%] transition-all duration-1000" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  <BarChart3 className="h-4 w-4 text-emerald-400" /> Success Rate
                </div>
                <span className="text-sm font-bold text-emerald-400">
                  {agentLogs.filter(log => log.status === 'Success').length > 0 
                    ? `${Math.round((agentLogs.filter(log => log.status === 'Success').length / agentLogs.length) * 100)}%` 
                    : '98%'}
                </span>
              </div>
              <div className="flex gap-1.5 h-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-full ${i <= 7 ? 'bg-emerald-500' : 'bg-white/5'}`} 
                  />
                ))}
              </div>
              <p className="text-[10px] text-slate-600 mt-4 uppercase tracking-widest font-bold text-center">Based on recent activities</p>
            </GlassCard>
          </div>
        </div>

        {/* ── Agent Trace Logs DataTable ── */}
        <GlassCard className="overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" /> Agent Trace Logs
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Real-time operational stream and task execution audit.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 rounded-xl border border-white/5 text-[10px] uppercase tracking-widest text-slate-400 hover:text-white">
                <ListFilter className="h-3.5 w-3.5 mr-2" /> Filter
              </Button>
              <Button variant="ghost" size="sm" className="h-8 rounded-xl border border-white/5 text-[10px] uppercase tracking-widest text-slate-400 hover:text-white">
                Export
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-400">
              <thead className="bg-white/[0.01] text-slate-600 uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4 font-bold text-[10px]">TXID</th>
                  <th className="px-6 py-4 font-bold text-[10px]">Agent Node</th>
                  <th className="px-6 py-4 font-bold text-[10px]">Operation / Task</th>
                  <th className="px-6 py-4 font-bold text-[10px]">Status</th>
                  <th className="px-6 py-4 font-bold text-[10px]">Latency</th>
                  <th className="px-6 py-4 font-bold text-[10px] text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {logsLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 rounded-full border-2 border-white/10 border-t-white animate-spin" />
                        <span>Loading activity logs...</span>
                      </div>
                    </td>
                  </tr>
                ) : agentLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No activity logs available yet
                    </td>
                  </tr>
                ) : (
                  agentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{log.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-6 w-6 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Bot className="h-3.5 w-3.5 text-blue-400" />
                          </div>
                          <span className="text-white font-bold">{log.agent}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-normal">{log.task}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-tighter text-[10px] ${
                          log.status === 'Success' ? 'text-emerald-500' : 
                          log.status === 'Running' ? 'text-blue-500' :
                          log.status === 'Failed' ? 'text-rose-500' : 'text-amber-500'
                        }`}>
                          <div className={`h-1 w-1 rounded-full ${
                            log.status === 'Success' ? 'bg-emerald-500' : 
                            log.status === 'Running' ? 'bg-blue-500 animate-pulse' :
                            log.status === 'Failed' ? 'bg-rose-500' : 'bg-amber-500'
                          }`} />
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{log.duration}</td>
                      <td className="px-6 py-4 text-right text-slate-500 group-hover:text-slate-300 transition-colors">{log.time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">System broad audit active</p>
            <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase tracking-widest text-slate-400 hover:text-white">
              Full Control Surface <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <DashboardLoading />;
  }

  if (!user) {
    return null;
  }

  return <DashboardContent user={user} />;
}
