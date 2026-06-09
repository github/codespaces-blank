import { ArrowRight, Sparkles, ShieldCheck, CircleDot, Terminal, Layers } from "lucide-react";

export default function AIElementsDocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-neutral-800">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="space-y-10">
          <div className="rounded-3xl border border-white/10 bg-neutral-950/80 p-10 shadow-xl shadow-black/40">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">
                <CircleDot className="h-4 w-4 text-purple-400" /> AI Elements Overview
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-white">
                  Introduction to AI Elements
                </h1>
                <p className="text-slate-400 max-w-3xl text-lg">
                  AI Elements is a component library and custom registry built on top of shadcn/ui to help you build AI-native applications faster. It provides pre-built components like conversations, messages and more.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl bg-white/5 p-6">
                    <div className="flex items-center gap-3 text-purple-400">
                      <Sparkles className="h-5 w-5" />
                      <span className="font-medium">Pre-built AI UI</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">
                      Use production-ready AI patterns for chat, messages, workflows, and assistant experiences.
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-6">
                    <div className="flex items-center gap-3 text-emerald-400">
                      <ShieldCheck className="h-5 w-5" />
                      <span className="font-medium">Built on shadcn/ui</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">
                      Integrates cleanly with existing shadcn projects and Tailwind styling systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-neutral-950/80 p-10">
              <h2 className="text-2xl font-semibold text-white">Quick Start</h2>
              <p className="mt-3 text-slate-400">
                Here are some basic examples of what you can achieve using components from AI Elements.
              </p>

              <div className="mt-8 space-y-6">
                <div className="rounded-3xl bg-white/5 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Conversations</h3>
                      <p className="mt-2 text-sm text-slate-400">
                        Build AI chat interfaces with messages, avatars, and response controls.
                      </p>
                    </div>
                    <Terminal className="h-6 w-6 text-slate-300" />
                  </div>
                </div>
                <div className="rounded-3xl bg-white/5 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Message Streams</h3>
                      <p className="mt-2 text-sm text-slate-400">
                        Use structured messaging flows to keep AI responses organized and searchable.
                      </p>
                    </div>
                    <Layers className="h-6 w-6 text-slate-300" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-neutral-950/80 p-10">
              <h2 className="text-2xl font-semibold text-white">Install in minutes</h2>
              <p className="mt-3 text-slate-400">
                Installing AI Elements is straightforward and can be done via package manager or the shadcn CLI.
              </p>
              <div className="mt-6 rounded-3xl bg-black/50 p-5 text-sm text-slate-300">
                <div className="mb-4 text-slate-400">npm</div>
                <pre className="rounded-2xl bg-slate-950/80 p-4 text-white">npm install ai-elements</pre>
              </div>
              <div className="mt-4 flex items-center gap-2 text-slate-400">
                <ArrowRight className="h-4 w-4" />
                <span>Components are added under your shadcn component folder by default.</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-950/80 p-10">
            <h2 className="text-2xl font-semibold text-white">Prerequisites</h2>
            <ul className="mt-6 space-y-4 text-slate-400">
              <li className="flex gap-3">
                <span className="mt-1 text-purple-400">•</span>
                Node.js 18 or later
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-purple-400">•</span>
                Next.js project with the AI SDK installed
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-purple-400">•</span>
                shadcn/ui installed or added automatically by the installer
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-purple-400">•</span>
                Optional: AI Gateway API key in env.local for simplified provider usage
              </li>
            </ul>
            <div className="mt-10 rounded-3xl bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white">Note</h3>
              <p className="mt-3 text-slate-400">
                AI Elements targets React 19 and Tailwind CSS 4, but it works gracefully in this dashboard with the existing theme and utility classes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
