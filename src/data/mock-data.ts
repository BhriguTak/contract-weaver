// ─── Types ───────────────────────────────────────────────────────────────────

export type ContractType = "MSA" | "Amendment" | "SOW" | "NDA" | "SLA";
export type ContractStatus = "active" | "expired" | "pending_review" | "draft" | "processing" | "failed";
export type ClauseType = "Termination" | "Payment Terms" | "Liability" | "Confidentiality" | "Indemnification" | "Governing Law" | "Force Majeure" | "Assignment" | "Dispute Resolution" | "Intellectual Property" | "Warranty" | "Insurance" | "Non-Compete" | "Data Protection";
export type ConfidenceLevel = "high" | "medium" | "low";
export type DiffType = "added" | "removed" | "modified" | "moved" | "unchanged";
export type ActivityType = "upload" | "extraction" | "review" | "comparison" | "comment";

export interface Contract {
  id: string;
  familyId: string;
  title: string;
  type: ContractType;
  status: ContractStatus;
  parties: string[];
  effectiveDate: string;
  terminationDate: string;
  signer: string;
  jurisdiction: string;
  version: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  confidenceScore: number;
  clauseCount: number;
}

export interface ContractFamily {
  id: string;
  name: string;
  primaryCounterparty: string;
  jurisdiction: string;
  dateRange: string;
  documentCount: number;
  tags: string[];
  lastActivity: string;
  status: ContractStatus;
  contracts: string[];
}

export interface Clause {
  id: string;
  contractId: string;
  type: ClauseType;
  text: string;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  obligations: string[];
  keyDates: string[];
  monetaryValues: string[];
  partyNames: string[];
  startOffset: number;
  endOffset: number;
}

export interface ClauseDiff {
  baseClauseId: string | null;
  compClauseId: string | null;
  baseText: string;
  compText: string;
  clauseType: ClauseType;
  diffType: DiffType;
  changes: { type: "add" | "remove" | "equal"; text: string }[];
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  contractId?: string;
  familyId?: string;
  user: string;
}

export interface UploadItem {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  status: "queued" | "processing" | "complete" | "failed";
  progress: number;
  parsingProfile: string;
  extractedParties?: string[];
  contractDate?: string;
  contractType?: ContractType;
  confidenceScore?: number;
  error?: string;
  elapsedTime?: string;
}

// ─── Mock Contracts ──────────────────────────────────────────────────────────

