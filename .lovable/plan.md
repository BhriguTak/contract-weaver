
# Contract Intelligence Platform — Proof of Concept

A contract analysis web app that lets legal and business users upload contracts, inspect clause-level extractions, explore contract families, and visually compare clause changes across related documents. Built with mock data to validate the full UI/UX before wiring up real parsing.

---

## Design System & Foundation

- **Enterprise-legal visual style**: Clean, professional, high data density
- **Color palette**: Neutral grays base, deep blue primary for actions, diff colors (green=added, red=removed, amber=changed, blue=neutral)
- **Typography**: Clear heading hierarchy, readable body text, monospace for clause IDs
- **Component tokens**: Cards, tag pills, confidence badges, timeline nodes, diff markup, progress indicators, doc-type icons
- **Accessibility**: Non-color cues (icons/labels) alongside diff colors, keyboard navigation, ARIA labels

---

## Screen 1: Dashboard

The main landing page after entry. Provides a high-level overview and quick access to all workflows.

- **KPI cards** at top: Total contracts, contract families, pending reviews, processing errors — each clickable to filter
- **Recent activity feed**: Timeline of recent uploads, extractions, and reviews with timestamps
- **Quick filters / saved views**: Chips like "All MSAs with pending amendments", "Failed extractions"
- **Upload CTA**: Prominent button to start uploading contracts
- **Contract families summary**: Cards showing top families with document counts and last activity

---

## Screen 2: Upload & Ingestion

Full upload flow with progress tracking and quality control.

- **Drag-and-drop zone** with file type hints (PDF, DOCX) and size limits
- **Single or bulk upload** toggle
- **Parsing profile selector**: Auto-detect, MSA, SOW, Amendment (dropdown)
- **Pre-upload validation**: Duplicate detection, unreadable file warnings shown inline before upload starts
- **Upload progress**: Per-file progress bars with status (queued → processing → complete/failed)
- **Per-file details**: Extracted parties, contract date, type, confidence score shown as results come in
- **Actions per file**: Retry, view raw extraction, mark for manual review, cancel
- **Processing monitor view**: Filterable list of all queued/processing/failed items with elapsed time

---

## Screen 3: Contract Family View

Visual grouping of related contracts (e.g., MSA + amendments + SOW).

- **Timeline/tree visualization**: Vertical timeline showing master → amendments → addendums in chronological order, using lines and nodes (DOM/CSS, no canvas)
- **Document cards** on the timeline: Each shows version, date, parties, signer, status, contract type badge
- **Family metadata panel**: Family ID, primary counterparty, jurisdiction, date range, tag pills
- **Actions**: Pin canonical document, merge/split families, add tags/notes
- **Table toggle**: Switch between timeline view and sortable table view of family documents
- **Click-through**: Any document card opens the Document Reader

---

## Screen 4: Document Reader & Clause View

Two-pane layout for deep inspection of a single contract's extracted content.

- **Left pane — Clause list**: Scrollable list of extracted clauses with:
  - Clause type badge (e.g., "Termination", "Payment Terms", "Liability")
  - Confidence badge (high/medium/low with percentage)
  - Quick metadata: obligations, key dates, monetary values shown as colored inline tags
  - Flag/correct extraction button per clause
- **Right pane — Document text**: Full document text with selectable text overlay
  - Click a clause in the left pane → right pane scrolls and highlights that section
  - Inline highlights for obligations (purple), dates (blue), monetary values (green), party names (orange)
  - Adjustable text size control
- **Metadata sidebar** (collapsible): Contract-level metadata — parties, effective date, termination date, signer, jurisdiction, contract type
- **Action bar**: Compare with another document, export, add to family, flag for review

---

## Screen 5: Clause Comparison / Diff Mode

Side-by-side clause-level diff between two documents in a family.

- **Document selector**: Pick two documents from a family to compare (dropdowns at top)
- **Side-by-side layout**: Left = base document, Right = comparison document
- **Diff markup**:
  - Additions: Green background + "+" icon
  - Deletions: Red background with strikethrough + "−" icon
  - Modifications: Amber background with tooltip showing previous wording + "~" icon
  - Moved clauses: Dashed border with arrow indicator
- **Clause alignment**: Matched clauses shown side-by-side; unmatched clauses shown with empty placeholder on the other side
- **Summary bar**: Counts of clauses changed / added / removed
- **Inline toggle**: Switch between side-by-side and unified inline diff view
- **Actions per clause**: Accept/reject change buttons (mock), add comment
- **Export comparison report** button

---

## Screen 6: Search & Filters

Global search accessible from a top navigation bar on all screens.

- **Search bar** with autocomplete on extracted fields (party names, clause types, keywords)
- **Advanced filter panel** (expandable): Date range, jurisdiction, contract type, status, confidence threshold slider, tags
- **Search results list**: Cards showing matched contracts with highlighted search terms, quick actions (open family, compare, export)
- **Filter chips**: Active filters shown as removable chips above results

---

## Screen 7: Navigation & Global Layout

- **Top navigation bar**: Logo, global search, notifications bell, user avatar
- **Left sidebar**: Dashboard, Upload, Families, Search, Settings — collapsible
- **Breadcrumb trail**: For deep navigation (Dashboard → Family → Document → Compare)
- **Responsive**: Sidebar collapses to hamburger on tablet/mobile, panes stack vertically in reader/compare views

---

## Mock Data

All screens will use realistic hardcoded sample data:
- 1 MSA + 2 amendments + 1 SOW forming a contract family
- ~15 total contracts across 3-4 families
- Extracted clauses with varying confidence scores
- Pre-computed diffs between amendment versions
- Sample metadata: parties, dates, jurisdictions, signers

---

## User Flows (3-click goal)

1. **Dashboard → Family → Compare**: Click family card → Click "Compare" on two documents → See diff
2. **Dashboard → Upload → Monitor**: Click upload CTA → Drop files → See processing status
3. **Dashboard → Family → Document Reader**: Click family → Click document → Inspect clauses
4. **Search → Document → Compare**: Search for clause → Open document → Compare with related version
