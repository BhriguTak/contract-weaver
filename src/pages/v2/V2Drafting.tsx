import { useState, useRef, useEffect, useCallback } from "react";
import {
  FilePlus2, Bot, Send, BookOpen, CheckCircle2, AlertTriangle,
  ChevronRight, Sparkles, Copy, RotateCcw, FileText, PenLine,
  Wand2, ArrowLeft, Plus, Trash2, GripVertical, ChevronDown,
  Loader2, Zap, Shield, Scale, X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { playbookTemplates, type PlaybookTemplate } from "@/data/v2-mock-data";
import { toast } from "@/hooks/use-toast";

/* ─── Types ─── */
interface DraftMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

interface DraftClause {
  id: string;
  title: string;
  text: string;
  aiGenerated?: boolean;
  status: "draft" | "reviewed" | "approved";
}

type CreationMode = "select" | "full_draft" | "clause_by_clause" | "playbook_guided";

/* ─── Mock AI Responses ─── */
const fullDraftResponses: Record<string, string> = {
  default: `I'll generate a complete **Payer Agreement** draft for you. Here's what I'm building:

**Contract Structure:**
1. Definitions & Interpretation
2. Term & Renewal
3. Provider Obligations & Credentialing
4. Compensation & Fee Schedule
5. Claims Submission & Processing
6. Quality Assurance & HEDIS Metrics
7. Confidentiality & HIPAA Compliance
8. Termination Provisions
9. Dispute Resolution
10. General Provisions

I've populated all sections using your playbook standards. Key terms are set to your preferred defaults:
- **Reimbursement**: 120% of Medicare Fee Schedule
- **Filing deadline**: 90 days
- **Termination notice**: 90 days without cause
- **HEDIS minimum**: 4.0 threshold

The full draft is now loaded in the editor. You can review each clause, and I'll flag any areas that need your specific input (marked with brackets).`,
};

const clauseResponses: Record<string, string> = {
  termination: `Here's a termination clause tailored for healthcare provider agreements:

**§9.1 Termination Without Cause**
Either party may terminate this Agreement without cause upon ninety (90) days' prior written notice to the other party, delivered by certified mail or overnight courier.

**§9.2 Termination for Cause**
Either party may terminate this Agreement immediately upon written notice if:
(a) The other party materially breaches any provision and fails to cure within thirty (30) days of written notice;
(b) The other party becomes insolvent or files for bankruptcy;
(c) Any required license, certification, or accreditation is revoked or suspended.

**§9.3 Termination for Regulatory Change**
Either party may terminate upon sixty (60) days' notice if a material change in applicable law or regulation renders performance commercially unreasonable.

**§9.4 Continuity of Care**
Upon termination, Provider shall continue to provide services to patients actively undergoing treatment for a transition period not to exceed sixty (60) days.

⚠️ **Playbook Note**: Your minimum notice period is 90 days for without-cause. This clause meets that threshold.`,

  reimbursement: `Here's the reimbursement and payment terms clause:

**§4.1 Reimbursement Rates**
Payer shall reimburse Provider for Covered Services at one hundred twenty percent (120%) of the applicable Medicare Fee Schedule in effect at the date of service, as published by CMS.

**§4.2 Rate Adjustments**
(a) Rates shall be adjusted annually on January 1 to reflect the updated Medicare Fee Schedule;
(b) Midyear CPT code additions shall be reimbursed at the newly published Medicare rate multiplied by the contract rate percentage;
(c) No retroactive rate decreases without mutual written consent.

**§4.3 Payment Terms**
(a) Payer shall remit payment within thirty (30) calendar days of receipt of a Clean Claim;
(b) Interest of 1.5% per month shall accrue on payments not remitted within the timeframe;
(c) Underpayments identified during reconciliation shall be corrected within fifteen (15) business days.

**§4.4 Clean Claim Definition**
A "Clean Claim" is one submitted electronically using ANSI X12 837 format with all required data elements, including valid CPT/HCPCS codes, appropriate modifiers, and supporting documentation.

⚠️ **Playbook Note**: Minimum acceptable rate is 115% of Medicare. Set at 120% as your standard starting position.`,

  hipaa: `Here's a comprehensive HIPAA/Privacy clause:

**§8.1 HIPAA Compliance**
Both parties shall comply with the Health Insurance Portability and Accountability Act of 1996 ("HIPAA"), the Health Information Technology for Economic and Clinical Health Act ("HITECH"), and all implementing regulations at 45 CFR Parts 160 and 164.

**§8.2 Business Associate Agreement**
The parties have executed a separate Business Associate Agreement ("BAA"), attached hereto as Exhibit C, which is incorporated by reference. In the event of conflict between this Agreement and the BAA, the BAA shall control with respect to PHI-related matters.

**§8.3 Minimum Necessary Standard**
Both parties shall limit the use, disclosure, and request of Protected Health Information ("PHI") to the minimum necessary to accomplish the intended purpose.

**§8.4 Safeguards**
Provider shall implement and maintain:
(a) Administrative safeguards per 45 CFR §164.308;
(b) Physical safeguards per 45 CFR §164.310;
(c) Technical safeguards per 45 CFR §164.312.

**§8.5 Breach Notification**
In the event of a Breach of Unsecured PHI:
(a) The discovering party shall notify the other within forty-eight (48) hours;
(b) Notification shall include the nature of the breach, types of information involved, and mitigation steps taken;
(c) Both parties shall cooperate in any required HHS notification.

✅ **Compliance Check**: This clause meets all current OCR enforcement priorities.`,

  quality: `Here's a quality assurance and performance metrics clause:

**§7.1 Quality Program Participation**
Provider agrees to participate in Payer's quality improvement programs, including but not limited to:
(a) HEDIS® measure reporting;
(b) Patient satisfaction surveys (CAHPS);
(c) Clinical quality initiatives;
(d) Utilization review programs.

**§7.2 Performance Standards**
Provider shall maintain the following minimum standards:
(a) HEDIS composite score of 4.0 or above across all measured domains;
(b) Patient satisfaction scores at or above the 50th percentile nationally;
(c) Hospital readmission rates at or below the CMS national average;
(d) Emergency department utilization rates within contracted benchmarks.

**§7.3 Performance Reporting**
(a) Provider shall submit quarterly quality reports within thirty (30) days of quarter-end;
(b) Payer shall provide claims-based quality data to Provider monthly;
(c) Annual performance review meetings shall be conducted within Q1 of each contract year.

**§7.4 Performance Incentives**
Providers achieving HEDIS scores at or above the 75th percentile shall be eligible for:
(a) Quality bonus payments of up to 5% of total reimbursement;
(b) Preferred tier status for member-facing directories;
(c) Expedited claims processing.

📊 **Benchmark**: Your current HEDIS average is 4.2 — above the 4.0 minimum threshold.`,

  default: `I can help draft any clause for your healthcare provider contract. Here are areas I can assist with:

• **Termination clauses** — Standard and for-cause provisions with continuity of care
• **Reimbursement terms** — Fee schedules, payment timelines, clean claim definitions
• **HIPAA/Privacy** — PHI handling, breach notification, BAA integration
• **Quality metrics** — HEDIS, CAHPS, performance incentives
• **Credentialing** — Provider enrollment and re-credentialing obligations
• **Claims processing** — Filing deadlines, appeals, reconsideration
• **Non-compete/Non-solicitation** — For employment agreements
• **Indemnification** — Mutual indemnity with carve-outs for malpractice
• **Force majeure** — Pandemic and regulatory change provisions
• **Dispute resolution** — Mediation/arbitration procedures

Describe what you need, and I'll generate clause language aligned with your playbook standards.`,
};

const playbookReviewResponses: Record<string, string> = {
  default: `I've completed the playbook compliance review. Here's my analysis:

**✅ Compliant Clauses (6/8)**
- §1.1 Definitions — Matches standard template
- §2.1 Term — 2-year initial term meets minimum
- §3.1 Provider Obligations — All required provisions present
- §5.1 Claims Submission — 90-day filing window within range
- §6.1 Credentialing — Standard language verified
- §8.1 HIPAA — All required provisions present

**⚠️ Review Needed (2/8)**
- §4.1 Compensation — Rate placeholder needs counterparty-specific value. Your floor is 115% of Medicare.
- §7.1 Quality Assurance — HEDIS threshold placeholder needs value. Recommended: 4.0 minimum.

**Risk Assessment: Low** 🟢
Overall deviation score: 12/100. This draft closely aligns with your playbook standards.

**Recommendations:**
1. Fill the [RATE] placeholder — suggest starting at 120%
2. Set [HEDIS_MIN] to 4.0 as your standard threshold
3. Consider adding a dispute resolution clause (missing from template)
4. Add force majeure provision for regulatory changes`,
};

function getAIResponse(query: string, mode: CreationMode): string {
  const q = query.toLowerCase();
  if (mode === "full_draft") return fullDraftResponses.default;
  if (mode === "playbook_guided") return playbookReviewResponses.default;
  if (q.includes("terminat")) return clauseResponses.termination;
  if (q.includes("reimburs") || q.includes("rate") || q.includes("payment") || q.includes("compens")) return clauseResponses.reimbursement;
  if (q.includes("hipaa") || q.includes("privacy") || q.includes("phi") || q.includes("security")) return clauseResponses.hipaa;
  if (q.includes("quality") || q.includes("hedis") || q.includes("performance") || q.includes("metric")) return clauseResponses.quality;
  return clauseResponses.default;
}

/* ─── Template Clauses ─── */
const defaultClauses: DraftClause[] = [
  { id: "c1", title: "§1.1 Definitions", text: "\"Covered Services\" means those healthcare services listed in Exhibit A that are medically necessary and provided by credentialed Providers within the Network.", status: "draft" },
  { id: "c2", title: "§2.1 Term", text: "This Agreement shall be effective as of [EFFECTIVE_DATE] and shall continue for a period of two (2) years, unless earlier terminated in accordance with Section 9.", status: "draft" },
  { id: "c3", title: "§3.1 Provider Obligations", text: "Provider shall maintain all required licenses, certifications, and accreditations. Provider shall comply with all applicable federal and state healthcare regulations, including but not limited to HIPAA, the Anti-Kickback Statute, and the Stark Law.", status: "draft" },
  { id: "c4", title: "§4.1 Compensation", text: "Payer shall reimburse Provider for Covered Services at the rates set forth in Exhibit B (Fee Schedule), which shall be no less than [RATE]% of the current Medicare Fee Schedule.", status: "draft" },
  { id: "c5", title: "§5.1 Claims Submission", text: "Provider shall submit all claims electronically using ANSI X12 837 format within [FILING_DAYS] days of the date of service. Late submissions may be denied.", status: "draft" },
  { id: "c6", title: "§6.1 Credentialing", text: "Provider shall cooperate with Payer's credentialing and re-credentialing requirements. Initial credentialing must be completed prior to the Effective Date.", status: "draft" },
  { id: "c7", title: "§7.1 Quality Assurance", text: "Provider agrees to participate in Payer's quality improvement programs and shall maintain HEDIS scores at or above the [HEDIS_MIN] threshold across all measured domains.", status: "draft" },
  { id: "c8", title: "§8.1 Confidentiality & HIPAA", text: "Both parties shall comply with the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and its implementing regulations. A separate Business Associate Agreement is attached as Exhibit C.", status: "draft" },
];

const typeLabels: Record<string, string> = {
  payer_agreement: "Payer Agreement",
  baa: "BAA",
  provider_network: "Provider Network",
  employment: "Employment",
  vendor: "Vendor",
  lease: "Facility Lease",
};

/* ─── Streaming Simulator ─── */
function useStreamingText(onComplete?: () => void) {
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const startStream = useCallback((fullText: string) => {
    setStreamedText("");
    setIsStreaming(true);
    let idx = 0;
    const chunkSize = () => Math.floor(Math.random() * 3) + 1;

    intervalRef.current = setInterval(() => {
      const size = chunkSize();
      idx += size;
      if (idx >= fullText.length) {
        setStreamedText(fullText);
        setIsStreaming(false);
        clearInterval(intervalRef.current);
        onComplete?.();
      } else {
        setStreamedText(fullText.slice(0, idx));
      }
    }, 12);
  }, [onComplete]);

  const stopStream = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsStreaming(false);
  }, []);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return { streamedText, isStreaming, startStream, stopStream };
}

