/* ─── V2 Mock Data: Healthcare Provider CLM ─── */

export type ContractStatus = "draft" | "in_review" | "approved" | "executed" | "expired" | "terminated";
export type ContractType = "payer_agreement" | "provider_network" | "baa" | "employment" | "vendor" | "lease" | "amendment";
export type ObligationStatus = "compliant" | "at_risk" | "overdue" | "upcoming" | "completed";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type RedlineStatus = "pending" | "accepted" | "rejected" | "counter";
export type PipelineStage = "draft" | "internal_review" | "pricing" | "legal" | "approved" | "signed";

export interface PipelineContract {
  id: string;
  title: string;
  type: ContractType;
  counterparty: string;
  stage: PipelineStage;
  owner: string;
  value: number;
  createdDate: string;
  lastModified: string;
  stageHistory: { stage: PipelineStage; date: string; by: string }[];
  sharedWith: string[];
  daysInStage: number;
  priority: RiskLevel;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
}

export interface V2Contract {
  id: string;
  title: string;
  type: ContractType;
  status: ContractStatus;
  counterparty: string;
  effectiveDate: string;
  expirationDate: string;
  value: number;
  owner: string;
  lastModified: string;
  tags: string[];
  riskScore: number;
  completeness: number;
  clauses: number;
  obligations: number;
}

export interface PlaybookTemplate {
  id: string;
  name: string;
  type: ContractType;
  description: string;
  clauses: number;
  lastUsed: string;
  usageCount: number;
}

export interface RedlineChange {
  id: string;
  contractId: string;
  clauseTitle: string;
  originalText: string;
  proposedText: string;
  author: string;
  timestamp: string;
  status: RedlineStatus;
  deviationSeverity: RiskLevel;
  playbookClause?: string;
  comment?: string;
}

export interface V2Obligation {
  id: string;
  contractId: string;
  contractTitle: string;
  title: string;
  description: string;
  dueDate: string;
  status: ObligationStatus;
  risk: RiskLevel;
  owner: string;
  category: string;
  recurrence: string;
  lastAction?: string;
}

export interface UploadedDocument {
  id: string;
  fileName: string;
  uploadDate: string;
  size: string;
  status: "queued" | "ocr_processing" | "ai_extraction" | "review" | "completed" | "failed";
  progress: number;
  ocrConfidence?: number;
  extractedClauses?: number;
  contractType?: ContractType;
  uploadedBy: string;
}

/* ─── Playbook Templates ─── */
export const playbookTemplates: PlaybookTemplate[] = [
  { id: "PB001", name: "Payer Agreement — Standard", type: "payer_agreement", description: "Standard managed care agreement with BCBS-style terms, fee schedules, and timely filing requirements.", clauses: 42, lastUsed: "2026-03-10", usageCount: 28 },
  { id: "PB002", name: "BAA — HIPAA Compliant", type: "baa", description: "Business Associate Agreement with full HIPAA/HITECH safeguards, breach notification, and PHI handling protocols.", clauses: 18, lastUsed: "2026-03-12", usageCount: 45 },
  { id: "PB003", name: "Provider Network Participation", type: "provider_network", description: "Network participation agreement covering credentialing, panel requirements, and reimbursement terms.", clauses: 36, lastUsed: "2026-02-28", usageCount: 15 },
  { id: "PB004", name: "Physician Employment Agreement", type: "employment", description: "Employment contract template for physicians including compensation, non-compete, tail coverage, and call schedules.", clauses: 31, lastUsed: "2026-03-08", usageCount: 22 },
  { id: "PB005", name: "Medical Equipment Vendor", type: "vendor", description: "Vendor agreement for medical devices/equipment with warranty, maintenance SLAs, and compliance certifications.", clauses: 24, lastUsed: "2026-03-01", usageCount: 9 },
  { id: "PB006", name: "Facility Lease — Clinical Space", type: "lease", description: "Commercial lease template for clinical facilities with Stark Law safe harbor provisions.", clauses: 28, lastUsed: "2026-02-15", usageCount: 6 },
];

