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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  kpiData,
  families,
  activityFeed,
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
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: string;
  onClick?: () => void;
}) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
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
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Icon className="h-5 w-5 text-primary" />
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
  "All MSAs with pending amendments",
  "Failed extractions",
  "Expiring within 90 days",
  "Low confidence clauses",
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Contract intelligence overview
          </p>
        </div>
        <Button onClick={() => navigate("/upload")} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Contracts
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Contracts"
          value={kpiData.totalContracts}
          icon={FileText}
          trend="+3 this month"
        />
        <KPICard
          title="Contract Families"
          value={kpiData.totalFamilies}
          icon={FolderTree}
        />
        <KPICard
          title="Pending Reviews"
          value={kpiData.pendingReviews}
          icon={AlertTriangle}
        />
        <KPICard
          title="Processing Errors"
          value={kpiData.processingErrors}
          icon={XCircle}
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

      {/* Main Content: Activity + Families */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[400px] pr-3">
              {activityFeed.map((item) => (
                <ActivityRow key={item.id} item={item} />
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Contract Families */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Contract Families</h2>
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
