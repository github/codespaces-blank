"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Globe,
  ExternalLink,
  FileText,
} from "lucide-react";

interface ResearchArtifactProps {
  result: {
    title: string;
    url: string;
    excerpts: string[];
  };
  index: number;
}

export function ResearchArtifact({ result, index }: ResearchArtifactProps) {
  const handleExport = (format: "markdown" | "json") => {
    const data =
      format === "markdown"
        ? `# ${result.title}\n\n${result.excerpts.join("\n\n")}\n\n[Source](${result.url})`
        : JSON.stringify(result, null, 2);

    const blob = new Blob([data], {
      type: format === "markdown" ? "text/markdown" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `research-${index}.${format === "markdown" ? "md" : "json"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="border-white/5 bg-white/[0.01] rounded-2xl overflow-hidden hover:border-white/10 transition-all group">
        <CardHeader className="bg-white/[0.02] border-b border-white/5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Globe className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-white">
                  {result.title}
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5 font-mono truncate max-w-md">
                  {result.url}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-white"
                onClick={() => handleExport("markdown")}
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-white"
                asChild
              >
                <a href={result.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {result.excerpts.map((excerpt, j) => (
              <p key={j} className="text-sm text-slate-400 leading-relaxed">
                {excerpt}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}