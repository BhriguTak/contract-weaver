// ─── Types ───────────────────────────────────────────────────────────────────

export type ContractType = "MSA" | "Amendment" | "SOW" | "NDA" | "SLA" | "BAA";
export type ContractStatus = "active" | "expired" | "pending_review" | "draft" | "processing" | "failed";
export type ClauseType = "Termination" | "Payment Terms" | "Liability" | "Confidentiality" | "Indemnification" | "Governing Law" | "Force Majeure" | "Assignment" | "Dispute Resolution" | "Intellectual Property" | "Warranty" | "Insurance" | "Non-Compete" | "Data Protection" | "HIPAA Compliance" | "Patient Data" | "Medical Records" | "Regulatory Compliance";
export type ConfidenceLevel = "high" | "medium" | "low";
export type DiffType = "added" | "removed" | "modified" | "moved" | "unchanged";
export type ActivityType = "upload" | "extraction" | "review" | "comparison" | "comment";
export type ObligationStatus = "compliant" | "at_risk" | "overdue" | "upcoming" | "completed";

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

export interface Obligation {
  id: string;
  contractId: string;
  clauseId: string;
  title: string;
  description: string;
  category: "compliance" | "financial" | "operational" | "reporting" | "insurance";
  status: ObligationStatus;
  dueDate: string;
  owner: string;
  riskLevel: "high" | "medium" | "low";
  lastChecked: string;
  evidence?: string;
}

// ─── Mock Contracts (Healthcare Provider) ────────────────────────────────────

export const contracts: Contract[] = [
  {
    id: "CTR-001",
    familyId: "FAM-001",
    title: "Master Services Agreement — MedFirst Health System & ClearView Analytics",
    type: "MSA",
    status: "active",
    parties: ["MedFirst Health System", "ClearView Analytics"],
    effectiveDate: "2023-01-15",
    terminationDate: "2026-01-15",
    signer: "Dr. Rebecca Thornton, VP Legal",
    jurisdiction: "Texas, USA",
    version: "1.0",
    fileName: "medfirst-clearview-msa-v1.pdf",
    fileSize: "2.4 MB",
    uploadedAt: "2025-11-20T09:30:00Z",
    confidenceScore: 94,
    clauseCount: 18,
  },
  {
    id: "CTR-002",
    familyId: "FAM-001",
    title: "Amendment No. 1 — MedFirst Health System & ClearView Analytics",
    type: "Amendment",
    status: "active",
    parties: ["MedFirst Health System", "ClearView Analytics"],
    effectiveDate: "2023-09-01",
    terminationDate: "2026-01-15",
    signer: "Dr. Rebecca Thornton, VP Legal",
    jurisdiction: "Texas, USA",
    version: "1.1",
    fileName: "medfirst-clearview-amd1.pdf",
    fileSize: "890 KB",
    uploadedAt: "2025-11-20T09:35:00Z",
    confidenceScore: 91,
    clauseCount: 6,
  },
  {
    id: "CTR-003",
    familyId: "FAM-001",
    title: "Business Associate Agreement — MedFirst Health System & ClearView Analytics",
    type: "BAA",
    status: "active",
    parties: ["MedFirst Health System", "ClearView Analytics"],
    effectiveDate: "2023-01-15",
    terminationDate: "2026-01-15",
    signer: "Dr. Rebecca Thornton, VP Legal",
    jurisdiction: "Texas, USA",
    version: "1.0",
    fileName: "medfirst-clearview-baa.pdf",
    fileSize: "1.1 MB",
    uploadedAt: "2025-12-01T14:20:00Z",
    confidenceScore: 87,
    clauseCount: 8,
  },
  {
    id: "CTR-004",
    familyId: "FAM-001",
    title: "SOW #1 — EHR Data Analytics Platform Implementation",
    type: "SOW",
    status: "active",
    parties: ["MedFirst Health System", "ClearView Analytics"],
    effectiveDate: "2023-04-01",
    terminationDate: "2024-03-31",
    signer: "Sarah Lopez, Chief Nursing Informatics Officer",
    jurisdiction: "Texas, USA",
    version: "1.0",
    fileName: "medfirst-clearview-sow1.pdf",
    fileSize: "1.8 MB",
    uploadedAt: "2025-11-20T09:40:00Z",
    confidenceScore: 92,
    clauseCount: 12,
  },
  {
    id: "CTR-005",
    familyId: "FAM-002",
    title: "Master Services Agreement — Sunrise Hospital Network & MedSecure Solutions",
    type: "MSA",
    status: "active",
    parties: ["Sunrise Hospital Network", "MedSecure Solutions"],
    effectiveDate: "2024-06-01",
    terminationDate: "2027-06-01",
    signer: "David Park, Chief Compliance Officer",
    jurisdiction: "Florida, USA",
    version: "1.0",
    fileName: "sunrise-medsecure-msa.pdf",
    fileSize: "3.1 MB",
    uploadedAt: "2025-12-05T10:00:00Z",
    confidenceScore: 96,
    clauseCount: 22,
  },
  {
    id: "CTR-006",
    familyId: "FAM-002",
    title: "BAA — Sunrise Hospital Network & MedSecure Solutions",
    type: "BAA",
    status: "active",
    parties: ["Sunrise Hospital Network", "MedSecure Solutions"],
    effectiveDate: "2024-06-01",
    terminationDate: "2027-06-01",
    signer: "David Park, Chief Compliance Officer",
    jurisdiction: "Florida, USA",
    version: "1.0",
    fileName: "sunrise-medsecure-baa.pdf",
    fileSize: "720 KB",
    uploadedAt: "2025-12-10T11:30:00Z",
    confidenceScore: 89,
    clauseCount: 5,
  },
  {
    id: "CTR-007",
    familyId: "FAM-003",
    title: "NDA — Pacific Care Alliance & HealthBridge Technologies",
    type: "NDA",
    status: "active",
    parties: ["Pacific Care Alliance", "HealthBridge Technologies"],
    effectiveDate: "2025-02-01",
    terminationDate: "2028-02-01",
    signer: "Lisa Tran, VP Clinical Operations",
    jurisdiction: "California, USA",
    version: "1.0",
    fileName: "pacificcare-healthbridge-nda.pdf",
    fileSize: "540 KB",
    uploadedAt: "2025-12-15T08:45:00Z",
    confidenceScore: 97,
    clauseCount: 10,
  },
  {
    id: "CTR-008",
    familyId: "FAM-003",
    title: "SLA — Pacific Care Alliance & HealthBridge Technologies",
    type: "SLA",
    status: "pending_review",
    parties: ["Pacific Care Alliance", "HealthBridge Technologies"],
    effectiveDate: "2025-03-01",
    terminationDate: "2026-03-01",
    signer: "Lisa Tran, VP Clinical Operations",
    jurisdiction: "California, USA",
    version: "1.0",
    fileName: "pacificcare-healthbridge-sla.pdf",
    fileSize: "1.5 MB",
    uploadedAt: "2025-12-18T16:10:00Z",
    confidenceScore: 83,
    clauseCount: 14,
  },
  {
    id: "CTR-009",
    familyId: "FAM-004",
    title: "MSA — Mountain Valley Medical Center & PharmaCo Distributions",
    type: "MSA",
    status: "expired",
    parties: ["Mountain Valley Medical Center", "PharmaCo Distributions"],
    effectiveDate: "2022-07-01",
    terminationDate: "2025-07-01",
    signer: "Mark Johnson, COO",
    jurisdiction: "Colorado, USA",
    version: "1.0",
    fileName: "mountainvalley-pharmaco-msa.pdf",
    fileSize: "2.7 MB",
    uploadedAt: "2025-10-01T12:00:00Z",
    confidenceScore: 90,
    clauseCount: 20,
  },
  {
    id: "CTR-010",
    familyId: "FAM-004",
    title: "SOW — Pharmaceutical Supply Chain Optimization",
    type: "SOW",
    status: "expired",
    parties: ["Mountain Valley Medical Center", "PharmaCo Distributions"],
    effectiveDate: "2022-09-15",
    terminationDate: "2023-09-14",
    signer: "Mark Johnson, COO",
    jurisdiction: "Colorado, USA",
    version: "1.0",
    fileName: "mountainvalley-pharmaco-sow.pdf",
    fileSize: "1.3 MB",
    uploadedAt: "2025-10-01T12:05:00Z",
    confidenceScore: 88,
    clauseCount: 11,
  },
  {
    id: "CTR-011",
    familyId: "FAM-004",
    title: "Amendment No. 1 — Mountain Valley Medical & PharmaCo",
    type: "Amendment",
    status: "expired",
    parties: ["Mountain Valley Medical Center", "PharmaCo Distributions"],
    effectiveDate: "2023-07-01",
    terminationDate: "2025-07-01",
    signer: "Mark Johnson, COO",
    jurisdiction: "Colorado, USA",
    version: "1.1",
    fileName: "mountainvalley-pharmaco-amd1.pdf",
    fileSize: "650 KB",
    uploadedAt: "2025-10-01T12:10:00Z",
    confidenceScore: 85,
    clauseCount: 4,
  },
  {
    id: "CTR-012",
    familyId: "FAM-002",
    title: "SOW — HIPAA Security Risk Assessment Phase 1",
    type: "SOW",
    status: "active",
    parties: ["Sunrise Hospital Network", "MedSecure Solutions"],
    effectiveDate: "2024-09-01",
    terminationDate: "2025-08-31",
    signer: "David Park, Chief Compliance Officer",
    jurisdiction: "Florida, USA",
    version: "1.0",
    fileName: "sunrise-medsecure-sow1.pdf",
    fileSize: "2.0 MB",
    uploadedAt: "2025-12-05T10:15:00Z",
    confidenceScore: 93,
    clauseCount: 15,
  },
  {
    id: "CTR-013",
    familyId: "FAM-001",
    title: "SOW #2 — Patient Outcomes Dashboard",
    type: "SOW",
    status: "draft",
    parties: ["MedFirst Health System", "ClearView Analytics"],
    effectiveDate: "2024-06-01",
    terminationDate: "2025-05-31",
    signer: "Dr. Rebecca Thornton, VP Legal",
    jurisdiction: "Texas, USA",
    version: "1.0",
    fileName: "medfirst-clearview-sow2.pdf",
    fileSize: "1.6 MB",
    uploadedAt: "2026-01-10T11:00:00Z",
    confidenceScore: 79,
    clauseCount: 13,
  },
  {
    id: "CTR-014",
    familyId: "FAM-003",
    title: "MSA — Pacific Care Alliance & HealthBridge Technologies",
    type: "MSA",
    status: "active",
    parties: ["Pacific Care Alliance", "HealthBridge Technologies"],
    effectiveDate: "2025-01-01",
    terminationDate: "2028-01-01",
    signer: "Lisa Tran, VP Clinical Operations",
    jurisdiction: "California, USA",
    version: "1.0",
    fileName: "pacificcare-healthbridge-msa.pdf",
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
    name: "MedFirst Health System — ClearView Analytics",
    primaryCounterparty: "ClearView Analytics",
    jurisdiction: "Texas, USA",
    dateRange: "Jan 2023 — Jan 2026",
    documentCount: 5,
    tags: ["Healthcare Analytics", "EHR Integration", "HIPAA", "Priority"],
    lastActivity: "2026-01-10T11:00:00Z",
    status: "active",
    contracts: ["CTR-001", "CTR-002", "CTR-003", "CTR-004", "CTR-013"],
  },
  {
    id: "FAM-002",
    name: "Sunrise Hospital Network — MedSecure Solutions",
    primaryCounterparty: "MedSecure Solutions",
    jurisdiction: "Florida, USA",
    dateRange: "Jun 2024 — Jun 2027",
    documentCount: 3,
    tags: ["Cybersecurity", "HIPAA Compliance", "Risk Assessment"],
    lastActivity: "2025-12-10T11:30:00Z",
    status: "active",
    contracts: ["CTR-005", "CTR-006", "CTR-012"],
  },
  {
    id: "FAM-003",
    name: "Pacific Care Alliance — HealthBridge Technologies",
    primaryCounterparty: "HealthBridge Technologies",
    jurisdiction: "California, USA",
    dateRange: "Jan 2025 — Feb 2028",
    documentCount: 3,
    tags: ["Telehealth", "Patient Portal", "Under Review"],
    lastActivity: "2025-12-18T16:10:00Z",
    status: "pending_review",
    contracts: ["CTR-007", "CTR-008", "CTR-014"],
  },
  {
    id: "FAM-004",
    name: "Mountain Valley Medical — PharmaCo Distributions",
    primaryCounterparty: "PharmaCo Distributions",
    jurisdiction: "Colorado, USA",
    dateRange: "Jul 2022 — Jul 2025",
    documentCount: 3,
    tags: ["Pharmacy", "Supply Chain", "Expired"],
    lastActivity: "2025-10-01T12:10:00Z",
    status: "expired",
    contracts: ["CTR-009", "CTR-010", "CTR-011"],
  },
];