/* ─── Contracts ─── */
export const v2Contracts: V2Contract[] = [
  { id: "CTR-2026-001", title: "BCBS PPO Network Agreement — Southeast Region", type: "payer_agreement", status: "executed", counterparty: "BlueCross BlueShield of Georgia", effectiveDate: "2025-07-01", expirationDate: "2027-06-30", value: 2400000, owner: "Dr. Sarah Chen", lastModified: "2026-03-10", tags: ["ppo", "southeast", "fee-schedule"], riskScore: 22, completeness: 100, clauses: 48, obligations: 12 },
  { id: "CTR-2026-002", title: "Aetna HMO Participation Agreement", type: "provider_network", status: "in_review", counterparty: "Aetna Health Inc.", effectiveDate: "2026-04-01", expirationDate: "2028-03-31", value: 1800000, owner: "James Rodriguez", lastModified: "2026-03-14", tags: ["hmo", "credentialing", "value-based"], riskScore: 45, completeness: 82, clauses: 36, obligations: 8 },
  { id: "CTR-2026-003", title: "BAA — Clearinghouse Data Exchange", type: "baa", status: "executed", counterparty: "MedClear Solutions", effectiveDate: "2026-01-01", expirationDate: "2027-12-31", value: 120000, owner: "Patricia Wang", lastModified: "2026-02-28", tags: ["hipaa", "phi", "edi"], riskScore: 18, completeness: 100, clauses: 18, obligations: 6 },
  { id: "CTR-2026-004", title: "Dr. Michael Foster — Cardiology Employment", type: "employment", status: "draft", counterparty: "Michael Foster, MD", effectiveDate: "2026-06-01", expirationDate: "2029-05-31", value: 890000, owner: "HR Department", lastModified: "2026-03-15", tags: ["cardiology", "employment", "non-compete"], riskScore: 35, completeness: 64, clauses: 31, obligations: 5 },
  { id: "CTR-2026-005", title: "UnitedHealth Value-Based Care Agreement", type: "payer_agreement", status: "in_review", counterparty: "UnitedHealth Group", effectiveDate: "2026-05-01", expirationDate: "2028-04-30", value: 3200000, owner: "Dr. Sarah Chen", lastModified: "2026-03-13", tags: ["value-based", "quality-metrics", "shared-savings"], riskScore: 52, completeness: 71, clauses: 54, obligations: 18 },
  { id: "CTR-2026-006", title: "Philips Medical Equipment — MRI Suite", type: "vendor", status: "approved", counterparty: "Philips Healthcare", effectiveDate: "2026-04-15", expirationDate: "2031-04-14", value: 4500000, owner: "Facilities Dept", lastModified: "2026-03-11", tags: ["equipment", "mri", "maintenance"], riskScore: 28, completeness: 95, clauses: 24, obligations: 9 },
  { id: "CTR-2026-007", title: "Cigna Behavioral Health Carve-Out", type: "payer_agreement", status: "executed", counterparty: "Cigna Behavioral Health", effectiveDate: "2025-09-01", expirationDate: "2027-08-31", value: 680000, owner: "Dr. Lisa Park", lastModified: "2026-01-20", tags: ["behavioral", "carve-out", "telehealth"], riskScore: 15, completeness: 100, clauses: 32, obligations: 7 },
  { id: "CTR-2026-008", title: "Clinical Space Lease — Downtown Campus", type: "lease", status: "executed", counterparty: "Metro Health Properties LLC", effectiveDate: "2024-01-01", expirationDate: "2034-12-31", value: 8400000, owner: "Facilities Dept", lastModified: "2026-02-10", tags: ["lease", "stark-law", "downtown"], riskScore: 12, completeness: 100, clauses: 28, obligations: 4 },
  { id: "CTR-2026-009", title: "Amendment #3 — BCBS Fee Schedule Update", type: "amendment", status: "draft", counterparty: "BlueCross BlueShield of Georgia", effectiveDate: "2026-07-01", expirationDate: "2027-06-30", value: 0, owner: "James Rodriguez", lastModified: "2026-03-15", tags: ["amendment", "fee-schedule", "cpt-update"], riskScore: 30, completeness: 45, clauses: 8, obligations: 2 },
  { id: "CTR-2026-010", title: "Humana Medicare Advantage Agreement", type: "payer_agreement", status: "expired", counterparty: "Humana Inc.", effectiveDate: "2023-01-01", expirationDate: "2025-12-31", value: 1500000, owner: "Dr. Sarah Chen", lastModified: "2025-11-15", tags: ["medicare", "advantage", "expired"], riskScore: 68, completeness: 100, clauses: 44, obligations: 14 },
];

