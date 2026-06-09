"use client";

import { CheckSquare, Clock, AlertCircle, Plus, Filter, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TasksPage() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Agent Tasks</h1>
          <p className="text-neutral-400">Manage and monitor tasks assigned to your autonomous agents.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-neutral-800 text-white hover:bg-neutral-800 gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="bg-white text-black hover:bg-neutral-200 gap-2">
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {[
          { title: "Quarterly Revenue Analysis", agent: "Sales Analyst", status: "In Progress", priority: "High", due: "2h remaining" },
          { title: "Competitor SDK Reverse Engineering", agent: "Market Researcher", status: "Todo", priority: "Medium", due: "Tomorrow" },
          { title: "BigQuery Optimization Patch", agent: "Cloud Engineer", status: "Done", priority: "Critical", due: "Completed" },
          { title: "Daily Lead Generation", agent: "Growth Agent", status: "In Progress", priority: "Low", due: "Ongoing" },
        ].map((task, i) => (
          <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
            <div className="flex items-start gap-4">
              <div className={`mt-1 p-2 rounded-lg ${task.status === 'Done' ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                <CheckSquare className={`h-5 w-5 ${task.status === 'Done' ? 'text-green-500' : 'text-blue-500'}`} />
              </div>
              <div className="space-y-1">
                <div className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">{task.title}</div>
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  <span className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-neutral-600" />
                    {task.agent}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {task.due}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <Badge variant="outline" className={`text-[10px] uppercase ${
                    task.priority === 'High' || task.priority === 'Critical' ? 'text-red-400 border-red-400/20 bg-red-400/5' : 'text-neutral-500 border-neutral-800'
                  }`}>
                    {task.priority}
                 </Badge>
                  <Badge className={`text-[10px] uppercase ${
                    task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                    task.status === 'Done' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                    'bg-neutral-800 text-neutral-400'
                  }`}>
                    {task.status}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