// ─── Mock Activity Feed ──────────────────────────────────────────────────────

export const activityFeed: ActivityItem[] = [
  { id: "ACT-001", type: "upload", title: "Patient Outcomes SOW uploaded", description: "medfirst-clearview-sow2.pdf uploaded for processing", timestamp: "2026-01-10T11:00:00Z", contractId: "CTR-013", familyId: "FAM-001", user: "Dr. Rebecca Thornton" },
  { id: "ACT-002", type: "extraction", title: "BAA extraction complete", description: "Business Associate Agreement (MedFirst) fully parsed — 8 clauses extracted", timestamp: "2025-12-01T14:45:00Z", contractId: "CTR-003", familyId: "FAM-001", user: "System" },
  { id: "ACT-003", type: "review", title: "SLA review requested", description: "SLA (Pacific Care Alliance) flagged for review — low confidence on 3 clauses", timestamp: "2025-12-18T16:30:00Z", contractId: "CTR-008", familyId: "FAM-003", user: "Lisa Tran" },
  { id: "ACT-004", type: "comparison", title: "HIPAA compliance diff generated", description: "Comparison between MSA v1.0 and BAA (Sunrise Hospital) completed", timestamp: "2025-12-10T12:00:00Z", contractId: "CTR-006", familyId: "FAM-002", user: "David Park" },
  { id: "ACT-005", type: "upload", title: "Bulk upload completed", description: "3 files for Mountain Valley Medical family uploaded successfully", timestamp: "2025-10-01T12:15:00Z", familyId: "FAM-004", user: "Mark Johnson" },
  { id: "ACT-006", type: "comment", title: "HIPAA clause flagged", description: "Note on PHI handling clause: 'Confirm BAA aligns with updated HIPAA Safe Harbor'", timestamp: "2025-12-02T09:15:00Z", contractId: "CTR-003", familyId: "FAM-001", user: "Dr. Rebecca Thornton" },
  { id: "ACT-007", type: "extraction", title: "Low confidence warning", description: "SOW #2 extraction has 3 clauses below 80% confidence threshold", timestamp: "2026-01-10T11:30:00Z", contractId: "CTR-013", familyId: "FAM-001", user: "System" },
  { id: "ACT-008", type: "review", title: "Amendment approved", description: "Amendment No. 1 (MedFirst) review completed and approved", timestamp: "2025-11-25T10:00:00Z", contractId: "CTR-002", familyId: "FAM-001", user: "Dr. Rebecca Thornton" },
];