/* ─── Redline Changes ─── */
export const redlineChanges: RedlineChange[] = [
  { id: "RL001", contractId: "CTR-2026-002", clauseTitle: "§4.2 Timely Filing", originalText: "Provider shall submit all claims within ninety (90) days of the date of service.", proposedText: "Provider shall submit all claims within one hundred twenty (120) days of the date of service.", author: "Aetna Legal", timestamp: "2026-03-14T10:30:00", status: "pending", deviationSeverity: "medium", playbookClause: "Claims must be filed within 90 days per standard terms.", comment: "Requesting extended filing window due to EHR migration." },
  { id: "RL002", contractId: "CTR-2026-002", clauseTitle: "§7.1 Reimbursement Rates", originalText: "Reimbursement shall be calculated at 120% of the current Medicare Fee Schedule.", proposedText: "Reimbursement shall be calculated at 105% of the current Medicare Fee Schedule.", author: "Aetna Finance", timestamp: "2026-03-14T11:15:00", status: "pending", deviationSeverity: "critical", playbookClause: "Minimum acceptable rate is 115% of Medicare Fee Schedule.", comment: "Below our minimum threshold — escalate to CFO." },
  { id: "RL003", contractId: "CTR-2026-002", clauseTitle: "§9.3 Termination Without Cause", originalText: "Either party may terminate this Agreement without cause upon ninety (90) days written notice.", proposedText: "Either party may terminate this Agreement without cause upon sixty (60) days written notice.", author: "Aetna Legal", timestamp: "2026-03-14T14:00:00", status: "rejected", deviationSeverity: "high", playbookClause: "Minimum 90-day notice period required for without-cause termination." },
  { id: "RL004", contractId: "CTR-2026-005", clauseTitle: "§3.1 Quality Metrics", originalText: "Provider shall maintain a minimum HEDIS score of 4.0 across all measured domains.", proposedText: "Provider shall maintain a minimum HEDIS score of 3.5 across all measured domains with a remediation plan for any domain below 3.0.", author: "UHG Quality Dept", timestamp: "2026-03-13T09:45:00", status: "counter", deviationSeverity: "medium", playbookClause: "HEDIS minimum of 4.0 is standard for Tier 1 providers.", comment: "Counter: Accept 3.5 minimum but require quarterly reporting." },
  { id: "RL005", contractId: "CTR-2026-005", clauseTitle: "§5.2 Shared Savings Distribution", originalText: "Shared savings shall be distributed 60/40 in favor of the Provider.", proposedText: "Shared savings shall be distributed 50/50 between Provider and Payer.", author: "UHG Finance", timestamp: "2026-03-13T16:20:00", status: "pending", deviationSeverity: "high", playbookClause: "Minimum 55/45 split favoring Provider for shared savings programs." },
  { id: "RL006", contractId: "CTR-2026-005", clauseTitle: "§11.4 Data Sharing & Analytics", originalText: "Payer shall provide monthly claims data within fifteen (15) business days of month-end.", proposedText: "Payer shall provide monthly claims data within thirty (30) business days of month-end.", author: "UHG IT", timestamp: "2026-03-13T11:00:00", status: "accepted", deviationSeverity: "low", playbookClause: "Data delivery within 15 business days preferred but 30 acceptable." },
  { id: "RL007", contractId: "CTR-2026-009", clauseTitle: "§2.1 CPT Code Updates", originalText: "Fee schedule shall incorporate the current year AMA CPT code set effective January 1.", proposedText: "Fee schedule shall incorporate the current year AMA CPT code set effective July 1, with retroactive adjustments.", author: "BCBS Contracts", timestamp: "2026-03-15T08:30:00", status: "pending", deviationSeverity: "medium", playbookClause: "CPT updates should be effective January 1 each year." },
];

