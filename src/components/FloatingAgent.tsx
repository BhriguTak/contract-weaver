import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Bot, User, Copy, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { contracts, families, obligations, clausesCTR001, clausesCTR002, clausesCTR004 } from "@/data/mock-data";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function generateResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("hipaa") || q.includes("compliance")) {
    return `## HIPAA Compliance Overview

**3 active HIPAA obligations** across your payer contracts:

1. **Annual Security Risk Assessment** — 🟡 Upcoming (Jan 15, 2026)
2. **BAA Compliance Certification** — 🟠 At Risk (SOC 2 pending)
3. **Personnel HIPAA Training** — 🟠 At Risk (18/22 complete)

> ⚠️ 2 items need immediate attention before next audit cycle.`;
  }

  if (q.includes("overdue") || q.includes("obligation")) {
    return `## Overdue Obligations

**${obligations.filter(o => o.status === "overdue").length} overdue items:**

1. **Q1 2026 Payment** — $312,500 (47 days overdue)
2. **Post-Termination Data Return** — PharmaCo (199 days overdue)
3. **Final Settlement** — $45,000 (138 days overdue)

> 💡 Escalate PharmaCo data return to legal counsel.`;
  }

  if (q.includes("payer") || q.includes("claim") || q.includes("denial")) {
    return `## Payer Contract Insights

### Claims Performance (Last 90 Days):
- **Clean claim rate**: 94.2% (target: 95%)
- **Average days to payment**: 32 days
- **Denial rate**: 8.3% — trending up from 6.1%

### Top Denial Reasons:
1. Missing prior authorization (34%)
2. Coding errors — ICD-10 specificity (22%)
3. Timely filing violations (18%)

> ⚠️ BlueCross BlueShield denials up 42% QoQ. Review BAA terms.`;
  }

  return `### Contract Portfolio Summary
- **${contracts.length} contracts** across ${families.length} payer relationships
- **${obligations.filter(o => o.status === "overdue").length} overdue** obligations
- **${obligations.filter(o => o.status === "at_risk").length} at-risk** items

Try asking about:
• HIPAA compliance status
• Overdue obligations
• Payer claims & denials
• Contract expirations`;
}

function formatInlineText(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(<strong key={key++}>{match[1]}</strong>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? <>{parts}</> : text;
}

function MiniMarkdown({ content }: { content: string }) {
  return (
    <>
      {content.split("\n").map((line, i) => {
        if (line.startsWith("## ")) return <h3 key={i} className="text-sm font-semibold mt-2 mb-1">{line.slice(3)}</h3>;
        if (line.startsWith("### ")) return <h4 key={i} className="text-xs font-semibold mt-1.5 mb-0.5">{line.slice(4)}</h4>;
        if (line.startsWith("> ")) return <blockquote key={i} className="border-l-2 border-primary/30 pl-2 text-[11px] text-muted-foreground italic my-1">{formatInlineText(line.slice(2))}</blockquote>;
        if (line.match(/^\d+\.\s/)) return <li key={i} className="ml-3 list-decimal text-xs">{formatInlineText(line.replace(/^\d+\.\s/, ""))}</li>;
        if (line.startsWith("- ") || line.startsWith("• ")) return <li key={i} className="ml-3 list-disc text-xs">{formatInlineText(line.slice(2))}</li>;
        if (line.trim() === "") return null;
        return <p key={i} className="text-xs my-0.5">{formatInlineText(line)}</p>;
      })}
    </>
  );
}

export function FloatingAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: `m-${Date.now()}`, role: "user", content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
    const response = generateResponse(text);
    setIsTyping(false);
    setMessages(prev => [...prev, { id: `m-${Date.now() + 1}`, role: "assistant", content: response, timestamp: new Date() }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center group"
        >
          <Sparkles className="h-6 w-6 group-hover:animate-pulse" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground flex items-center justify-center">
            AI
          </span>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] rounded-xl border bg-card shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-primary/5">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold">Contract Agent</p>
                <p className="text-[10px] text-muted-foreground">Healthcare payer intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setMessages([])}>
                <RotateCcw className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setOpen(false)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-semibold">Ask me anything</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  HIPAA compliance, payer obligations, claims data, contract terms
                </p>
                <div className="flex flex-col gap-1.5 mt-4 w-full">
                  {["What are the overdue obligations?", "Show HIPAA compliance status", "Payer claims & denial trends"].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-[11px] text-left px-3 py-2 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                    {msg.role === "assistant" && (
                      <div className="shrink-0 mt-0.5 h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
                        <Bot className="h-3 w-3 text-primary" />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-lg px-3 py-2 ${msg.role === "user" ? "bg-primary text-primary-foreground text-xs" : "bg-muted/50 border"}`}>
                      {msg.role === "assistant" ? <MiniMarkdown content={msg.content} /> : <p className="text-xs">{msg.content}</p>}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2">
                    <div className="shrink-0 h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
                      <Bot className="h-3 w-3 text-primary" />
                    </div>
                    <div className="bg-muted/50 border rounded-lg px-3 py-2 flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-2.5">
            <div className="flex gap-1.5">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about contracts..."
                className="flex-1 resize-none rounded-lg border bg-background px-2.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary min-h-[36px] max-h-[80px]"
                rows={1}
              />
              <Button size="sm" className="h-9 w-9 p-0 shrink-0" disabled={!input.trim() || isTyping} onClick={() => sendMessage(input)}>
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