export const contracts: Contract[] = [
  {
    id: "CTR-001",
    familyId: "FAM-001",
    title: "Master Services Agreement — Acme Corp & TechVentures Inc.",
    type: "MSA",
    status: "active",
    parties: ["Acme Corp", "TechVentures Inc."],
    effectiveDate: "2023-01-15",
    terminationDate: "2026-01-15",
    signer: "Jane Mitchell, VP Legal",
    jurisdiction: "Delaware, USA",
    version: "1.0",
    fileName: "acme-techventures-msa-v1.pdf",
    fileSize: "2.4 MB",
    uploadedAt: "2025-11-20T09:30:00Z",
    confidenceScore: 94,
    clauseCount: 18,
  },
  {
    id: "CTR-002",
    familyId: "FAM-001",
    title: "Amendment No. 1 — Acme Corp & TechVentures Inc.",
    type: "Amendment",
    status: "active",
    parties: ["Acme Corp", "TechVentures Inc."],
    effectiveDate: "2023-09-01",
    terminationDate: "2026-01-15",
    signer: "Jane Mitchell, VP Legal",
    jurisdiction: "Delaware, USA",
    version: "1.1",
    fileName: "acme-techventures-amd1.pdf",
    fileSize: "890 KB",
    uploadedAt: "2025-11-20T09:35:00Z",
    confidenceScore: 91,
    clauseCount: 6,
  },
  {
    id: "CTR-003",
    familyId: "FAM-001",
    title: "Amendment No. 2 — Acme Corp & TechVentures Inc.",
    type: "Amendment",
    status: "pending_review",
    parties: ["Acme Corp", "TechVentures Inc."],
    effectiveDate: "2024-03-15",
    terminationDate: "2026-01-15",
    signer: "Robert Chen, General Counsel",
    jurisdiction: "Delaware, USA",
    version: "1.2",
    fileName: "acme-techventures-amd2.pdf",
    fileSize: "1.1 MB",
    uploadedAt: "2025-12-01T14:20:00Z",
    confidenceScore: 87,
    clauseCount: 8,
  },
  {
    id: "CTR-004",
    familyId: "FAM-001",
    title: "Statement of Work #1 — Cloud Migration",
    type: "SOW",
    status: "active",
    parties: ["Acme Corp", "TechVentures Inc."],
    effectiveDate: "2023-04-01",
    terminationDate: "2024-03-31",
    signer: "Sarah Lopez, Project Director",
    jurisdiction: "Delaware, USA",
    version: "1.0",
    fileName: "acme-techventures-sow1.pdf",
    fileSize: "1.8 MB",
    uploadedAt: "2025-11-20T09:40:00Z",
    confidenceScore: 92,
    clauseCount: 12,
  },
  {
    id: "CTR-005",
    familyId: "FAM-002",
    title: "Master Services Agreement — GlobalBank & SecureIT Ltd.",
    type: "MSA",
    status: "active",
    parties: ["GlobalBank", "SecureIT Ltd."],
    effectiveDate: "2024-06-01",
    terminationDate: "2027-06-01",
    signer: "David Park, Chief Legal Officer",
    jurisdiction: "New York, USA",
    version: "1.0",
    fileName: "globalbank-secureit-msa.pdf",
    fileSize: "3.1 MB",
    uploadedAt: "2025-12-05T10:00:00Z",
    confidenceScore: 96,
    clauseCount: 22,
  },
  {
    id: "CTR-006",
    familyId: "FAM-002",
    title: "Amendment No. 1 — GlobalBank & SecureIT Ltd.",
    type: "Amendment",
    status: "active",
    parties: ["GlobalBank", "SecureIT Ltd."],
    effectiveDate: "2025-01-15",
    terminationDate: "2027-06-01",
    signer: "David Park, Chief Legal Officer",
    jurisdiction: "New York, USA",
    version: "1.1",
    fileName: "globalbank-secureit-amd1.pdf",
    fileSize: "720 KB",
    uploadedAt: "2025-12-10T11:30:00Z",
    confidenceScore: 89,
    clauseCount: 5,
  },
  {
    id: "CTR-007",
    familyId: "FAM-003",
    title: "Non-Disclosure Agreement — Meridian Health & DataPulse",
    type: "NDA",
    status: "active",
    parties: ["Meridian Health", "DataPulse Analytics"],
    effectiveDate: "2025-02-01",
    terminationDate: "2028-02-01",
    signer: "Lisa Tran, VP Operations",
    jurisdiction: "California, USA",
    version: "1.0",
    fileName: "meridian-datapulse-nda.pdf",
    fileSize: "540 KB",
    uploadedAt: "2025-12-15T08:45:00Z",
    confidenceScore: 97,
    clauseCount: 10,
  },
  {
    id: "CTR-008",
    familyId: "FAM-003",
    title: "SLA — Meridian Health & DataPulse Analytics",
    type: "SLA",
    status: "pending_review",
    parties: ["Meridian Health", "DataPulse Analytics"],
    effectiveDate: "2025-03-01",
    terminationDate: "2026-03-01",
    signer: "Lisa Tran, VP Operations",
    jurisdiction: "California, USA",
    version: "1.0",
    fileName: "meridian-datapulse-sla.pdf",
    fileSize: "1.5 MB",
    uploadedAt: "2025-12-18T16:10:00Z",
    confidenceScore: 83,
    clauseCount: 14,
  },
  {
    id: "CTR-009",
    familyId: "FAM-004",
    title: "MSA — Sterling Manufacturing & LogiFlow",
    type: "MSA",
    status: "expired",
    parties: ["Sterling Manufacturing", "LogiFlow Systems"],
    effectiveDate: "2022-07-01",
    terminationDate: "2025-07-01",
    signer: "Mark Johnson, COO",
    jurisdiction: "Illinois, USA",
    version: "1.0",
    fileName: "sterling-logiflow-msa.pdf",
    fileSize: "2.7 MB",
    uploadedAt: "2025-10-01T12:00:00Z",
    confidenceScore: 90,
    clauseCount: 20,
  },
  {
    id: "CTR-010",
    familyId: "FAM-004",
    title: "SOW — Supply Chain Optimization",
    type: "SOW",
    status: "expired",
    parties: ["Sterling Manufacturing", "LogiFlow Systems"],
    effectiveDate: "2022-09-15",
    terminationDate: "2023-09-14",
    signer: "Mark Johnson, COO",
    jurisdiction: "Illinois, USA",
    version: "1.0",
    fileName: "sterling-logiflow-sow.pdf",
    fileSize: "1.3 MB",
    uploadedAt: "2025-10-01T12:05:00Z",
    confidenceScore: 88,
    clauseCount: 11,
  },
  {
    id: "CTR-011",
    familyId: "FAM-004",
    title: "Amendment No. 1 — Sterling Manufacturing & LogiFlow",
    type: "Amendment",
    status: "expired",
    parties: ["Sterling Manufacturing", "LogiFlow Systems"],
    effectiveDate: "2023-07-01",
    terminationDate: "2025-07-01",
    signer: "Mark Johnson, COO",
    jurisdiction: "Illinois, USA",
    version: "1.1",
    fileName: "sterling-logiflow-amd1.pdf",
    fileSize: "650 KB",
    uploadedAt: "2025-10-01T12:10:00Z",
    confidenceScore: 85,
    clauseCount: 4,
  },
  {
    id: "CTR-012",
    familyId: "FAM-002",
    title: "SOW — Cybersecurity Audit Phase 1",
    type: "SOW",
    status: "active",
    parties: ["GlobalBank", "SecureIT Ltd."],
    effectiveDate: "2024-09-01",
    terminationDate: "2025-08-31",
    signer: "David Park, Chief Legal Officer",
    jurisdiction: "New York, USA",
    version: "1.0",
    fileName: "globalbank-secureit-sow1.pdf",
    fileSize: "2.0 MB",
    uploadedAt: "2025-12-05T10:15:00Z",
    confidenceScore: 93,
    clauseCount: 15,
  },
  {
    id: "CTR-013",
    familyId: "FAM-001",
    title: "SOW #2 — Data Analytics Platform",
    type: "SOW",
    status: "draft",
    parties: ["Acme Corp", "TechVentures Inc."],
    effectiveDate: "2024-06-01",
    terminationDate: "2025-05-31",
    signer: "Jane Mitchell, VP Legal",
    jurisdiction: "Delaware, USA",
    version: "1.0",
    fileName: "acme-techventures-sow2.pdf",
    fileSize: "1.6 MB",
    uploadedAt: "2026-01-10T11:00:00Z",
    confidenceScore: 79,
    clauseCount: 13,
  },
  {
    id: "CTR-014",
    familyId: "FAM-003",
    title: "MSA — Meridian Health & DataPulse Analytics",
    type: "MSA",
    status: "active",
    parties: ["Meridian Health", "DataPulse Analytics"],
    effectiveDate: "2025-01-01",
    terminationDate: "2028-01-01",
    signer: "Lisa Tran, VP Operations",
    jurisdiction: "California, USA",
    version: "1.0",
    fileName: "meridian-datapulse-msa.pdf",
    fileSize: "2.9 MB",
    uploadedAt: "2025-12-12T09:00:00Z",
    confidenceScore: 95,
    clauseCount: 19,
  },
];