/* ─── Obligations ─── */
export const v2Obligations: V2Obligation[] = [
  { id: "OBL001", contractId: "CTR-2026-001", contractTitle: "BCBS PPO Network Agreement", title: "Submit quarterly quality metrics report", description: "HEDIS measures, patient satisfaction scores, and readmission rates due to BCBS.", dueDate: "2026-03-31", status: "upcoming", risk: "low", owner: "Quality Dept", category: "Reporting", recurrence: "Quarterly" },
  { id: "OBL002", contractId: "CTR-2026-001", contractTitle: "BCBS PPO Network Agreement", title: "Annual credentialing verification", description: "All participating providers must complete re-credentialing with updated licenses and certifications.", dueDate: "2026-06-30", status: "upcoming", risk: "medium", owner: "Medical Staff Office", category: "Credentialing", recurrence: "Annual" },
  { id: "OBL003", contractId: "CTR-2026-003", contractTitle: "BAA — Clearinghouse Data Exchange", title: "HIPAA security risk assessment", description: "Conduct and document annual security risk assessment per BAA requirements.", dueDate: "2026-03-15", status: "overdue", risk: "critical", owner: "IT Security", category: "Compliance", recurrence: "Annual", lastAction: "Reminder sent 2026-03-10" },
  { id: "OBL004", contractId: "CTR-2026-007", contractTitle: "Cigna Behavioral Health Carve-Out", title: "Telehealth utilization report", description: "Monthly report on telehealth visit volume and outcomes for behavioral health services.", dueDate: "2026-03-20", status: "at_risk", risk: "medium", owner: "Dr. Lisa Park", category: "Reporting", recurrence: "Monthly" },
  { id: "OBL005", contractId: "CTR-2026-006", contractTitle: "Philips Medical Equipment — MRI Suite", title: "Preventive maintenance — MRI", description: "Quarterly preventive maintenance as per equipment warranty requirements.", dueDate: "2026-04-15", status: "upcoming", risk: "low", owner: "Facilities Dept", category: "Maintenance", recurrence: "Quarterly" },
  { id: "OBL006", contractId: "CTR-2026-001", contractTitle: "BCBS PPO Network Agreement", title: "Claims reconciliation audit", description: "Bi-annual claims reconciliation and underpayment recovery analysis.", dueDate: "2026-02-28", status: "overdue", risk: "high", owner: "Revenue Cycle", category: "Financial", recurrence: "Bi-annual", lastAction: "Audit team assigned 2026-02-20" },
  { id: "OBL007", contractId: "CTR-2026-005", contractTitle: "UnitedHealth Value-Based Care Agreement", title: "Shared savings calculation submission", description: "Submit verified shared savings calculation with supporting claims data.", dueDate: "2026-04-30", status: "upcoming", risk: "medium", owner: "Finance Dept", category: "Financial", recurrence: "Annual" },
  { id: "OBL008", contractId: "CTR-2026-008", contractTitle: "Clinical Space Lease — Downtown Campus", title: "Insurance certificate renewal", description: "Provide updated certificate of insurance meeting landlord requirements.", dueDate: "2026-03-25", status: "at_risk", risk: "medium", owner: "Risk Management", category: "Compliance", recurrence: "Annual" },
  { id: "OBL009", contractId: "CTR-2026-001", contractTitle: "BCBS PPO Network Agreement", title: "Network adequacy report", description: "Demonstrate compliance with minimum provider-to-member ratios by specialty.", dueDate: "2026-05-15", status: "upcoming", risk: "low", owner: "Network Ops", category: "Compliance", recurrence: "Semi-annual" },
  { id: "OBL010", contractId: "CTR-2026-010", contractTitle: "Humana Medicare Advantage Agreement", title: "Contract renewal negotiation", description: "Expired contract requires renegotiation or formal termination documentation.", dueDate: "2026-01-15", status: "overdue", risk: "critical", owner: "Dr. Sarah Chen", category: "Contract Lifecycle", recurrence: "One-time", lastAction: "Initial outreach sent 2025-12-01" },
  { id: "OBL011", contractId: "CTR-2026-003", contractTitle: "BAA — Clearinghouse Data Exchange", title: "PHI access log review", description: "Monthly review of all PHI access logs for unauthorized access patterns.", dueDate: "2026-03-31", status: "upcoming", risk: "low", owner: "Privacy Officer", category: "Compliance", recurrence: "Monthly" },
  { id: "OBL012", contractId: "CTR-2026-004", contractTitle: "Dr. Michael Foster — Cardiology Employment", title: "Compensation benchmarking review", description: "Annual FMV assessment of physician compensation per Stark Law requirements.", dueDate: "2026-05-31", status: "upcoming", risk: "medium", owner: "Compliance Dept", category: "Compliance", recurrence: "Annual" },
];

