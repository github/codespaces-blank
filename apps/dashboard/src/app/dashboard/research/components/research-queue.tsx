"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useResearchJob } from "../hooks/use-research-job";

export type ResearchJobStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

interface ResearchQueueProps {
  jobId: string | null;
  onJobComplete?: (result: any) => void;
  onJobCancel?: (jobId: string) => void;
}

export function ResearchQueue({
  jobId,
  onJobComplete,
  onJobCancel,
}: ResearchQueueProps) {
  const { job, isLoading, error } = useResearchJob({
    jobId: jobId || null,
    enabled: !!jobId,
  });

  useEffect(() => {
    if (job?.status === "COMPLETED" && job.result) {
      onJobComplete?.(job.result);
    }
  }, [job?.status, job?.result, onJobComplete]);

  if (!job && !isLoading) return null;

  const statusConfig = {
    QUEUED: {
      label: "Queued",
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      icon: Clock,
    },
    PROCESSING: {
      label: "Processing",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: Loader2,
    },
    COMPLETED: {
      label: "Completed",
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-400/20",
      icon: CheckCircle2,
    },
    FAILED: {
      label: "Failed",
      color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      icon: XCircle,
    },
  };

  const config = statusConfig[job?.status || "QUEUED"];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card className="border-white/10 bg-white/[0.02] rounded-2xl overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-400" />
              Deep Research Job
            </CardTitle>
            <Badge
              variant="outline"
              className={cn(
                "rounded-lg text-xs font-medium",
                config.color
              )}
            >
              <config.icon
                className={cn("h-3 w-3 mr-1", job?.status === "PROCESSING" && "animate-spin")}
              />
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Objective
            </p>
            <p className="text-sm text-slate-300">{job?.payload?.objective}</p>
          </div>

          {job?.status === "PROCESSING" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="h-3 w-3 animate-spin" />
                Analyzing sources and extracting insights...
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full w-2/3 transition-all duration-1000" />
              </div>
            </div>
          )}

          {job?.status === "FAILED" && (
            <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
              <p className="text-xs text-rose-400">{job?.error || "An error occurred"}</p>
            </div>
          )}

          {job && (job.status === "QUEUED" || job.status === "PROCESSING") && (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs rounded-lg text-slate-500 hover:text-white"
                onClick={() => onJobCancel?.(job.id)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}