import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileStack, Search, Filter, SortAsc, ArrowRight, FileText,
  Clock, DollarSign, AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { v2Contracts, type ContractStatus, type ContractType } from "@/data/v2-mock-data";

const statusStyle: Record<string, string> = {
  executed: "bg-confidence-high/10 text-confidence-high border-confidence-high/20",
  in_review: "bg-status-warning/10 text-status-warning border-status-warning/20",
  draft: "bg-status-info/10 text-status-info border-status-info/20",
  approved: "bg-confidence-high/10 text-confidence-high border-confidence-high/20",
  expired: "bg-muted text-muted-foreground border-border",
  terminated: "bg-destructive/10 text-destructive border-destructive/20",
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

export default function V2Contracts() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = v2Contracts.filter(c => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.counterparty.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <FileStack className="h-5 w-5 text-primary" />Contract Library
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">{v2Contracts.length} contracts · Healthcare provider agreements</p>
        </div>
        <Button size="sm" className="text-xs gap-1.5" onClick={() => navigate("/v2/drafting")}>
          New Contract <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search contracts..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="executed">Executed</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-8 w-[160px] text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="payer_agreement">Payer Agreement</SelectItem>
            <SelectItem value="provider_network">Provider Network</SelectItem>
            <SelectItem value="baa">BAA</SelectItem>
            <SelectItem value="employment">Employment</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
            <SelectItem value="lease">Facility Lease</SelectItem>
            <SelectItem value="amendment">Amendment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contracts Table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-muted-foreground">Contract</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Counterparty</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Value</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Risk</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Completeness</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Expiration</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer">
                  <td className="p-3">
                    <p className="font-medium truncate max-w-[280px]">{c.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{c.id} · {c.owner}</p>
                  </td>
                  <td className="p-3"><Badge variant="secondary" className="text-[9px]">{typeLabels[c.type]}</Badge></td>
                  <td className="p-3 text-muted-foreground">{c.counterparty}</td>
                  <td className="p-3 text-center font-medium">
                    {c.value > 0 ? `$${(c.value / 1000).toFixed(0)}K` : "—"}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`font-semibold ${c.riskScore <= 25 ? "text-confidence-high" : c.riskScore <= 50 ? "text-confidence-medium" : "text-destructive"}`}>
                      {c.riskScore}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Progress value={c.completeness} className="h-1.5 flex-1" />
                      <span className="text-[10px] text-muted-foreground w-7">{c.completeness}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-center text-muted-foreground">{c.expirationDate}</td>
                  <td className="p-3 text-center">
                    <Badge variant="outline" className={`text-[10px] ${statusStyle[c.status] || ""}`}>
                      {c.status.replace("_", " ")}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-muted-foreground">No contracts match your filters.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
