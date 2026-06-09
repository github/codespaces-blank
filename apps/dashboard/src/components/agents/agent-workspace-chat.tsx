"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { getAuth } from "firebase/auth";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { getApiBaseUrl } from "@/lib/api-base";

type Props = {
  agentId: string;
};

export function AgentWorkspaceChat({ agentId }: Props) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${getApiBaseUrl()}/api/agents/${agentId}/chat`,
        fetch: async (input, init) => {
          const user = getAuth().currentUser;
          const token = user ? await user.getIdToken() : null;
          const headers = new Headers(init?.headers);
          if (token) headers.set("Authorization", `Bearer ${token}`);
          return fetch(input, { ...init, headers });
        },
      }),
    [agentId]
  );

  const { messages, sendMessage, status, error } = useChat({ transport });

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 h-[min(420px,50vh)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Agent chat</p>
        {error ? (
          <p className="text-[11px] text-red-400 truncate max-w-[60%]">{error.message}</p>
        ) : null}
      </div>
      <ScrollArea className="flex-1 min-h-[200px] rounded-xl border border-white/5 bg-black/20 p-3">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <p className="text-xs text-slate-500">
              Send a message. Tool calls appear inline when enabled on the agent.
            </p>
          ) : null}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`text-sm rounded-lg px-3 py-2 ${
                m.role === "user"
                  ? "bg-cyan-500/15 text-cyan-50 ml-6"
                  : "bg-white/5 text-slate-200 mr-6"
              }`}
            >
              <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">
                {m.role}
              </p>
              {m.parts.map((part, i) =>
                part.type === "text" ? (
                  <p key={i} className="whitespace-pre-wrap leading-relaxed">
                    {part.text}
                  </p>
                ) : (
                  <pre
                    key={i}
                    className="mt-1 text-[11px] text-amber-200/90 overflow-x-auto"
                  >
                    {JSON.stringify(part, null, 2).slice(0, 1200)}
                  </pre>
                )
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <form
        className="flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const data = new FormData(form);
          const text = String(data.get("message") || "").trim();
          if (!text) return;
          await sendMessage({ text });
          form.reset();
        }}
      >
        <Textarea
          name="message"
          rows={2}
          placeholder="Message this agent…"
          className="flex-1 rounded-xl bg-white/5 border-white/10 text-white text-sm resize-none"
        />
        <Button
          type="submit"
          disabled={status === "streaming" || status === "submitted"}
          className="rounded-xl self-end"
        >
          {status === "streaming" || status === "submitted" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