// ─── Mock Families ───────────────────────────────────────────────────────────

export const families: ContractFamily[] = [
  {
    id: "FAM-001",
    name: "Acme Corp — TechVentures Inc.",
    primaryCounterparty: "TechVentures Inc.",
    jurisdiction: "Delaware, USA",
    dateRange: "Jan 2023 — Jan 2026",
    documentCount: 5,
    tags: ["Cloud Services", "IT Outsourcing", "Priority"],
    lastActivity: "2026-01-10T11:00:00Z",
    status: "active",
    contracts: ["CTR-001", "CTR-002", "CTR-003", "CTR-004", "CTR-013"],
  },
  {
    id: "FAM-002",
    name: "GlobalBank — SecureIT Ltd.",
    primaryCounterparty: "SecureIT Ltd.",
    jurisdiction: "New York, USA",
    dateRange: "Jun 2024 — Jun 2027",
    documentCount: 3,
    tags: ["Cybersecurity", "Financial Services"],
    lastActivity: "2025-12-10T11:30:00Z",
    status: "active",
    contracts: ["CTR-005", "CTR-006", "CTR-012"],
  },
  {
    id: "FAM-003",
    name: "Meridian Health — DataPulse Analytics",
    primaryCounterparty: "DataPulse Analytics",
    jurisdiction: "California, USA",
    dateRange: "Jan 2025 — Feb 2028",
    documentCount: 3,
    tags: ["Healthcare", "Data Analytics", "Under Review"],
    lastActivity: "2025-12-18T16:10:00Z",
    status: "pending_review",
    contracts: ["CTR-007", "CTR-008", "CTR-014"],
  },
  {
    id: "FAM-004",
    name: "Sterling Manufacturing — LogiFlow Systems",
    primaryCounterparty: "LogiFlow Systems",
    jurisdiction: "Illinois, USA",
    dateRange: "Jul 2022 — Jul 2025",
    documentCount: 3,
    tags: ["Supply Chain", "Manufacturing", "Expired"],
    lastActivity: "2025-10-01T12:10:00Z",
    status: "expired",
    contracts: ["CTR-009", "CTR-010", "CTR-011"],
  },
];

// ─── Mock Activity Feed ──────────────────────────────────────────────────────

export const activityFeed: ActivityItem[] = [
  { id: "ACT-001", type: "upload", title: "SOW #2 uploaded", description: "acme-techventures-sow2.pdf uploaded for processing", timestamp: "2026-01-10T11:00:00Z", contractId: "CTR-013", familyId: "FAM-001", user: "Jane Mitchell" },
  { id: "ACT-002", type: "extraction", title: "Extraction complete", description: "Amendment No. 2 (Acme Corp) fully parsed — 8 clauses extracted", timestamp: "2025-12-01T14:45:00Z", contractId: "CTR-003", familyId: "FAM-001", user: "System" },
  { id: "ACT-003", type: "review", title: "Review requested", description: "SLA (Meridian Health) flagged for manual review — low confidence on 3 clauses", timestamp: "2025-12-18T16:30:00Z", contractId: "CTR-008", familyId: "FAM-003", user: "Lisa Tran" },
  { id: "ACT-004", type: "comparison", title: "Diff generated", description: "Comparison between MSA v1.0 and Amendment No. 1 (GlobalBank) completed", timestamp: "2025-12-10T12:00:00Z", contractId: "CTR-006", familyId: "FAM-002", user: "David Park" },
  { id: "ACT-005", type: "upload", title: "Bulk upload completed", description: "3 files for Sterling Manufacturing family uploaded successfully", timestamp: "2025-10-01T12:15:00Z", familyId: "FAM-004", user: "Mark Johnson" },
  { id: "ACT-006", type: "comment", title: "Comment added", description: "Note on Termination clause: 'Confirm 90-day notice aligns with Amendment 2'", timestamp: "2025-12-02T09:15:00Z", contractId: "CTR-003", familyId: "FAM-001", user: "Robert Chen" },
  { id: "ACT-007", type: "extraction", title: "Low confidence warning", description: "SOW #2 extraction has 3 clauses below 80% confidence threshold", timestamp: "2026-01-10T11:30:00Z", contractId: "CTR-013", familyId: "FAM-001", user: "System" },
  { id: "ACT-008", type: "review", title: "Review approved", description: "Amendment No. 1 (Acme Corp) review completed and approved", timestamp: "2025-11-25T10:00:00Z", contractId: "CTR-002", familyId: "FAM-001", user: "Jane Mitchell" },
];

// ─── Mock Upload Queue ───────────────────────────────────────────────────────

export const uploadQueue: UploadItem[] = [
  { id: "UPL-001", fileName: "vendor-agreement-v3.pdf", fileSize: "2.1 MB", fileType: "PDF", status: "complete", progress: 100, parsingProfile: "Auto-detect", extractedParties: ["Vendor Co.", "BuyerCorp"], contractDate: "2025-11-01", contractType: "MSA", confidenceScore: 93, elapsedTime: "12s" },
  { id: "UPL-002", fileName: "nda-supplement.docx", fileSize: "450 KB", fileType: "DOCX", status: "processing", progress: 65, parsingProfile: "NDA", elapsedTime: "8s" },
  { id: "UPL-003", fileName: "amendment-draft-4.pdf", fileSize: "1.3 MB", fileType: "PDF", status: "queued", progress: 0, parsingProfile: "Amendment" },
  { id: "UPL-004", fileName: "corrupted-scan.pdf", fileSize: "5.8 MB", fileType: "PDF", status: "failed", progress: 30, parsingProfile: "Auto-detect", error: "Unable to extract text — document appears to be a scanned image without OCR", elapsedTime: "45s" },
];

// ─── Mock Clauses for CTR-001 (MSA) ─────────────────────────────────────────

