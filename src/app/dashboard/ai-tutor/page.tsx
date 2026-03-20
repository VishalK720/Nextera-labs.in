"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Code2,
  Lightbulb,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  { label: "Explain RAG", icon: BookOpen, prompt: "Explain Retrieval-Augmented Generation in simple terms" },
  { label: "Debug my code", icon: Code2, prompt: "Help me debug my code. Here's the error I'm getting:" },
  { label: "Project ideas", icon: Lightbulb, prompt: "Suggest some AI project ideas for a high school student" },
  { label: "Review my prompt", icon: Sparkles, prompt: "Review this prompt and suggest improvements:" },
];

export default function AITutorPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey! I'm your AI tutor at Nextera Labs. I can help you understand concepts, debug code, brainstorm project ideas, or review your work. What would you like to explore today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      // Build messages for API (exclude welcome message)
      const apiMessages = updatedMessages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          studentId: user?.id ?? undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Something went wrong" }));
        throw new Error(err.error || "Failed to get response");
      }

      // Stream the response
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      const aiMsgId = `ai-${Date.now()}`;
      let fullContent = "";

      // Add empty AI message
      setMessages((prev) => [
        ...prev,
        { id: aiMsgId, role: "assistant", content: "", timestamp: new Date() },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId ? { ...m, content: fullContent } : m
          )
        );
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to get response";
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          role: "assistant",
          content: `Sorry, I ran into an error: ${errorMsg}. Please try again!`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping, user?.id]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Chat cleared! What would you like to explore?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px-2rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-amber" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-text-primary">AI Tutor</h2>
            <p className="text-xs text-text-muted flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" />
              Powered by Claude
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
          aria-label="Clear chat"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto rounded-xl bg-background-card border border-border p-4 space-y-4 mb-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === "assistant" && (
              <div className="h-8 w-8 rounded-lg bg-amber/10 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="h-4 w-4 text-amber" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-amber text-background rounded-br-md"
                  : "bg-white/[0.04] border border-border text-text-primary rounded-bl-md"
              )}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-invert prose-sm max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 [&>pre]:bg-white/5 [&>pre]:rounded-lg [&>pre]:p-3">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && messages[messages.length - 1]?.role !== "assistant" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className="h-8 w-8 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-amber" />
              </div>
              <div className="bg-white/[0.04] border border-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-text-muted animate-pulse" />
                <span className="h-2 w-2 rounded-full bg-text-muted animate-pulse [animation-delay:150ms]" />
                <span className="h-2 w-2 rounded-full bg-text-muted animate-pulse [animation-delay:300ms]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {quickPrompts.map((qp) => (
            <button
              key={qp.label}
              onClick={() => sendMessage(qp.prompt)}
              className="flex items-center gap-2 p-3 rounded-lg bg-background-card border border-border text-sm text-text-muted hover:text-text-primary hover:border-amber/30 transition-colors text-left"
            >
              <qp.icon className="h-4 w-4 text-amber shrink-0" />
              <span className="truncate">{qp.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="relative flex items-end gap-2 bg-background-card border border-border rounded-xl p-3">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your AI tutor anything..."
          rows={1}
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted resize-none outline-none min-h-[36px] max-h-[120px] py-1.5"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          className={cn(
            "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-all",
            input.trim() && !isTyping
              ? "bg-amber text-background hover:bg-amber-hover"
              : "bg-white/5 text-text-muted cursor-not-allowed"
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