// ─── Mock Upload Queue ───────────────────────────────────────────────────────

export const uploadQueue: UploadItem[] = [
  { id: "UPL-001", fileName: "payer-agreement-bcbs-v3.pdf", fileSize: "2.1 MB", fileType: "PDF", status: "complete", progress: 100, parsingProfile: "Auto-detect", extractedParties: ["BlueCross BlueShield", "MedFirst Health System"], contractDate: "2025-11-01", contractType: "MSA", confidenceScore: 93, elapsedTime: "12s" },
  { id: "UPL-002", fileName: "hipaa-baa-supplement.docx", fileSize: "450 KB", fileType: "DOCX", status: "processing", progress: 65, parsingProfile: "BAA", elapsedTime: "8s" },
  { id: "UPL-003", fileName: "credentialing-amendment-v4.pdf", fileSize: "1.3 MB", fileType: "PDF", status: "queued", progress: 0, parsingProfile: "Amendment" },
  { id: "UPL-004", fileName: "scanned-consent-form.pdf", fileSize: "5.8 MB", fileType: "PDF", status: "failed", progress: 30, parsingProfile: "Auto-detect", error: "Unable to extract text — document appears to be a scanned image without OCR", elapsedTime: "45s" },
];

// ─── Mock Clauses for CTR-001 (MSA — Healthcare) ─────────────────────────────

export const clausesCTR001: Clause[] = [
  { id: "CL-001-01", contractId: "CTR-001", type: "Termination", text: "Either party may terminate this Agreement upon ninety (90) days' prior written notice to the other party. In the event of a material breach, the non-breaching party may terminate immediately upon written notice if the breach remains uncured for thirty (30) days after receipt of notice specifying the breach.", confidence: 96, confidenceLevel: "high", obligations: ["90-day notice requirement", "30-day cure period"], keyDates: ["90 days prior notice"], monetaryValues: [], partyNames: ["MedFirst Health System", "ClearView Analytics"], startOffset: 0, endOffset: 450 },
  { id: "CL-001-02", contractId: "CTR-001", type: "Payment Terms", text: "ClearView Analytics shall invoice MedFirst Health System on a monthly basis. Payment shall be due within thirty (30) days of receipt of a valid invoice. Late payments shall accrue interest at the rate of 1.5% per month or the maximum rate permitted by law, whichever is less.", confidence: 94, confidenceLevel: "high", obligations: ["Monthly invoicing", "30-day payment window"], keyDates: ["30 days from invoice"], monetaryValues: ["1.5% monthly interest"], partyNames: ["MedFirst Health System", "ClearView Analytics"], startOffset: 451, endOffset: 800 },
  { id: "CL-001-03", contractId: "CTR-001", type: "Liability", text: "IN NO EVENT SHALL EITHER PARTY'S AGGREGATE LIABILITY UNDER THIS AGREEMENT EXCEED THE TOTAL FEES PAID OR PAYABLE BY MEDFIRST HEALTH SYSTEM IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM. NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR EXEMPLARY DAMAGES.", confidence: 92, confidenceLevel: "high", obligations: ["Liability cap at 12-month fees"], keyDates: [], monetaryValues: ["12-month fee cap"], partyNames: ["MedFirst Health System"], startOffset: 801, endOffset: 1200 },
  { id: "CL-001-04", contractId: "CTR-001", type: "Confidentiality", text: "Each party agrees to maintain the confidentiality of all Confidential Information received from the other party. Confidential Information shall not be disclosed to any third party without the prior written consent of the disclosing party, except to employees, contractors, or advisors who have a need to know and are bound by obligations of confidentiality no less restrictive than those set forth herein.", confidence: 95, confidenceLevel: "high", obligations: ["Maintain confidentiality", "Written consent for disclosure"], keyDates: [], monetaryValues: [], partyNames: ["MedFirst Health System", "ClearView Analytics"], startOffset: 1201, endOffset: 1650 },
  { id: "CL-001-05", contractId: "CTR-001", type: "HIPAA Compliance", text: "ClearView Analytics agrees to comply with all applicable provisions of the Health Insurance Portability and Accountability Act of 1996 (HIPAA), the HITECH Act, and all regulations promulgated thereunder, including but not limited to the Privacy Rule, Security Rule, and Breach Notification Rule, in connection with any Protected Health Information (PHI) accessed or processed under this Agreement.", confidence: 95, confidenceLevel: "high", obligations: ["HIPAA Privacy Rule compliance", "HIPAA Security Rule compliance", "Breach Notification compliance"], keyDates: [], monetaryValues: [], partyNames: ["ClearView Analytics"], startOffset: 1651, endOffset: 2050 },
  { id: "CL-001-06", contractId: "CTR-001", type: "Governing Law", text: "This Agreement shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of laws principles. Any disputes arising under this Agreement shall be resolved exclusively in the federal or state courts located in Houston, Texas.", confidence: 97, confidenceLevel: "high", obligations: ["Texas jurisdiction"], keyDates: [], monetaryValues: [], partyNames: [], startOffset: 2051, endOffset: 2400 },
  { id: "CL-001-07", contractId: "CTR-001", type: "Force Majeure", text: "Neither party shall be liable for any delay or failure to perform its obligations under this Agreement due to causes beyond its reasonable control, including but not limited to acts of God, pandemics, public health emergencies, government-mandated lockdowns, strikes, government actions, or natural disasters, provided that the affected party gives prompt notice and uses commercially reasonable efforts to mitigate the effects.", confidence: 91, confidenceLevel: "high", obligations: ["Prompt notice", "Mitigation efforts"], keyDates: [], monetaryValues: [], partyNames: [], startOffset: 2401, endOffset: 2850 },
  { id: "CL-001-08", contractId: "CTR-001", type: "Patient Data", text: "All patient data, including but not limited to Protected Health Information (PHI), Electronic Health Records (EHR), and de-identified datasets, processed by ClearView Analytics shall remain the exclusive property of MedFirst Health System. ClearView Analytics shall not use patient data for any purpose other than performing the Services described in the applicable Statement of Work, and shall not sell, license, or otherwise transfer patient data to any third party.", confidence: 73, confidenceLevel: "low", obligations: ["Patient data ownership retained by MedFirst", "No secondary use of PHI", "No third-party data transfers"], keyDates: [], monetaryValues: [], partyNames: ["MedFirst Health System", "ClearView Analytics"], startOffset: 2851, endOffset: 3250 },
];

// ─── Mock Clauses for CTR-002 (Amendment 1) ──────────────────────────────────

