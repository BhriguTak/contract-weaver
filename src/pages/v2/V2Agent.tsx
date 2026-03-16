import { useState, useRef, useEffect } from "react";
import { Bot, Send, RotateCcw, FileStack, Copy, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { v2Contracts, v2Obligations, redlineChanges } from "@/data/v2-mock-data";
import { toast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function generateResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("overdue") || q.includes("obligation")) {
    const overdue = v2Obligations.filter(o => o.status === "overdue");
    return `## Overdue Obligations\n\nThere are **${overdue.length}** overdue obligations requiring immediate attention:\n\n${overdue.map((o, i) => `${i + 1}. **${o.title}** — ${o.contractTitle}\n   - Due: ${o.dueDate} | Risk: ${o.risk.toUpperCase()}\n   - Owner: ${o.owner}\n   ${o.lastAction ? `- Last action: ${o.lastAction}` : ""}`).join("\n\n")}\n\n**Recommendation**: Prioritize the HIPAA security risk assessment (critical risk) and schedule the claims reconciliation audit immediately.`;
  }
  if (q.includes("redline") || q.includes("deviation")) {
    const pending = redlineChanges.filter(r => r.status === "pending");
    const critical = redlineChanges.filter(r => r.deviationSeverity === "critical");
    return `## Redline Summary\n\n- **${pending.length}** pending redlines await your review\n- **${critical.length}** critical deviation(s) detected\n\n### Critical Deviations:\n${critical.map(r => `- **${r.clauseTitle}**: ${r.comment || "No comment"}\n  - Playbook standard: ${r.playbookClause}`).join("\n\n")}\n\n**⚠️ Alert**: The Aetna reimbursement rate proposal (105% of Medicare) is below your minimum threshold of 115%. Recommend escalating to the CFO before accepting.`;
  }
  if (q.includes("hipaa") || q.includes("compliance") || q.includes("baa")) {
    return `## HIPAA & Compliance Status\n\n### BAA Coverage\n- **Active BAAs**: ${v2Contracts.filter(c => c.type === "baa" && c.status === "executed").length}\n- All PHI-handling vendors have current BAAs on file\n\n### Key Compliance Items\n1. **HIPAA Security Risk Assessment** — ⚠️ OVERDUE (was due Mar 15)\n2. **PHI Access Log Review** — Due Mar 31 (on track)\n3. **Breach Notification Protocol** — All BAAs include 48-hour notification clause\n\n### Recommendations\n- Complete the overdue security risk assessment immediately (regulatory exposure)\n- Schedule the annual BAA review cycle for Q2\n- Verify all new vendor agreements include HIPAA addenda`;
  }
  if (q.includes("expir") || q.includes("renew")) {
    const expired = v2Contracts.filter(c => c.status === "expired");
    const expiringSoon = v2Contracts.filter(c => {
      const exp = new Date(c.expirationDate);
      const now = new Date();
      const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return diff > 0 && diff <= 180;
    });
    return `## Contract Renewal Tracker\n\n### Expired (${expired.length})\n${expired.map(c => `- **${c.title}** — Expired ${c.expirationDate}\n  - Value: $${(c.value/1000).toFixed(0)}K | Action needed: Renegotiate or terminate`).join("\n")}\n\n### Expiring Within 6 Months (${expiringSoon.length})\n${expiringSoon.length > 0 ? expiringSoon.map(c => `- **${c.title}** — Expires ${c.expirationDate}`).join("\n") : "No contracts expiring in the next 6 months."}\n\n**Recommendation**: Initiate renewal discussions for the Humana Medicare Advantage Agreement — it expired 3+ months ago with $1.5M annual value at stake.`;
  }
  if (q.includes("risk") || q.includes("score")) {
    const highRisk = v2Contracts.filter(c => c.riskScore > 50);
    return `## Portfolio Risk Analysis\n\n### Risk Distribution\n| Risk Level | Contracts |\n|---|---|\n| Low (0-25) | ${v2Contracts.filter(c => c.riskScore <= 25).length} |\n| Medium (26-50) | ${v2Contracts.filter(c => c.riskScore > 25 && c.riskScore <= 50).length} |\n| High (51+) | ${highRisk.length} |\n\n### High-Risk Contracts\n${highRisk.map(c => `- **${c.title}** — Score: ${c.riskScore}\n  - Status: ${c.status} | Value: $${(c.value/1000).toFixed(0)}K`).join("\n\n")}\n\n**Key Drivers**: Expired contracts and pending redlines with critical deviations are the primary risk elevators.`;
  }

  // Default overview
  return `## Portfolio Overview\n\n| Metric | Value |\n|---|---|\n| Total Contracts | ${v2Contracts.length} |\n| Active (Executed) | ${v2Contracts.filter(c => c.status === "executed").length} |\n| In Review | ${v2Contracts.filter(c => c.status === "in_review").length} |\n| Drafts | ${v2Contracts.filter(c => c.status === "draft").length} |\n| Total Value | $${(v2Contracts.reduce((s,c) => s+c.value, 0)/1e6).toFixed(1)}M |\n| Pending Redlines | ${redlineChanges.filter(r => r.status === "pending").length} |\n| Overdue Obligations | ${v2Obligations.filter(o => o.status === "overdue").length} |\n\nTry asking about:\n- **Overdue obligations** and compliance risks\n- **Redline deviations** and playbook violations\n- **HIPAA & BAA compliance** status\n- **Contract expirations** and renewals\n- **Risk scores** and portfolio analysis`;
}

