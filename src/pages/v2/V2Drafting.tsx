import { useState } from "react";
import {
  FilePlus2, Bot, Send, BookOpen, CheckCircle2, AlertTriangle,
  ChevronRight, Sparkles, Copy, RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { playbookTemplates, type PlaybookTemplate } from "@/data/v2-mock-data";
import { toast } from "@/hooks/use-toast";

interface DraftMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const typeLabels: Record<string, string> = {
  payer_agreement: "Payer Agreement",
  baa: "BAA",
  provider_network: "Provider Network",
  employment: "Employment",
  vendor: "Vendor",
  lease: "Facility Lease",
};

const sampleClauses = [
  { title: "§1.1 Definitions", text: "\"Covered Services\" means those healthcare services listed in Exhibit A that are medically necessary and provided by credentialed Providers within the Network." },
  { title: "§2.1 Term", text: "This Agreement shall be effective as of [EFFECTIVE_DATE] and shall continue for a period of two (2) years, unless earlier terminated in accordance with Section 9." },
  { title: "§3.1 Provider Obligations", text: "Provider shall maintain all required licenses, certifications, and accreditations. Provider shall comply with all applicable federal and state healthcare regulations, including but not limited to HIPAA, the Anti-Kickback Statute, and the Stark Law." },
  { title: "§4.1 Compensation", text: "Payer shall reimburse Provider for Covered Services at the rates set forth in Exhibit B (Fee Schedule), which shall be no less than [RATE]% of the current Medicare Fee Schedule." },
  { title: "§5.1 Claims Submission", text: "Provider shall submit all claims electronically using ANSI X12 837 format within [FILING_DAYS] days of the date of service. Late submissions may be denied." },
  { title: "§6.1 Credentialing", text: "Provider shall cooperate with Payer's credentialing and re-credentialing requirements. Initial credentialing must be completed prior to the Effective Date." },
  { title: "§7.1 Quality Assurance", text: "Provider agrees to participate in Payer's quality improvement programs and shall maintain HEDIS scores at or above the [HEDIS_MIN] threshold across all measured domains." },
  { title: "§8.1 Confidentiality & HIPAA", text: "Both parties shall comply with the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and its implementing regulations. A separate Business Associate Agreement is attached as Exhibit C." },
];

function aiResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("termination")) return "I've drafted a termination clause with 90-day notice for without-cause and immediate termination for material breach, consistent with your playbook standards.\n\n**§9.1 Termination Without Cause**\nEither party may terminate this Agreement without cause upon ninety (90) days' prior written notice.\n\n**§9.2 Termination for Cause**\nEither party may terminate immediately upon written notice if the other party materially breaches this Agreement and fails to cure within thirty (30) days.\n\n**§9.3 Effect of Termination**\nUpon termination, Provider shall continue to provide services to patients currently undergoing treatment for a transition period of sixty (60) days.";
  if (q.includes("reimbursement") || q.includes("rate") || q.includes("payment")) return "Based on your playbook, here's a reimbursement clause set at 120% of Medicare:\n\n**§4.2 Reimbursement Rates**\nPayer shall reimburse Provider at one hundred twenty percent (120%) of the applicable Medicare Fee Schedule in effect at the time of service. Rates shall be adjusted annually on January 1 to reflect Medicare updates.\n\n**§4.3 Payment Terms**\nPayer shall remit payment within thirty (30) calendar days of receipt of a clean claim. Interest of 1.5% per month shall accrue on late payments.\n\n⚠️ **Playbook Note**: Your minimum acceptable rate is 115% of Medicare. I've set this at 120% as your standard starting position.";
  if (q.includes("hipaa") || q.includes("privacy") || q.includes("phi")) return "Here's a comprehensive HIPAA/privacy clause for the agreement:\n\n**§8.1 HIPAA Compliance**\nBoth parties shall comply with HIPAA, HITECH, and all applicable state privacy laws. A Business Associate Agreement (BAA) is incorporated by reference as Exhibit C.\n\n**§8.2 PHI Safeguards**\nProvider shall implement administrative, physical, and technical safeguards to protect PHI as required by 45 CFR §164.308-312.\n\n**§8.3 Breach Notification**\nIn the event of a security incident involving PHI, the discovering party shall notify the other within forty-eight (48) hours of discovery.";
  return "I can help draft any clause for your healthcare provider contract. Here are some areas I can assist with:\n\n• **Termination clauses** — Standard and for-cause provisions\n• **Reimbursement terms** — Fee schedules pegged to Medicare rates\n• **HIPAA/Privacy** — PHI handling and breach notification\n• **Quality metrics** — HEDIS requirements and reporting\n• **Credentialing** — Provider credentialing obligations\n• **Non-compete/Non-solicitation** — For employment agreements\n\nJust describe what you need, and I'll generate clause language aligned with your playbook.";
}

