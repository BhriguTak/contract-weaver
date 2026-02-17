import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  Flag,
  Check,
  ChevronRight,
  GitCompareArrows,
  Download,
  FolderPlus,
  MapPin,
  Clock,
  User,
  Minus,
  Plus,
  PanelRightClose,
  PanelRightOpen,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  getContract,
  getContractClauses,
  getFamily,
  type Clause,
  type Contract,
} from "@/data/mock-data";

const confidenceColors: Record<string, string> = {
  high: "bg-confidence-high/10 text-confidence-high border-confidence-high/20",
  medium: "bg-confidence-medium/10 text-confidence-medium border-confidence-medium/20",
  low: "bg-confidence-low/10 text-confidence-low border-confidence-low/20",
};

const clauseTypeColors: Record<string, string> = {
  Termination: "bg-destructive/10 text-destructive",
  "Payment Terms": "bg-highlight-monetary/10 text-highlight-monetary",
  Liability: "bg-confidence-medium/10 text-confidence-medium",
  Confidentiality: "bg-status-info/10 text-status-info",
  Indemnification: "bg-status-pending/10 text-status-pending",
  "Governing Law": "bg-primary/10 text-primary",
  "Force Majeure": "bg-highlight-party/10 text-highlight-party",
  "Intellectual Property": "bg-highlight-obligation/10 text-highlight-obligation",
  "Data Protection": "bg-status-info/10 text-status-info",
  Insurance: "bg-confidence-high/10 text-confidence-high",
  Warranty: "bg-confidence-medium/10 text-confidence-medium",
  "Non-Compete": "bg-destructive/10 text-destructive",
  "Dispute Resolution": "bg-primary/10 text-primary",
  Assignment: "bg-muted text-muted-foreground",
};