export const clausesCTR002: Clause[] = [
  { id: "CL-002-01", contractId: "CTR-002", type: "Termination", text: "Section 8.1 of the Agreement is hereby amended to read: Either party may terminate this Agreement upon sixty (60) days' prior written notice to the other party. In the event of a material breach, the non-breaching party may terminate immediately upon written notice if the breach remains uncured for fifteen (15) days after receipt of notice specifying the breach.", confidence: 94, confidenceLevel: "high", obligations: ["60-day notice requirement (changed from 90)", "15-day cure period (changed from 30)"], keyDates: ["60 days prior notice"], monetaryValues: [], partyNames: ["MedFirst Health System", "ClearView Analytics"], startOffset: 0, endOffset: 480 },
  { id: "CL-002-02", contractId: "CTR-002", type: "Payment Terms", text: "Section 5.2 is amended: Payment shall be due within forty-five (45) days of receipt of a valid invoice. A 2% early payment discount is available for invoices paid within ten (10) days. Late payments shall accrue interest at the rate of 1.0% per month.", confidence: 92, confidenceLevel: "high", obligations: ["45-day payment window (changed from 30)", "Early payment discount"], keyDates: ["45 days from invoice", "10 days for discount"], monetaryValues: ["2% early payment discount", "1.0% monthly interest (changed from 1.5%)"], partyNames: ["MedFirst Health System", "ClearView Analytics"], startOffset: 481, endOffset: 850 },
  { id: "CL-002-03", contractId: "CTR-002", type: "Liability", text: "Section 9 is amended: In no event shall either party's aggregate liability under this Agreement exceed two times (2x) the total fees paid or payable by MedFirst Health System in the twelve (12) months preceding the claim.", confidence: 90, confidenceLevel: "high", obligations: ["Liability cap at 2x 12-month fees (changed from 1x)"], keyDates: [], monetaryValues: ["2x 12-month fee cap"], partyNames: ["MedFirst Health System"], startOffset: 851, endOffset: 1150 },
  { id: "CL-002-04", contractId: "CTR-002", type: "Data Protection", text: "A new Section 14 is added: ClearView Analytics shall comply with all applicable data protection laws, including HIPAA, HITECH, and state health privacy laws, in the handling of any Protected Health Information processed on behalf of MedFirst Health System. ClearView Analytics shall implement appropriate administrative, technical, and physical safeguards to ensure the confidentiality, integrity, and availability of ePHI.", confidence: 86, confidenceLevel: "medium", obligations: ["HIPAA/HITECH compliance", "ePHI safeguards implementation"], keyDates: [], monetaryValues: [], partyNames: ["ClearView Analytics", "MedFirst Health System"], startOffset: 1151, endOffset: 1550 },
  { id: "CL-002-05", contractId: "CTR-002", type: "Insurance", text: "A new Section 15 is added: ClearView Analytics shall maintain commercial general liability insurance of not less than $5,000,000 per occurrence and professional liability (E&O) insurance of not less than $2,000,000 per claim, plus cyber liability insurance of $10,000,000 covering healthcare data breaches throughout the term of this Agreement.", confidence: 93, confidenceLevel: "high", obligations: ["Maintain CGL insurance", "Maintain E&O insurance", "Maintain cyber liability insurance"], keyDates: [], monetaryValues: ["$5,000,000 CGL per occurrence", "$2,000,000 E&O per claim", "$10,000,000 cyber liability"], partyNames: ["ClearView Analytics"], startOffset: 1551, endOffset: 1900 },
  { id: "CL-002-06", contractId: "CTR-002", type: "Intellectual Property", text: "Section 12.1 is amended: All intellectual property rights in any deliverables created by ClearView Analytics specifically for MedFirst Health System shall be assigned to MedFirst upon acceptance (rather than upon full payment). ClearView Analytics grants MedFirst Health System a perpetual, royalty-free license to use any ClearView pre-existing IP incorporated into deliverables.", confidence: 78, confidenceLevel: "low", obligations: ["IP assignment upon acceptance (changed from payment)", "Perpetual license for pre-existing IP (new)"], keyDates: [], monetaryValues: [], partyNames: ["MedFirst Health System", "ClearView Analytics"], startOffset: 1901, endOffset: 2350 },
];

// ─── Mock Clauses for CTR-004 (SOW #1 — EHR Analytics) ───────────────────────

