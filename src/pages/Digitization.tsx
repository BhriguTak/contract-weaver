import { useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertTriangle,
  Eye,
  RotateCcw,
  Plus,
  Filter,
  ScanLine,
  Sparkles,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type PipelineStatus = "queued" | "ocr_processing" | "ai_extraction" | "review" | "completed" | "failed";

interface DigitizedContract {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  source: "scanner" | "email" | "fax" | "manual";
  payer: string;
  contractType: string;
  status: PipelineStatus;
  progress: number;
  ocrConfidence?: number;
  extractedClauses?: number;
  extractedFields?: number;
  error?: string;
  pages: number;
  stage?: string;
}

const mockPipeline: DigitizedContract[] = [
  {
    id: "DIG-001", fileName: "bcbs-provider-agreement-2019.pdf", fileSize: "12.4 MB",
    uploadedBy: "Admin", uploadedAt: "2026-03-13T09:15:00Z", source: "scanner",
    payer: "BlueCross BlueShield", contractType: "Provider Agreement",
    status: "completed", progress: 100, ocrConfidence: 94, extractedClauses: 28,
    extractedFields: 156, pages: 42,
  },
  {
    id: "DIG-002", fileName: "aetna-reimbursement-schedule-2020.pdf", fileSize: "8.7 MB",
    uploadedBy: "Admin", uploadedAt: "2026-03-13T09:30:00Z", source: "scanner",
    payer: "Aetna", contractType: "Reimbursement Schedule",
    status: "completed", progress: 100, ocrConfidence: 89, extractedClauses: 15,
    extractedFields: 92, pages: 28,
  },
  {
    id: "DIG-003", fileName: "unitedhealth-baa-amendment-2021.tiff", fileSize: "18.2 MB",
    uploadedBy: "Dr. Rebecca Thornton", uploadedAt: "2026-03-13T10:00:00Z", source: "fax",
    payer: "UnitedHealth Group", contractType: "BAA Amendment",
    status: "ai_extraction", progress: 68, ocrConfidence: 82, pages: 15,
    stage: "Extracting HIPAA clauses...",
  },
  {
    id: "DIG-004", fileName: "cigna-capitation-agreement-2018.pdf", fileSize: "22.1 MB",
    uploadedBy: "Admin", uploadedAt: "2026-03-13T10:15:00Z", source: "manual",
    payer: "Cigna", contractType: "Capitation Agreement",
    status: "ocr_processing", progress: 34, pages: 56,
    stage: "OCR scanning page 19 of 56...",
  },
  {
    id: "DIG-005", fileName: "humana-telehealth-addendum.jpg", fileSize: "4.5 MB",
    uploadedBy: "Lisa Tran", uploadedAt: "2026-03-13T10:30:00Z", source: "email",
    payer: "Humana", contractType: "Telehealth Addendum",
    status: "queued", progress: 0, pages: 8,
  },
  {
    id: "DIG-006", fileName: "medicaid-fee-schedule-2017-scan.pdf", fileSize: "35.6 MB",
    uploadedBy: "Admin", uploadedAt: "2026-03-12T14:00:00Z", source: "scanner",
    payer: "Medicaid (State)", contractType: "Fee Schedule",
    status: "failed", progress: 22, pages: 88,
    error: "OCR failed — pages 45-88 are illegible (faded ink, poor scan quality)",
  },
  {
    id: "DIG-007", fileName: "tricare-network-participation-2019.pdf", fileSize: "6.9 MB",
    uploadedBy: "Admin", uploadedAt: "2026-03-12T16:00:00Z", source: "scanner",
    payer: "TRICARE", contractType: "Network Participation",
    status: "review", progress: 95, ocrConfidence: 76, extractedClauses: 19,
    extractedFields: 78, pages: 22,
    stage: "Low confidence — needs human review",
  },
  {
    id: "DIG-008", fileName: "bcbs-credentialing-attachment-2020.pdf", fileSize: "3.2 MB",
    uploadedBy: "David Park", uploadedAt: "2026-03-12T11:00:00Z", source: "email",
    payer: "BlueCross BlueShield", contractType: "Credentialing",
    status: "completed", progress: 100, ocrConfidence: 97, extractedClauses: 8,
    extractedFields: 44, pages: 12,
  },
];

const statusConfig: Record<PipelineStatus, { label: string; icon: React.ElementType; color: string }> = {
  queued: { label: "Queued", icon: Clock, color: "bg-muted text-muted-foreground" },
  ocr_processing: { label: "OCR Scanning", icon: ScanLine, color: "bg-status-info/10 text-status-info" },
  ai_extraction: { label: "AI Extraction", icon: Sparkles, color: "bg-primary/10 text-primary" },
  review: { label: "Needs Review", icon: AlertTriangle, color: "bg-confidence-medium/10 text-confidence-medium" },
  completed: { label: "Completed", icon: CheckCircle2, color: "bg-confidence-high/10 text-confidence-high" },
  failed: { label: "Failed", icon: XCircle, color: "bg-destructive/10 text-destructive" },
};

function PipelineStats() {
  const total = mockPipeline.length;
  const completed = mockPipeline.filter(d => d.status === "completed").length;
  const processing = mockPipeline.filter(d => ["ocr_processing", "ai_extraction"].includes(d.status)).length;
  const failed = mockPipeline.filter(d => d.status === "failed").length;
  const review = mockPipeline.filter(d => d.status === "review").length;
  const totalPages = mockPipeline.reduce((sum, d) => sum + d.pages, 0);
  const avgConfidence = Math.round(
    mockPipeline.filter(d => d.ocrConfidence).reduce((sum, d) => sum + (d.ocrConfidence || 0), 0) /
    mockPipeline.filter(d => d.ocrConfidence).length
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {[
        { label: "Total Documents", value: total, icon: FileText, accent: false },
        { label: "Completed", value: completed, icon: CheckCircle2, accent: false },
        { label: "Processing", value: processing, icon: Loader2, accent: false },
        { label: "Needs Review", value: review, icon: AlertTriangle, accent: true },
        { label: "Failed", value: failed, icon: XCircle, accent: true },
        { label: "Avg OCR Score", value: `${avgConfidence}%`, icon: ScanLine, accent: false },
      ].map((stat, i) => (
        <Card key={i}>
          <CardContent className="p-3.5">
            <div className="flex items-center gap-2">
              <div className={`rounded-md p-1.5 ${stat.accent ? "bg-destructive/10" : "bg-primary/10"}`}>
                <stat.icon className={`h-3.5 w-3.5 ${stat.accent ? "text-destructive" : "text-primary"}`} />
              </div>
              <div>
                <p className="text-lg font-bold leading-tight">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function Digitization() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockPipeline.filter(doc => {
    if (filterStatus !== "all" && doc.status !== filterStatus) return false;
    if (searchQuery && !doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) && !doc.payer.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ScanLine className="h-6 w-6 text-primary" />
            Legacy Contract Digitization
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            OCR + AI pipeline for converting legacy payer contracts into structured data
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Legacy Contracts
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload Legacy Contracts</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium">Drop scanned contracts here</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, TIFF, JPG, PNG — up to 50MB per file
                </p>
                <Button variant="outline" size="sm" className="mt-3 text-xs">
                  Browse Files
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Payer</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select payer..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bcbs">BlueCross BlueShield</SelectItem>
                      <SelectItem value="aetna">Aetna</SelectItem>
                      <SelectItem value="united">UnitedHealth Group</SelectItem>
                      <SelectItem value="cigna">Cigna</SelectItem>
                      <SelectItem value="humana">Humana</SelectItem>
                      <SelectItem value="medicaid">Medicaid (State)</SelectItem>
                      <SelectItem value="medicare">Medicare</SelectItem>
                      <SelectItem value="tricare">TRICARE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Contract Type</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Auto-detect" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                      <SelectItem value="provider">Provider Agreement</SelectItem>
                      <SelectItem value="reimbursement">Reimbursement Schedule</SelectItem>
                      <SelectItem value="capitation">Capitation Agreement</SelectItem>
                      <SelectItem value="baa">BAA / HIPAA</SelectItem>
                      <SelectItem value="credentialing">Credentialing</SelectItem>
                      <SelectItem value="fee-schedule">Fee Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Source</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select source..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scanner">Physical Scanner</SelectItem>
                      <SelectItem value="email">Email Attachment</SelectItem>
                      <SelectItem value="fax">Fax</SelectItem>
                      <SelectItem value="manual">Manual Upload</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Shield className="h-4 w-4 text-primary shrink-0" />
                <p className="text-[11px] text-muted-foreground">
                  All uploaded documents are encrypted at rest (AES-256) and processed in a HIPAA-compliant environment.
                </p>
              </div>

              <Button className="w-full gap-2">
                <Upload className="h-4 w-4" />
                Start Digitization Pipeline
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <PipelineStats />

      {/* Pipeline Visualization */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Digitization Pipeline</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs">
                {(["queued", "ocr_processing", "ai_extraction", "review", "completed"] as PipelineStatus[]).map(s => {
                  const cfg = statusConfig[s];
                  return (
                    <div key={s} className="flex items-center gap-1">
                      <div className={`h-2 w-2 rounded-full ${s === "completed" ? "bg-confidence-high" : s === "review" ? "bg-confidence-medium" : s === "queued" ? "bg-muted-foreground/40" : "bg-primary"}`} />
                      <span className="text-muted-foreground">{cfg.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-muted">
            {(() => {
              const total = mockPipeline.length;
              const counts = {
                completed: mockPipeline.filter(d => d.status === "completed").length,
                review: mockPipeline.filter(d => d.status === "review").length,
                ai_extraction: mockPipeline.filter(d => d.status === "ai_extraction").length,
                ocr_processing: mockPipeline.filter(d => d.status === "ocr_processing").length,
                queued: mockPipeline.filter(d => d.status === "queued").length,
                failed: mockPipeline.filter(d => d.status === "failed").length,
              };
              return (
                <>
                  <div className="bg-confidence-high transition-all" style={{ width: `${(counts.completed / total) * 100}%` }} />
                  <div className="bg-confidence-medium transition-all" style={{ width: `${(counts.review / total) * 100}%` }} />
                  <div className="bg-primary transition-all" style={{ width: `${(counts.ai_extraction / total) * 100}%` }} />
                  <div className="bg-status-info transition-all" style={{ width: `${(counts.ocr_processing / total) * 100}%` }} />
                  <div className="bg-muted-foreground/30 transition-all" style={{ width: `${(counts.queued / total) * 100}%` }} />
                  <div className="bg-destructive transition-all" style={{ width: `${(counts.failed / total) * 100}%` }} />
                </>
              );
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base">Document Queue</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-8 w-[200px] text-xs pl-8"
                />
                <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-8 w-[140px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="queued">Queued</SelectItem>
                  <SelectItem value="ocr_processing">OCR Scanning</SelectItem>
                  <SelectItem value="ai_extraction">AI Extraction</SelectItem>
                  <SelectItem value="review">Needs Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Document</TableHead>
                  <TableHead className="text-xs">Payer</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Source</TableHead>
                  <TableHead className="text-xs">Pages</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">OCR Score</TableHead>
                  <TableHead className="text-xs">Progress</TableHead>
                  <TableHead className="text-xs w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(doc => {
                  const cfg = statusConfig[doc.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <TableRow key={doc.id}>
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate max-w-[200px]">{doc.fileName}</p>
                            <p className="text-[10px] text-muted-foreground">{doc.fileSize} · {doc.uploadedBy}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <span className="text-xs">{doc.payer}</span>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Badge variant="secondary" className="text-[10px] font-normal">
                          {doc.contractType}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <span className="text-xs text-muted-foreground capitalize">{doc.source}</span>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <span className="text-xs text-muted-foreground">{doc.pages}</span>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Badge variant="outline" className={`text-[10px] gap-1 ${cfg.color}`}>
                          <StatusIcon className="h-2.5 w-2.5" />
                          {cfg.label}
                        </Badge>
                        {doc.stage && (
                          <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[160px] truncate">{doc.stage}</p>
                        )}
                        {doc.error && (
                          <p className="text-[10px] text-destructive mt-0.5 max-w-[160px] truncate">{doc.error}</p>
                        )}
                      </TableCell>
                      <TableCell className="py-2.5">
                        {doc.ocrConfidence ? (
                          <span className={`text-xs font-medium ${doc.ocrConfidence >= 90 ? "text-confidence-high" : doc.ocrConfidence >= 80 ? "text-confidence-medium" : "text-destructive"}`}>
                            {doc.ocrConfidence}%
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="w-20">
                          <Progress value={doc.progress} className="h-1.5" />
                          <p className="text-[10px] text-muted-foreground mt-0.5">{doc.progress}%</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-1">
                          {doc.status === "completed" && (
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                          {doc.status === "failed" && (
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