const suggestions = [
  "What are the overdue obligations?",
  "Show me critical redline deviations",
  "HIPAA compliance status",
  "Which contracts are expiring soon?",
  "Analyze portfolio risk scores",
];

export default function V2Agent() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", role: "assistant", content: "Hello! I'm your healthcare contract intelligence agent. I can analyze your contracts, track obligations, review redlines, and flag compliance risks.\n\nWhat would you like to know?", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim() || isTyping) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(userMsg.content);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, 800);
  };

  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="text-sm font-bold mt-2 mb-1">{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-xs font-semibold mt-2 mb-1">{line.slice(4)}</h3>;
      if (line.startsWith("| ")) {
        const cells = line.split("|").filter(Boolean).map(c => c.trim());
        if (cells.every(c => c.match(/^-+$/))) return null;
        return <div key={i} className="grid grid-cols-2 text-[11px] border-b py-0.5">{cells.map((c, j) => <span key={j} className={j === 0 ? "text-muted-foreground" : "font-medium text-right"}>{c}</span>)}</div>;
      }
      if (line.startsWith("- **")) return <p key={i} className="text-xs ml-2 my-0.5">{line.replace(/\*\*/g, "").slice(2)}</p>;
      if (line.startsWith("- ")) return <p key={i} className="text-xs ml-2 my-0.5 text-muted-foreground">{line.slice(2)}</p>;
      if (line.startsWith("**⚠️") || line.startsWith("**Recommendation")) return <p key={i} className="text-xs mt-2 p-2 rounded bg-status-warning/10 border border-status-warning/20 text-status-warning">{line.replace(/\*\*/g, "")}</p>;
      if (line.startsWith("**")) return <p key={i} className="text-xs font-semibold mt-1">{line.replace(/\*\*/g, "")}</p>;
      if (line.trim() === "") return <div key={i} className="h-1" />;
      return <p key={i} className="text-xs">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold">Contract Intelligence Agent</h1>
            <p className="text-[10px] text-muted-foreground">{v2Contracts.length} contracts · {v2Obligations.length} obligations tracked</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-xs gap-1 h-7" onClick={() => setMessages([messages[0]])}>
          <RotateCcw className="h-3 w-3" />Reset
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-lg px-4 py-3 ${
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border"
              }`}>
                {msg.role === "user" ? (
                  <p className="text-xs">{msg.content}</p>
                ) : (
                  <div>{renderMarkdown(msg.content)}</div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card border rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.1s]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="max-w-3xl mx-auto">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestions.map(s => (
                <button key={s} onClick={() => setInput(s)} className="text-[10px] px-3 py-1.5 rounded-full border bg-card hover:bg-muted transition-colors text-muted-foreground">
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask about contracts, obligations, compliance..."
              className="min-h-[40px] max-h-[120px] text-xs resize-none"
              rows={1}
            />
            <Button size="icon" className="h-10 w-10 shrink-0" onClick={sendMessage} disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