/* ─── Component ─── */
export default function V2Drafting() {
  const [mode, setMode] = useState<CreationMode>("select");
  const [selectedTemplate, setSelectedTemplate] = useState<PlaybookTemplate | null>(null);
  const [draftClauses, setDraftClauses] = useState<DraftClause[]>(defaultClauses);
  const [messages, setMessages] = useState<DraftMessage[]>([]);
  const [input, setInput] = useState("");
  const [contractTitle, setContractTitle] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [contractType, setContractType] = useState<string>("payer_agreement");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { streamedText, isStreaming, startStream } = useStreamingText(() => {
    setIsAiThinking(false);
  });
  const streamingMsgIdRef = useRef<string>("");

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedText]);

  // Update streaming message
  useEffect(() => {
    if (isStreaming && streamingMsgIdRef.current) {
      setMessages(prev =>
        prev.map(m => m.id === streamingMsgIdRef.current ? { ...m, content: streamedText, isStreaming: true } : m)
      );
    }
    if (!isStreaming && streamingMsgIdRef.current) {
      setMessages(prev =>
        prev.map(m => m.id === streamingMsgIdRef.current ? { ...m, isStreaming: false } : m)
      );
      streamingMsgIdRef.current = "";
    }
  }, [streamedText, isStreaming]);

  const selectMode = (m: CreationMode) => {
    setMode(m);
    const greetings: Record<string, string> = {
      full_draft: "I'll generate a complete contract draft from your inputs. Tell me the contract type, counterparty, and any key terms you want to include, and I'll produce a full draft using your playbook standards.\n\nYou can also select a playbook template below to start with a proven foundation.",
      clause_by_clause: "Let's build your contract section by section. I'll help you draft individual clauses — just describe what you need (e.g., \"draft a termination clause\" or \"add HIPAA provisions\"), and I'll generate playbook-aligned language.\n\nStart by selecting a template or ask me to draft any clause.",
      playbook_guided: "I'll guide you through the drafting process using your playbook standards. Select a template, and I'll review the draft against your playbook, flag deviations, and suggest improvements.\n\nLet's begin — choose a playbook template below.",
    };
    setMessages([
      { id: "welcome", role: "assistant", content: greetings[m] || "" },
    ]);
  };

  const selectTemplate = (template: PlaybookTemplate) => {
    setSelectedTemplate(template);
    setContractTitle(`${template.name} — [Counterparty]`);
    setContractType(template.type);

    const msgId = Date.now().toString();
    streamingMsgIdRef.current = msgId;
    setMessages(prev => [...prev, { id: msgId, role: "assistant", content: "", isStreaming: true }]);
    setIsAiThinking(true);

    const fullText = mode === "playbook_guided"
      ? playbookReviewResponses.default
      : `Loaded the **${template.name}** template with ${template.clauses} standard clauses. The draft is ready for customization.\n\n**Key placeholders to fill:**\n• **[EFFECTIVE_DATE]** — Contract start date\n• **[RATE]** — Medicare rate multiplier (your floor: 115%)\n• **[FILING_DAYS]** — Claims filing deadline (standard: 90)\n• **[HEDIS_MIN]** — Minimum HEDIS threshold (standard: 4.0)\n\nI can help you:\n→ **Modify** any existing clause\n→ **Add** new sections (termination, dispute resolution, force majeure)\n→ **Review** the entire draft against your playbook\n\nWhat would you like to work on?`;

    setTimeout(() => startStream(fullText), 600);
  };

  const sendMessage = () => {
    if (!input.trim() || isAiThinking) return;
    const userMsg: DraftMessage = { id: `u-${Date.now()}`, role: "user", content: input };
    const aiMsgId = `a-${Date.now()}`;
    streamingMsgIdRef.current = aiMsgId;

    setMessages(prev => [...prev, userMsg, { id: aiMsgId, role: "assistant", content: "", isStreaming: true }]);
    setIsAiThinking(true);
    setInput("");

    const response = getAIResponse(input, mode);
    setTimeout(() => startStream(response), 800);
  };

  const addClauseFromAI = (title: string, text: string) => {
    const newClause: DraftClause = {
      id: `ai-${Date.now()}`,
      title,
      text,
      aiGenerated: true,
      status: "draft",
    };
    setDraftClauses(prev => [...prev, newClause]);
    toast({ title: "Clause added", description: `${title} has been added to your draft.` });
  };

  const removeClause = (id: string) => {
    setDraftClauses(prev => prev.filter(c => c.id !== id));
    toast({ title: "Clause removed" });
  };

  const approveClause = (id: string) => {
    setDraftClauses(prev =>
      prev.map(c => c.id === id ? { ...c, status: c.status === "approved" ? "draft" : "approved" } : c)
    );
  };

  /* ─── Mode Selection Screen ─── */
  if (mode === "select") {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />AI Contract Creation
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Choose how you'd like to create your healthcare provider contract</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Full Draft */}
          <Card
            className="cursor-pointer hover:shadow-lg hover:border-primary/40 transition-all group"
            onClick={() => selectMode("full_draft")}
          >
            <CardContent className="p-5 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Full Draft Generation</h3>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  AI generates a complete contract from your inputs — contract type, counterparty, and key terms. Fastest way to a first draft.
                </p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-primary font-medium">
                Get started <ChevronRight className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>

          {/* Clause by Clause */}
          <Card
            className="cursor-pointer hover:shadow-lg hover:border-primary/40 transition-all group"
            onClick={() => selectMode("clause_by_clause")}
          >
            <CardContent className="p-5 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <PenLine className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Clause-by-Clause Co-Authoring</h3>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Build your contract section by section. AI suggests and writes individual clauses on demand.
                </p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-primary font-medium">
                Get started <ChevronRight className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>

          {/* Playbook Guided */}
          <Card
            className="cursor-pointer hover:shadow-lg hover:border-primary/40 transition-all group"
            onClick={() => selectMode("playbook_guided")}
          >
            <CardContent className="p-5 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Playbook-Guided with AI Review</h3>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Start from a playbook template. AI fills in details, flags deviations, and ensures compliance.
                </p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-primary font-medium">
                Get started <ChevronRight className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-6 text-[10px] text-muted-foreground pt-2">
          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{playbookTemplates.length} playbook templates available</span>
          <span className="flex items-center gap-1"><Scale className="h-3 w-3" />Healthcare provider contracts only</span>
          <span className="flex items-center gap-1"><Shield className="h-3 w-3" />HIPAA-aware drafting</span>
        </div>
      </div>
    );
  }

  /* ─── Main Drafting Interface ─── */
  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Left: Contract Editor */}
      <div className="flex-1 flex flex-col border-r min-w-0">
        {!selectedTemplate ? (
          /* Template Selection */
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-3xl mx-auto space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    {mode === "full_draft" && <Zap className="h-5 w-5 text-primary" />}
                    {mode === "clause_by_clause" && <PenLine className="h-5 w-5 text-primary" />}
                    {mode === "playbook_guided" && <Shield className="h-5 w-5 text-primary" />}
                    {mode === "full_draft" && "Full Draft Generation"}
                    {mode === "clause_by_clause" && "Clause-by-Clause"}
                    {mode === "playbook_guided" && "Playbook-Guided"}
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1">Select a playbook template to begin</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => setMode("select")}>
                  <ArrowLeft className="h-3 w-3" />Change Mode
                </Button>
              </div>

              {/* Quick Setup (Full Draft mode) */}
              {mode === "full_draft" && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4 space-y-3">
                    <p className="text-xs font-semibold">Quick Setup</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-muted-foreground font-medium">Counterparty</label>
                        <Input
                          value={counterparty}
                          onChange={e => setCounterparty(e.target.value)}
                          placeholder="e.g., Aetna Health Inc."
                          className="h-8 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground font-medium">Contract Type</label>
                        <Select value={contractType} onValueChange={setContractType}>
                          <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(typeLabels).map(([k, v]) => (
                              <SelectItem key={k} value={k}>{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {playbookTemplates
                  .filter(t => mode !== "full_draft" || t.type === contractType || contractType === "")
                  .map(t => (
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
          /* Clause Editor */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Editor Header */}
            <div className="p-4 border-b space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <BookOpen className="h-4 w-4 text-primary shrink-0" />
                  <Input
                    value={contractTitle}
                    onChange={(e) => setContractTitle(e.target.value)}
                    className="text-sm font-semibold border-0 p-0 h-auto focus-visible:ring-0 bg-transparent max-w-md"
                  />
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setSelectedTemplate(null); setDraftClauses(defaultClauses); }}>
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
                <span>{draftClauses.filter(c => c.status === "approved").length} approved</span>
                <span>·</span>
                <span>{draftClauses.filter(c => c.aiGenerated).length} AI-generated</span>
                {mode === "full_draft" && <Badge className="text-[9px] bg-primary/10 text-primary border-0 ml-1">Full Draft</Badge>}
                {mode === "clause_by_clause" && <Badge className="text-[9px] bg-primary/10 text-primary border-0 ml-1">Clause-by-Clause</Badge>}
                {mode === "playbook_guided" && <Badge className="text-[9px] bg-primary/10 text-primary border-0 ml-1">Playbook-Guided</Badge>}
              </div>
            </div>

            {/* Clause List */}
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-3xl mx-auto space-y-3">
                {draftClauses.map((clause) => (
                  <Card key={clause.id} className={`group transition-all ${clause.status === "approved" ? "border-confidence-high/30 bg-confidence-high/5" : ""} ${clause.aiGenerated ? "border-l-2 border-l-primary" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-primary">{clause.title}</h4>
                          {clause.aiGenerated && (
                            <Badge variant="outline" className="text-[8px] h-4 gap-0.5 border-primary/30 text-primary">
                              <Sparkles className="h-2 w-2" />AI
                            </Badge>
                          )}
                          {clause.status === "approved" && (
                            <Badge variant="outline" className="text-[8px] h-4 gap-0.5 border-confidence-high/30 text-confidence-high">
                              <CheckCircle2 className="h-2 w-2" />Approved
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => approveClause(clause.id)} title={clause.status === "approved" ? "Unapprove" : "Approve"}>
                            <CheckCircle2 className={`h-3 w-3 ${clause.status === "approved" ? "text-confidence-high" : ""}`} />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => navigator.clipboard.writeText(clause.text)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => removeClause(clause.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-foreground/80 mt-2 leading-relaxed whitespace-pre-wrap">
                        {clause.text.split(/(\[.*?\])/).map((part, j) =>
                          part.startsWith("[") ? <span key={j} className="bg-status-warning/15 text-status-warning px-1 rounded text-[11px] font-medium">{part}</span> : part
                        )}
                      </p>
                    </CardContent>
                  </Card>
                ))}

                {/* Add Clause Button */}
                <button
                  className="w-full border-2 border-dashed border-border rounded-lg p-3 text-xs text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-1.5"
                  onClick={() => {
                    setInput("Draft a new clause for ");
                    document.querySelector<HTMLTextAreaElement>("[data-chat-input]")?.focus();
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />Ask AI to draft a new clause
                </button>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Right: AI Co-Author Chat */}
      <div className="w-[400px] flex flex-col bg-muted/30">
        <div className="p-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold">AI Co-Author</p>
              <p className="text-[10px] text-muted-foreground">
                {isAiThinking ? (
                  <span className="flex items-center gap-1 text-primary">
                    <Loader2 className="h-2.5 w-2.5 animate-spin" />Generating...
                  </span>
                ) : (
                  "Healthcare contract specialist"
                )}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={() => { setMode("select"); setSelectedTemplate(null); setMessages([]); setDraftClauses(defaultClauses); }}>
            <ArrowLeft className="h-3 w-3 mr-1" />Modes
          </Button>
        </div>

        <ScrollArea className="flex-1 p-3">
          <div className="space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[92%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border"
                }`}>
                  {msg.content.split("\n").map((line, i) => {
                    const trimmed = line.trim();
                    if (trimmed.startsWith("**§")) {
                      // Clause header in AI response — offer add button
                      const clauseTitle = trimmed.replace(/\*\*/g, "");
                      return (
                        <div key={i} className="flex items-center justify-between mt-2 mb-0.5">
                          <p className="font-bold text-primary">{clauseTitle}</p>
                          {msg.role === "assistant" && !msg.isStreaming && (
                            <button
                              className="text-[9px] text-primary hover:underline shrink-0 ml-2"
                              onClick={() => {
                                // Find the text for this clause
                                const msgLines = msg.content.split("\n");
                                const lineIdx = msgLines.findIndex(l => l.trim() === trimmed);
                                let clauseText = "";
                                for (let j = lineIdx + 1; j < msgLines.length; j++) {
                                  if (msgLines[j].trim().startsWith("**§") || msgLines[j].trim().startsWith("⚠️") || msgLines[j].trim().startsWith("✅") || msgLines[j].trim().startsWith("📊")) break;
                                  clauseText += msgLines[j] + "\n";
                                }
                                addClauseFromAI(clauseTitle, clauseText.trim());
                              }}
                            >
                              + Add to draft
                            </button>
                          )}
                        </div>
                      );
                    }
                    if (trimmed.startsWith("**") && trimmed.endsWith("**")) return <p key={i} className="font-bold mt-1.5">{trimmed.replace(/\*\*/g, "")}</p>;
                    if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) return <p key={i} className="ml-2">{trimmed.replace(/\*\*/g, "")}</p>;
                    if (trimmed.startsWith("→ ")) return <p key={i} className="ml-2 text-primary">{trimmed.replace(/\*\*/g, "")}</p>;
                    if (trimmed.startsWith("⚠️")) return <p key={i} className="mt-1.5 text-status-warning text-[10px] bg-status-warning/10 px-2 py-1 rounded">{trimmed}</p>;
                    if (trimmed.startsWith("✅")) return <p key={i} className="mt-1.5 text-confidence-high text-[10px] bg-confidence-high/10 px-2 py-1 rounded">{trimmed}</p>;
                    if (trimmed.startsWith("📊")) return <p key={i} className="mt-1.5 text-status-info text-[10px] bg-status-info/10 px-2 py-1 rounded">{trimmed}</p>;
                    if (trimmed.match(/^\d+\./)) return <p key={i} className="ml-2">{trimmed}</p>;
                    if (trimmed.startsWith("(")) return <p key={i} className="ml-4 text-muted-foreground">{trimmed}</p>;
                    return <p key={i} className={trimmed === "" ? "h-1.5" : ""}>{trimmed}</p>;
                  })}
                  {msg.isStreaming && (
                    <span className="inline-block w-1.5 h-3.5 bg-primary ml-0.5 animate-pulse rounded-sm" />
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Textarea
              data-chat-input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={isAiThinking ? "AI is generating..." : "Describe a clause to draft..."}
              className="min-h-[36px] max-h-[100px] text-xs resize-none"
              rows={1}
              disabled={isAiThinking}
            />
            <Button size="icon" className="h-9 w-9 shrink-0" onClick={sendMessage} disabled={!input.trim() || isAiThinking}>
              {isAiThinking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            </Button>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {(mode === "full_draft" ? [
              "Generate full draft",
              "Add force majeure clause",
              "Review against playbook",
            ] : mode === "playbook_guided" ? [
              "Run compliance check",
              "Flag all deviations",
              "Suggest missing clauses",
            ] : [
              "Draft termination clause",
              "Add reimbursement terms",
              "HIPAA provisions",
              "Quality metrics clause",
            ]).map(q => (
              <button
                key={q}
                onClick={() => setInput(q)}
                disabled={isAiThinking}
                className="text-[9px] px-2 py-0.5 rounded-full border bg-card hover:bg-muted transition-colors text-muted-foreground disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
