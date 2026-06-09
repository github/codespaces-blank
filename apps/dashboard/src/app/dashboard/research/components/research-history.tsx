"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import {
  History,
  Search,
  Database,
  Zap,
  Clock,
  ChevronRight,
  Trash2,
} from "lucide-react";

interface ResearchArtifactSummary {
  id: string;
  objective: string;
  type: "SEARCH" | "EXTRACT" | "DEEP_RESEARCH";
  status: "COMPLETED" | "PROCESSING" | "QUEUED" | "FAILED";
  durationMs?: number;
  sourceCount: number;
  createdAt: string;
  queryChain: string[];
}

interface ResearchHistoryProps {
  artifacts: ResearchArtifactSummary[];
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ResearchHistory({
  artifacts,
  onSelect,
  onDelete,
}: ResearchHistoryProps) {
  const typeIcons = {
    SEARCH: Search,
    EXTRACT: Database,
    DEEP_RESEARCH: Zap,
  };

  const typeColors = {
    SEARCH: "text-blue-400",
    EXTRACT: "text-emerald-400",
    DEEP_RESEARCH: "text-purple-400",
  };

  if (artifacts.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
          <History className="h-8 w-8 text-slate-600" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-400">No research history yet</p>
          <p className="text-xs text-slate-600">Run your first research to see it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {artifacts.map((artifact, i) => {
        const Icon = typeIcons[artifact.type];
        const color = typeColors[artifact.type];

        return (
          <motion.div
            key={artifact.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02 }}
          >
            <Card
              className="border-white/5 bg-white/[0.01] rounded-xl hover:bg-white/[0.02] hover:border-white/10 transition-all cursor-pointer group"
              onClick={() => onSelect(artifact.id)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("p-2 rounded-lg bg-white/[0.03]", color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white line-clamp-1">
                      {artifact.objective}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(artifact.createdAt).toLocaleDateString()}
                      </span>
                      <span>{artifact.sourceCount} sources</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-md border-white/10 text-[10px] text-slate-500 uppercase"
                  >
                    {artifact.type.replace("_", " ")}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}