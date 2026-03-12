import { useNavigate } from "react-router-dom";
import {
  FileText,
  FolderTree,
  AlertTriangle,
  Clock,
  Upload,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  MessageSquare,
  GitCompareArrows,
  Shield,
  ClipboardCheck,
  Heart,
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

const statusColors: Record<string, string> = {
  active: "bg-confidence-high/10 text-confidence-high border-confidence-high/20",
  expired: "bg-muted text-muted-foreground border-border",
  pending_review: "bg-confidence-medium/10 text-confidence-medium border-confidence-medium/20",
  draft: "bg-status-info/10 text-status-info border-status-info/20",
};

const activityIcons: Record<string, React.ElementType> = {
  upload: Upload,
  extraction: Activity,
  review: CheckCircle2,
  comparison: GitCompareArrows,
  comment: MessageSquare,
};

function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  onClick,
  alert,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: string;
  onClick?: () => void;
  alert?: boolean;
}) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/30 ${alert ? "border-destructive/30" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
            {trend && (
              <p className="mt-1 flex items-center gap-1 text-xs text-confidence-high">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </p>
            )}
          </div>
          <div className={`rounded-lg p-2.5 ${alert ? "bg-destructive/10" : "bg-primary/10"}`}>
            <Icon className={`h-5 w-5 ${alert ? "text-destructive" : "text-primary"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const Icon = activityIcons[item.type] || Activity;
  const timeAgo = getTimeAgo(item.timestamp);

  return (
    <div className="flex gap-3 py-3 border-b last:border-0">
      <div className="mt-0.5 rounded-md bg-muted p-1.5 h-fit">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight">{item.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
          {item.description}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground">{timeAgo}</span>
          <span className="text-[11px] text-muted-foreground">·</span>
          <span className="text-[11px] text-muted-foreground">{item.user}</span>
        </div>
      </div>
    </div>
  );
}

function FamilyCard({ family }: { family: ContractFamily }) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
      onClick={() => navigate(`/families/${family.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold truncate">{family.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {family.jurisdiction} · {family.dateRange}
            </p>
          </div>
          <Badge
            variant="outline"
            className={`shrink-0 text-[10px] ${statusColors[family.status] || ""}`}
          >
            {family.status.replace("_", " ")}
          </Badge>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {family.documentCount} docs
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {getTimeAgo(family.lastActivity)}
          </span>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1">
          {family.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-5 font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Obligation Alert Widget ───────────────────────── */
function ObligationAlerts() {
  const navigate = useNavigate();
  const urgent = obligations
    .filter(o => o.status === "overdue" || o.status === "at_risk")
    .sort((a, b) => {
      const order: Record<string, number> = { overdue: 0, at_risk: 1 };
      return (order[a.status] ?? 2) - (order[b.status] ?? 2);
    })
    .slice(0, 5);

  const total = obligations.length;
  const compliant = obligations.filter(o => o.status === "compliant" || o.status === "completed").length;
  const score = Math.round((compliant / total) * 100);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Compliance Overview
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1"
            onClick={() => navigate("/obligations")}
          >
            View all <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Overall Compliance</span>
            <span className={`font-semibold ${score >= 70 ? "text-confidence-high" : score >= 50 ? "text-confidence-medium" : "text-destructive"}`}>
              {score}%
            </span>
          </div>
          <Progress value={score} className="h-2" />
        </div>

        {/* Urgent items */}
        <div className="space-y-2">
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
                <p className="text-xs font-medium truncate">{obl.title}</p>
                <p className="text-[10px] text-muted-foreground">{obl.owner}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getTimeAgo(timestamp: string): string {
  const now = new Date("2026-02-16T12:00:00Z");
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

const quickFilters = [
  "BAAs needing renewal",
  "HIPAA compliance gaps",
  "Expiring within 90 days",
  "Low confidence clauses",
  "Overdue obligations",
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            Healthcare Contract Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Contract intelligence for healthcare provider agreements
          </p>
        </div>
        <Button onClick={() => navigate("/upload")} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Contracts
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Contracts"
          value={kpiData.totalContracts}
          icon={FileText}
          trend="+3 this month"
        />
        <KPICard
          title="Provider Families"
          value={kpiData.totalFamilies}
          icon={FolderTree}
        />
        <KPICard
          title="HIPAA Contracts"
          value={kpiData.hipaaContracts}
          icon={Shield}
        />
        <KPICard
          title="Overdue Obligations"
          value={kpiData.overdueObligations}
          icon={ClipboardCheck}
          alert={kpiData.overdueObligations > 0}
          onClick={() => navigate("/obligations")}
        />
        <KPICard
          title="At Risk"
          value={kpiData.atRiskObligations}
          icon={AlertTriangle}
          alert={kpiData.atRiskObligations > 0}
          onClick={() => navigate("/obligations")}
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => (
          <Button
            key={filter}
            variant="outline"
            size="sm"
            className="text-xs h-7 rounded-full"
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compliance + Activity */}
        <div className="lg:col-span-4 space-y-6">
          <ObligationAlerts />
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-[300px] pr-3">
                {activityFeed.map((item) => (
                  <ActivityRow key={item.id} item={item} />
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Contract Families */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Healthcare Provider Families</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1"
              onClick={() => navigate("/families")}
            >
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {families.map((family) => (
              <FamilyCard key={family.id} family={family} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
