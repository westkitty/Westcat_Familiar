/**
 * ⚠ MOCK DATA — WESTCAT Familiar
 * Dexter's evidence: lineage of the WestCat Overlay family, decisions made,
 * risks carried, graveyard notes. Forensic reconstruction, not telemetry.
 * Law 9: Dexter Is Not Cute — keep the tone clinical when editing.
 */
import type { Evidenced } from '../../types/evidence'

export interface LineageEntry extends Evidenced {
  id: string
  repo: string
  era: string
  verdict: string
  extracted: string[]
}

export interface DecisionEntry extends Evidenced {
  id: string
  date: string
  decision: string
  rationale: string
}

export interface RiskEntry extends Evidenced {
  id: string
  risk: string
  severity: 'low' | 'medium' | 'high'
  mitigation: string
}

export interface GraveyardNote extends Evidenced {
  id: string
  note: string
}

export const MOCK_LINEAGE: LineageEntry[] = [
  {
    id: 'lin-macos',
    repo: 'WestCat_Overlay_MacOS',
    era: 'PySide era, strongest reference',
    verdict: 'Best philosophy: local companion, BIBLE-scope discipline, graceful failure.',
    extracted: ['chat bubble + cat coordination', 'macOS packaging intent', 'internal doc standards'],
    evidenceTier: 'mock'
  },
  {
    id: 'lin-westcat',
    repo: 'west_cat_overlay',
    era: 'PySide era',
    verdict: 'Best check-in mechanics: polling prompts, follow-ups, encouragements.',
    extracted: ['question/answer check-in flow', 'asset import pipeline', 'simple activity tracking'],
    evidenceTier: 'mock'
  },
  {
    id: 'lin-reloaded',
    repo: 'WESTCAT-OVERLAY-RELOADED',
    era: 'PySide era, most ambitious',
    verdict: 'Best animation architecture: clusters, zip streams, easing, one-shots.',
    extracted: ['state-driven animation vocabulary', 'question types (ack/mcq/text)', 'dev menus, hotkeys'],
    evidenceTier: 'mock'
  },
  {
    id: 'lin-framemaker',
    repo: 'Overlay_frame_maker',
    era: 'React/Vite studio, standalone',
    verdict: 'Possible future asset generator. Not a primary source.',
    extracted: ['sprite frame generation concept'],
    evidenceTier: 'mock'
  },
  {
    id: 'lin-others',
    repo: '(all other family repos)',
    era: 'various',
    verdict: 'Duplicates, empty placeholders, abandoned renames. Excluded from lineage.',
    extracted: [],
    evidenceTier: 'stale'
  }
]

export const MOCK_DECISIONS: DecisionEntry[] = [
  {
    id: 'dec-electron',
    date: '2026-07-01',
    decision: 'Adopt Electron + React + TypeScript + Vite.',
    rationale: 'PySide lineage proved the concept and exhausted the stack. Port ideas, not code.',
    evidenceTier: 'mock'
  },
  {
    id: 'dec-constitution',
    date: '2026-07-02',
    decision: 'Adopt the ten-law Familiar Constitution as acceptance criteria.',
    rationale: 'Previous attempts died by dashboard collapse and scope creep.',
    evidenceTier: 'mock'
  },
  {
    id: 'dec-mocks',
    date: '2026-07-03',
    decision: 'All v1 data is transparent mock with mandatory evidence tiers.',
    rationale: 'Fake intelligence theater killed trust in earlier prototypes.',
    evidenceTier: 'mock'
  },
  {
    id: 'dec-scarcity',
    date: '2026-07-03',
    decision: 'Fable budget: 3 units per session, gated, with visible cost.',
    rationale: 'A reasoning layer that is always available becomes a crutch immediately.',
    evidenceTier: 'mock'
  },
  {
    id: 'dec-storage',
    date: '2026-07-04',
    decision: 'localStorage v1; filesystem JSON is a declared seam, not a dependency.',
    rationale: 'Zero-setup beats correct-forever for a first runnable cut.',
    evidenceTier: 'mock'
  }
]

export const MOCK_RISKS: RiskEntry[] = [
  {
    id: 'risk-dashboard',
    risk: 'Dashboard collapse — panels outgrow the familiar.',
    severity: 'high',
    mitigation: 'Law 1/2 in the self-audit; panels stay summoned and dismissible.',
    evidenceTier: 'mock'
  },
  {
    id: 'risk-motion',
    risk: 'Decorative animation accretes without state backing.',
    severity: 'medium',
    mitigation: 'State machine is the only source of animation classes; audit checks it.',
    evidenceTier: 'mock'
  },
  {
    id: 'risk-transparent',
    risk: 'Electron transparent-window quirks on macOS (shadows, resize).',
    severity: 'medium',
    mitigation: 'Keep hasShadow off; treat always-on-top as a research seam.',
    evidenceTier: 'mock'
  },
  {
    id: 'risk-abandonment',
    risk: 'Family history: projects die at the packaging step.',
    severity: 'high',
    mitigation: 'v1 ships as npm run dev; packaging is explicitly out of scope.',
    evidenceTier: 'mock'
  }
]

export const MOCK_GRAVEYARD: GraveyardNote[] = [
  {
    id: 'grv-01',
    note: 'Cause of death, attempt #1: rewrote the overlay window system three times before drawing a cat.',
    evidenceTier: 'mock'
  },
  {
    id: 'grv-02',
    note: 'Cause of death, attempt #2: check-in prompts fired so often the user muted the app in a week.',
    evidenceTier: 'mock'
  },
  {
    id: 'grv-03',
    note: 'Cause of death, attempt #3: animation system grew richer than the product around it.',
    evidenceTier: 'mock'
  }
]
