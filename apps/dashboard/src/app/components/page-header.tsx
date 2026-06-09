import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  accent?: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

export function PageHeader({
  title,
  description,
  accent,
  actionLabel,
  onActionClick,
}: PageHeaderProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-neutral-950/70 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          {accent ? (
            <span className="inline-flex rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
              {accent}
            </span>
          ) : null}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">{description}</p>
          </div>
        </div>
        {actionLabel ? (
          <Button
            className="rounded-full bg-white/10 text-white shadow-lg shadow-white/10 hover:bg-white/15"
            onClick={onActionClick}
          >
            <span>{actionLabel}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