export const clausesCTR004: Clause[] = [
  { id: "CL-004-01", contractId: "CTR-004", type: "Payment Terms", text: "MedFirst Health System shall pay ClearView Analytics a fixed fee of $1,250,000 for the EHR Data Analytics Platform Implementation, payable in four equal quarterly installments of $312,500 each. The first installment is due within fifteen (15) days of the Effective Date. Subsequent installments are due on the first business day of each calendar quarter.", confidence: 95, confidenceLevel: "high", obligations: ["Quarterly payments of $312,500", "First payment within 15 days"], keyDates: ["15 days from Effective Date", "Quarterly due dates"], monetaryValues: ["$1,250,000 total", "$312,500 per quarter"], partyNames: ["MedFirst Health System", "ClearView Analytics"], startOffset: 0, endOffset: 420 },
  { id: "CL-004-02", contractId: "CTR-004", type: "Intellectual Property", text: "All analytics dashboards, data models, integration adapters, and clinical documentation produced under this Statement of Work shall be considered 'Work Product' and shall be owned exclusively by MedFirst Health System upon delivery and acceptance. ClearView Analytics retains a non-exclusive license to use general methodologies and anonymized analytical frameworks for other healthcare clients.", confidence: 89, confidenceLevel: "medium", obligations: ["IP ownership transfers to MedFirst", "Non-exclusive license retained by ClearView"], keyDates: [], monetaryValues: [], partyNames: ["MedFirst Health System", "ClearView Analytics"], startOffset: 421, endOffset: 850 },
  { id: "CL-004-03", contractId: "CTR-004", type: "Termination", text: "Either party may terminate this Statement of Work for convenience upon thirty (30) days' written notice. In the event of termination for convenience by MedFirst Health System, ClearView Analytics shall be entitled to payment for all work completed through the effective date of termination, plus any reasonable wind-down costs not to exceed $50,000.", confidence: 93, confidenceLevel: "high", obligations: ["30-day notice for termination", "Payment for completed work", "Wind-down cost cap"], keyDates: ["30 days written notice"], monetaryValues: ["$50,000 wind-down cap"], partyNames: ["MedFirst Health System", "ClearView Analytics"], startOffset: 851, endOffset: 1280 },
  { id: "CL-004-04", contractId: "CTR-004", type: "Warranty", text: "ClearView Analytics warrants that all analytics platform services shall be performed in a professional and workmanlike manner consistent with healthcare industry standards and HL7 FHIR interoperability requirements. ClearView Analytics further warrants that the platform shall achieve 99.5% uptime within sixty (60) days of go-live. Any defects identified within ninety (90) days of acceptance shall be remediated at no additional cost.", confidence: 91, confidenceLevel: "high", obligations: ["Professional service delivery", "HL7 FHIR compliance", "99.5% uptime guarantee", "90-day defect remediation"], keyDates: ["60 days post go-live", "90 days post acceptance"], monetaryValues: [], partyNames: ["ClearView Analytics"], startOffset: 1281, endOffset: 1720 },
  { id: "CL-004-05", contractId: "CTR-004", type: "Liability", text: "ClearView Analytics' aggregate liability under this Statement of Work shall not exceed the total fees paid or payable under this SOW. Neither party shall be liable for any loss of patient data during implementation unless caused by gross negligence or willful misconduct, in which case the liable party shall bear full responsibility for breach notification costs and OCR penalty exposure.", confidence: 87, confidenceLevel: "medium", obligations: ["Liability cap at total SOW fees", "Patient data loss liability for gross negligence", "Breach notification cost responsibility"], keyDates: [], monetaryValues: ["Total SOW fees cap"], partyNames: ["ClearView Analytics"], startOffset: 1721, endOffset: 2150 },
  { id: "CL-004-06", contractId: "CTR-004", type: "HIPAA Compliance", text: "During the course of the EHR Analytics Implementation, ClearView Analytics personnel may have access to MedFirst Health System's Protected Health Information, electronic medical records, and clinical data systems. All such information shall be treated as PHI under the Business Associate Agreement. ClearView Analytics shall ensure that all personnel with access complete HIPAA training and sign individual confidentiality acknowledgments.", confidence: 94, confidenceLevel: "high", obligations: ["Treat all clinical data as PHI", "HIPAA training for all personnel", "Individual confidentiality acknowledgments"], keyDates: [], monetaryValues: [], partyNames: ["MedFirst Health System", "ClearView Analytics"], startOffset: 2151, endOffset: 2580 },
  { id: "CL-004-07", contractId: "CTR-004", type: "Force Majeure", text: "EHR system outages or hospital emergency operations lasting more than seventy-two (72) consecutive hours shall constitute a force majeure event under this SOW. In such event, project timelines shall be adjusted day-for-day, and neither party shall be liable for resulting delays. ClearView Analytics shall maintain documented contingency plans for clinical system downtime.", confidence: 90, confidenceLevel: "high", obligations: ["Timeline adjustment for outages", "Maintain contingency plans for clinical downtime"], keyDates: ["72-hour threshold"], monetaryValues: [], partyNames: ["ClearView Analytics"], startOffset: 2581, endOffset: 2980 },
  { id: "CL-004-08", contractId: "CTR-004", type: "Insurance", text: "In addition to the insurance requirements set forth in the MSA, ClearView Analytics shall maintain cyber liability insurance with a minimum coverage of $10,000,000 per occurrence for the duration of the EHR Analytics project and for twelve (12) months following project completion, specifically covering healthcare data breach incidents.", confidence: 92, confidenceLevel: "high", obligations: ["Cyber liability insurance $10M minimum", "Coverage extends 12 months post-completion", "Healthcare breach coverage"], keyDates: ["12 months post-completion"], monetaryValues: ["$10,000,000 cyber liability coverage"], partyNames: ["ClearView Analytics"], startOffset: 2981, endOffset: 3350 },
  { id: "CL-004-09", contractId: "CTR-004", type: "Data Protection", text: "ClearView Analytics shall implement encryption at rest (AES-256) and in transit (TLS 1.2 or higher) for all Protected Health Information handled during the implementation. A detailed PHI data mapping document shall be provided to MedFirst Health System prior to any data movement. ClearView Analytics shall conduct a HIPAA Security Risk Assessment and share findings with MedFirst within thirty (30) days of the Effective Date.", confidence: 88, confidenceLevel: "medium", obligations: ["AES-256 encryption at rest for PHI", "TLS 1.2+ in transit", "PHI data mapping document", "HIPAA Security Risk Assessment within 30 days"], keyDates: ["30 days from Effective Date"], monetaryValues: [], partyNames: ["MedFirst Health System", "ClearView Analytics"], startOffset: 3351, endOffset: 3800 },
  { id: "CL-004-10", contractId: "CTR-004", type: "Dispute Resolution", text: "Any disputes arising under this Statement of Work shall first be submitted to the project steering committee for resolution within fifteen (15) business days. If unresolved, disputes shall be escalated to senior management of both parties. If still unresolved after thirty (30) days, the dispute shall be submitted to binding arbitration in Houston, Texas under the rules of the American Arbitration Association.", confidence: 96, confidenceLevel: "high", obligations: ["Steering committee resolution (15 days)", "Senior management escalation", "Binding arbitration if unresolved"], keyDates: ["15 business days", "30 days escalation"], monetaryValues: [], partyNames: ["MedFirst Health System", "ClearView Analytics"], startOffset: 3801, endOffset: 4250 },
  { id: "CL-004-11", contractId: "CTR-004", type: "Assignment", text: "ClearView Analytics shall not assign or subcontract any portion of this Statement of Work without the prior written consent of MedFirst Health System, except that ClearView Analytics may engage pre-approved subcontractors listed in Exhibit B. All subcontractors must execute BAAs and shall be bound by terms no less restrictive than this SOW.", confidence: 91, confidenceLevel: "high", obligations: ["No assignment without consent", "Pre-approved subcontractors only", "Subcontractor BAA requirement"], keyDates: [], monetaryValues: [], partyNames: ["MedFirst Health System", "ClearView Analytics"], startOffset: 4251, endOffset: 4600 },
  { id: "CL-004-12", contractId: "CTR-004", type: "Governing Law", text: "This Statement of Work shall be governed by and construed in accordance with the laws of the State of Texas, consistent with the governing law provisions of the Master Services Agreement. The parties consent to exclusive jurisdiction and venue in the courts of Texas for any actions not subject to arbitration.", confidence: 97, confidenceLevel: "high", obligations: ["Texas governing law", "Exclusive Texas jurisdiction"], keyDates: [], monetaryValues: [], partyNames: [], startOffset: 4601, endOffset: 4950 },
];

// ─── Full Document Text ──────────────────────────────────────────────────────

