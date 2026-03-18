import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Search, ChevronDown, ChevronRight, MapPin, Clock,
  Tag, ArrowUpDown, SlidersHorizontal, X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  families, contracts, getFamilyContracts,
  type ContractFamily, type Contract,
} from "@/data/mock-data";

/* ─── Constants ─────────────────────────────────────────────── */

const statusColors: Record<string, string> = {
  active: "bg-confidence-high/10 text-confidence-high border-confidence-high/20",
  expired: "bg-muted text-muted-foreground border-border",
  pending_review: "bg-confidence-medium/10 text-confidence-medium border-confidence-medium/20",
  draft: "bg-status-info/10 text-status-info border-status-info/20",
  processing: "bg-status-pending/10 text-status-pending border-status-pending/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
};

const typeColors: Record<string, string> = {
  MSA: "bg-primary/10 text-primary border-primary/20",
  Amendment: "bg-confidence-medium/10 text-confidence-medium border-confidence-medium/20",
  SOW: "bg-status-info/10 text-status-info border-status-info/20",
  NDA: "bg-status-pending/10 text-status-pending border-status-pending/20",
  SLA: "bg-highlight-obligation/10 text-highlight-obligation border-highlight-obligation/20",
  BAA: "bg-destructive/10 text-destructive border-destructive/20",
};

const ITEMS_PER_PAGE = 10;

type SortField = "name" | "documentCount" | "lastActivity" | "status";
type SortDir = "asc" | "desc";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ─── Document Row (inside expanded family) ─────────────────── */
function DocumentRow({ contract }: { contract: Contract }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/reader/${contract.id}`)}
      className="w-full flex items-center gap-4 px-4 py-2.5 text-left hover:bg-muted/40 transition-colors border-b border-border/50 last:border-0 group"
    >
      <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <Badge variant="outline" className={`text-[9px] shrink-0 ${typeColors[contract.type] || ""}`}>
          {contract.type}
        </Badge>
        <span className="text-xs font-medium truncate">{contract.title}</span>
      </div>
      <div className="flex items-center gap-4 shrink-0 text-[11px] text-muted-foreground">
        <span>v{contract.version}</span>
        <span className={`font-medium ${
          contract.confidenceScore >= 90 ? "text-confidence-high" :
          contract.confidenceScore >= 80 ? "text-confidence-medium" : "text-confidence-low"
        }`}>
          {contract.confidenceScore}%
        </span>
        <span>{contract.clauseCount} clauses</span>
        <Badge variant="outline" className={`text-[9px] ${statusColors[contract.status] || ""}`}>
          {contract.status.replace("_", " ")}
        </Badge>
        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
}

/* ─── Family Row (expandable) ───────────────────────────────── */
function FamilyRow({ family, isOpen, onToggle }: {
  family: ContractFamily;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const familyContracts = useMemo(
    () => getFamilyContracts(family.id).sort(
      (a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime()
    ),
    [family.id]
  );

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors border-b border-border text-left group">
          <div className="shrink-0 text-muted-foreground">
            {isOpen
              ? <ChevronDown className="h-4 w-4" />
              : <ChevronRight className="h-4 w-4" />
            }
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold truncate">{family.name}</h3>
              <Badge variant="outline" className={`text-[9px] shrink-0 ${statusColors[family.status] || ""}`}>
                {family.status.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{family.jurisdiction}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{family.dateRange}</span>
              <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{family.documentCount} docs</span>
            </div>
          </div>

          {/* Tags */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            {family.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-normal">
                <Tag className="h-2.5 w-2.5 mr-0.5" />{tag}
              </Badge>
            ))}
            {family.tags.length > 3 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-normal">
                +{family.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Last activity */}
          <span className="hidden lg:block text-[11px] text-muted-foreground shrink-0 w-24 text-right">
            {formatDate(family.lastActivity)}
          </span>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="bg-muted/20 border-b border-border">
          {familyContracts.map(c => (
            <DocumentRow key={c.id} contract={c} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ─── Main Contracts Page ───────────────────────────────────── */
export default function Families() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("lastActivity");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [openFamilies, setOpenFamilies] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  // Unique jurisdictions for filter
  const jurisdictions = useMemo(() =>
    [...new Set(families.map(f => f.jurisdiction))].sort(),
    []
  );

  // Filter
  const filtered = useMemo(() => {
    let result = families.filter(f => {
      if (statusFilter !== "all" && f.status !== statusFilter) return false;
      if (jurisdictionFilter !== "all" && f.jurisdiction !== jurisdictionFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const matchesFamily = f.name.toLowerCase().includes(q) ||
          f.primaryCounterparty.toLowerCase().includes(q) ||
          f.tags.some(t => t.toLowerCase().includes(q));
        // Also search child contracts
        const childContracts = getFamilyContracts(f.id);
        const matchesChild = childContracts.some(c =>
          c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
        );
        if (!matchesFamily && !matchesChild) return false;
      }
      return true;
    });

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "documentCount": cmp = a.documentCount - b.documentCount; break;
        case "lastActivity": cmp = new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime(); break;
        case "status": cmp = a.status.localeCompare(b.status); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [search, statusFilter, jurisdictionFilter, sortField, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleFamily = (id: string) => {
    setOpenFamilies(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const hasFilters = search || statusFilter !== "all" || jurisdictionFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setJurisdictionFilter("all");
    setPage(1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {families.length} contract families · {contracts.length} total documents
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search families, contracts, tags..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="h-8 pl-8 text-xs"
          />
        </div>

        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="pending_review">Pending Review</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        <Select value={jurisdictionFilter} onValueChange={v => { setJurisdictionFilter(v); setPage(1); }}>
          <SelectTrigger className="h-8 w-[150px] text-xs">
            <SelectValue placeholder="Jurisdiction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jurisdictions</SelectItem>
            {jurisdictions.map(j => (
              <SelectItem key={j} value={j}>{j}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Buttons */}
        <div className="flex items-center gap-1 ml-auto">
          {[
            { field: "lastActivity" as SortField, label: "Recent" },
            { field: "name" as SortField, label: "Name" },
            { field: "documentCount" as SortField, label: "Docs" },
          ].map(s => (
            <Button
              key={s.field}
              variant={sortField === s.field ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-[11px] gap-1 px-2"
              onClick={() => toggleSort(s.field)}
            >
              <ArrowUpDown className="h-3 w-3" />
              {s.label}
            </Button>
          ))}
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1 text-muted-foreground" onClick={clearFilters}>
            <X className="h-3 w-3" /> Clear
          </Button>
        )}
      </div>

      {/* Results summary */}
      <div className="text-[11px] text-muted-foreground">
        Showing {paged.length} of {filtered.length} families
        {filtered.length !== families.length && ` (filtered from ${families.length})`}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Column Header */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/40 text-[11px] font-medium text-muted-foreground">
            <div className="w-4 shrink-0" /> {/* chevron space */}
            <div className="flex-1">Contract Family</div>
            <div className="hidden md:block w-40 text-right">Tags</div>
            <div className="hidden lg:block w-24 text-right">Last Activity</div>
          </div>

          {paged.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              No contract families match your filters.
            </div>
          ) : (
            paged.map(family => (
              <FamilyRow
                key={family.id}
                family={family}
                isOpen={openFamilies.has(family.id)}
                onToggle={() => toggleFamily(family.id)}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <Button
                  key={p}
                  variant={page === p ? "default" : "outline"}
                  size="sm"
                  className="h-7 w-7 text-xs p-0"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
