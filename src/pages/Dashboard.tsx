import { useNavigate } from "react-router-dom";
import {
  FileText,
  FolderTree,
  AlertTriangle,
  Clock,
  Upload,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  XCircle,
  MessageSquare,
  GitCompareArrows,
  Shield,
  ClipboardCheck,
  Heart,
  DollarSign,
  Stethoscope,
  Building2,
  ScanLine,
  BarChart3,
  Users,
  Percent,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  kpiData,
  families,
  activityFeed,
  obligations,
  type ActivityItem,
  type ContractFamily,
} from "@/data/mock-data";

/* ─── Payer-Specific KPI Data ─────────────────────── */
const payerKpis = {
  totalPayerContracts: 14,
  activePayers: 6,
  cleanClaimRate: 94.2,
  cleanClaimTarget: 95,
  avgDaysToPayment: 32,
  denialRate: 8.3,
  denialRatePrev: 6.1,
  credentialingPending: 3,
  totalContractValue: 4_800_000,
  baaCompliance: 87,
  networkAdequacy: 92,
  priorAuthApproval: 78,
  arOver90Days: 245_000,
  reimbursementVariance: -3.2,
};

const payerBreakdown = [
  { name: "BlueCross BlueShield", contracts: 4, status: "active" as const, claimRate: 96.1, denials: 5.2, value: "$1.8M", renewal: "Jun 2026" },
  { name: "Aetna", contracts: 3, status: "active" as const, claimRate: 93.4, denials: 9.1, value: "$920K", renewal: "Sep 2026" },
  { name: "UnitedHealth Group", contracts: 3, status: "active" as const, claimRate: 91.8, denials: 11.2, value: "$1.2M", renewal: "Mar 2027" },
  { name: "Cigna", contracts: 2, status: "review" as const, claimRate: 94.7, denials: 7.3, value: "$480K", renewal: "Dec 2026" },
  { name: "Humana", contracts: 1, status: "active" as const, claimRate: 97.2, denials: 4.1, value: "$280K", renewal: "Jan 2027" },
  { name: "TRICARE", contracts: 1, status: "expired" as const, claimRate: 88.5, denials: 14.8, value: "$120K", renewal: "Expired" },
];

const topDenialReasons = [
  { reason: "Missing prior authorization", pct: 34, trend: "up" },
  { reason: "ICD-10 coding specificity", pct: 22, trend: "stable" },
  { reason: "Timely filing violation", pct: 18, trend: "down" },
  { reason: "Non-covered service", pct: 14, trend: "up" },
  { reason: "Duplicate claim", pct: 12, trend: "stable" },
];

/* ─── Status Colors ───────────────────────────────── */
const statusColors: Record<string, string> = {
  active: "bg-confidence-high/10 text-confidence-high border-confidence-high/20",
  expired: "bg-muted text-muted-foreground border-border",
  pending_review: "bg-confidence-medium/10 text-confidence-medium border-confidence-medium/20",
  review: "bg-confidence-medium/10 text-confidence-medium border-confidence-medium/20",
  draft: "bg-status-info/10 text-status-info border-status-info/20",
};

/* ─── Activity Icons ──────────────────────────────── */
const activityIcons: Record<string, React.ElementType> = {
  upload: Upload,
  extraction: Activity,
  review: CheckCircle2,
  comparison: GitCompareArrows,
  comment: MessageSquare,
};