/* ─── Uploaded Documents ─── */
export const uploadedDocuments: UploadedDocument[] = [
  { id: "DOC001", fileName: "BCBS_Agreement_2019_Signed.pdf", uploadDate: "2026-03-14", size: "4.2 MB", status: "completed", progress: 100, ocrConfidence: 94, extractedClauses: 38, contractType: "payer_agreement", uploadedBy: "Admin" },
  { id: "DOC002", fileName: "Aetna_Provider_Manual_2020.pdf", uploadDate: "2026-03-14", size: "12.8 MB", status: "ai_extraction", progress: 65, ocrConfidence: 88, uploadedBy: "James Rodriguez" },
  { id: "DOC003", fileName: "Old_BAA_LabCorp_2018.pdf", uploadDate: "2026-03-15", size: "1.1 MB", status: "ocr_processing", progress: 30, uploadedBy: "Patricia Wang" },
  { id: "DOC004", fileName: "Humana_MA_Agreement_2023.pdf", uploadDate: "2026-03-15", size: "6.5 MB", status: "review", progress: 90, ocrConfidence: 91, extractedClauses: 44, contractType: "payer_agreement", uploadedBy: "Admin" },
  { id: "DOC005", fileName: "Equipment_Lease_Siemens_2017.pdf", uploadDate: "2026-03-15", size: "3.3 MB", status: "queued", progress: 0, uploadedBy: "Facilities Dept" },
  { id: "DOC006", fileName: "Physician_Employment_Template_v2.docx", uploadDate: "2026-03-15", size: "890 KB", status: "failed", progress: 15, uploadedBy: "HR Department" },
  { id: "DOC007", fileName: "Cigna_BH_Amendment_2024.pdf", uploadDate: "2026-03-16", size: "2.1 MB", status: "ai_extraction", progress: 50, ocrConfidence: 96, uploadedBy: "Dr. Lisa Park" },
];

/* ─── Team Members ─── */
export const teamMembers: TeamMember[] = [
  { id: "TM001", name: "Dr. Sarah Chen", role: "Chief Medical Officer", department: "Executive" },
  { id: "TM002", name: "James Rodriguez", role: "Contract Manager", department: "Legal" },
  { id: "TM003", name: "Patricia Wang", role: "Compliance Officer", department: "Compliance" },
  { id: "TM004", name: "Michael Torres", role: "Pricing Analyst", department: "Finance" },
  { id: "TM005", name: "Angela Davis", role: "Senior Counsel", department: "Legal" },
  { id: "TM006", name: "Robert Kim", role: "VP Revenue Cycle", department: "Finance" },
  { id: "TM007", name: "Lisa Park", role: "Director of Behavioral Health", department: "Clinical" },
  { id: "TM008", name: "David Chen", role: "Pricing Director", department: "Finance" },
];

