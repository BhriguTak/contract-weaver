import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  MapPin,
  Tag,
  List,
  GitBranch,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  families,
  contracts,
  getFamilyContracts,
  type ContractFamily,
  type Contract,
} from "@/data/mock-data";

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
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ─── Timeline Node ─────────────────────────────────────────── */
function TimelineNode({
  contract,
  isFirst,
  isLast,
  onClick,
}: {
  contract: Contract;
  isFirst: boolean;
  isLast: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex gap-4 relative">
      {/* Vertical line + dot */}
      <div className="flex flex-col items-center w-6 shrink-0">
        {!isFirst && <div className="w-px flex-1 bg-border" />}
        <div
          className={`w-3 h-3 rounded-full border-2 shrink-0 ${
            contract.type === "MSA"
              ? "bg-primary border-primary"
              : contract.type === "Amendment"
              ? "bg-confidence-medium border-confidence-medium"
              : "bg-status-info border-status-info"
          }`}
        />
        {!isLast && <div className="w-px flex-1 bg-border" />}
      </div>

      {/* Card */}
      <Card
        className="flex-1 mb-3 cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={`text-[10px] ${typeColors[contract.type] || ""}`}>
                  {contract.type}
                </Badge>
                <span className="font-mono-id text-muted-foreground">{contract.id}</span>
              </div>
              <h4 className="text-sm font-medium mt-1.5 truncate">{contract.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                v{contract.version} · {contract.signer}
              </p>
            </div>
            <Badge variant="outline" className={`shrink-0 text-[10px] ${statusColors[contract.status] || ""}`}>
              {contract.status.replace("_", " ")}
            </Badge>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(contract.effectiveDate)}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {contract.clauseCount} clauses
            </span>
            <span className={`flex items-center gap-1 ${
              contract.confidenceScore >= 90 ? "text-confidence-high" :
              contract.confidenceScore >= 80 ? "text-confidence-medium" : "text-confidence-low"
            }`}>
              {contract.confidenceScore}% confidence
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Family Detail Panel ───────────────────────────────────── */
function FamilyDetail({ family }: { family: ContractFamily }) {
  const navigate = useNavigate();
  const familyContracts = getFamilyContracts(family.id).sort(
    (a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime()
  );
  const [view, setView] = useState<"timeline" | "table">("timeline");

  return (
    <div className="space-y-4">
      {/* Family Header */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-id text-muted-foreground">{family.id}</span>
                <Badge variant="outline" className={`text-[10px] ${statusColors[family.status] || ""}`}>
                  {family.status.replace("_", " ")}
                </Badge>
              </div>
              <h2 className="text-lg font-semibold mt-1">{family.name}</h2>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {family.jurisdiction}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {family.dateRange}
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> {family.documentCount} documents
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {family.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">
                <Tag className="h-3 w-3 mr-1" /> {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Documents</h3>
        <div className="flex gap-1">
          <Button
            variant={view === "timeline" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => setView("timeline")}
          >
            <GitBranch className="h-3 w-3" /> Timeline
          </Button>
          <Button
            variant={view === "table" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => setView("table")}
          >
            <List className="h-3 w-3" /> Table
          </Button>
        </div>
      </div>

      {/* Timeline View */}
      {view === "timeline" && (
        <div>
          {familyContracts.map((c, i) => (
            <TimelineNode
              key={c.id}
              contract={c}
              isFirst={i === 0}
              isLast={i === familyContracts.length - 1}
              onClick={() => navigate(`/reader/${c.id}`)}
            />
          ))}
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Effective</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {familyContracts.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => navigate(`/reader/${c.id}`)}>
                  <TableCell className="font-mono-id">{c.id}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">{c.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${typeColors[c.type] || ""}`}>{c.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${statusColors[c.status] || ""}`}>
                      {c.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{formatDate(c.effectiveDate)}</TableCell>
                  <TableCell className={`text-xs font-medium ${
                    c.confidenceScore >= 90 ? "text-confidence-high" :
                    c.confidenceScore >= 80 ? "text-confidence-medium" : "text-confidence-low"
                  }`}>
                    {c.confidenceScore}%
                  </TableCell>
                  <TableCell>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

/* ─── Main Families Page ────────────────────────────────────── */
export default function Families() {
  const [selectedFamily, setSelectedFamily] = useState<string>(families[0]?.id || "");
  const selected = families.find((f) => f.id === selectedFamily);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contract Families</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Browse and explore related contract groups
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Family List */}
        <div className="lg:col-span-4">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="space-y-2 pr-3">
              {families.map((f) => (
                <Card
                  key={f.id}
                  className={`cursor-pointer transition-all hover:shadow-sm ${
                    selectedFamily === f.id
                      ? "border-primary shadow-sm bg-primary/[0.02]"
                      : "hover:border-primary/30"
                  }`}
                  onClick={() => setSelectedFamily(f.id)}
                >
                  <CardContent className="p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold truncate">{f.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {f.jurisdiction} · {f.documentCount} docs
                        </p>
                      </div>
                      <Badge variant="outline" className={`shrink-0 text-[10px] ${statusColors[f.status] || ""}`}>
                        {f.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {f.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-normal">
                          {tag}
                        </Badge>
                      ))}
                      {f.tags.length > 2 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-normal">
                          +{f.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Family Detail */}
        <div className="lg:col-span-8">
          {selected ? (
            <FamilyDetail family={selected} />
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
              Select a family to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
