import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  Filter,
  Shield,
  DollarSign,
  Settings,
  FileText,
  BarChart3,
  CalendarClock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  obligations,
  contracts,
  families,
  type Obligation,
  type ObligationStatus,
} from "@/data/mock-data";

const statusConfig: Record<ObligationStatus, { label: string; icon: React.ElementType; color: string; badgeClass: string }> = {
  compliant: { label: "Compliant", icon: CheckCircle2, color: "text-confidence-high", badgeClass: "bg-confidence-high/10 text-confidence-high border-confidence-high/20" },
  at_risk: { label: "At Risk", icon: AlertTriangle, color: "text-confidence-medium", badgeClass: "bg-confidence-medium/10 text-confidence-medium border-confidence-medium/20" },
  overdue: { label: "Overdue", icon: XCircle, color: "text-destructive", badgeClass: "bg-destructive/10 text-destructive border-destructive/20" },
  upcoming: { label: "Upcoming", icon: Clock, color: "text-status-info", badgeClass: "bg-status-info/10 text-status-info border-status-info/20" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-muted-foreground", badgeClass: "bg-muted text-muted-foreground border-border" },
};

const categoryIcons: Record<string, React.ElementType> = {
  compliance: Shield,
  financial: DollarSign,
  operational: Settings,
  reporting: FileText,
  insurance: Shield,
};

const riskColors: Record<string, string> = {
  high: "text-destructive",
  medium: "text-confidence-medium",
  low: "text-confidence-high",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getDaysUntil(d: string): number {
  const now = new Date("2026-02-16");
  const due = new Date(d);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/* ─── Summary Cards ─────────────────────────────────── */
function SummaryCard({
  title,
  count,
  icon: Icon,
  color,
  onClick,
  active,
}: {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${active ? "border-primary ring-1 ring-primary/20" : "hover:border-primary/30"}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{count}</p>
          </div>
          <div className={`rounded-lg bg-muted p-2 ${color}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Compliance Score Ring ──────────────────────────── */
function ComplianceScore({ obligations: obligs }: { obligations: Obligation[] }) {
  const total = obligs.length;
  const compliant = obligs.filter(o => o.status === "compliant" || o.status === "completed").length;
  const score = total > 0 ? Math.round((compliant / total) * 100) : 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="28"
                fill="none"
                stroke={score >= 70 ? "hsl(var(--confidence-high))" : score >= 50 ? "hsl(var(--confidence-medium))" : "hsl(var(--destructive))"}
                strokeWidth="6"
                strokeDasharray={`${(score / 100) * 175.9} 175.9`}
                strokeLinecap="round"
                transform="rotate(-90 32 32)"
              />
            </svg>
            <span className="absolute text-sm font-bold">{score}%</span>
          </div>
          <div>
            <p className="text-sm font-semibold">Compliance Score</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {compliant}/{total} obligations met
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Category Breakdown ────────────────────────────── */
function CategoryBreakdown({ obligs }: { obligs: Obligation[] }) {
  const categories = ["compliance", "financial", "operational", "reporting", "insurance"] as const;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">By Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {categories.map(cat => {
          const catObligs = obligs.filter(o => o.category === cat);
          if (catObligs.length === 0) return null;
          const compliant = catObligs.filter(o => o.status === "compliant" || o.status === "completed").length;
          const pct = Math.round((compliant / catObligs.length) * 100);
          const Icon = categoryIcons[cat] || FileText;

          return (
            <div key={cat} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 capitalize font-medium">
                  <Icon className="h-3 w-3 text-muted-foreground" />
                  {cat}
                </span>
                <span className="text-muted-foreground">{compliant}/{catObligs.length}</span>
              </div>
              <Progress value={pct} className="h-1.5" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/* ─── Main Page ─────────────────────────────────────── */
export default function Obligations() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = obligations.filter(o => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (categoryFilter !== "all" && o.category !== categoryFilter) return false;
    return true;
  });

  const overdue = obligations.filter(o => o.status === "overdue").length;
  const atRisk = obligations.filter(o => o.status === "at_risk").length;
  const compliant = obligations.filter(o => o.status === "compliant").length;
  const upcoming = obligations.filter(o => o.status === "upcoming").length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Obligation Tracker</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor compliance, deadlines, and risk across all healthcare contracts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1">
            <CalendarClock className="h-3.5 w-3.5" /> Export Calendar
          </Button>
          <Button variant="outline" size="sm" className="text-xs gap-1">
            <BarChart3 className="h-3.5 w-3.5" /> Compliance Report
          </Button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <SummaryCard title="Overdue" count={overdue} icon={XCircle} color="text-destructive" onClick={() => setStatusFilter(statusFilter === "overdue" ? "all" : "overdue")} active={statusFilter === "overdue"} />
        <SummaryCard title="At Risk" count={atRisk} icon={AlertTriangle} color="text-confidence-medium" onClick={() => setStatusFilter(statusFilter === "at_risk" ? "all" : "at_risk")} active={statusFilter === "at_risk"} />
        <SummaryCard title="Compliant" count={compliant} icon={CheckCircle2} color="text-confidence-high" onClick={() => setStatusFilter(statusFilter === "compliant" ? "all" : "compliant")} active={statusFilter === "compliant"} />
        <SummaryCard title="Upcoming" count={upcoming} icon={Clock} color="text-status-info" onClick={() => setStatusFilter(statusFilter === "upcoming" ? "all" : "upcoming")} active={statusFilter === "upcoming"} />
        <ComplianceScore obligations={obligations} />
        <CategoryBreakdown obligs={obligations} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 w-40 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
            <SelectItem value="overdue" className="text-xs">Overdue</SelectItem>
            <SelectItem value="at_risk" className="text-xs">At Risk</SelectItem>
            <SelectItem value="compliant" className="text-xs">Compliant</SelectItem>
            <SelectItem value="upcoming" className="text-xs">Upcoming</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-8 w-40 text-xs">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Categories</SelectItem>
            <SelectItem value="compliance" className="text-xs">Compliance</SelectItem>
            <SelectItem value="financial" className="text-xs">Financial</SelectItem>
            <SelectItem value="operational" className="text-xs">Operational</SelectItem>
            <SelectItem value="reporting" className="text-xs">Reporting</SelectItem>
            <SelectItem value="insurance" className="text-xs">Insurance</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground ml-auto">
          Showing {filtered.length} of {obligations.length} obligations
        </span>
      </div>

      {/* Obligations Table */}
      <Card>
        <ScrollArea className="h-[calc(100vh-420px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Status</TableHead>
                <TableHead>Obligation</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="w-[80px]">Evidence</TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered
                .sort((a, b) => {
                  const statusOrder: Record<string, number> = { overdue: 0, at_risk: 1, upcoming: 2, compliant: 3, completed: 4 };
                  return (statusOrder[a.status] ?? 5) - (statusOrder[b.status] ?? 5);
                })
                .map((obl) => {
                  const sc = statusConfig[obl.status];
                  const Icon = sc.icon;
                  const CatIcon = categoryIcons[obl.category] || FileText;
                  const contract = contracts.find(c => c.id === obl.contractId);
                  const daysUntil = getDaysUntil(obl.dueDate);

                  return (
                    <TableRow key={obl.id} className="cursor-pointer hover:bg-muted/30">
                      <TableCell>
                        <Icon className={`h-4 w-4 ${sc.color}`} />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{obl.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{obl.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          className="p-0 h-auto text-xs"
                          onClick={(e) => { e.stopPropagation(); navigate(`/reader/${obl.contractId}`); }}
                        >
                          {contract?.id} — {contract?.type}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] capitalize gap-1">
                          <CatIcon className="h-2.5 w-2.5" />
                          {obl.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{obl.owner}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <p>{formatDate(obl.dueDate)}</p>
                          <p className={`text-[10px] ${daysUntil < 0 ? "text-destructive" : daysUntil < 30 ? "text-confidence-medium" : "text-muted-foreground"}`}>
                            {daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : daysUntil === 0 ? "Due today" : `${daysUntil}d remaining`}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] ${riskColors[obl.riskLevel]}`}>
                          {obl.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {obl.evidence ? (
                          <span className="text-[10px] text-muted-foreground line-clamp-2">{obl.evidence}</span>
                        ) : (
                          <span className="text-[10px] text-destructive">Missing</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}