/* ─── Highlighted Document Text ─────────────────────────── */
function HighlightedText({ clause, fontSize }: { clause: Clause; fontSize: number }) {
  let text = clause.text;

  // Build highlight spans
  const highlights: { text: string; type: string }[] = [];

  // Simple approach: wrap known entities
  const entityMap: { values: string[]; type: string }[] = [
    { values: clause.partyNames, type: "party" },
    { values: clause.monetaryValues, type: "monetary" },
    { values: clause.keyDates, type: "date" },
    { values: clause.obligations, type: "obligation" },
  ];

  return (
    <div style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }} className="text-foreground">
      <p>{text}</p>
      {/* Entity tags below */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {clause.obligations.map((o, i) => (
          <Badge key={`ob-${i}`} variant="outline" className="text-[10px] bg-highlight-obligation-bg text-highlight-obligation border-highlight-obligation/20">
            {o}
          </Badge>
        ))}
        {clause.keyDates.map((d, i) => (
          <Badge key={`dt-${i}`} variant="outline" className="text-[10px] bg-highlight-date-bg text-highlight-date border-highlight-date/20">
            {d}
          </Badge>
        ))}
        {clause.monetaryValues.map((m, i) => (
          <Badge key={`mv-${i}`} variant="outline" className="text-[10px] bg-highlight-monetary-bg text-highlight-monetary border-highlight-monetary/20">
            {m}
          </Badge>
        ))}
        {clause.partyNames.map((p, i) => (
          <Badge key={`pn-${i}`} variant="outline" className="text-[10px] bg-highlight-party-bg text-highlight-party border-highlight-party/20">
            {p}
          </Badge>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────── */
export default function DocumentReader() {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();
  const contract = getContract(contractId || "CTR-001");
  const clauses = getContractClauses(contractId || "CTR-001");
  const family = contract ? getFamily(contract.familyId) : undefined;

  const [selectedClause, setSelectedClause] = useState<string>(clauses[0]?.id || "");
  const [fontSize, setFontSize] = useState(14);
  const [showMeta, setShowMeta] = useState(true);
  const rightPaneRef = useRef<HTMLDivElement>(null);

  const activeClause = clauses.find((c) => c.id === selectedClause);

  if (!contract) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        Contract not found
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      {/* Action Bar */}
      <div className="border-b bg-card px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Badge variant="outline" className="font-mono-id text-[10px] shrink-0">{contract.id}</Badge>
          <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
          <h2 className="text-sm font-semibold truncate">{contract.title}</h2>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => navigate(`/compare?base=${contract.id}`)}>
            <GitCompareArrows className="h-3 w-3" /> Compare
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
            <Download className="h-3 w-3" /> Export
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
            <Flag className="h-3 w-3" /> Flag
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setShowMeta(!showMeta)}
          >
            {showMeta ? <PanelRightClose className="h-3.5 w-3.5" /> : <PanelRightOpen className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane — Clause List */}
        <div className="w-80 border-r bg-card flex flex-col shrink-0">
          <div className="p-3 border-b">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Extracted Clauses ({clauses.length})
            </h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {clauses.map((clause) => (
                <div
                  key={clause.id}
                  className={`p-2.5 rounded-md cursor-pointer transition-colors ${
                    selectedClause === clause.id
                      ? "bg-primary/5 border border-primary/20"
                      : "hover:bg-muted/50 border border-transparent"
                  }`}
                  onClick={() => setSelectedClause(clause.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className={`text-[10px] px-1.5 ${clauseTypeColors[clause.type] || "bg-muted text-muted-foreground"}`}>
                      {clause.type}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] px-1.5 ${confidenceColors[clause.confidenceLevel]}`}>
                      {clause.confidence}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{clause.text}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {clause.obligations.length > 0 && (
                      <span className="inline-block w-2 h-2 rounded-full bg-highlight-obligation" title="Obligations" />
                    )}
                    {clause.keyDates.length > 0 && (
                      <span className="inline-block w-2 h-2 rounded-full bg-highlight-date" title="Dates" />
                    )}
                    {clause.monetaryValues.length > 0 && (
                      <span className="inline-block w-2 h-2 rounded-full bg-highlight-monetary" title="Monetary" />
                    )}
                    {clause.partyNames.length > 0 && (
                      <span className="inline-block w-2 h-2 rounded-full bg-highlight-party" title="Parties" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Pane — Document Text */}
        <div className="flex-1 flex flex-col overflow-hidden" ref={rightPaneRef}>
          <div className="px-4 py-2 border-b flex items-center justify-between bg-card shrink-0">
            <span className="text-xs text-muted-foreground">Document Text</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setFontSize(Math.max(10, fontSize - 1))}>
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-xs text-muted-foreground w-8 text-center">{fontSize}</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setFontSize(Math.min(22, fontSize + 1))}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-6 max-w-3xl">
              {activeClause ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className={`${clauseTypeColors[activeClause.type] || ""}`}>
                      {activeClause.type}
                    </Badge>
                    <span className="font-mono-id text-muted-foreground">{activeClause.id}</span>
                    <Badge variant="outline" className={`${confidenceColors[activeClause.confidenceLevel]}`}>
                      {activeClause.confidenceLevel} · {activeClause.confidence}%
                    </Badge>
                  </div>
                  <HighlightedText clause={activeClause} fontSize={fontSize} />
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                      <Flag className="h-3 w-3" /> Flag extraction
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                      <Check className="h-3 w-3" /> Correct
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Select a clause to view its text.</p>
              )}

              {/* Show all clauses as full document */}
              <Separator className="my-8" />
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground">Full Document</h3>
              <div className="space-y-6">
                {clauses.map((clause) => (
                  <div
                    key={clause.id}
                    id={`clause-${clause.id}`}
                    className={`p-4 rounded-lg border transition-colors ${
                      selectedClause === clause.id
                        ? "border-primary/30 bg-primary/[0.02]"
                        : "border-transparent hover:bg-muted/30"
                    }`}
                    onClick={() => setSelectedClause(clause.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={`text-[10px] ${clauseTypeColors[clause.type] || ""}`}>
                        {clause.type}
                      </Badge>
                      <span className="font-mono-id text-muted-foreground text-xs">{clause.id}</span>
                    </div>
                    <HighlightedText clause={clause} fontSize={fontSize} />
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Metadata Sidebar */}
        {showMeta && (
          <div className="w-64 border-l bg-card shrink-0 overflow-auto">
            <div className="p-4 space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Contract Metadata
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="font-medium">{contract.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Parties</p>
                  {contract.parties.map((p) => (
                    <p key={p} className="font-medium flex items-center gap-1">
                      <User className="h-3 w-3 text-highlight-party" /> {p}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Effective Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3 text-highlight-date" />
                    {new Date(contract.effectiveDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Termination Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3 text-highlight-date" />
                    {new Date(contract.terminationDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Signer</p>
                  <p className="font-medium">{contract.signer}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Jurisdiction</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {contract.jurisdiction}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Version</p>
                  <p className="font-medium">v{contract.version}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                  <p className={`font-medium ${
                    contract.confidenceScore >= 90 ? "text-confidence-high" :
                    contract.confidenceScore >= 80 ? "text-confidence-medium" : "text-confidence-low"
                  }`}>
                    {contract.confidenceScore}%
                  </p>
                </div>
                {family && (
                  <div>
                    <p className="text-xs text-muted-foreground">Family</p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() => navigate(`/families/${family.id}`)}
                    >
                      {family.name}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
