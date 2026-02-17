import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Minus,
  ArrowLeftRight,
  Download,
  Columns,
  AlignJustify,
  Check,
  X,
  MessageSquare,
  MoveRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  contracts,
  families,
  getFamilyContracts,
  diffsCTR001vsCTR002,
  type ClauseDiff,
  type DiffType,
} from "@/data/mock-data";

const diffIcons: Record<DiffType, React.ElementType> = {
  added: Plus,
  removed: Minus,
  modified: ArrowLeftRight,
  moved: MoveRight,
  unchanged: Check,
};

const diffLabels: Record<DiffType, string> = {
  added: "Added",
  removed: "Removed",
  modified: "Modified",
  moved: "Moved",
  unchanged: "Unchanged",
};

const diffBadgeColors: Record<DiffType, string> = {
  added: "bg-diff-added-bg text-diff-added border-diff-added/20",
  removed: "bg-diff-removed-bg text-diff-removed border-diff-removed/20",
  modified: "bg-diff-modified-bg text-diff-modified border-diff-modified/20",
  moved: "bg-diff-moved-bg text-diff-moved border-diff-moved/20",
  unchanged: "bg-muted text-muted-foreground border-border",
};

/* ─── Inline Diff Rendering ─────────────────────────────── */
function InlineDiffText({ changes }: { changes: ClauseDiff["changes"] }) {
  return (
    <span>
      {changes.map((c, i) => {
        if (c.type === "equal") return <span key={i}>{c.text}</span>;
        if (c.type === "add")
          return (
            <span key={i} className="bg-diff-added-bg text-diff-added rounded px-0.5">
              {c.text}
            </span>
          );
        if (c.type === "remove")
          return (
            <span key={i} className="bg-diff-removed-bg text-diff-removed line-through rounded px-0.5">
              {c.text}
            </span>
          );
        return <span key={i}>{c.text}</span>;
      })}
    </span>
  );
}