export const clausesCTR001: Clause[] = [
  { id: "CL-001-01", contractId: "CTR-001", type: "Termination", text: "Either party may terminate this Agreement upon ninety (90) days' prior written notice to the other party. In the event of a material breach, the non-breaching party may terminate immediately upon written notice if the breach remains uncured for thirty (30) days after receipt of notice specifying the breach.", confidence: 96, confidenceLevel: "high", obligations: ["90-day notice requirement", "30-day cure period"], keyDates: ["90 days prior notice"], monetaryValues: [], partyNames: ["Acme Corp", "TechVentures Inc."], startOffset: 0, endOffset: 450 },
  { id: "CL-001-02", contractId: "CTR-001", type: "Payment Terms", text: "TechVentures Inc. shall invoice Acme Corp on a monthly basis. Payment shall be due within thirty (30) days of receipt of a valid invoice. Late payments shall accrue interest at the rate of 1.5% per month or the maximum rate permitted by law, whichever is less.", confidence: 94, confidenceLevel: "high", obligations: ["Monthly invoicing", "30-day payment window"], keyDates: ["30 days from invoice"], monetaryValues: ["1.5% monthly interest"], partyNames: ["Acme Corp", "TechVentures Inc."], startOffset: 451, endOffset: 800 },
  { id: "CL-001-03", contractId: "CTR-001", type: "Liability", text: "IN NO EVENT SHALL EITHER PARTY'S AGGREGATE LIABILITY UNDER THIS AGREEMENT EXCEED THE TOTAL FEES PAID OR PAYABLE BY ACME CORP IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM. NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR EXEMPLARY DAMAGES.", confidence: 92, confidenceLevel: "high", obligations: ["Liability cap at 12-month fees"], keyDates: [], monetaryValues: ["12-month fee cap"], partyNames: ["Acme Corp"], startOffset: 801, endOffset: 1200 },
  { id: "CL-001-04", contractId: "CTR-001", type: "Confidentiality", text: "Each party agrees to maintain the confidentiality of all Confidential Information received from the other party. Confidential Information shall not be disclosed to any third party without the prior written consent of the disclosing party, except to employees, contractors, or advisors who have a need to know and are bound by obligations of confidentiality no less restrictive than those set forth herein.", confidence: 95, confidenceLevel: "high", obligations: ["Maintain confidentiality", "Written consent for disclosure"], keyDates: [], monetaryValues: [], partyNames: ["Acme Corp", "TechVentures Inc."], startOffset: 1201, endOffset: 1650 },
  { id: "CL-001-05", contractId: "CTR-001", type: "Indemnification", text: "Each party shall indemnify, defend, and hold harmless the other party from and against any third-party claims, damages, losses, and expenses (including reasonable attorneys' fees) arising out of or related to a breach of this Agreement or gross negligence or willful misconduct by the indemnifying party.", confidence: 88, confidenceLevel: "medium", obligations: ["Mutual indemnification", "Defense obligation"], keyDates: [], monetaryValues: [], partyNames: ["Acme Corp", "TechVentures Inc."], startOffset: 1651, endOffset: 2050 },
  { id: "CL-001-06", contractId: "CTR-001", type: "Governing Law", text: "This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of laws principles. Any disputes arising under this Agreement shall be resolved exclusively in the federal or state courts located in Wilmington, Delaware.", confidence: 97, confidenceLevel: "high", obligations: ["Delaware jurisdiction"], keyDates: [], monetaryValues: [], partyNames: [], startOffset: 2051, endOffset: 2400 },
  { id: "CL-001-07", contractId: "CTR-001", type: "Force Majeure", text: "Neither party shall be liable for any delay or failure to perform its obligations under this Agreement due to causes beyond its reasonable control, including but not limited to acts of God, war, terrorism, pandemics, strikes, government actions, or natural disasters, provided that the affected party gives prompt notice and uses commercially reasonable efforts to mitigate the effects.", confidence: 91, confidenceLevel: "high", obligations: ["Prompt notice", "Mitigation efforts"], keyDates: [], monetaryValues: [], partyNames: [], startOffset: 2401, endOffset: 2850 },
  { id: "CL-001-08", contractId: "CTR-001", type: "Intellectual Property", text: "All intellectual property rights in any deliverables created by TechVentures Inc. specifically for Acme Corp under a Statement of Work shall be assigned to Acme Corp upon full payment. TechVentures Inc. retains all rights in its pre-existing intellectual property and general know-how.", confidence: 73, confidenceLevel: "low", obligations: ["IP assignment upon payment", "Pre-existing IP retained"], keyDates: [], monetaryValues: [], partyNames: ["Acme Corp", "TechVentures Inc."], startOffset: 2851, endOffset: 3250 },
];

// ─── Mock Clauses for CTR-002 (Amendment 1) ──────────────────────────────────

