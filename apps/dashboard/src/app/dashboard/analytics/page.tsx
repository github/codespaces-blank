"use client";

import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight, Zap, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Business Analytics</h1>
          <p className="text-neutral-400">Agent-driven insights extracted from your cloud data.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-neutral-800 text-white hover:bg-neutral-800">
            Export Report
          </Button>
          <Button className="bg-white text-black hover:bg-neutral-200 gap-2">
            <Play className="h-4 w-4 fill-current" />
            Run Analysis Agent
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Revenue", value: "$45,231.89", change: "+20.1%", icon: DollarSign, trend: "up" },
          { title: "Active Users", value: "+2,350", change: "+180.1%", icon: Users, trend: "up" },
          { title: "Sales Growth", value: "+12.2%", change: "+19%", icon: TrendingUp, trend: "up" },
          { title: "Agentic Actions", value: "573", change: "+201", icon: Zap, trend: "up" },
        ].map((stat, i) => (
          <Card key={i} className="bg-neutral-900 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-400">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-neutral-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-neutral-500 mt-1">
                <span className="text-green-500 font-medium inline-flex items-center mr-1">
                  {stat.change} <ArrowUpRight className="h-3 w-3 ml-0.5" />
                </span>
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Revenue Intelligence</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t border-neutral-800">
             {/* Dynamic Chart Placeholder */}
             <div className="text-center space-y-4">
                <div className="relative w-48 h-48 mx-auto">
                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full animate-pulse" />
                    <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin [animation-duration:3s]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BarChart3 className="h-12 w-12 text-blue-500/50" />
                    </div>
                </div>
                <p className="text-sm text-neutral-500">Agent is analyzing BigQuery datasets...</p>
             </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Agent Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { role: "Sales Analyst", text: "Subscription churn decreased by 5% after the new onboarding workflow.", time: "10m ago" },
              { role: "Growth Agent", text: "High conversion detected on Threads. Recommend increasing social spend.", time: "1h ago" },
              { role: "Data Researcher", text: "Competitive analysis shows competitor 'X' just launched a similar SDK.", time: "3h ago" },
            ].map((insight, i) => (
              <div key={i} className="p-4 rounded-lg bg-black border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-blue-400 border-blue-400/20 bg-blue-400/5">
                    {insight.role}
                  </Badge>
                  <span className="text-[10px] text-neutral-600">{insight.time}</span>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  "{insight.text}"
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
