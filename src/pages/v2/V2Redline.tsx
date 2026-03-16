import { useState } from "react";
import {
  GitCompareArrows, CheckCircle2, XCircle, MessageSquare, AlertTriangle,
  ArrowRight, Shield, ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { redlineChanges, v2Contracts, type RedlineChange, type RedlineStatus } from "@/data/v2-mock-data";
import { toast } from "@/hooks/use-toast";

const severityStyle: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-status-warning/10 text-status-warning border-status-warning/20",
  medium: "bg-confidence-medium/10 text-confidence-medium border-confidence-medium/20",
  low: "bg-muted text-muted-foreground border-border",
};

const statusStyle: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: "Pending", icon: AlertTriangle, color: "text-status-warning" },
  accepted: { label: "Accepted", icon: CheckCircle2, color: "text-confidence-high" },
  rejected: { label: "Rejected", icon: XCircle, color: "text-destructive" },
  counter: { label: "Counter", icon: MessageSquare, color: "text-status-info" },
};

function DeviationCard({ change, onAction }: { change: RedlineChange; onAction: (id: string, status: RedlineStatus) => void }) {
  const status = statusStyle[change.status];
  const StatusIcon = status.icon;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <StatusIcon className={`h-4 w-4 shrink-0 ${status.color}`} />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{change.clauseTitle}</p>
              <p className="text-[10px] text-muted-foreground">{change.author} · {new Date(change.timestamp).toLocaleDateString()}</p>
            </div>
          </div>
          <Badge variant="outline" className={`text-[9px] shrink-0 ${severityStyle[change.deviationSeverity]}`}>
            {change.deviationSeverity} deviation
          </Badge>
        </div>

        {/* Diff View */}
        <div className="grid grid-cols-2 divide-x">
          <div className="p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Original (Playbook)</p>
            <p className="text-xs leading-relaxed bg-diff-removed-bg/50 p-3 rounded-md border border-diff-removed/10">{change.originalText}</p>
          </div>
          <div className="p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Proposed Change</p>
            <p className="text-xs leading-relaxed bg-diff-added-bg/50 p-3 rounded-md border border-diff-added/10">{change.proposedText}</p>
          </div>
        </div>

        {/* Playbook Reference */}
        {change.playbookClause && (
          <div className="px-4 pb-3">
            <div className="flex items-start gap-2 p-2 rounded-md bg-status-warning/5 border border-status-warning/10">
              <Shield className="h-3 w-3 text-status-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-status-warning">Playbook Standard</p>
                <p className="text-[10px] text-muted-foreground">{change.playbookClause}</p>
              </div>
            </div>
          </div>
        )}

        {/* Comment */}
        {change.comment && (
          <div className="px-4 pb-3">
            <p className="text-[10px] text-muted-foreground italic">💬 {change.comment}</p>
          </div>
        )}

        {/* Actions */}
        {change.status === "pending" && (
          <div className="px-4 pb-4 flex items-center gap-2">
            <Button size="sm" className="h-7 text-xs gap-1" onClick={() => onAction(change.id, "accepted")}>
              <CheckCircle2 className="h-3 w-3" />Accept
            </Button>
            <Button size="sm" variant="destructive" className="h-7 text-xs gap-1" onClick={() => onAction(change.id, "rejected")}>
              <XCircle className="h-3 w-3" />Reject
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => onAction(change.id, "counter")}>
              <MessageSquare className="h-3 w-3" />Counter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function V2Redline() {
  const [changes, setChanges] = useState(redlineChanges);
  const [contractFilter, setContractFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const contractsWithRedlines = [...new Set(redlineChanges.map(r => r.contractId))];

  const filtered = changes.filter(c => {
    if (contractFilter !== "all" && c.contractId !== contractFilter) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  const handleAction = (id: string, newStatus: RedlineStatus) => {
    setChanges(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    toast({
      title: `Redline ${newStatus}`,
      description: `The change has been marked as ${newStatus}.`,
    });
  };

  const summary = {
    total: changes.length,
    pending: changes.filter(c => c.status === "pending").length,
    critical: changes.filter(c => c.deviationSeverity === "critical").length,
    accepted: changes.filter(c => c.status === "accepted").length,
    rejected: changes.filter(c => c.status === "rejected").length,
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <GitCompareArrows className="h-5 w-5 text-primary" />Redlining & Deviations
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">Review proposed changes and track deviations from your playbook standards</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total Changes", value: summary.total, color: "" },
          { label: "Pending Review", value: summary.pending, color: "text-status-warning" },
          { label: "Critical", value: summary.critical, color: "text-destructive" },
          { label: "Accepted", value: summary.accepted, color: "text-confidence-high" },
          { label: "Rejected", value: summary.rejected, color: "text-destructive" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-3 text-center">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={contractFilter} onValueChange={setContractFilter}>
          <SelectTrigger className="h-8 w-[260px] text-xs"><SelectValue placeholder="All Contracts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Contracts</SelectItem>
            {contractsWithRedlines.map(id => {
              const contract = v2Contracts.find(c => c.id === id);
              return <SelectItem key={id} value={id} className="text-xs">{contract?.title || id}</SelectItem>;
            })}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="counter">Counter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Redline Cards */}
      <div className="space-y-4">
        {filtered.map(change => (
          <DeviationCard key={change.id} change={change} onAction={handleAction} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-xs text-muted-foreground">No redline changes match your filters.</div>
        )}
      </div>
    </div>
  );
}