export const documentTexts: Record<string, string> = {
  "CTR-001": `MASTER SERVICES AGREEMENT

Effective Date: January 15, 2023
Termination Date: January 15, 2026

This Master Services Agreement ("Agreement") is entered into as of the Effective Date by and between MedFirst Health System, a Texas corporation with its principal place of business at 5200 Medical Center Drive, Houston, TX 77030 ("Covered Entity" or "Client"), and ClearView Analytics, a Delaware corporation with its principal place of business at 800 Innovation Parkway, Austin, TX 78701 ("Business Associate" or "Service Provider").

RECITALS

WHEREAS, Client operates a multi-facility health system providing inpatient, outpatient, and ambulatory care services and desires to engage Service Provider to provide healthcare data analytics, clinical decision support, and population health management services; and

WHEREAS, Service Provider possesses the expertise, personnel, and HIPAA-compliant infrastructure necessary to perform such services;

NOW, THEREFORE, in consideration of the mutual covenants and agreements set forth herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. DEFINITIONS

1.1 "Protected Health Information" or "PHI" means any individually identifiable health information as defined under 45 CFR § 160.103, including electronic PHI (ePHI), that is created, received, maintained, or transmitted in connection with the Services.

1.2 "Deliverables" means the tangible and intangible materials, including analytics dashboards, clinical reports, data models, and other work product, to be delivered by Service Provider under a Statement of Work.

1.3 "Services" means the professional services described in any Statement of Work executed under this Agreement.

1.4 "Statement of Work" or "SOW" means a written document executed by both parties that describes the specific Services to be performed, Deliverables, timeline, and fees.

2. SERVICES AND STATEMENTS OF WORK

2.1 Service Provider shall perform the Services described in each SOW in a professional and workmanlike manner consistent with healthcare industry standards and Joint Commission requirements.

2.2 Each SOW shall reference this Agreement and shall be subject to the terms and conditions herein. In the event of a conflict between this Agreement and any SOW, the terms of this Agreement shall prevail unless the SOW expressly states otherwise.

2.3 Service Provider shall assign qualified personnel with healthcare domain expertise to perform the Services and shall not replace key personnel without prior written notice to Client.

3. TERM AND RENEWAL

3.1 This Agreement shall commence on the Effective Date and continue for an initial term of three (3) years, unless earlier terminated in accordance with Section 8.

3.2 This Agreement shall automatically renew for successive one (1) year periods unless either party provides written notice of non-renewal at least ninety (90) days prior to the end of the then-current term.

4. FEES AND EXPENSES

4.1 Client shall pay Service Provider the fees set forth in each applicable SOW. Unless otherwise specified in a SOW, all fees are stated in United States Dollars.

4.2 Service Provider shall be entitled to reimbursement for reasonable, pre-approved out-of-pocket expenses incurred in connection with the Services, provided that any single expense exceeding $500 requires prior written approval from Client.

5. PAYMENT TERMS

${clauseText("CTR-001", "CL-001-02")}

6. REPRESENTATIONS AND WARRANTIES

6.1 Each party represents and warrants that: (a) it has the authority to enter into this Agreement; (b) its performance will not violate any applicable law or regulation including HIPAA; and (c) it will comply with all applicable healthcare laws in the performance of its obligations hereunder.

6.2 Service Provider represents and warrants that the Services will be performed in accordance with the specifications set forth in the applicable SOW and in compliance with all applicable professional standards and CMS regulations.

7. CONFIDENTIALITY

${clauseText("CTR-001", "CL-001-04")}

7.2 The obligations of confidentiality shall survive termination of this Agreement for a period of five (5) years, except with respect to PHI and trade secrets, which shall be protected indefinitely as required by HIPAA.

8. TERMINATION

${clauseText("CTR-001", "CL-001-01")}

8.2 Upon termination, Service Provider shall promptly return or destroy all PHI and Confidential Information of Client and shall provide a certification of such return or destruction within thirty (30) days, in compliance with 45 CFR § 164.504(e).

9. LIMITATION OF LIABILITY

${clauseText("CTR-001", "CL-001-03")}

10. HIPAA COMPLIANCE

${clauseText("CTR-001", "CL-001-05")}

11. FORCE MAJEURE

${clauseText("CTR-001", "CL-001-07")}

12. PATIENT DATA OWNERSHIP

${clauseText("CTR-001", "CL-001-08")}

13. DISPUTE RESOLUTION

13.1 The parties shall attempt to resolve any dispute arising out of or relating to this Agreement through good faith negotiation. If the dispute cannot be resolved through negotiation within thirty (30) days, either party may pursue the remedies available under Section 14.

14. GOVERNING LAW AND JURISDICTION

${clauseText("CTR-001", "CL-001-06")}

15. INSURANCE

15.1 Service Provider shall maintain, at its own expense, commercial general liability insurance with coverage of at least $2,000,000 per occurrence and $5,000,000 in the aggregate, professional liability insurance of at least $1,000,000 per claim, and cyber liability insurance of at least $5,000,000 per occurrence covering healthcare data breaches, throughout the term of this Agreement.

16. NOTICES

16.1 All notices under this Agreement shall be in writing and delivered by certified mail, overnight courier, or email (with confirmation of receipt) to the addresses set forth on the signature page or to such other address as a party may designate in writing.

17. GENERAL PROVISIONS

17.1 Entire Agreement. This Agreement, together with all SOWs, BAAs, and exhibits, constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior agreements, negotiations, and discussions.

17.2 Amendment. This Agreement may only be amended by a written instrument signed by authorized representatives of both parties.

17.3 Waiver. The failure of either party to enforce any provision of this Agreement shall not constitute a waiver of such provision or the right to enforce it at a later time.

17.4 Severability. If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.

17.5 Assignment. Neither party may assign this Agreement without the prior written consent of the other party, except in connection with a merger, acquisition, or sale of substantially all of its assets.

IN WITNESS WHEREOF, the parties have executed this Master Services Agreement as of the Effective Date.

MEDFIRST HEALTH SYSTEM               CLEARVIEW ANALYTICS
By: Dr. Rebecca Thornton              By: James Whitfield
Title: VP Legal                        Title: CEO
Date: January 10, 2023               Date: January 12, 2023`,

  "CTR-002": `AMENDMENT NO. 1 TO MASTER SERVICES AGREEMENT

Effective Date: September 1, 2023

This Amendment No. 1 ("Amendment") is entered into as of the Effective Date by and between MedFirst Health System, a Texas corporation ("Covered Entity"), and ClearView Analytics, a Delaware corporation ("Business Associate"), and amends that certain Master Services Agreement dated January 15, 2023 (the "Agreement").

RECITALS

WHEREAS, the parties entered into the Agreement for the provision of healthcare data analytics and clinical decision support services; and

WHEREAS, the parties desire to amend certain terms of the Agreement to reflect updated commercial terms, enhanced HIPAA compliance requirements, and additional cyber insurance obligations;

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. AMENDMENTS TO SECTION 5 — PAYMENT TERMS

Section 5 of the Agreement is hereby deleted in its entirety and replaced with the following:

${clauseText("CTR-002", "CL-002-02")}

2. AMENDMENTS TO SECTION 8 — TERMINATION

Section 8.1 of the Agreement is hereby deleted in its entirety and replaced with the following:

${clauseText("CTR-002", "CL-002-01")}

3. AMENDMENTS TO SECTION 9 — LIMITATION OF LIABILITY

Section 9 of the Agreement is hereby deleted in its entirety and replaced with the following:

${clauseText("CTR-002", "CL-002-03")}

4. NEW SECTION 14A — DATA PROTECTION

The following new section is added to the Agreement immediately following Section 14:

${clauseText("CTR-002", "CL-002-04")}

5. NEW SECTION 15A — INSURANCE REQUIREMENTS

The following new section is added to the Agreement immediately following Section 15:

${clauseText("CTR-002", "CL-002-05")}

6. AMENDMENTS TO SECTION 12 — INTELLECTUAL PROPERTY

Section 12.1 of the Agreement is hereby deleted in its entirety and replaced with the following:

${clauseText("CTR-002", "CL-002-06")}

7. RATIFICATION

Except as expressly amended by this Amendment, all terms and conditions of the Agreement remain in full force and effect and are hereby ratified and confirmed. In the event of any conflict between this Amendment and the Agreement, the terms of this Amendment shall prevail.

8. COUNTERPARTS

This Amendment may be executed in counterparts, each of which shall be deemed an original, and all of which together shall constitute one and the same instrument.

9. ENTIRE AMENDMENT

This Amendment, together with the Agreement and the Business Associate Agreement, constitutes the entire understanding between the parties with respect to the subject matter hereof. No modification of this Amendment shall be effective unless in writing and signed by both parties.

IN WITNESS WHEREOF, the parties have executed this Amendment No. 1 as of the Effective Date.

MEDFIRST HEALTH SYSTEM               CLEARVIEW ANALYTICS
By: Dr. Rebecca Thornton              By: James Whitfield
Title: VP Legal                        Title: CEO
Date: August 25, 2023                Date: August 28, 2023`,

  "CTR-004": `STATEMENT OF WORK #1 — EHR DATA ANALYTICS PLATFORM IMPLEMENTATION

Effective Date: April 1, 2023
Termination Date: March 31, 2024

This Statement of Work ("SOW") is entered into pursuant to the Master Services Agreement dated January 15, 2023 (the "MSA") between MedFirst Health System, a Texas corporation ("Covered Entity" or "Client"), and ClearView Analytics, a Delaware corporation ("Business Associate" or "Service Provider").

1. PROJECT OVERVIEW

The purpose of this SOW is to define the scope, deliverables, timeline, and commercial terms for the implementation of a comprehensive EHR Data Analytics Platform. The platform shall integrate with MedFirst's Epic EHR system to provide real-time clinical analytics, population health dashboards, quality measure tracking (HEDIS/CMS Star Ratings), and predictive patient risk models.

2. SCOPE OF SERVICES

ClearView Analytics shall provide the following services:
(a) EHR data extraction and HL7 FHIR integration assessment
(b) Clinical data warehouse architecture design (OMOP CDM compliant)
(c) Real-time analytics dashboard development for clinical operations
(d) Population health management module with risk stratification
(e) CMS Quality Measure reporting automation (HEDIS, Star Ratings)
(f) Predictive analytics for patient readmission risk
(g) HIPAA-compliant data pipeline implementation
(h) Clinical staff training and knowledge transfer
(i) Post-implementation support for ninety (90) days

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

8. HIPAA COMPLIANCE

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

Phase 1 — Discovery & EHR Assessment: April 1 – May 15, 2023
Phase 2 — Architecture & FHIR Integration: May 16 – June 30, 2023
Phase 3 — Platform Development & Data Pipeline: July 1 – November 30, 2023
Phase 4 — Clinical Testing & Validation: December 1 – January 31, 2024
Phase 5 — Go-Live & Clinical Hypercare: February 1 – March 31, 2024

16. KEY PERSONNEL

Project Lead (ClearView): Dr. Michael Torres, Chief Clinical Data Scientist
Account Manager (ClearView): Rachel Kim, Director of Healthcare Solutions
Project Sponsor (MedFirst): Sarah Lopez, Chief Nursing Informatics Officer
Technical Lead (MedFirst): James Wright, VP of Health Information Technology

17. ACCEPTANCE CRITERIA

Deliverables shall be deemed accepted upon written confirmation from Client's Project Sponsor or designee within ten (10) business days of delivery. If Client does not respond within such period, deliverables shall be deemed accepted.

18. ENTIRE AGREEMENT

This SOW, together with the MSA, BAA, and all exhibits and schedules attached hereto, constitutes the entire agreement between the parties with respect to the subject matter hereof. In the event of any conflict between this SOW and the MSA, the terms of the MSA shall prevail unless expressly stated otherwise herein.

IN WITNESS WHEREOF, the parties have executed this Statement of Work as of the Effective Date.

MEDFIRST HEALTH SYSTEM               CLEARVIEW ANALYTICS
By: Sarah Lopez                       By: Rachel Kim
Title: CNIO                           Title: Director of Healthcare Solutions
Date: March 25, 2023                 Date: March 27, 2023`,
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
    baseText: "ClearView Analytics shall invoice MedFirst Health System on a monthly basis. Payment shall be due within thirty (30) days of receipt of a valid invoice. Late payments shall accrue interest at the rate of 1.5% per month or the maximum rate permitted by law, whichever is less.",
    compText: "Payment shall be due within forty-five (45) days of receipt of a valid invoice. A 2% early payment discount is available for invoices paid within ten (10) days. Late payments shall accrue interest at the rate of 1.0% per month.",
    changes: [
      { type: "remove", text: "ClearView Analytics shall invoice MedFirst Health System on a monthly basis. " },
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
    baseText: "IN NO EVENT SHALL EITHER PARTY'S AGGREGATE LIABILITY UNDER THIS AGREEMENT EXCEED THE TOTAL FEES PAID OR PAYABLE BY MEDFIRST HEALTH SYSTEM IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.",
    compText: "In no event shall either party's aggregate liability under this Agreement exceed two times (2x) the total fees paid or payable by MedFirst Health System in the twelve (12) months preceding the claim.",
    changes: [
      { type: "equal", text: "In no event shall either party's aggregate liability under this Agreement exceed " },
      { type: "add", text: "two times (2x) " },
      { type: "equal", text: "the total fees paid or payable by MedFirst Health System in the twelve (12) months preceding the claim." },
    ],
  },
  {
    baseClauseId: "CL-001-04", compClauseId: null, clauseType: "Confidentiality", diffType: "unchanged",
    baseText: "Each party agrees to maintain the confidentiality of all Confidential Information received from the other party...",
    compText: "", changes: [],
  },
  {
    baseClauseId: "CL-001-05", compClauseId: null, clauseType: "HIPAA Compliance", diffType: "unchanged",
    baseText: "ClearView Analytics agrees to comply with all applicable provisions of HIPAA...",
    compText: "", changes: [],
  },
  {
    baseClauseId: null, compClauseId: "CL-002-04", clauseType: "Data Protection", diffType: "added",
    baseText: "", compText: "ClearView Analytics shall comply with all applicable data protection laws, including HIPAA, HITECH, and state health privacy laws, in the handling of any Protected Health Information processed on behalf of MedFirst Health System. ClearView Analytics shall implement appropriate administrative, technical, and physical safeguards to ensure the confidentiality, integrity, and availability of ePHI.",
    changes: [{ type: "add", text: "ClearView Analytics shall comply with all applicable data protection laws, including HIPAA, HITECH, and state health privacy laws, in the handling of any Protected Health Information processed on behalf of MedFirst Health System. ClearView Analytics shall implement appropriate administrative, technical, and physical safeguards to ensure the confidentiality, integrity, and availability of ePHI." }],
  },
  {
    baseClauseId: null, compClauseId: "CL-002-05", clauseType: "Insurance", diffType: "added",
    baseText: "", compText: "ClearView Analytics shall maintain commercial general liability insurance of not less than $5,000,000 per occurrence and professional liability (E&O) insurance of not less than $2,000,000 per claim, plus cyber liability insurance of $10,000,000 covering healthcare data breaches throughout the term of this Agreement.",
    changes: [{ type: "add", text: "ClearView Analytics shall maintain commercial general liability insurance of not less than $5,000,000 per occurrence and professional liability (E&O) insurance of not less than $2,000,000 per claim, plus cyber liability insurance of $10,000,000 covering healthcare data breaches throughout the term of this Agreement." }],
  },
  {
    baseClauseId: "CL-001-08", compClauseId: "CL-002-06", clauseType: "Intellectual Property", diffType: "modified",
    baseText: "All patient data, including but not limited to Protected Health Information (PHI), Electronic Health Records (EHR), and de-identified datasets, processed by ClearView Analytics shall remain the exclusive property of MedFirst Health System.",
    compText: "All intellectual property rights in any deliverables created by ClearView Analytics specifically for MedFirst Health System shall be assigned to MedFirst upon acceptance (rather than upon full payment). ClearView Analytics grants MedFirst Health System a perpetual, royalty-free license to use any ClearView pre-existing IP incorporated into deliverables.",
    changes: [
      { type: "remove", text: "All patient data, including but not limited to Protected Health Information (PHI), Electronic Health Records (EHR), and de-identified datasets, processed by ClearView Analytics shall remain the exclusive property of MedFirst Health System" },
      { type: "add", text: "All intellectual property rights in any deliverables created by ClearView Analytics specifically for MedFirst Health System shall be assigned to MedFirst upon acceptance (rather than upon full payment). ClearView Analytics grants MedFirst Health System a perpetual, royalty-free license to use any ClearView pre-existing IP incorporated into deliverables" },
      { type: "equal", text: "." },
    ],
  },
];