export const clausesCTR002: Clause[] = [
  { id: "CL-002-01", contractId: "CTR-002", type: "Termination", text: "Section 8.1 of the Agreement is hereby amended to read: Either party may terminate this Agreement upon sixty (60) days' prior written notice to the other party. In the event of a material breach, the non-breaching party may terminate immediately upon written notice if the breach remains uncured for fifteen (15) days after receipt of notice specifying the breach.", confidence: 94, confidenceLevel: "high", obligations: ["60-day notice requirement (changed from 90)", "15-day cure period (changed from 30)"], keyDates: ["60 days prior notice"], monetaryValues: [], partyNames: ["Acme Corp", "TechVentures Inc."], startOffset: 0, endOffset: 480 },
  { id: "CL-002-02", contractId: "CTR-002", type: "Payment Terms", text: "Section 5.2 is amended: Payment shall be due within forty-five (45) days of receipt of a valid invoice. A 2% early payment discount is available for invoices paid within ten (10) days. Late payments shall accrue interest at the rate of 1.0% per month.", confidence: 92, confidenceLevel: "high", obligations: ["45-day payment window (changed from 30)", "Early payment discount"], keyDates: ["45 days from invoice", "10 days for discount"], monetaryValues: ["2% early payment discount", "1.0% monthly interest (changed from 1.5%)"], partyNames: ["Acme Corp", "TechVentures Inc."], startOffset: 481, endOffset: 850 },
  { id: "CL-002-03", contractId: "CTR-002", type: "Liability", text: "Section 9 is amended: In no event shall either party's aggregate liability under this Agreement exceed two times (2x) the total fees paid or payable by Acme Corp in the twelve (12) months preceding the claim.", confidence: 90, confidenceLevel: "high", obligations: ["Liability cap at 2x 12-month fees (changed from 1x)"], keyDates: [], monetaryValues: ["2x 12-month fee cap"], partyNames: ["Acme Corp"], startOffset: 851, endOffset: 1150 },
  { id: "CL-002-04", contractId: "CTR-002", type: "Data Protection", text: "A new Section 14 is added: TechVentures Inc. shall comply with all applicable data protection laws, including GDPR and CCPA, in the handling of any personal data processed on behalf of Acme Corp. TechVentures Inc. shall implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk.", confidence: 86, confidenceLevel: "medium", obligations: ["GDPR/CCPA compliance", "Security measures implementation"], keyDates: [], monetaryValues: [], partyNames: ["TechVentures Inc.", "Acme Corp"], startOffset: 1151, endOffset: 1550 },
  { id: "CL-002-05", contractId: "CTR-002", type: "Insurance", text: "A new Section 15 is added: TechVentures Inc. shall maintain commercial general liability insurance of not less than $5,000,000 per occurrence and professional liability (E&O) insurance of not less than $2,000,000 per claim throughout the term of this Agreement.", confidence: 93, confidenceLevel: "high", obligations: ["Maintain CGL insurance", "Maintain E&O insurance"], keyDates: [], monetaryValues: ["$5,000,000 CGL per occurrence", "$2,000,000 E&O per claim"], partyNames: ["TechVentures Inc."], startOffset: 1551, endOffset: 1900 },
  { id: "CL-002-06", contractId: "CTR-002", type: "Intellectual Property", text: "Section 12.1 is amended: All intellectual property rights in any deliverables created by TechVentures Inc. specifically for Acme Corp shall be assigned to Acme Corp upon acceptance (rather than upon full payment). TechVentures Inc. grants Acme Corp a perpetual, royalty-free license to use any TechVentures Inc. pre-existing IP incorporated into deliverables.", confidence: 78, confidenceLevel: "low", obligations: ["IP assignment upon acceptance (changed from payment)", "Perpetual license for pre-existing IP (new)"], keyDates: [], monetaryValues: [], partyNames: ["Acme Corp", "TechVentures Inc."], startOffset: 1901, endOffset: 2350 },
];

// ─── Mock Clauses for CTR-004 (SOW #1 — Cloud Migration) ─────────────────────

