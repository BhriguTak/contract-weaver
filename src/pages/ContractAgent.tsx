import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  FileText,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  contracts,
  families,
  obligations,
  clausesCTR001,
  clausesCTR002,
  clausesCTR004,
} from "@/data/mock-data";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "What are the HIPAA compliance obligations across all contracts?",
  "Which obligations are currently overdue?",
  "Summarize the payment terms for MedFirst Health System contracts",
  "What insurance requirements exist for ClearView Analytics?",
  "Compare the termination clauses between the MSA and Amendment 1",
  "Which contracts expire in the next 12 months?",
];

/* ─── Mock AI Response Engine ─────────────────────── */
function generateResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("hipaa") || q.includes("compliance")) {
    return `## HIPAA Compliance Obligations

Based on my analysis of your contract portfolio, here are the key HIPAA-related obligations:

### Active Obligations:
1. **Annual HIPAA Security Risk Assessment** (OBL-001)
   - Contract: CTR-001 (MSA — MedFirst & ClearView)
   - Status: 🟡 Upcoming — Due Jan 15, 2026
   - Owner: ClearView Analytics

2. **BAA Compliance Certification** (OBL-003)
   - Contract: CTR-003 (BAA — MedFirst & ClearView)
   - Status: 🟠 At Risk — Awaiting SOC 2 Type II report
   - Owner: ClearView Analytics

3. **Personnel HIPAA Training** (OBL-007)
   - Contract: CTR-004 (SOW #1)
   - Status: 🟠 At Risk — 18/22 personnel completed
   - Owner: ClearView Analytics

4. **BAA Breach Notification Protocol Test** (OBL-009)
   - Contract: CTR-006 (BAA — Sunrise & MedSecure)
   - Status: 🟡 Upcoming — Due Jun 1, 2026

### Key HIPAA Clauses:
- **CL-001-05**: ClearView must comply with Privacy Rule, Security Rule, and Breach Notification Rule
- **CL-004-06**: All personnel with PHI access must complete HIPAA training and sign confidentiality acknowledgments
- **CL-004-09**: AES-256 encryption at rest, TLS 1.2+ in transit for all PHI

> ⚠️ **Action Required**: 2 obligations are at risk and need immediate attention.`;
  }

  if (q.includes("overdue")) {
    return `## Overdue Obligations

There are currently **2 overdue obligations** requiring immediate attention:

### 1. Q1 2026 Payment — EHR Analytics SOW (OBL-005)
- **Contract**: CTR-004 (SOW #1 — EHR Data Analytics)
- **Amount**: $312,500 quarterly installment
- **Due Date**: January 1, 2026 (47 days overdue)
- **Owner**: MedFirst Health System
- **Risk Level**: 🔴 High
- **Impact**: Late payment may accrue 1.0% monthly interest per Amendment No. 1

### 2. Post-Termination Data Return (OBL-013)
- **Contract**: CTR-009 (MSA — Mountain Valley & PharmaCo)
- **Due Date**: August 1, 2025 (199 days overdue)
- **Owner**: PharmaCo Distributions
- **Risk Level**: 🔴 High
- **Impact**: Data destruction certification not received; potential HIPAA violation for retained PHI

### 3. Final Settlement Payment (OBL-014)
- **Contract**: CTR-009 (MSA — Mountain Valley & PharmaCo)
- **Amount**: $45,000
- **Due Date**: October 1, 2025 (138 days overdue)
- **Owner**: Mountain Valley Medical Center

> 💡 **Recommendation**: Escalate the PharmaCo data return issue to legal counsel given potential HIPAA implications.`;
  }

  if (q.includes("payment") || q.includes("financial")) {
    return `## Payment Terms Summary — MedFirst Health System Contracts

### MSA (CTR-001) — Original Terms:
- Monthly invoicing by ClearView Analytics
- **30-day** payment window
- Late interest: **1.5%/month**

### Amendment No. 1 (CTR-002) — Updated Terms:
- Payment window extended to **45 days**
- **2% early payment discount** for invoices paid within 10 days
- Late interest reduced to **1.0%/month**

### SOW #1 — EHR Analytics (CTR-004):
- Fixed fee: **$1,250,000**
- **4 quarterly installments** of $312,500 each
- First payment due within 15 days of Effective Date
- Termination wind-down costs capped at **$50,000**

### Current Financial Status:
| Obligation | Amount | Status |
|---|---|---|
| Monthly Service Fees | Per SOW | ✅ Compliant |
| Q1 2026 Quarterly | $312,500 | 🔴 Overdue |
| Insurance Premiums | N/A | ✅ Current |

> 💰 **Total Active Contract Value**: ~$1,250,000 (SOW #1) + ongoing MSA fees`;
  }

  if (q.includes("insurance")) {
    return `## Insurance Requirements — ClearView Analytics

### Per MSA (CTR-001):
- Commercial General Liability: **$2,000,000/occurrence**, $5,000,000 aggregate
- Professional Liability (E&O): **$1,000,000/claim**
- Cyber Liability: **$5,000,000/occurrence** (healthcare breach coverage)

### Per Amendment No. 1 (CTR-002) — Enhanced Requirements:
- CGL: **$5,000,000/occurrence** (increased)
- E&O: **$2,000,000/claim** (increased)
- Cyber Liability: **$10,000,000** covering healthcare data breaches (increased)

### Per SOW #1 (CTR-004) — Additional Requirements:
- Cyber Liability: **$10,000,000/occurrence** minimum
- Coverage must extend **12 months post-project completion**
- Must specifically cover healthcare data breach incidents

### Current Status:
- **OBL-004**: Cyber Liability Insurance Renewal — ✅ Compliant
  - Policy renewed through March 2027
  - Last verified: November 15, 2025`;
  }

  if (q.includes("termination") || q.includes("compare")) {
    return `## Termination Clause Comparison: MSA vs Amendment 1

### MSA (CTR-001) — Original:
- **Notice period**: 90 days
- **Cure period for breach**: 30 days
- Post-termination: Return/destroy PHI within 30 days

### Amendment No. 1 (CTR-002) — Modified:
- **Notice period**: 60 days ⬇️ (reduced from 90)
- **Cure period for breach**: 15 days ⬇️ (reduced from 30)

### Key Changes:
| Provision | MSA | Amendment 1 | Change |
|---|---|---|---|
| Notice Period | 90 days | 60 days | -30 days |
| Cure Period | 30 days | 15 days | -15 days |

### SOW #1 (CTR-004) — Separate Terms:
- Termination for convenience: **30 days** notice
- Wind-down costs capped at **$50,000**
- Payment for completed work through termination date

> ⚠️ The shortened cure period in the Amendment gives less time to remedy breaches. Consider whether 15 days is sufficient for complex healthcare data issues.`;
  }

  if (q.includes("expire") || q.includes("expir")) {
    return `## Contracts Expiring Within 12 Months

### Expiring Soon:
1. **CTR-001** — MSA (MedFirst & ClearView)
   - Expires: **January 15, 2026** (in ~11 months)
   - Auto-renewal unless 90-day notice given
   - Action: Renewal decision needed by Oct 17, 2025

2. **CTR-008** — SLA (Pacific Care & HealthBridge)
   - Expires: **March 1, 2026**
   - Status: Under Review
   - ⚠️ Q3 metrics showed 98.8% vs 99.5% SLA target

### Already Expired:
3. **CTR-009** — MSA (Mountain Valley & PharmaCo)
   - Expired: July 1, 2025
   - ⚠️ Outstanding obligations: Data return + $45K settlement

4. **CTR-010** — SOW (Mountain Valley & PharmaCo)
   - Expired: September 14, 2023

### Next 12-24 Months:
5. **CTR-002** — Amendment (MedFirst & ClearView): Jan 15, 2026
6. **CTR-003** — BAA (MedFirst & ClearView): Jan 15, 2026`;
  }

  return `I can help you analyze your healthcare contract portfolio. Here's what I found related to your query:

### Contract Portfolio Overview:
- **${contracts.length} total contracts** across ${families.length} provider relationships
- **${obligations.filter(o => o.status === "overdue").length} overdue obligations** requiring attention
- **${obligations.filter(o => o.status === "at_risk").length} at-risk items** to monitor
- **${contracts.filter(c => c.type === "BAA").length} Business Associate Agreements** (HIPAA)

### Key Healthcare Providers:
1. **MedFirst Health System** — 5 contracts (MSA, Amendment, BAA, 2 SOWs)
2. **Sunrise Hospital Network** — 3 contracts (MSA, BAA, SOW)
3. **Pacific Care Alliance** — 3 contracts (NDA, SLA, MSA)
4. **Mountain Valley Medical** — 3 contracts (MSA, SOW, Amendment) — Expired

Try asking me about specific topics like:
- HIPAA compliance status
- Payment terms and financial obligations
- Insurance requirements
- Contract expirations and renewals
- Clause comparisons between documents`;
}

