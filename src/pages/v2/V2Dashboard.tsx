import { useNavigate } from "react-router-dom";
import {
  FileStack, FilePlus2, Shield, AlertTriangle, Clock, TrendingUp, TrendingDown,
  DollarSign, XCircle, CheckCircle2, ArrowRight, ScanLine, GitCompareArrows,
  Building2, Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { v2KpiData, v2Contracts, v2Obligations, redlineChanges, uploadedDocuments } from "@/data/v2-mock-data";

/* ─── Metric Card ─── */
function MetricCard({ title, value, icon: Icon, trend, trendDir, subtitle, alert, onClick }: {
  title: string; value: string | number; icon: React.ElementType;
  trend?: string; trendDir?: "up" | "down"; subtitle?: string; alert?: boolean; onClick?: () => void;
}) {
  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/30 ${alert ? "border-destructive/30" : ""}`} onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {trend && (
              <p className={`flex items-center gap-1 text-[11px] ${trendDir === "up" ? "text-confidence-high" : trendDir === "down" ? "text-destructive" : "text-muted-foreground"}`}>
                {trendDir === "up" ? <TrendingUp className="h-3 w-3" /> : trendDir === "down" ? <TrendingDown className="h-3 w-3" /> : null}
                {trend}
              </p>
            )}
            {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={`rounded-lg p-2 ${alert ? "bg-destructive/10" : "bg-primary/10"}`}>
            <Icon className={`h-4 w-4 ${alert ? "text-destructive" : "text-primary"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Status badge helper ─── */
const statusStyle: Record<string, string> = {
  executed: "bg-confidence-high/10 text-confidence-high border-confidence-high/20",
  in_review: "bg-status-warning/10 text-status-warning border-status-warning/20",
  draft: "bg-status-info/10 text-status-info border-status-info/20",
  approved: "bg-confidence-high/10 text-confidence-high border-confidence-high/20",
  expired: "bg-muted text-muted-foreground border-border",
  terminated: "bg-destructive/10 text-destructive border-destructive/20",
};

/* ─── Recent Contracts Table ─── */
function RecentContracts() {
  const navigate = useNavigate();
  const recent = [...v2Contracts].sort((a, b) => b.lastModified.localeCompare(a.lastModified)).slice(0, 6);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><FileStack className="h-4 w-4 text-primary" />Recent Contracts</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs gap-1 h-7" onClick={() => navigate("/v2/contracts")}>View all<ArrowRight className="h-3 w-3" /></Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <thead><tr className="border-b">
            <th className="text-left p-3 font-medium text-muted-foreground">Contract</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Counterparty</th>
            <th className="text-center p-3 font-medium text-muted-foreground">Risk</th>
            <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
          </tr></thead>
          <tbody>
            {recent.map(c => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => navigate("/v2/contracts")}>
                <td className="p-3">
                  <p className="font-medium truncate max-w-[240px]">{c.title}</p>
                  <p className="text-[10px] text-muted-foreground">{c.id}</p>
                </td>
                <td className="p-3 text-muted-foreground">{c.counterparty}</td>
                <td className="p-3 text-center">
                  <span className={`font-semibold ${c.riskScore <= 25 ? "text-confidence-high" : c.riskScore <= 50 ? "text-confidence-medium" : "text-destructive"}`}>{c.riskScore}</span>
                </td>
                <td className="p-3 text-center">
                  <Badge variant="outline" className={`text-[10px] ${statusStyle[c.status] || ""}`}>{c.status.replace("_", " ")}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

/* ─── Obligation Alerts ─── */
function ObligationAlerts() {
  const navigate = useNavigate();
  const urgent = v2Obligations.filter(o => o.status === "overdue" || o.status === "at_risk").slice(0, 5);
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Obligation Alerts</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs gap-1 h-7" onClick={() => navigate("/v2/obligations")}>View all<ArrowRight className="h-3 w-3" /></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground">Compliance Score</span>
          <span className={`font-bold ${v2KpiData.complianceScore >= 70 ? "text-confidence-high" : "text-confidence-medium"}`}>{v2KpiData.complianceScore}%</span>
        </div>
        <Progress value={v2KpiData.complianceScore} className="h-2 mb-3" />
        {urgent.map(o => (
          <div key={o.id} className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/30 cursor-pointer" onClick={() => navigate("/v2/obligations")}>
            {o.status === "overdue" ? <XCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" /> : <AlertTriangle className="h-3.5 w-3.5 text-confidence-medium shrink-0 mt-0.5" />}
            <div className="min-w-0">
              <p className="text-[11px] font-medium truncate">{o.title}</p>
              <p className="text-[10px] text-muted-foreground">{o.contractTitle} · Due {o.dueDate}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ─── Redline Summary ─── */
function RedlineSummary() {
  const navigate = useNavigate();
  const pending = redlineChanges.filter(r => r.status === "pending");
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><GitCompareArrows className="h-4 w-4 text-primary" />Pending Redlines</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs gap-1 h-7" onClick={() => navigate("/v2/redline")}>Review<ArrowRight className="h-3 w-3" /></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {pending.slice(0, 4).map(r => (
          <div key={r.id} className="p-2 rounded-md border hover:bg-muted/30 cursor-pointer" onClick={() => navigate("/v2/redline")}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium truncate">{r.clauseTitle}</p>
              <Badge variant="outline" className={`text-[9px] ${
                r.deviationSeverity === "critical" ? "text-destructive border-destructive/30" :
                r.deviationSeverity === "high" ? "text-status-warning border-status-warning/30" :
                "text-muted-foreground"
              }`}>{r.deviationSeverity}</Badge>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{r.author} · {r.comment || "No comment"}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ─── Digitization Pipeline ─── */
function DigitizationStatus() {
  const navigate = useNavigate();
  const processing = uploadedDocuments.filter(d => !["completed", "failed"].includes(d.status));
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><ScanLine className="h-4 w-4 text-primary" />Digitization Pipeline</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs gap-1 h-7" onClick={() => navigate("/v2/upload")}>Manage<ArrowRight className="h-3 w-3" /></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-4 text-xs mb-2">
          <span className="text-muted-foreground">{processing.length} processing</span>
          <span className="text-confidence-high">{uploadedDocuments.filter(d => d.status === "completed").length} completed</span>
          <span className="text-destructive">{uploadedDocuments.filter(d => d.status === "failed").length} failed</span>
        </div>
        {processing.slice(0, 3).map(d => (
          <div key={d.id} className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="truncate font-medium">{d.fileName}</span>
              <span className="text-muted-foreground">{d.progress}%</span>
            </div>
            <Progress value={d.progress} className="h-1" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ─── Main Dashboard ─── */
export default function V2Dashboard() {
  const navigate = useNavigate();
  const totalValue = v2KpiData.totalValue;

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Provider Contract Intelligence</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Healthcare contract lifecycle management & analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => navigate("/v2/upload")}>
            <ScanLine className="h-3.5 w-3.5" />Upload Legacy
          </Button>
          <Button size="sm" className="text-xs gap-1.5" onClick={() => navigate("/v2/drafting")}>
            <FilePlus2 className="h-3.5 w-3.5" />New Contract
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard title="Total Contracts" value={v2KpiData.totalContracts} icon={FileStack} subtitle={`${v2KpiData.activeContracts} active`} />
        <MetricCard title="Portfolio Value" value={`$${(totalValue / 1e6).toFixed(1)}M`} icon={DollarSign} trend="+12% YoY" trendDir="up" />
        <MetricCard title="In Review" value={v2KpiData.inReview} icon={Clock} onClick={() => navigate("/v2/contracts")} />
        <MetricCard title="Pending Redlines" value={v2KpiData.pendingRedlines} icon={GitCompareArrows} alert={v2KpiData.pendingRedlines > 3} onClick={() => navigate("/v2/redline")} />
        <MetricCard title="Overdue Obligations" value={v2KpiData.overdueObligations} icon={AlertTriangle} alert={v2KpiData.overdueObligations > 0} onClick={() => navigate("/v2/obligations")} />
        <MetricCard title="Avg Risk Score" value={v2KpiData.avgRiskScore} icon={Activity} subtitle="Lower is better" trendDir={v2KpiData.avgRiskScore <= 35 ? "up" : "down"} trend={v2KpiData.avgRiskScore <= 35 ? "Healthy" : "Elevated"} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 space-y-5">
          <ObligationAlerts />
          <RedlineSummary />
          <DigitizationStatus />
        </div>
        <div className="lg:col-span-8">
          <RecentContracts />
        </div>
      </div>
    </div>
  );
}