export default function V2Drafting() {
  const [selectedTemplate, setSelectedTemplate] = useState<PlaybookTemplate | null>(null);
  const [draftClauses, setDraftClauses] = useState(sampleClauses);
  const [messages, setMessages] = useState<DraftMessage[]>([
    { id: "1", role: "assistant", content: "I'm your AI contract co-author. Select a playbook template to start, then I can help you draft, refine, or add clauses. What would you like to work on?" },
  ]);
  const [input, setInput] = useState("");
  const [contractTitle, setContractTitle] = useState("");

  const selectTemplate = (template: PlaybookTemplate) => {
    setSelectedTemplate(template);
    setContractTitle(`${template.name} — [Counterparty]`);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: "assistant",
      content: `Great choice! I've loaded the **${template.name}** template with ${template.clauses} standard clauses. The draft is ready for customization.\n\nKey placeholders to fill:\n• **[EFFECTIVE_DATE]** — Contract start date\n• **[RATE]** — Medicare rate multiplier\n• **[FILING_DAYS]** — Claims filing deadline\n• **[HEDIS_MIN]** — Minimum HEDIS threshold\n\nI can help you draft additional clauses, modify existing ones, or review the contract against your playbook. What would you like to do?`
    }]);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: DraftMessage = { id: Date.now().toString(), role: "user", content: input };
    const aiMsg: DraftMessage = { id: (Date.now() + 1).toString(), role: "assistant", content: aiResponse(input) };
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Left: Playbook / Clause Editor */}
      <div className="flex-1 flex flex-col border-r min-w-0">
        {/* Template Selection or Editor */}
        {!selectedTemplate ? (
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-3xl mx-auto space-y-5">
              <div>
                <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <FilePlus2 className="h-5 w-5 text-primary" />Contract Drafting
                </h1>
                <p className="text-xs text-muted-foreground mt-1">Select a playbook template to begin drafting</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {playbookTemplates.map(t => (
                  <Card key={t.id} className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all" onClick={() => selectTemplate(t)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold">{t.name}</h3>
                          <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                        </div>
                        <Badge variant="outline" className="text-[9px] shrink-0">{typeLabels[t.type] || t.type}</Badge>
                      </div>
                      <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>{t.clauses} clauses</span>
                        <span>Used {t.usageCount}x</span>
                        <span>Last: {t.lastUsed}</span>
                      </div>
                      <Button size="sm" variant="ghost" className="mt-2 text-xs gap-1 h-7 w-full">
                        Use Template <ChevronRight className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Editor Header */}
            <div className="p-4 border-b space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <Input
                    value={contractTitle}
                    onChange={(e) => setContractTitle(e.target.value)}
                    className="text-sm font-semibold border-0 p-0 h-auto focus-visible:ring-0 bg-transparent max-w-md"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setSelectedTemplate(null); setDraftClauses(sampleClauses); }}>
                    <RotateCcw className="h-3 w-3 mr-1" />Reset
                  </Button>
                  <Button size="sm" className="text-xs h-7" onClick={() => toast({ title: "Draft saved", description: "Your contract draft has been saved." })}>
                    <CheckCircle2 className="h-3 w-3 mr-1" />Save Draft
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <Badge variant="secondary" className="text-[9px]">{typeLabels[selectedTemplate.type]}</Badge>
                <span>{draftClauses.length} clauses</span>
                <span>·</span>
                <span>Template: {selectedTemplate.name}</span>
              </div>
            </div>
            {/* Clause List */}
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-3xl mx-auto space-y-3">
                {draftClauses.map((clause, i) => (
                  <Card key={i} className="group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-semibold text-primary">{clause.title}</h4>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => navigator.clipboard.writeText(clause.text)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-foreground/80 mt-2 leading-relaxed whitespace-pre-wrap">
                        {clause.text.split(/(\[.*?\])/).map((part, j) =>
                          part.startsWith("[") ? <span key={j} className="bg-status-warning/15 text-status-warning px-1 rounded text-[11px] font-medium">{part}</span> : part
                        )}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Right: AI Co-Author Chat */}
      <div className="w-[380px] flex flex-col bg-muted/30">
        <div className="p-3 border-b flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold">AI Co-Author</p>
            <p className="text-[10px] text-muted-foreground">Playbook-aware drafting assistant</p>
          </div>
        </div>
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[90%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border"
                }`}>
                  {msg.content.split("\n").map((line, i) => {
                    if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-bold mt-1">{line.replace(/\*\*/g, "")}</p>;
                    if (line.startsWith("• ")) return <p key={i} className="ml-2">• {line.slice(2).replace(/\*\*/g, "")}</p>;
                    if (line.startsWith("⚠️")) return <p key={i} className="mt-1 text-status-warning">{line}</p>;
                    return <p key={i} className={line === "" ? "h-1" : ""}>{line}</p>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask to draft a clause..."
              className="min-h-[36px] max-h-[100px] text-xs resize-none"
              rows={1}
            />
            <Button size="icon" className="h-9 w-9 shrink-0" onClick={sendMessage} disabled={!input.trim()}>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {["Add termination clause", "Draft reimbursement terms", "HIPAA provisions"].map(q => (
              <button key={q} onClick={() => { setInput(q); }} className="text-[9px] px-2 py-0.5 rounded-full border bg-card hover:bg-muted transition-colors text-muted-foreground">
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