/* ─── Chat Message Component ──────────────────────── */
function ChatMessage({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
      {message.role === "assistant" && (
        <div className="shrink-0 mt-1 h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      <div className={`max-w-[85%] ${message.role === "user" ? "order-first" : ""}`}>
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.role === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-card border"
          }`}
        >
          {message.role === "assistant" ? (
            <div className="prose prose-sm max-w-none dark:prose-invert [&_table]:text-xs [&_th]:p-1.5 [&_td]:p-1.5 [&_h2]:text-base [&_h3]:text-sm [&_h2]:mt-2 [&_h3]:mt-2 [&_p]:my-1.5 [&_ul]:my-1 [&_li]:my-0.5 [&_blockquote]:my-2 [&_blockquote]:text-xs">
              <MarkdownRenderer content={message.content} />
            </div>
          ) : (
            <p>{message.content}</p>
          )}
        </div>
        {message.role === "assistant" && (
          <div className="flex items-center gap-1 mt-1">
            <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 text-muted-foreground" onClick={handleCopy}>
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        )}
      </div>
      {message.role === "user" && (
        <div className="shrink-0 mt-1 h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

/* ─── Simple Markdown Renderer ────────────────────── */
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let tableRows: string[][] = [];
  let inTable = false;

  while (i < lines.length) {
    const line = lines[i];

    // Table detection
    if (line.includes("|") && line.trim().startsWith("|")) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      // Skip separator rows
      if (!line.match(/^\|[\s\-:|]+\|$/)) {
        const cells = line.split("|").filter((c, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());
        tableRows.push(cells);
      }
      i++;
      // Check if next line exits table
      if (i >= lines.length || !lines[i]?.includes("|") || !lines[i]?.trim().startsWith("|")) {
        inTable = false;
        elements.push(
          <table key={`table-${i}`} className="w-full border-collapse my-2">
            <thead>
              <tr>
                {tableRows[0]?.map((h, j) => <th key={j} className="text-left border-b font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(1).map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => <td key={ci} className="border-b border-border/50">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
      continue;
    }

    // Headers
    if (line.startsWith("## ")) {
      elements.push(<h2 key={i}>{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i}>{line.slice(4)}</h3>);
    }
    // Blockquotes
    else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="border-l-2 border-primary/30 pl-3 text-muted-foreground italic">
          {formatInlineText(line.slice(2))}
        </blockquote>
      );
    }
    // List items
    else if (line.match(/^\d+\.\s/)) {
      elements.push(<li key={i} className="ml-4 list-decimal">{formatInlineText(line.replace(/^\d+\.\s/, ""))}</li>);
    } else if (line.startsWith("- ")) {
      elements.push(<li key={i} className="ml-4 list-disc">{formatInlineText(line.slice(2))}</li>);
    }
    // Empty line
    else if (line.trim() === "") {
      // skip
    }
    // Regular paragraph
    else {
      elements.push(<p key={i}>{formatInlineText(line)}</p>);
    }
    i++;
  }

  return <>{elements}</>;
}

function formatInlineText(text: string): React.ReactNode {
  // Bold
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<strong key={key++}>{match[1]}</strong>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? <>{parts}</> : text;
}

/* ─── Main Component ──────────────────────────────── */
export default function ContractAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));

    const response = generateResponse(text);
    const assistantMsg: Message = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, assistantMsg]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      {/* Header */}
      <div className="border-b bg-card px-4 py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Contract Intelligence Agent</h2>
            <p className="text-[10px] text-muted-foreground">Ask questions about your healthcare contract portfolio</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] gap-1">
            <FileText className="h-2.5 w-2.5" />
            {contracts.length} contracts indexed
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => setMessages([])}
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-280px)] text-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Healthcare Contract Intelligence</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Ask questions about HIPAA compliance, payment terms, obligations, insurance requirements, or any aspect of your contract portfolio.
              </p>

              <Separator className="my-6 max-w-sm" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
                {suggestedQuestions.map((q, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="h-auto text-xs text-left px-3 py-2.5 whitespace-normal justify-start"
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="shrink-0 mt-1 h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-card border rounded-lg px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-card p-4 shrink-0">
        <div className="max-w-3xl mx-auto flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about contracts, obligations, HIPAA compliance..."
            className="flex-1 resize-none rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[40px] max-h-[120px]"
            rows={1}
          />
          <Button
            size="sm"
            className="h-10 w-10 p-0 shrink-0"
            disabled={!input.trim() || isTyping}
            onClick={() => sendMessage(input)}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