export const clausesCTR004: Clause[] = [
  { id: "CL-004-01", contractId: "CTR-004", type: "Payment Terms", text: "Acme Corp shall pay TechVentures Inc. a fixed fee of $1,250,000 for the Cloud Migration project, payable in four equal quarterly installments of $312,500 each. The first installment is due within fifteen (15) days of the Effective Date. Subsequent installments are due on the first business day of each calendar quarter.", confidence: 95, confidenceLevel: "high", obligations: ["Quarterly payments of $312,500", "First payment within 15 days"], keyDates: ["15 days from Effective Date", "Quarterly due dates"], monetaryValues: ["$1,250,000 total", "$312,500 per quarter"], partyNames: ["Acme Corp", "TechVentures Inc."], startOffset: 0, endOffset: 420 },
  { id: "CL-004-02", contractId: "CTR-004", type: "Intellectual Property", text: "All cloud architecture designs, migration scripts, automation tools, and documentation produced under this Statement of Work shall be considered 'Work Product' and shall be owned exclusively by Acme Corp upon delivery and acceptance. TechVentures Inc. retains a non-exclusive license to use general methodologies and frameworks developed during the engagement for other clients.", confidence: 89, confidenceLevel: "medium", obligations: ["IP ownership transfers to Acme Corp", "Non-exclusive license retained by TechVentures"], keyDates: [], monetaryValues: [], partyNames: ["Acme Corp", "TechVentures Inc."], startOffset: 421, endOffset: 850 },
  { id: "CL-004-03", contractId: "CTR-004", type: "Termination", text: "Either party may terminate this Statement of Work for convenience upon thirty (30) days' written notice. In the event of termination for convenience by Acme Corp, TechVentures Inc. shall be entitled to payment for all work completed through the effective date of termination, plus any reasonable wind-down costs not to exceed $50,000.", confidence: 93, confidenceLevel: "high", obligations: ["30-day notice for termination", "Payment for completed work", "Wind-down cost cap"], keyDates: ["30 days written notice"], monetaryValues: ["$50,000 wind-down cap"], partyNames: ["Acme Corp", "TechVentures Inc."], startOffset: 851, endOffset: 1280 },
  { id: "CL-004-04", contractId: "CTR-004", type: "Warranty", text: "TechVentures Inc. warrants that all migration services shall be performed in a professional and workmanlike manner consistent with industry standards. TechVentures Inc. further warrants that the migrated systems shall achieve 99.5% uptime within sixty (60) days of go-live. Any defects identified within ninety (90) days of acceptance shall be remediated at no additional cost.", confidence: 91, confidenceLevel: "high", obligations: ["Professional service delivery", "99.5% uptime guarantee", "90-day defect remediation"], keyDates: ["60 days post go-live", "90 days post acceptance"], monetaryValues: [], partyNames: ["TechVentures Inc."], startOffset: 1281, endOffset: 1720 },
  { id: "CL-004-05", contractId: "CTR-004", type: "Liability", text: "TechVentures Inc.'s aggregate liability under this Statement of Work shall not exceed the total fees paid or payable under this SOW. Neither party shall be liable for any loss of data during migration unless caused by gross negligence or willful misconduct, in which case the liable party shall bear full responsibility for data recovery costs.", confidence: 87, confidenceLevel: "medium", obligations: ["Liability cap at total SOW fees", "Data loss liability for gross negligence"], keyDates: [], monetaryValues: ["Total SOW fees cap"], partyNames: ["TechVentures Inc."], startOffset: 1721, endOffset: 2150 },
  { id: "CL-004-06", contractId: "CTR-004", type: "Confidentiality", text: "During the course of the Cloud Migration, TechVentures Inc. personnel may have access to Acme Corp's proprietary systems, data, and infrastructure configurations. All such information shall be treated as Confidential Information under the Master Services Agreement. TechVentures Inc. shall ensure that all personnel with access sign individual confidentiality acknowledgments.", confidence: 94, confidenceLevel: "high", obligations: ["Treat migration data as confidential", "Individual confidentiality acknowledgments"], keyDates: [], monetaryValues: [], partyNames: ["Acme Corp", "TechVentures Inc."], startOffset: 2151, endOffset: 2580 },
  { id: "CL-004-07", contractId: "CTR-004", type: "Force Majeure", text: "Cloud service provider outages lasting more than seventy-two (72) consecutive hours shall constitute a force majeure event under this SOW. In such event, project timelines shall be adjusted day-for-day, and neither party shall be liable for resulting delays. TechVentures Inc. shall maintain documented contingency plans for provider outages.", confidence: 90, confidenceLevel: "high", obligations: ["Timeline adjustment for outages", "Maintain contingency plans"], keyDates: ["72-hour threshold"], monetaryValues: [], partyNames: ["TechVentures Inc."], startOffset: 2581, endOffset: 2980 },
  { id: "CL-004-08", contractId: "CTR-004", type: "Insurance", text: "In addition to the insurance requirements set forth in the MSA, TechVentures Inc. shall maintain cyber liability insurance with a minimum coverage of $3,000,000 per occurrence for the duration of the Cloud Migration project and for twelve (12) months following project completion.", confidence: 92, confidenceLevel: "high", obligations: ["Cyber liability insurance $3M minimum", "Coverage extends 12 months post-completion"], keyDates: ["12 months post-completion"], monetaryValues: ["$3,000,000 cyber liability coverage"], partyNames: ["TechVentures Inc."], startOffset: 2981, endOffset: 3350 },
  { id: "CL-004-09", contractId: "CTR-004", type: "Data Protection", text: "TechVentures Inc. shall implement encryption at rest (AES-256) and in transit (TLS 1.2 or higher) for all data handled during the migration. A detailed data mapping document shall be provided to Acme Corp prior to any data movement. TechVentures Inc. shall conduct a data protection impact assessment and share findings with Acme Corp within thirty (30) days of the Effective Date.", confidence: 88, confidenceLevel: "medium", obligations: ["AES-256 encryption at rest", "TLS 1.2+ in transit", "Data mapping document", "DPIA within 30 days"], keyDates: ["30 days from Effective Date"], monetaryValues: [], partyNames: ["Acme Corp", "TechVentures Inc."], startOffset: 3351, endOffset: 3800 },
  { id: "CL-004-10", contractId: "CTR-004", type: "Dispute Resolution", text: "Any disputes arising under this Statement of Work shall first be submitted to the project steering committee for resolution within fifteen (15) business days. If unresolved, disputes shall be escalated to senior management of both parties. If still unresolved after thirty (30) days, the dispute shall be submitted to binding arbitration in Wilmington, Delaware under the rules of the American Arbitration Association.", confidence: 96, confidenceLevel: "high", obligations: ["Steering committee resolution (15 days)", "Senior management escalation", "Binding arbitration if unresolved"], keyDates: ["15 business days", "30 days escalation"], monetaryValues: [], partyNames: ["Acme Corp", "TechVentures Inc."], startOffset: 3801, endOffset: 4250 },
  { id: "CL-004-11", contractId: "CTR-004", type: "Assignment", text: "TechVentures Inc. shall not assign or subcontract any portion of this Statement of Work without the prior written consent of Acme Corp, except that TechVentures Inc. may engage pre-approved subcontractors listed in Exhibit B. All subcontractors shall be bound by terms no less restrictive than this SOW.", confidence: 91, confidenceLevel: "high", obligations: ["No assignment without consent", "Pre-approved subcontractors only", "Subcontractor binding terms"], keyDates: [], monetaryValues: [], partyNames: ["Acme Corp", "TechVentures Inc."], startOffset: 4251, endOffset: 4600 },
  { id: "CL-004-12", contractId: "CTR-004", type: "Governing Law", text: "This Statement of Work shall be governed by and construed in accordance with the laws of the State of Delaware, consistent with the governing law provisions of the Master Services Agreement. The parties consent to exclusive jurisdiction and venue in the courts of Delaware for any actions not subject to arbitration.", confidence: 97, confidenceLevel: "high", obligations: ["Delaware governing law", "Exclusive Delaware jurisdiction"], keyDates: [], monetaryValues: [], partyNames: [], startOffset: 4601, endOffset: 4950 },
];

// ─── Full Document Text ──────────────────────────────────────────────────────