/* ─── Components ──────────────────────────────────── */
function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection,
  subtitle,
  alert,
  onClick,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendDirection?: "up" | "down" | "stable";
  subtitle?: string;
  alert?: boolean;
  onClick?: () => void;
}) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/30 ${alert ? "border-destructive/30" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
            {trend && (
              <p className={`mt-0.5 flex items-center gap-1 text-[11px] ${
                trendDirection === "up" ? "text-confidence-high" :
                trendDirection === "down" ? "text-destructive" : "text-muted-foreground"
              }`}>
                {trendDirection === "up" ? <TrendingUp className="h-3 w-3" /> :
                 trendDirection === "down" ? <TrendingDown className="h-3 w-3" /> : null}
                {trend}
              </p>
            )}
            {subtitle && <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <div className={`rounded-lg p-2 ${alert ? "bg-destructive/10" : "bg-primary/10"}`}>
            <Icon className={`h-4 w-4 ${alert ? "text-destructive" : "text-primary"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const Icon = activityIcons[item.type] || Activity;
  return (
    <div className="flex gap-3 py-2.5 border-b last:border-0">
      <div className="mt-0.5 rounded-md bg-muted p-1.5 h-fit">
        <Icon className="h-3 w-3 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium leading-tight">{item.title}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
        <span className="text-[10px] text-muted-foreground">{item.user}</span>
      </div>
    </div>
  );
}

function PayerTable() {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Payer Performance
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => navigate("/families")}>
            View all <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-muted-foreground">Payer</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Contracts</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Clean Claim %</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Denial %</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Value</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Renewal</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {payerBreakdown.map(payer => (
                <tr key={payer.name} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer">
                  <td className="p-3 font-medium">{payer.name}</td>
                  <td className="p-3 text-center">{payer.contracts}</td>
                  <td className="p-3 text-center">
                    <span className={payer.claimRate >= 95 ? "text-confidence-high" : payer.claimRate >= 90 ? "text-confidence-medium" : "text-destructive"}>
                      {payer.claimRate}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={payer.denials <= 6 ? "text-confidence-high" : payer.denials <= 10 ? "text-confidence-medium" : "text-destructive"}>
                      {payer.denials}%
                    </span>
                  </td>
                  <td className="p-3 text-center font-medium">{payer.value}</td>
                  <td className="p-3 text-center text-muted-foreground">{payer.renewal}</td>
                  <td className="p-3 text-center">
                    <Badge variant="outline" className={`text-[10px] ${statusColors[payer.status] || ""}`}>
                      {payer.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function DenialInsights() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <XCircle className="h-4 w-4 text-destructive" />
          Top Denial Reasons
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topDenialReasons.map(d => (
          <div key={d.reason} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="truncate">{d.reason}</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">{d.pct}%</span>
                {d.trend === "up" && <TrendingUp className="h-3 w-3 text-destructive" />}
                {d.trend === "down" && <TrendingDown className="h-3 w-3 text-confidence-high" />}
              </div>
            </div>
            <Progress value={d.pct} className="h-1.5" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ComplianceWidget() {
  const navigate = useNavigate();
  const urgent = obligations
    .filter(o => o.status === "overdue" || o.status === "at_risk")
    .sort((a, b) => {
      const order: Record<string, number> = { overdue: 0, at_risk: 1 };
      return (order[a.status] ?? 2) - (order[b.status] ?? 2);
    })
    .slice(0, 4);

  const total = obligations.length;
  const compliant = obligations.filter(o => o.status === "compliant" || o.status === "completed").length;
  const score = Math.round((compliant / total) * 100);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Compliance & Obligations
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => navigate("/obligations")}>
            View all <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Overall Compliance</span>
            <span className={`font-semibold ${score >= 70 ? "text-confidence-high" : score >= 50 ? "text-confidence-medium" : "text-destructive"}`}>
              {score}%
            </span>
          </div>
          <Progress value={score} className="h-2" />
        </div>
        <div className="space-y-1.5">
          {urgent.map(obl => (
            <div
              key={obl.id}
              className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/30 cursor-pointer"
              onClick={() => navigate("/obligations")}
            >
              {obl.status === "overdue" ? (
                <XCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 text-confidence-medium shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <p className="text-[11px] font-medium truncate">{obl.title}</p>
                <p className="text-[10px] text-muted-foreground">{obl.owner}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Main Dashboard ──────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            Payer Contract Intelligence
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time analytics across payer agreements, claims performance & compliance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/digitization")} className="gap-2 text-xs">
            <ScanLine className="h-4 w-4" />
            Digitize Legacy
          </Button>
          <Button onClick={() => navigate("/upload")} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Contracts
          </Button>
        </div>
      </div>

      {/* Primary KPIs — Payer Specific */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Active Payers"
          value={payerKpis.activePayers}
          icon={Building2}
          subtitle={`${payerKpis.totalPayerContracts} total contracts`}
        />
        <MetricCard
          title="Clean Claim Rate"
          value={`${payerKpis.cleanClaimRate}%`}
          icon={CheckCircle2}
          trend={`Target: ${payerKpis.cleanClaimTarget}%`}
          trendDirection={payerKpis.cleanClaimRate >= payerKpis.cleanClaimTarget ? "up" : "down"}
        />
        <MetricCard
          title="Denial Rate"
          value={`${payerKpis.denialRate}%`}
          icon={XCircle}
          trend={`Was ${payerKpis.denialRatePrev}% last quarter`}
          trendDirection="down"
          alert
        />
        <MetricCard
          title="Avg Days to Pay"
          value={payerKpis.avgDaysToPayment}
          icon={Clock}
          subtitle="Industry avg: 45 days"
          trendDirection="up"
        />
        <MetricCard
          title="Prior Auth Approval"
          value={`${payerKpis.priorAuthApproval}%`}
          icon={ClipboardCheck}
          alert={payerKpis.priorAuthApproval < 80}
        />
        <MetricCard
          title="A/R > 90 Days"
          value={`$${(payerKpis.arOver90Days / 1000).toFixed(0)}K`}
          icon={DollarSign}
          alert
          onClick={() => navigate("/obligations")}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          title="BAA Compliance"
          value={`${payerKpis.baaCompliance}%`}
          icon={Shield}
          onClick={() => navigate("/obligations")}
        />
        <MetricCard
          title="Network Adequacy"
          value={`${payerKpis.networkAdequacy}%`}
          icon={Users}
        />
        <MetricCard
          title="Overdue Obligations"
          value={kpiData.overdueObligations}
          icon={AlertTriangle}
          alert={kpiData.overdueObligations > 0}
          onClick={() => navigate("/obligations")}
        />
        <MetricCard
          title="Credentialing Pending"
          value={payerKpis.credentialingPending}
          icon={Stethoscope}
          subtitle="Providers awaiting approval"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-5">
          <ComplianceWidget />
          <DenialInsights />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-[240px] pr-3">
                {activityFeed.map(item => (
                  <ActivityRow key={item.id} item={item} />
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column — Payer Table */}
        <div className="lg:col-span-8 space-y-5">
          <PayerTable />

          {/* Provider Families Grid */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Provider Families</h2>
            <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => navigate("/families")}>
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {families.map(family => (
              <Card
                key={family.id}
                className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
                onClick={() => navigate(`/families/${family.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs font-semibold truncate">{family.name}</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {family.jurisdiction} · {family.dateRange}
                      </p>
                    </div>
                    <Badge variant="outline" className={`shrink-0 text-[10px] ${statusColors[family.status] || ""}`}>
                      {family.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><FileText className="h-2.5 w-2.5" />{family.documentCount} docs</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {family.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-normal">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
