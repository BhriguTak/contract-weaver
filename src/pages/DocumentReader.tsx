import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  Flag,
  ChevronRight,
  GitCompareArrows,
  Download,
  MapPin,
  Clock,
  User,
  Minus,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  getContract,
  getContractClauses,
  getFamily,
  getDocumentText,
  type Clause,
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

/* ─── Inline entity badges ─────────────────────────── */
function EntityBadges({ clause }: { clause: Clause }) {
  return (
    <div className="flex flex-wrap gap-1">
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
  );
}

/* ─── Render document with clause highlighting ──────── */
function DigitizedDocument({
  documentText,
  clauses,
  selectedClause,
  fontSize,
  clauseRefs,
}: {
  documentText: string;
  clauses: Clause[];
  selectedClause: string;
  fontSize: number;
  clauseRefs: React.MutableRefObject<Record<string, HTMLSpanElement | null>>;
}) {
  // Find all clause texts in the document and mark their positions
  const segments: { text: string; clauseId: string | null; start: number }[] = [];
  
  // Build a map of clause text positions in the document
  const clausePositions: { start: number; end: number; clauseId: string }[] = [];
  clauses.forEach((clause) => {
    const idx = documentText.indexOf(clause.text);
    if (idx !== -1) {
      clausePositions.push({ start: idx, end: idx + clause.text.length, clauseId: clause.id });
    }
  });
  
  // Sort by position
  clausePositions.sort((a, b) => a.start - b.start);
  
  // Build segments
  let cursor = 0;
  clausePositions.forEach((pos) => {
    if (pos.start > cursor) {
      segments.push({ text: documentText.slice(cursor, pos.start), clauseId: null, start: cursor });
    }
    segments.push({ text: documentText.slice(pos.start, pos.end), clauseId: pos.clauseId, start: pos.start });
    cursor = pos.end;
  });
  if (cursor < documentText.length) {
    segments.push({ text: documentText.slice(cursor), clauseId: null, start: cursor });
  }

  return (
    <div style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }} className="text-foreground whitespace-pre-wrap font-serif">
      {segments.map((seg, i) => {
        if (seg.clauseId) {
          const isSelected = selectedClause === seg.clauseId;
          return (
            <span
              key={i}
              ref={(el) => { clauseRefs.current[seg.clauseId!] = el; }}
              className={`transition-all duration-300 rounded px-0.5 ${
                isSelected
                  ? "bg-yellow-200 dark:bg-yellow-500/30 ring-2 ring-yellow-400 dark:ring-yellow-500/50"
                  : "hover:bg-yellow-100/50 dark:hover:bg-yellow-500/10"
              }`}
              data-clause-id={seg.clauseId}
            >
              {seg.text}
            </span>
          );
        }
        return <span key={i}>{seg.text}</span>;
      })}
    </div>
  );
}

/* ─── Fallback: clause-based document view ──────────── */
function ClauseBasedDocument({
  clauses,
  selectedClause,
  fontSize,
  clauseRefs,
}: {
  clauses: Clause[];
  selectedClause: string;
  fontSize: number;
  clauseRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}) {
  return (
    <div className="space-y-4">
      {clauses.map((clause) => (
        <div
          key={clause.id}
          ref={(el) => { clauseRefs.current[clause.id] = el; }}
          className={`p-4 rounded-lg border transition-all duration-300 ${
            selectedClause === clause.id
              ? "bg-yellow-200/60 dark:bg-yellow-500/20 border-yellow-400 dark:border-yellow-500/40 ring-1 ring-yellow-400/50"
              : "border-transparent hover:bg-muted/30"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={`text-[10px] ${clauseTypeColors[clause.type] || ""}`}>
              {clause.type}
            </Badge>
            <span className="font-mono-id text-muted-foreground text-xs">{clause.id}</span>
          </div>
          <p style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }} className="text-foreground">
            {clause.text}
          </p>
          <div className="mt-3">
            <EntityBadges clause={clause} />
          </div>
        </div>
      ))}
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
  const documentText = getDocumentText(contractId || "CTR-001");

  const [selectedClause, setSelectedClause] = useState<string>("");
  const [fontSize, setFontSize] = useState(14);
  const clauseRefs = useRef<Record<string, HTMLElement | null>>({});

  const scrollToClause = useCallback((clauseId: string) => {
    setSelectedClause(clauseId);
    // Delay to allow re-render with highlight before scrolling
    setTimeout(() => {
      const el = clauseRefs.current[clauseId];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
  }, []);

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
          <Separator orientation="vertical" className="h-5 mx-1" />
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setFontSize(Math.max(10, fontSize - 1))}>
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-xs text-muted-foreground w-6 text-center">{fontSize}</span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setFontSize(Math.min(22, fontSize + 1))}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — Full Digitized Contract */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 max-w-3xl mx-auto">
              {documentText ? (
                <DigitizedDocument
                  documentText={documentText}
                  clauses={clauses}
                  selectedClause={selectedClause}
                  fontSize={fontSize}
                  clauseRefs={clauseRefs as any}
                />
              ) : (
                <ClauseBasedDocument
                  clauses={clauses}
                  selectedClause={selectedClause}
                  fontSize={fontSize}
                  clauseRefs={clauseRefs as any}
                />
              )}
            </div>
          </ScrollArea>
        </div>

        {/* RIGHT — Metadata + Clauses */}
        <div className="w-80 border-l bg-card shrink-0 flex flex-col overflow-hidden">
          <ScrollArea className="h-full">
            {/* Contract Metadata */}
            <div className="p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Contract Metadata
              </h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Type</span>
                  <span className="font-medium text-xs">{contract.type}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Parties</span>
                  <div className="mt-1 space-y-1">
                    {contract.parties.map((p) => (
                      <p key={p} className="font-medium text-xs flex items-center gap-1">
                        <User className="h-3 w-3 text-highlight-party" /> {p}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Effective</span>
                  <span className="font-medium text-xs flex items-center gap-1">
                    <Clock className="h-3 w-3 text-highlight-date" />
                    {new Date(contract.effectiveDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Terminates</span>
                  <span className="font-medium text-xs flex items-center gap-1">
                    <Clock className="h-3 w-3 text-highlight-date" />
                    {new Date(contract.terminationDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Signer</span>
                  <span className="font-medium text-xs">{contract.signer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Jurisdiction</span>
                  <span className="font-medium text-xs flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {contract.jurisdiction}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Version</span>
                  <span className="font-medium text-xs">v{contract.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Confidence</span>
                  <span className={`font-medium text-xs ${
                    contract.confidenceScore >= 90 ? "text-confidence-high" :
                    contract.confidenceScore >= 80 ? "text-confidence-medium" : "text-confidence-low"
                  }`}>
                    {contract.confidenceScore}%
                  </span>
                </div>
                {family && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Family</span>
                    <Button variant="link" className="p-0 h-auto text-xs" onClick={() => navigate(`/families/${family.id}`)}>
                      {family.name}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Extracted Clauses */}
            <div className="p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Extracted Clauses ({clauses.length})
              </h3>
              <div className="space-y-1.5">
                {clauses.map((clause) => (
                  <div
                    key={clause.id}
                    className={`p-2.5 rounded-md cursor-pointer transition-colors ${
                      selectedClause === clause.id
                        ? "bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-300 dark:border-yellow-500/30"
                        : "hover:bg-muted/50 border border-transparent"
                    }`}
                    onClick={() => scrollToClause(clause.id)}
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
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
