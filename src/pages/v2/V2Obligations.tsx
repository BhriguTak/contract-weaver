import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, AlertTriangle, CheckCircle2, XCircle, Clock, Calendar,
  User, FileText, Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { v2Obligations, type ObligationStatus, type RiskLevel } from "@/data/v2-mock-data";

const statusConfig: Record<ObligationStatus, { label: string; icon: React.ElementType; color: string; badgeClass: string }> = {
  compliant: { label: "Compliant", icon: CheckCircle2, color: "text-confidence-high", badgeClass: "bg-confidence-high/10 text-confidence-high border-confidence-high/20" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-confidence-high", badgeClass: "bg-confidence-high/10 text-confidence-high border-confidence-high/20" },
  upcoming: { label: "Upcoming", icon: Clock, color: "text-status-info", badgeClass: "bg-status-info/10 text-status-info border-status-info/20" },
  at_risk: { label: "At Risk", icon: AlertTriangle, color: "text-status-warning", badgeClass: "bg-status-warning/10 text-status-warning border-status-warning/20" },
  overdue: { label: "Overdue", icon: XCircle, color: "text-destructive", badgeClass: "bg-destructive/10 text-destructive border-destructive/20" },
};

const riskColors: Record<RiskLevel, string> = {
  low: "text-confidence-high",
  medium: "text-confidence-medium",
  high: "text-status-warning",
  critical: "text-destructive",
};

function getDaysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function V2Obligations() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = [...new Set(v2Obligations.map(o => o.category))];

  const filtered = v2Obligations.filter(o => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (categoryFilter !== "all" && o.category !== categoryFilter) return false;
    return true;
  });

  const total = v2Obligations.length;
  const overdue = v2Obligations.filter(o => o.status === "overdue").length;
  const atRisk = v2Obligations.filter(o => o.status === "at_risk").length;
  const upcoming = v2Obligations.filter(o => o.status === "upcoming").length;
  const safe = v2Obligations.filter(o => o.status === "compliant" || o.status === "completed").length;
  const complianceScore = Math.round(((total - overdue) / total) * 100);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />Obligation Tracking
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">Monitor and manage contractual obligations across all healthcare agreements</p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Compliance</p>
            <p className={`text-3xl font-bold mt-1 ${complianceScore >= 80 ? "text-confidence-high" : complianceScore >= 60 ? "text-confidence-medium" : "text-destructive"}`}>{complianceScore}%</p>
            <Progress value={complianceScore} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        {[
          { label: "Overdue", value: overdue, color: "text-destructive", icon: XCircle },
          { label: "At Risk", value: atRisk, color: "text-status-warning", icon: AlertTriangle },
          { label: "Upcoming", value: upcoming, color: "text-status-info", icon: Clock },
          { label: "Total", value: total, color: "", icon: FileText },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-lg p-2 bg-primary/5">
                <s.icon className={`h-4 w-4 ${s.color || "text-primary"}`} />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="at_risk">At Risk</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="compliant">Compliant</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-8 w-[160px] text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Obligations Table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Obligation</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Contract</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Category</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Due Date</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Risk</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Owner</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Recurrence</th>
              </tr>
            </thead>
            <tbody>
              {filtered.sort((a, b) => {
                const order: Record<string, number> = { overdue: 0, at_risk: 1, upcoming: 2, compliant: 3, completed: 4 };
                return (order[a.status] ?? 5) - (order[b.status] ?? 5);
              }).map(o => {
                const config = statusConfig[o.status];
                const StatusIcon = config.icon;
                const days = getDaysUntil(o.dueDate);
                return (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-3">
                      <Badge variant="outline" className={`text-[10px] ${config.badgeClass}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />{config.label}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <p className="font-medium">{o.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{o.description}</p>
                      {o.lastAction && <p className="text-[10px] text-status-info mt-0.5">↪ {o.lastAction}</p>}
                    </td>
                    <td className="p-3 text-muted-foreground max-w-[200px] truncate">{o.contractTitle}</td>
                    <td className="p-3 text-center"><Badge variant="secondary" className="text-[9px]">{o.category}</Badge></td>
                    <td className="p-3 text-center">
                      <span className={days < 0 ? "text-destructive font-semibold" : days <= 7 ? "text-status-warning" : "text-muted-foreground"}>
                        {o.dueDate}
                      </span>
                      <p className="text-[10px] text-muted-foreground">{days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}</p>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`font-semibold capitalize ${riskColors[o.risk]}`}>{o.risk}</span>
                    </td>
                    <td className="p-3 text-muted-foreground">{o.owner}</td>
                    <td className="p-3 text-center text-muted-foreground">{o.recurrence}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-muted-foreground">No obligations match your filters.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