/* ─── Side-by-Side Clause Row ───────────────────────────── */
function SideBySideRow({ diff }: { diff: ClauseDiff }) {
  const Icon = diffIcons[diff.diffType];

  return (
    <div className="border-b last:border-0">
      {/* Clause type header */}
      <div className="px-4 py-2 bg-muted/30 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-sm font-medium">{diff.clauseType}</span>
        <Badge variant="outline" className={`text-[10px] ml-auto ${diffBadgeColors[diff.diffType]}`}>
          {diffLabels[diff.diffType]}
        </Badge>
      </div>

      {diff.diffType === "unchanged" ? (
        <div className="px-4 py-3 text-sm text-muted-foreground italic">
          No changes — clause unchanged
        </div>
      ) : (
        <div className="grid grid-cols-2 divide-x">
          {/* Base */}
          <div className={`p-4 text-sm leading-relaxed ${!diff.baseText ? "bg-muted/20" : ""}`}>
            {diff.baseText ? (
              diff.changes.length > 0 ? (
                <span>
                  {diff.changes.map((c, i) => {
                    if (c.type === "equal") return <span key={i}>{c.text}</span>;
                    if (c.type === "remove")
                      return (
                        <span key={i} className="bg-diff-removed-bg text-diff-removed rounded px-0.5 font-medium">
                          {c.text}
                        </span>
                      );
                    return null; // Don't show additions on base side
                  })}
                </span>
              ) : (
                diff.baseText
              )
            ) : (
              <span className="text-muted-foreground italic text-xs">— Not present in base document —</span>
            )}
          </div>

          {/* Comparison */}
          <div className={`p-4 text-sm leading-relaxed ${!diff.compText ? "bg-muted/20" : ""}`}>
            {diff.compText ? (
              diff.changes.length > 0 ? (
                <span>
                  {diff.changes.map((c, i) => {
                    if (c.type === "equal") return <span key={i}>{c.text}</span>;
                    if (c.type === "add")
                      return (
                        <span key={i} className="bg-diff-added-bg text-diff-added rounded px-0.5 font-medium">
                          {c.text}
                        </span>
                      );
                    return null; // Don't show removals on comparison side
                  })}
                </span>
              ) : (
                diff.compText
              )
            ) : (
              <span className="text-muted-foreground italic text-xs">— Not present in comparison document —</span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      {diff.diffType !== "unchanged" && (
        <div className="px-4 py-1.5 bg-muted/10 flex items-center gap-1 border-t">
          <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 text-confidence-high">
            <Check className="h-3 w-3" /> Accept
          </Button>
          <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 text-destructive">
            <X className="h-3 w-3" /> Reject
          </Button>
          <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1">
            <MessageSquare className="h-3 w-3" /> Comment
          </Button>
        </div>
      )}
    </div>
  );
}

/* ─── Unified Diff Row ──────────────────────────────────── */
function UnifiedRow({ diff }: { diff: ClauseDiff }) {
  const Icon = diffIcons[diff.diffType];

  if (diff.diffType === "unchanged") return null;

  return (
    <div className="border-b last:border-0">
      <div className="px-4 py-2 bg-muted/30 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-sm font-medium">{diff.clauseType}</span>
        <Badge variant="outline" className={`text-[10px] ml-auto ${diffBadgeColors[diff.diffType]}`}>
          {diffLabels[diff.diffType]}
        </Badge>
      </div>
      <div className="p-4 text-sm leading-relaxed">
        {diff.changes.length > 0 ? (
          <InlineDiffText changes={diff.changes} />
        ) : (
          <span className={diff.diffType === "added" ? "text-diff-added" : "text-diff-removed"}>
            {diff.compText || diff.baseText}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Main Compare Page ─────────────────────────────────── */
export default function Compare() {
  const [searchParams] = useSearchParams();
  const defaultBase = searchParams.get("base") || "CTR-001";

  const [baseId, setBaseId] = useState(defaultBase);
  const [compId, setCompId] = useState("CTR-002");
  const [viewMode, setViewMode] = useState<"side-by-side" | "unified">("side-by-side");

  // For this POC, we only have diffs for CTR-001 vs CTR-002
  const diffs = baseId === "CTR-001" && compId === "CTR-002" ? diffsCTR001vsCTR002 : [];

  const baseContract = contracts.find((c) => c.id === baseId);
  const compContract = contracts.find((c) => c.id === compId);

  // Summary stats
  const added = diffs.filter((d) => d.diffType === "added").length;
  const removed = diffs.filter((d) => d.diffType === "removed").length;
  const modified = diffs.filter((d) => d.diffType === "modified").length;
  const unchanged = diffs.filter((d) => d.diffType === "unchanged").length;

  // Available contracts for selection
  const familyId = baseContract?.familyId || "FAM-001";
  const familyContracts = getFamilyContracts(familyId);

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      {/* Top Bar — Document Selectors */}
      <div className="border-b bg-card px-4 py-3 shrink-0 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Base:</span>
            <Select value={baseId} onValueChange={setBaseId}>
              <SelectTrigger className="h-8 w-56 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {familyContracts.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="text-xs">
                    {c.id} — {c.type} v{c.version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Compare:</span>
            <Select value={compId} onValueChange={setCompId}>
              <SelectTrigger className="h-8 w-56 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {familyContracts.filter((c) => c.id !== baseId).map((c) => (
                  <SelectItem key={c.id} value={c.id} className="text-xs">
                    {c.id} — {c.type} v{c.version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <Button
              variant={viewMode === "side-by-side" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => setViewMode("side-by-side")}
            >
              <Columns className="h-3 w-3" /> Side-by-side
            </Button>
            <Button
              variant={viewMode === "unified" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => setViewMode("unified")}
            >
              <AlignJustify className="h-3 w-3" /> Unified
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
              <Download className="h-3 w-3" /> Export Report
            </Button>
          </div>
        </div>

        {/* Summary Bar */}
        <div className="flex items-center gap-4 text-xs">
          <span className="text-muted-foreground font-medium">Changes:</span>
          <span className="flex items-center gap-1 text-diff-added">
            <Plus className="h-3 w-3" /> {added} added
          </span>
          <span className="flex items-center gap-1 text-diff-removed">
            <Minus className="h-3 w-3" /> {removed} removed
          </span>
          <span className="flex items-center gap-1 text-diff-modified">
            <ArrowLeftRight className="h-3 w-3" /> {modified} modified
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Check className="h-3 w-3" /> {unchanged} unchanged
          </span>
        </div>
      </div>

      {/* Column Headers for side-by-side */}
      {viewMode === "side-by-side" && diffs.length > 0 && (
        <div className="grid grid-cols-2 divide-x border-b bg-muted/30 shrink-0">
          <div className="px-4 py-2">
            <p className="text-xs font-semibold">{baseContract?.title}</p>
            <p className="text-[10px] text-muted-foreground">v{baseContract?.version} · {baseContract?.type}</p>
          </div>
          <div className="px-4 py-2">
            <p className="text-xs font-semibold">{compContract?.title}</p>
            <p className="text-[10px] text-muted-foreground">v{compContract?.version} · {compContract?.type}</p>
          </div>
        </div>
      )}

      {/* Diff Content */}
      <ScrollArea className="flex-1">
        {diffs.length > 0 ? (
          <div>
            {viewMode === "side-by-side"
              ? diffs.map((d, i) => <SideBySideRow key={i} diff={d} />)
              : diffs.map((d, i) => <UnifiedRow key={i} diff={d} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <ArrowLeftRight className="h-8 w-8 mb-3 opacity-30" />
            <p className="text-sm">Select two documents from the same family to compare.</p>
            <p className="text-xs mt-1">Pre-computed diffs are available for CTR-001 vs CTR-002.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
