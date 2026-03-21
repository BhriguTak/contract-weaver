import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FilePlus2, ArrowRight, Clock, Users, CheckCircle2, AlertTriangle,
  Send, TrendingUp, FileText, Gavel, DollarSign, Eye, ChevronRight,
  X, Search, UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  pipelineContracts, teamMembers,
  type PipelineContract, type PipelineStage, type TeamMember,
} from "@/data/v2-mock-data";
import { toast } from "@/hooks/use-toast";

/* ─── Constants ─── */
const stages: { key: PipelineStage; label: string; icon: React.ElementType; color: string }[] = [
  { key: "draft", label: "Draft", icon: FileText, color: "text-status-info" },
  { key: "internal_review", label: "Internal Review", icon: Eye, color: "text-status-pending" },
  { key: "pricing", label: "Pricing Review", icon: DollarSign, color: "text-status-warning" },
  { key: "legal", label: "Legal Review", icon: Gavel, color: "text-highlight-obligation" },
  { key: "approved", label: "Approved", icon: CheckCircle2, color: "text-confidence-high" },
  { key: "signed", label: "Signed", icon: CheckCircle2, color: "text-confidence-high" },
];

const priorityStyle: Record<string, string> = {
  low: "bg-confidence-high/10 text-confidence-high border-confidence-high/20",
  medium: "bg-status-warning/10 text-status-warning border-status-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
};

const stageStyle: Record<string, string> = {
  draft: "bg-status-info/10 text-status-info border-status-info/20",
  internal_review: "bg-status-pending/10 text-status-pending border-status-pending/20",
  pricing: "bg-status-warning/10 text-status-warning border-status-warning/20",
  legal: "bg-highlight-obligation/10 text-highlight-obligation border-highlight-obligation/20",
  approved: "bg-confidence-high/10 text-confidence-high border-confidence-high/20",
  signed: "bg-confidence-high/10 text-confidence-high border-confidence-high/20",
};

const typeLabels: Record<string, string> = {
  payer_agreement: "Payer Agreement",
  baa: "BAA",
  provider_network: "Provider Network",
  employment: "Employment",
  vendor: "Vendor",
  lease: "Facility Lease",
  amendment: "Amendment",
};