/* ─── Pipeline Contracts ─── */
export const pipelineContracts: PipelineContract[] = [
  { id: "PL-001", title: "Anthem BCBS — Value-Based Primary Care", type: "payer_agreement", counterparty: "Anthem BCBS", stage: "draft", owner: "James Rodriguez", value: 2100000, createdDate: "2026-03-15", lastModified: "2026-03-18", stageHistory: [{ stage: "draft", date: "2026-03-15", by: "James Rodriguez" }], sharedWith: [], daysInStage: 3, priority: "medium" },
  { id: "PL-002", title: "Cigna PPO — Specialty Network Expansion", type: "provider_network", counterparty: "Cigna Health", stage: "internal_review", owner: "Dr. Sarah Chen", value: 1500000, createdDate: "2026-03-10", lastModified: "2026-03-16", stageHistory: [{ stage: "draft", date: "2026-03-10", by: "Dr. Sarah Chen" }, { stage: "internal_review", date: "2026-03-14", by: "Dr. Sarah Chen" }], sharedWith: ["TM002", "TM005"], daysInStage: 4, priority: "high" },
  { id: "PL-003", title: "UnitedHealth — Cardiology Capitation Agreement", type: "payer_agreement", counterparty: "UnitedHealth Group", stage: "pricing", owner: "Robert Kim", value: 3800000, createdDate: "2026-03-01", lastModified: "2026-03-15", stageHistory: [{ stage: "draft", date: "2026-03-01", by: "Robert Kim" }, { stage: "internal_review", date: "2026-03-05", by: "James Rodriguez" }, { stage: "pricing", date: "2026-03-10", by: "Robert Kim" }], sharedWith: ["TM004", "TM008"], daysInStage: 8, priority: "critical" },
  { id: "PL-004", title: "Medline Equipment Supply — Surgical Suite", type: "vendor", counterparty: "Medline Industries", stage: "pricing", owner: "Facilities Dept", value: 950000, createdDate: "2026-03-05", lastModified: "2026-03-17", stageHistory: [{ stage: "draft", date: "2026-03-05", by: "Facilities Dept" }, { stage: "internal_review", date: "2026-03-08", by: "Patricia Wang" }, { stage: "pricing", date: "2026-03-12", by: "Michael Torres" }], sharedWith: ["TM004", "TM006"], daysInStage: 6, priority: "low" },
  { id: "PL-005", title: "BAA — TeleDoc AI Platform", type: "baa", counterparty: "TeleDoc Health", stage: "legal", owner: "Patricia Wang", value: 240000, createdDate: "2026-02-28", lastModified: "2026-03-18", stageHistory: [{ stage: "draft", date: "2026-02-28", by: "Patricia Wang" }, { stage: "internal_review", date: "2026-03-03", by: "James Rodriguez" }, { stage: "pricing", date: "2026-03-08", by: "Michael Torres" }, { stage: "legal", date: "2026-03-14", by: "Angela Davis" }], sharedWith: ["TM002", "TM005", "TM003"], daysInStage: 4, priority: "high" },
  { id: "PL-006", title: "Dr. Rachel Moore — Oncology Employment", type: "employment", counterparty: "Rachel Moore, MD", stage: "legal", owner: "HR Department", value: 720000, createdDate: "2026-03-02", lastModified: "2026-03-17", stageHistory: [{ stage: "draft", date: "2026-03-02", by: "HR Department" }, { stage: "internal_review", date: "2026-03-05", by: "Dr. Sarah Chen" }, { stage: "pricing", date: "2026-03-09", by: "Robert Kim" }, { stage: "legal", date: "2026-03-13", by: "Angela Davis" }], sharedWith: ["TM005", "TM001"], daysInStage: 5, priority: "medium" },
  { id: "PL-007", title: "Aetna Medicare Supplement — Region IV", type: "payer_agreement", counterparty: "Aetna Inc.", stage: "approved", owner: "James Rodriguez", value: 1900000, createdDate: "2026-02-20", lastModified: "2026-03-16", stageHistory: [{ stage: "draft", date: "2026-02-20", by: "James Rodriguez" }, { stage: "internal_review", date: "2026-02-24", by: "Dr. Sarah Chen" }, { stage: "pricing", date: "2026-03-01", by: "David Chen" }, { stage: "legal", date: "2026-03-07", by: "Angela Davis" }, { stage: "approved", date: "2026-03-14", by: "Dr. Sarah Chen" }], sharedWith: ["TM001", "TM005", "TM004"], daysInStage: 4, priority: "medium" },
  { id: "PL-008", title: "Clinical Space Lease — Northside Campus", type: "lease", counterparty: "Northside Properties", stage: "approved", owner: "Facilities Dept", value: 5200000, createdDate: "2026-02-15", lastModified: "2026-03-18", stageHistory: [{ stage: "draft", date: "2026-02-15", by: "Facilities Dept" }, { stage: "internal_review", date: "2026-02-20", by: "Patricia Wang" }, { stage: "pricing", date: "2026-02-25", by: "Robert Kim" }, { stage: "legal", date: "2026-03-03", by: "Angela Davis" }, { stage: "approved", date: "2026-03-15", by: "Dr. Sarah Chen" }], sharedWith: ["TM003", "TM005", "TM006"], daysInStage: 3, priority: "low" },
  { id: "PL-009", title: "Humana — Behavioral Health Carve-In", type: "payer_agreement", counterparty: "Humana Inc.", stage: "signed", owner: "Dr. Lisa Park", value: 1100000, createdDate: "2026-02-01", lastModified: "2026-03-12", stageHistory: [{ stage: "draft", date: "2026-02-01", by: "Dr. Lisa Park" }, { stage: "internal_review", date: "2026-02-05", by: "James Rodriguez" }, { stage: "pricing", date: "2026-02-10", by: "Michael Torres" }, { stage: "legal", date: "2026-02-17", by: "Angela Davis" }, { stage: "approved", date: "2026-02-25", by: "Dr. Sarah Chen" }, { stage: "signed", date: "2026-03-12", by: "Dr. Sarah Chen" }], sharedWith: ["TM001", "TM002", "TM005", "TM004"], daysInStage: 6, priority: "low" },
  { id: "PL-010", title: "BCBS Fee Schedule Amendment Q3", type: "amendment", counterparty: "BCBS of Georgia", stage: "draft", owner: "James Rodriguez", value: 0, createdDate: "2026-03-18", lastModified: "2026-03-18", stageHistory: [{ stage: "draft", date: "2026-03-18", by: "James Rodriguez" }], sharedWith: [], daysInStage: 0, priority: "medium" },
  { id: "PL-011", title: "LabCorp — Reference Lab Services BAA", type: "baa", counterparty: "LabCorp", stage: "internal_review", owner: "Patricia Wang", value: 380000, createdDate: "2026-03-08", lastModified: "2026-03-17", stageHistory: [{ stage: "draft", date: "2026-03-08", by: "Patricia Wang" }, { stage: "internal_review", date: "2026-03-13", by: "James Rodriguez" }], sharedWith: ["TM002"], daysInStage: 5, priority: "low" },
  { id: "PL-012", title: "Molina Healthcare — Medicaid Managed Care", type: "payer_agreement", counterparty: "Molina Healthcare", stage: "signed", owner: "Dr. Sarah Chen", value: 2800000, createdDate: "2026-01-15", lastModified: "2026-03-05", stageHistory: [{ stage: "draft", date: "2026-01-15", by: "James Rodriguez" }, { stage: "internal_review", date: "2026-01-22", by: "Dr. Sarah Chen" }, { stage: "pricing", date: "2026-02-01", by: "David Chen" }, { stage: "legal", date: "2026-02-10", by: "Angela Davis" }, { stage: "approved", date: "2026-02-20", by: "Dr. Sarah Chen" }, { stage: "signed", date: "2026-03-05", by: "Dr. Sarah Chen" }], sharedWith: ["TM001", "TM002", "TM004", "TM005", "TM008"], daysInStage: 13, priority: "low" },
];

/* ─── Dashboard KPIs ─── */
export const v2KpiData = {
  totalContracts: v2Contracts.length,
  activeContracts: v2Contracts.filter(c => c.status === "executed").length,
  draftsInProgress: v2Contracts.filter(c => c.status === "draft").length,
  inReview: v2Contracts.filter(c => c.status === "in_review").length,
  expiredContracts: v2Contracts.filter(c => c.status === "expired").length,
  totalValue: v2Contracts.reduce((sum, c) => sum + c.value, 0),
  avgRiskScore: Math.round(v2Contracts.reduce((sum, c) => sum + c.riskScore, 0) / v2Contracts.length),
  pendingRedlines: redlineChanges.filter(r => r.status === "pending").length,
  criticalObligations: v2Obligations.filter(o => o.risk === "critical").length,
  overdueObligations: v2Obligations.filter(o => o.status === "overdue").length,
  upcomingObligations: v2Obligations.filter(o => o.status === "upcoming").length,
  complianceScore: Math.round((v2Obligations.filter(o => o.status === "compliant" || o.status === "completed" || o.status === "upcoming").length / v2Obligations.length) * 100),
  documentsProcessing: uploadedDocuments.filter(d => d.status !== "completed" && d.status !== "failed").length,
};