// ─── Mock Obligations ────────────────────────────────────────────────────────

export const obligations: Obligation[] = [
  // MedFirst / ClearView obligations
  { id: "OBL-001", contractId: "CTR-001", clauseId: "CL-001-05", title: "Annual HIPAA Security Risk Assessment", description: "ClearView Analytics must complete and submit annual HIPAA Security Risk Assessment to MedFirst Health System", category: "compliance", status: "upcoming", dueDate: "2026-01-15", owner: "ClearView Analytics", riskLevel: "high", lastChecked: "2025-12-15T10:00:00Z", evidence: "Last assessment completed Jan 2025" },
  { id: "OBL-002", contractId: "CTR-001", clauseId: "CL-001-02", title: "Monthly Invoice Submission", description: "ClearView Analytics must submit monthly invoices; MedFirst must pay within 30 days", category: "financial", status: "compliant", dueDate: "2026-02-01", owner: "ClearView Analytics", riskLevel: "low", lastChecked: "2026-01-28T09:00:00Z", evidence: "Invoice #INV-2026-01 submitted on time" },
  { id: "OBL-003", contractId: "CTR-003", clauseId: "CL-001-05", title: "BAA Compliance Certification", description: "Annual certification that ClearView maintains HIPAA-compliant safeguards for PHI", category: "compliance", status: "at_risk", dueDate: "2026-01-15", owner: "ClearView Analytics", riskLevel: "high", lastChecked: "2025-12-20T14:00:00Z", evidence: "Certification pending — awaiting updated SOC 2 Type II report" },
  { id: "OBL-004", contractId: "CTR-004", clauseId: "CL-004-08", title: "Cyber Liability Insurance Renewal", description: "Maintain $10M cyber liability insurance coverage for healthcare data breaches", category: "insurance", status: "compliant", dueDate: "2026-04-01", owner: "ClearView Analytics", riskLevel: "medium", lastChecked: "2025-11-15T10:00:00Z", evidence: "Policy renewed through March 2027" },
  { id: "OBL-005", contractId: "CTR-004", clauseId: "CL-004-01", title: "Q1 2026 Payment — EHR Analytics SOW", description: "Quarterly payment of $312,500 for EHR Data Analytics Platform", category: "financial", status: "overdue", dueDate: "2026-01-01", owner: "MedFirst Health System", riskLevel: "high", lastChecked: "2026-02-10T09:00:00Z" },
  { id: "OBL-006", contractId: "CTR-004", clauseId: "CL-004-04", title: "Platform Uptime SLA — 99.5%", description: "EHR Analytics Platform must maintain 99.5% uptime per warranty terms", category: "operational", status: "compliant", dueDate: "2026-03-31", owner: "ClearView Analytics", riskLevel: "low", lastChecked: "2026-02-01T08:00:00Z", evidence: "Current uptime: 99.7% (last 30 days)" },
  { id: "OBL-007", contractId: "CTR-004", clauseId: "CL-004-06", title: "Personnel HIPAA Training Completion", description: "All ClearView personnel with PHI access must complete annual HIPAA training", category: "compliance", status: "at_risk", dueDate: "2026-03-01", owner: "ClearView Analytics", riskLevel: "medium", lastChecked: "2026-01-15T11:00:00Z", evidence: "18/22 personnel completed; 4 pending" },
  // Sunrise / MedSecure obligations
  { id: "OBL-008", contractId: "CTR-005", clauseId: "CL-001-01", title: "MSA Renewal Decision", description: "90-day notice required if either party intends not to renew the MSA", category: "operational", status: "upcoming", dueDate: "2027-03-01", owner: "Sunrise Hospital Network", riskLevel: "low", lastChecked: "2026-01-10T09:00:00Z" },
  { id: "OBL-009", contractId: "CTR-006", clauseId: "CL-001-05", title: "BAA Breach Notification Protocol Test", description: "Annual test of PHI breach notification procedures per BAA requirements", category: "compliance", status: "upcoming", dueDate: "2026-06-01", owner: "MedSecure Solutions", riskLevel: "medium", lastChecked: "2025-06-15T10:00:00Z", evidence: "Last test completed June 2025" },
  { id: "OBL-010", contractId: "CTR-012", clauseId: "CL-004-09", title: "HIPAA Security Risk Assessment Delivery", description: "Complete and deliver HIPAA Security Risk Assessment findings to Sunrise Hospital", category: "reporting", status: "compliant", dueDate: "2025-10-01", owner: "MedSecure Solutions", riskLevel: "low", lastChecked: "2025-10-01T10:00:00Z", evidence: "Assessment delivered on Sept 28, 2025" },
  // Pacific Care / HealthBridge
  { id: "OBL-011", contractId: "CTR-008", clauseId: "CL-001-01", title: "SLA Performance Review — Q4", description: "Quarterly review of telehealth platform SLA metrics", category: "operational", status: "at_risk", dueDate: "2026-03-01", owner: "HealthBridge Technologies", riskLevel: "medium", lastChecked: "2025-12-20T16:00:00Z", evidence: "Q3 metrics showed 98.8% uptime vs 99.5% SLA target" },
  { id: "OBL-012", contractId: "CTR-014", clauseId: "CL-001-02", title: "Annual Rate Escalation Review", description: "Review and negotiate annual rate adjustments per MSA Section 4.3", category: "financial", status: "upcoming", dueDate: "2026-01-01", owner: "Pacific Care Alliance", riskLevel: "low", lastChecked: "2025-11-15T10:00:00Z" },
  // Mountain Valley / PharmaCo (expired but tracked)
  { id: "OBL-013", contractId: "CTR-009", clauseId: "CL-001-04", title: "Post-Termination Data Return", description: "PharmaCo must return or certify destruction of all confidential supply chain data within 30 days of contract expiry", category: "compliance", status: "overdue", dueDate: "2025-08-01", owner: "PharmaCo Distributions", riskLevel: "high", lastChecked: "2026-01-05T09:00:00Z", evidence: "Data destruction certification not received" },
  { id: "OBL-014", contractId: "CTR-009", clauseId: "CL-001-03", title: "Final Settlement Payment", description: "Outstanding balance of $45,000 for final quarter services", category: "financial", status: "overdue", dueDate: "2025-10-01", owner: "Mountain Valley Medical Center", riskLevel: "high", lastChecked: "2026-01-05T09:00:00Z" },
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

export function getObligationsForContract(contractId: string): Obligation[] {
  return obligations.filter((o) => o.contractId === contractId);
}

export function getObligationsByStatus(status: ObligationStatus): Obligation[] {
  return obligations.filter((o) => o.status === status);
}

// ─── KPI Data ────────────────────────────────────────────────────────────────

export const kpiData = {
  totalContracts: contracts.length,
  totalFamilies: families.length,
  pendingReviews: contracts.filter((c) => c.status === "pending_review").length,
  processingErrors: uploadQueue.filter((u) => u.status === "failed").length,
  overdueObligations: obligations.filter((o) => o.status === "overdue").length,
  atRiskObligations: obligations.filter((o) => o.status === "at_risk").length,
  hipaaContracts: contracts.filter((c) => c.type === "BAA" || families.find(f => f.id === c.familyId)?.tags.includes("HIPAA")).length,
};