/* ─── KPI Card ─── */
function KpiCard({ title, value, icon: Icon, subtitle, trend, alert }: {
  title: string; value: string | number; icon: React.ElementType;
  subtitle?: string; trend?: string; alert?: boolean;
}) {
  return (
    <Card className={`${alert ? "border-destructive/30 bg-destructive/5" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={`p-2 rounded-lg ${alert ? "bg-destructive/10" : "bg-primary/10"}`}>
            <Icon className={`h-4 w-4 ${alert ? "text-destructive" : "text-primary"}`} />
          </div>
        </div>
        {trend && <p className="text-[10px] text-confidence-high mt-2">{trend}</p>}
      </CardContent>
    </Card>
  );
}

/* ─── Stage Funnel ─── */
function StageFunnel({ contracts }: { contracts: PipelineContract[] }) {
  return (
    <Card>
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="text-sm font-semibold">Contract Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex items-end gap-1.5">
          {stages.map((s) => {
            const count = contracts.filter(c => c.stage === s.key).length;
            const maxCount = Math.max(...stages.map(st => contracts.filter(c => c.stage === st.key).length), 1);
            const height = Math.max((count / maxCount) * 100, 12);
            return (
              <div key={s.key} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-sm font-bold">{count}</span>
                <div
                  className={`w-full rounded-t-md transition-all ${
                    s.key === "signed" ? "bg-confidence-high/20" :
                    s.key === "approved" ? "bg-confidence-high/15" :
                    s.key === "legal" ? "bg-highlight-obligation/15" :
                    s.key === "pricing" ? "bg-status-warning/15" :
                    s.key === "internal_review" ? "bg-status-pending/15" :
                    "bg-status-info/15"
                  }`}
                  style={{ height: `${height}px` }}
                />
                <div className="flex flex-col items-center">
                  <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
                  <span className="text-[9px] text-muted-foreground mt-0.5 text-center leading-tight">{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Share Modal ─── */
function ShareModal({ contract, open, onOpenChange }: {
  contract: PipelineContract | null; open: boolean; onOpenChange: (v: boolean) => void;
}) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = teamMembers.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMember = (id: string) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleShare = () => {
    toast({
      title: "Contract shared",
      description: `Shared "${contract?.title}" with ${selectedMembers.length} team member(s) for pricing review.`,
    });
    setSelectedMembers([]);
    setNote("");
    setSearchTerm("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" />
            Share for Review
          </DialogTitle>
          <DialogDescription className="text-xs">
            {contract?.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>

          <div className="border rounded-md max-h-[180px] overflow-auto">
            {filtered.map(m => (
              <label
                key={m.id}
                className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 cursor-pointer text-xs border-b last:border-0"
              >
                <Checkbox
                  checked={selectedMembers.includes(m.id)}
                  onCheckedChange={() => toggleMember(m.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{m.name}</p>
                  <p className="text-[10px] text-muted-foreground">{m.role} · {m.department}</p>
                </div>
              </label>
            ))}
          </div>

          {selectedMembers.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedMembers.map(id => {
                const m = teamMembers.find(t => t.id === id);
                return (
                  <Badge key={id} variant="secondary" className="text-[10px] gap-1 pr-1">
                    {m?.name}
                    <X className="h-2.5 w-2.5 cursor-pointer" onClick={() => toggleMember(id)} />
                  </Badge>
                );
              })}
            </div>
          )}

          <Textarea
            placeholder="Add a note (optional)..."
            value={note}
            onChange={e => setNote(e.target.value)}
            className="text-xs min-h-[60px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" className="text-xs gap-1.5" onClick={handleShare} disabled={selectedMembers.length === 0}>
            <Send className="h-3 w-3" /> Share with {selectedMembers.length || ""} member{selectedMembers.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Main Page ─── */
export default function V2Pipeline() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState(pipelineContracts);
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [shareContract, setShareContract] = useState<PipelineContract | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const filtered = stageFilter === "all"
    ? contracts
    : contracts.filter(c => c.stage === stageFilter);

  // KPIs
  const totalDrafts = contracts.length;
  const inDraft = contracts.filter(c => c.stage === "draft").length;
  const inPricing = contracts.filter(c => c.stage === "pricing").length;
  const signed = contracts.filter(c => c.stage === "signed").length;
  const avgDaysInStage = Math.round(contracts.reduce((s, c) => s + c.daysInStage, 0) / contracts.length);
  const totalValue = contracts.reduce((s, c) => s + c.value, 0);
  const overdue = contracts.filter(c => c.daysInStage > 10).length;

  const handleAdvanceStage = (contractId: string) => {
    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;
      const stageOrder: PipelineStage[] = ["draft", "internal_review", "pricing", "legal", "approved", "signed"];
      const idx = stageOrder.indexOf(c.stage);
      if (idx >= stageOrder.length - 1) return c;
      const nextStage = stageOrder[idx + 1];
      return {
        ...c,
        stage: nextStage,
        daysInStage: 0,
        lastModified: new Date().toISOString().split("T")[0],
        stageHistory: [...c.stageHistory, { stage: nextStage, date: new Date().toISOString().split("T")[0], by: "You" }],
      };
    }));
    toast({ title: "Stage advanced", description: "Contract moved to next stage." });
  };

  const openShare = (c: PipelineContract) => {
    setShareContract(c);
    setShareOpen(true);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <FilePlus2 className="h-5 w-5 text-primary" />Contract Creation
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Pipeline dashboard · {totalDrafts} contracts in progress</p>
        </div>
        <Button size="sm" className="text-xs gap-1.5" onClick={() => navigate("/v2/drafting")}>
          <FilePlus2 className="h-3.5 w-3.5" /> New Contract
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <KpiCard title="Total" value={totalDrafts} icon={FileText} subtitle="All contracts" />
        <KpiCard title="In Draft" value={inDraft} icon={FileText} subtitle="Awaiting review" />
        <KpiCard title="Pricing Review" value={inPricing} icon={DollarSign} subtitle="With pricing team" />
        <KpiCard title="Signed" value={signed} icon={CheckCircle2} subtitle="Fully executed" trend={`${signed} this month`} />
        <KpiCard title="Avg Days" value={`${avgDaysInStage}d`} icon={Clock} subtitle="In current stage" />
        <KpiCard title="Total Value" value={`$${(totalValue / 1e6).toFixed(1)}M`} icon={TrendingUp} subtitle="Pipeline value" />
        <KpiCard title="Overdue" value={overdue} icon={AlertTriangle} subtitle=">10 days in stage" alert={overdue > 0} />
      </div>

      {/* Funnel + Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <StageFunnel contracts={contracts} />
        </div>
        <Card>
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="text-sm font-semibold">Stage Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {stages.map(s => {
              const count = contracts.filter(c => c.stage === s.key).length;
              const pct = totalDrafts > 0 ? Math.round((count / totalDrafts) * 100) : 0;
              return (
                <div key={s.key} className="flex items-center gap-2">
                  <s.icon className={`h-3.5 w-3.5 ${s.color} shrink-0`} />
                  <span className="text-xs flex-1 truncate">{s.label}</span>
                  <Progress value={pct} className="h-1.5 w-20" />
                  <span className="text-xs font-medium w-6 text-right">{count}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="h-8 w-[180px] text-xs"><SelectValue placeholder="Filter by stage" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {stages.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">{filtered.length} contract{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Contract List */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-muted-foreground">Contract</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Value</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Stage</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Days</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Priority</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Shared</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-3">
                    <p className="font-medium truncate max-w-[260px]">{c.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{c.id} · {c.owner}</p>
                  </td>
                  <td className="p-3"><Badge variant="secondary" className="text-[9px]">{typeLabels[c.type] || c.type}</Badge></td>
                  <td className="p-3 text-center font-medium">
                    {c.value > 0 ? `$${(c.value / 1000).toFixed(0)}K` : "—"}
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant="outline" className={`text-[10px] ${stageStyle[c.stage] || ""}`}>
                      {c.stage.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <span className={c.daysInStage > 10 ? "text-destructive font-semibold" : "text-muted-foreground"}>
                      {c.daysInStage}d
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant="outline" className={`text-[10px] ${priorityStyle[c.priority] || ""}`}>
                      {c.priority}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    {c.sharedWith.length > 0 ? (
                      <span className="text-[10px] text-muted-foreground">{c.sharedWith.length} member{c.sharedWith.length !== 1 ? "s" : ""}</span>
                    ) : <span className="text-[10px] text-muted-foreground">—</span>}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 px-2" onClick={() => openShare(c)}>
                        <Users className="h-3 w-3" /> Share
                      </Button>
                      {c.stage !== "signed" && (
                        <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2" onClick={() => handleAdvanceStage(c.id)}>
                          Advance <ChevronRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-muted-foreground">No contracts in this stage.</div>
          )}
        </CardContent>
      </Card>

      <ShareModal contract={shareContract} open={shareOpen} onOpenChange={setShareOpen} />
    </div>
  );
}