export const documentTexts: Record<string, string> = {
  "CTR-004": `STATEMENT OF WORK #1 — CLOUD MIGRATION

Effective Date: April 1, 2023
Termination Date: March 31, 2024

This Statement of Work ("SOW") is entered into pursuant to the Master Services Agreement dated January 15, 2023 (the "MSA") between Acme Corp, a Delaware corporation ("Client"), and TechVentures Inc., a Delaware corporation ("Service Provider").

1. PROJECT OVERVIEW

The purpose of this SOW is to define the scope, deliverables, timeline, and commercial terms for the migration of Client's on-premises infrastructure to a cloud-based environment. The migration shall encompass all production workloads, databases, and supporting services currently hosted in Client's primary data center.

2. SCOPE OF SERVICES

TechVentures Inc. shall provide the following services:
(a) Infrastructure assessment and cloud readiness evaluation
(b) Architecture design for target cloud environment (AWS/Azure)
(c) Migration planning and dependency mapping
(d) Data migration with zero-downtime cutover strategy
(e) Application re-platforming and containerization where applicable
(f) Security configuration and compliance validation
(g) Performance testing and optimization
(h) Knowledge transfer and operational documentation
(i) Post-migration support for ninety (90) days

3. PAYMENT TERMS

${clauseText("CTR-004", "CL-004-01")}

4. INTELLECTUAL PROPERTY

${clauseText("CTR-004", "CL-004-02")}

5. TERMINATION

${clauseText("CTR-004", "CL-004-03")}

6. WARRANTY

${clauseText("CTR-004", "CL-004-04")}

7. LIMITATION OF LIABILITY

${clauseText("CTR-004", "CL-004-05")}

8. CONFIDENTIALITY

${clauseText("CTR-004", "CL-004-06")}

9. FORCE MAJEURE

${clauseText("CTR-004", "CL-004-07")}

10. INSURANCE

${clauseText("CTR-004", "CL-004-08")}

11. DATA PROTECTION

${clauseText("CTR-004", "CL-004-09")}

12. DISPUTE RESOLUTION

${clauseText("CTR-004", "CL-004-10")}

13. ASSIGNMENT AND SUBCONTRACTING

${clauseText("CTR-004", "CL-004-11")}

14. GOVERNING LAW

${clauseText("CTR-004", "CL-004-12")}

15. PROJECT TIMELINE

Phase 1 — Discovery & Assessment: April 1 – May 15, 2023
Phase 2 — Architecture & Planning: May 16 – June 30, 2023
Phase 3 — Migration Execution: July 1 – November 30, 2023
Phase 4 — Testing & Optimization: December 1 – January 31, 2024
Phase 5 — Go-Live & Hypercare: February 1 – March 31, 2024

16. KEY PERSONNEL

Project Lead (TechVentures): Michael Torres, Senior Cloud Architect
Account Manager (TechVentures): Rachel Kim, Director of Client Services
Project Sponsor (Acme Corp): Sarah Lopez, Project Director
Technical Lead (Acme Corp): James Wright, VP of Infrastructure

17. ACCEPTANCE CRITERIA

Deliverables shall be deemed accepted upon written confirmation from Client's Project Sponsor or designee within ten (10) business days of delivery. If Client does not respond within such period, deliverables shall be deemed accepted.

18. ENTIRE AGREEMENT

This SOW, together with the MSA and all exhibits and schedules attached hereto, constitutes the entire agreement between the parties with respect to the subject matter hereof. In the event of any conflict between this SOW and the MSA, the terms of the MSA shall prevail unless expressly stated otherwise herein.

IN WITNESS WHEREOF, the parties have executed this Statement of Work as of the Effective Date.

ACME CORP                           TECHVENTURES INC.
By: Sarah Lopez                     By: Rachel Kim
Title: Project Director             Title: Director of Client Services
Date: March 25, 2023               Date: March 27, 2023`,
};

// Helper to insert clause text into document templates
function clauseText(contractId: string, clauseId: string): string {
  const allClauses: Record<string, Clause[]> = {
    "CTR-001": clausesCTR001,
    "CTR-002": clausesCTR002,
    "CTR-004": clausesCTR004,
  };
  const clause = allClauses[contractId]?.find(c => c.id === clauseId);
  return clause?.text || "";
}

// ─── Pre-computed Diffs (CTR-001 vs CTR-002) ─────────────────────────────────

