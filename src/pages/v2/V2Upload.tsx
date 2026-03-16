import { useState, useRef } from "react";
import {
  ScanLine, Upload, FileText, CheckCircle2, XCircle, Clock, Loader2,
  AlertTriangle, Eye, Trash2, RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { uploadedDocuments, type UploadedDocument } from "@/data/v2-mock-data";
import { toast } from "@/hooks/use-toast";

const stageLabels = ["Queued", "OCR", "AI Extraction", "Review", "Complete"];
const stageKeys = ["queued", "ocr_processing", "ai_extraction", "review", "completed"];

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string; badgeClass: string }> = {
  queued: { label: "Queued", icon: Clock, color: "text-muted-foreground", badgeClass: "bg-muted text-muted-foreground" },
  ocr_processing: { label: "OCR Processing", icon: Loader2, color: "text-status-info", badgeClass: "bg-status-info/10 text-status-info" },
  ai_extraction: { label: "AI Extraction", icon: Loader2, color: "text-status-pending", badgeClass: "bg-status-pending/10 text-status-pending" },
  review: { label: "Ready for Review", icon: Eye, color: "text-status-warning", badgeClass: "bg-status-warning/10 text-status-warning" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-confidence-high", badgeClass: "bg-confidence-high/10 text-confidence-high" },
  failed: { label: "Failed", icon: XCircle, color: "text-destructive", badgeClass: "bg-destructive/10 text-destructive" },
};

function PipelineStage({ doc }: { doc: UploadedDocument }) {
  const currentIdx = stageKeys.indexOf(doc.status);
  return (
    <div className="flex items-center gap-1">
      {stageLabels.map((label, i) => {
        const isComplete = i < currentIdx || doc.status === "completed";
        const isCurrent = i === currentIdx && doc.status !== "completed" && doc.status !== "failed";
        return (
          <div key={label} className="flex items-center gap-1">
            <div className={`h-2 w-2 rounded-full ${isComplete ? "bg-confidence-high" : isCurrent ? "bg-status-info animate-pulse" : "bg-muted"}`} />
            {i < stageLabels.length - 1 && <div className={`h-[1px] w-4 ${isComplete ? "bg-confidence-high" : "bg-muted"}`} />}
          </div>
        );
      })}
    </div>
  );
}

export default function V2Upload() {
  const [documents, setDocuments] = useState(uploadedDocuments);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    const newDoc: UploadedDocument = {
      id: `DOC${String(documents.length + 1).padStart(3, "0")}`,
      fileName: `New_Contract_${Date.now()}.pdf`,
      uploadDate: new Date().toISOString().split("T")[0],
      size: "2.4 MB",
      status: "queued",
      progress: 0,
      uploadedBy: "Admin",
    };
    setDocuments(prev => [newDoc, ...prev]);
    toast({ title: "Document uploaded", description: "Processing will begin shortly." });
  };

  const summary = {
    total: documents.length,
    processing: documents.filter(d => !["completed", "failed"].includes(d.status)).length,
    completed: documents.filter(d => d.status === "completed").length,
    failed: documents.filter(d => d.status === "failed").length,
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <ScanLine className="h-5 w-5 text-primary" />Legacy Contract Digitization
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Upload and process legacy healthcare contracts through the AI extraction pipeline</p>
        </div>
        <Button size="sm" className="text-xs gap-1.5" onClick={handleUpload}>
          <Upload className="h-3.5 w-3.5" />Upload Contracts
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Documents", value: summary.total, icon: FileText, color: "" },
          { label: "Processing", value: summary.processing, icon: Loader2, color: "text-status-info" },
          { label: "Completed", value: summary.completed, icon: CheckCircle2, color: "text-confidence-high" },
          { label: "Failed", value: summary.failed, icon: XCircle, color: "text-destructive" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-lg p-2 bg-primary/10">
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

      {/* Upload Drop Zone */}
      <Card className="border-dashed border-2 hover:border-primary/30 transition-colors cursor-pointer" onClick={handleUpload}>
        <CardContent className="p-8 text-center">
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium">Drop legacy contracts here or click to upload</p>
          <p className="text-[10px] text-muted-foreground mt-1">Supports PDF, DOCX, TIFF · Max 50MB per file</p>
        </CardContent>
      </Card>

      {/* Pipeline Legend */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
        <span className="font-semibold text-foreground">Pipeline:</span>
        {stageLabels.map((label, i) => (
          <span key={label} className="flex items-center gap-1">
            <div className={`h-2 w-2 rounded-full ${i === 0 ? "bg-muted" : i === stageLabels.length - 1 ? "bg-confidence-high" : "bg-status-info"}`} />
            {label}
          </span>
        ))}
      </div>

      {/* Documents Table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-muted-foreground">Document</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Pipeline</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Progress</th>
                <th className="text-center p-3 font-medium text-muted-foreground">OCR Confidence</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Clauses</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => {
                const config = statusConfig[doc.status];
                const StatusIcon = config.icon;
                return (
                  <tr key={doc.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div>
                          <p className="font-medium truncate max-w-[220px]">{doc.fileName}</p>
                          <p className="text-[10px] text-muted-foreground">{doc.size} · {doc.uploadedBy} · {doc.uploadDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center"><PipelineStage doc={doc} /></div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2 justify-center">
                        <Progress value={doc.progress} className="h-1.5 w-16" />
                        <span className="text-[10px] text-muted-foreground w-7">{doc.progress}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      {doc.ocrConfidence ? (
                        <span className={`font-semibold ${doc.ocrConfidence >= 90 ? "text-confidence-high" : doc.ocrConfidence >= 80 ? "text-confidence-medium" : "text-destructive"}`}>
                          {doc.ocrConfidence}%
                        </span>
                      ) : "—"}
                    </td>
                    <td className="p-3 text-center">{doc.extractedClauses || "—"}</td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className={`text-[10px] ${config.badgeClass}`}>
                        <StatusIcon className={`h-3 w-3 mr-1 ${doc.status === "ocr_processing" || doc.status === "ai_extraction" ? "animate-spin" : ""}`} />
                        {config.label}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {doc.status === "review" && (
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                        )}
                        {doc.status === "failed" && (
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><RefreshCw className="h-3 w-3" /></Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
