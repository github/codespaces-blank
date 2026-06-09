"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, X, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatAssist({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I'm the World Automate AI assistant. How can I help you build your autonomous agency today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "bot", content: "That sounds like a great project. Our research and agent orchestration tools would be perfect for that." }]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed bottom-24 right-6 w-[350px] md:w-[400px] z-[100] overflow-hidden"
        >
          <div className="bg-[#0d0d0d] border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-black" />
                </div>
                <div>
                  <p className="text-white text-xs font-bold uppercase tracking-widest">Ask AI</p>
                  <p className="text-neutral-500 text-[10px]">Active now</p>
                </div>
              </div>
              <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    m.role === "user" ? "bg-white text-black font-medium" : "bg-neutral-900 text-neutral-400 border border-neutral-800"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-neutral-900 border-t border-neutral-800">
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-full py-3 px-4 text-sm text-white outline-none focus:border-neutral-600 transition-all pr-12"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 p-2 bg-white text-black rounded-full hover:bg-neutral-200 transition-all"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