export const diffsCTR001vsCTR002: ClauseDiff[] = [
  {
    baseClauseId: "CL-001-01", compClauseId: "CL-002-01", clauseType: "Termination", diffType: "modified",
    baseText: "Either party may terminate this Agreement upon ninety (90) days' prior written notice to the other party. In the event of a material breach, the non-breaching party may terminate immediately upon written notice if the breach remains uncured for thirty (30) days after receipt of notice specifying the breach.",
    compText: "Either party may terminate this Agreement upon sixty (60) days' prior written notice to the other party. In the event of a material breach, the non-breaching party may terminate immediately upon written notice if the breach remains uncured for fifteen (15) days after receipt of notice specifying the breach.",
    changes: [
      { type: "equal", text: "Either party may terminate this Agreement upon " },
      { type: "remove", text: "ninety (90)" },
      { type: "add", text: "sixty (60)" },
      { type: "equal", text: " days' prior written notice to the other party. In the event of a material breach, the non-breaching party may terminate immediately upon written notice if the breach remains uncured for " },
      { type: "remove", text: "thirty (30)" },
      { type: "add", text: "fifteen (15)" },
      { type: "equal", text: " days after receipt of notice specifying the breach." },
    ],
  },
  {
    baseClauseId: "CL-001-02", compClauseId: "CL-002-02", clauseType: "Payment Terms", diffType: "modified",
    baseText: "TechVentures Inc. shall invoice Acme Corp on a monthly basis. Payment shall be due within thirty (30) days of receipt of a valid invoice. Late payments shall accrue interest at the rate of 1.5% per month or the maximum rate permitted by law, whichever is less.",
    compText: "Payment shall be due within forty-five (45) days of receipt of a valid invoice. A 2% early payment discount is available for invoices paid within ten (10) days. Late payments shall accrue interest at the rate of 1.0% per month.",
    changes: [
      { type: "remove", text: "TechVentures Inc. shall invoice Acme Corp on a monthly basis. " },
      { type: "equal", text: "Payment shall be due within " },
      { type: "remove", text: "thirty (30)" },
      { type: "add", text: "forty-five (45)" },
      { type: "equal", text: " days of receipt of a valid invoice. " },
      { type: "add", text: "A 2% early payment discount is available for invoices paid within ten (10) days. " },
      { type: "equal", text: "Late payments shall accrue interest at the rate of " },
      { type: "remove", text: "1.5%" },
      { type: "add", text: "1.0%" },
      { type: "equal", text: " per month" },
      { type: "remove", text: " or the maximum rate permitted by law, whichever is less" },
      { type: "equal", text: "." },
    ],
  },
  {
    baseClauseId: "CL-001-03", compClauseId: "CL-002-03", clauseType: "Liability", diffType: "modified",
    baseText: "IN NO EVENT SHALL EITHER PARTY'S AGGREGATE LIABILITY UNDER THIS AGREEMENT EXCEED THE TOTAL FEES PAID OR PAYABLE BY ACME CORP IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.",
    compText: "In no event shall either party's aggregate liability under this Agreement exceed two times (2x) the total fees paid or payable by Acme Corp in the twelve (12) months preceding the claim.",
    changes: [
      { type: "equal", text: "In no event shall either party's aggregate liability under this Agreement exceed " },
      { type: "add", text: "two times (2x) " },
      { type: "equal", text: "the total fees paid or payable by Acme Corp in the twelve (12) months preceding the claim." },
    ],
  },
  {
    baseClauseId: "CL-001-04", compClauseId: null, clauseType: "Confidentiality", diffType: "unchanged",
    baseText: "Each party agrees to maintain the confidentiality of all Confidential Information received from the other party...",
    compText: "", changes: [],
  },
  {
    baseClauseId: "CL-001-05", compClauseId: null, clauseType: "Indemnification", diffType: "unchanged",
    baseText: "Each party shall indemnify, defend, and hold harmless the other party...",
    compText: "", changes: [],
  },
  {
    baseClauseId: null, compClauseId: "CL-002-04", clauseType: "Data Protection", diffType: "added",
    baseText: "", compText: "TechVentures Inc. shall comply with all applicable data protection laws, including GDPR and CCPA, in the handling of any personal data processed on behalf of Acme Corp. TechVentures Inc. shall implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk.",
    changes: [{ type: "add", text: "TechVentures Inc. shall comply with all applicable data protection laws, including GDPR and CCPA, in the handling of any personal data processed on behalf of Acme Corp. TechVentures Inc. shall implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk." }],
  },
  {
    baseClauseId: null, compClauseId: "CL-002-05", clauseType: "Insurance", diffType: "added",
    baseText: "", compText: "TechVentures Inc. shall maintain commercial general liability insurance of not less than $5,000,000 per occurrence and professional liability (E&O) insurance of not less than $2,000,000 per claim throughout the term of this Agreement.",
    changes: [{ type: "add", text: "TechVentures Inc. shall maintain commercial general liability insurance of not less than $5,000,000 per occurrence and professional liability (E&O) insurance of not less than $2,000,000 per claim throughout the term of this Agreement." }],
  },
  {
    baseClauseId: "CL-001-08", compClauseId: "CL-002-06", clauseType: "Intellectual Property", diffType: "modified",
    baseText: "All intellectual property rights in any deliverables created by TechVentures Inc. specifically for Acme Corp under a Statement of Work shall be assigned to Acme Corp upon full payment. TechVentures Inc. retains all rights in its pre-existing intellectual property and general know-how.",
    compText: "All intellectual property rights in any deliverables created by TechVentures Inc. specifically for Acme Corp shall be assigned to Acme Corp upon acceptance (rather than upon full payment). TechVentures Inc. grants Acme Corp a perpetual, royalty-free license to use any TechVentures Inc. pre-existing IP incorporated into deliverables.",
    changes: [
      { type: "equal", text: "All intellectual property rights in any deliverables created by TechVentures Inc. specifically for Acme Corp " },
      { type: "remove", text: "under a Statement of Work " },
      { type: "equal", text: "shall be assigned to Acme Corp upon " },
      { type: "remove", text: "full payment" },
      { type: "add", text: "acceptance (rather than upon full payment)" },
      { type: "equal", text: ". TechVentures Inc. " },
      { type: "remove", text: "retains all rights in its pre-existing intellectual property and general know-how" },
      { type: "add", text: "grants Acme Corp a perpetual, royalty-free license to use any TechVentures Inc. pre-existing IP incorporated into deliverables" },
      { type: "equal", text: "." },
    ],
  },
];

// ─── Helper Functions ────────────────────────────────────────────────────────

export function getContract(id: string): Contract | undefined {
  return contracts.find((c) => c.id === id);
}

export function getFamily(id: string): ContractFamily | undefined {
  return families.find((f) => f.id === id);
}

export function getFamilyContracts(familyId: string): Contract[] {
  return contracts.filter((c) => c.familyId === familyId);
}

export function getContractClauses(contractId: string): Clause[] {
  if (contractId === "CTR-001") return clausesCTR001;
  if (contractId === "CTR-002") return clausesCTR002;
  if (contractId === "CTR-004") return clausesCTR004;
  return [];
}

export function getDocumentText(contractId: string): string | undefined {
  return documentTexts[contractId];
}

// ─── KPI Data ────────────────────────────────────────────────────────────────

export const kpiData = {
  totalContracts: contracts.length,
  totalFamilies: families.length,
  pendingReviews: contracts.filter((c) => c.status === "pending_review").length,
  processingErrors: uploadQueue.filter((u) => u.status === "failed").length,
};
