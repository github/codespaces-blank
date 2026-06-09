"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputButton,
  PromptInputBody,
  PromptInputFooter,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
} from "@/components/ai-elements/prompt-input";
import {
  Attachments,
  Attachment,
  AttachmentPreview,
  AttachmentInfo,
  AttachmentRemove,
} from "@/components/ai-elements/attachments";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DefaultChatTransport, isToolUIPart } from "ai";
import { GlobeIcon, MessageSquareIcon, PaperclipIcon, WrenchIcon, LayersIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";

export default function DashboardChatPage() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const handleSubmit = useCallback(
    (message: { text: string }) => {
      if (message.text.trim()) {
        sendMessage({ text: message.text });
        setShowSuggestions(false);
      }
    },
    [sendMessage]
  );

  useEffect(() => {
    if (status === "ready" && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        const lastText = lastMessage.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("");

        if (lastText) {
          fetch("/api/chat/suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lastAssistantMessage: lastText }),
          })
            .then((res) => res.json())
            .then((data) => {
              setSuggestions(data.suggestions || []);
              setShowSuggestions(true);
            })
            .catch(() => {
              setSuggestions([]);
              setShowSuggestions(false);
            });
        }
      }
    }
  }, [messages, status]);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      sendMessage({ text: suggestion });
      setShowSuggestions(false);
    },
    [sendMessage]
  );

  const renderTool = (part: any, messageId: string, idx: number) => {
    const toolTitle =
      part.type === "dynamic-tool"
        ? part.toolName
        : part.type.replace("tool-", "");
    return (
      <Tool defaultOpen key={`${messageId}-${idx}`}>
        <ToolHeader
          state={part.state}
          title={toolTitle}
          type={part.type}
          toolName={part.type === "dynamic-tool" ? part.toolName : undefined}
        />
        <ToolContent>
          {(part.state === "input-available" ||
            part.state === "output-available") && <ToolInput input={part.input} />}
          {part.state === "output-available" && part.output && (
            <ToolOutput errorText={part.errorText} output={String(part.output) as any} />
          )}
        </ToolContent>
      </Tool>
    );
  };

  return (
    <TooltipProvider>
      <div className="flex h-[calc(100vh-8rem)] min-h-0 flex-col">
        <div className="shrink-0 mb-4 flex items-center gap-3">
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
            GPT-4o Mini (OpenRouter)
          </span>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Conversation className="h-full" initial="smooth" resize="smooth">
            <ConversationContent>
              {messages.length === 0 ? (
                <ConversationEmptyState
                  description="Send a message to start the conversation."
                  icon={<MessageSquareIcon className="size-6" />}
                  title="Welcome to Chat"
                />
              ) : (
                <>
                  {messages.map((message) => (
                    <Message from={message.role} key={message.id}>
                      <MessageContent>
                        {message.parts.map((part, i) => {
                          switch (part.type) {
                            case "text":
                              return (
                                <MessageResponse key={`${message.id}-${i}`}>
                                  {part.text}
                                </MessageResponse>
                              );
                            case "reasoning":
                              return (
                                <Reasoning
                                  key={`${message.id}-${i}`}
                                  isStreaming={part.state === "streaming"}
                                >
                                  <ReasoningTrigger />
                                  <ReasoningContent>{part.text}</ReasoningContent>
                                </Reasoning>
                              );
                            default:
                              if (isToolUIPart(part)) {
                                return renderTool(part, message.id, i);
                              }
                              return null;
                          }
                        })}
                      </MessageContent>
                    </Message>
                  ))}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="mt-4">
                      <Suggestions>
                        {suggestions.map((suggestion, idx) => (
                          <Suggestion
                            key={`suggestion-${idx}`}
                            suggestion={suggestion}
                            onClick={handleSuggestionClick}
                          />
                        ))}
                      </Suggestions>
                    </div>
                  )}
                </>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>

        <div className="shrink-0 border-t border-white/10 bg-[#0a0a0a] p-4">
          <PromptInputProvider>
            <PromptInput className="w-full" onSubmit={handleSubmit}>
              <PromptInputBody>
                <PromptInputTextarea placeholder="Type your message..." className="min-h-[3rem]" />
                <Attachments>
                  {messages.map((message) =>
                    message.parts
                      .filter((p) => p.type === "file")
                      .map((part, i) => (
                        <Attachment
                          data={part as any}
                          key={`${message.id}-file-${i}`}
                        >
                          <AttachmentPreview />
                          <AttachmentInfo />
                          <AttachmentRemove />
                        </Attachment>
                      ))
                  )}
                </Attachments>
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputButton tooltip="Web Search Available">
                    <GlobeIcon size={16} />
                  </PromptInputButton>
                  <PromptInputButton tooltip="Tools & Connectors">
                    <WrenchIcon size={16} />
                  </PromptInputButton>
                </PromptInputTools>
                <PromptInputSubmit status={status} onStop={stop} />
              </PromptInputFooter>
            </PromptInput>
          </PromptInputProvider>
        </div>
      </div>
    </TooltipProvider>
  );
}
