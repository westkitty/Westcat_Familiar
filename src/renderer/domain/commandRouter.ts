/**
 * Command router. Law 7: Fable Is Scarce.
 * Order of preference: deterministic local logic → local mock AI seam →
 * Fable (gated, costed, budgeted). The router never recommends Fable
 * casually; high complexity AND remaining budget are both required.
 */
import type { Command, RouterDecision, RouterResult } from '../types'
import type { Evidenced } from '../types/evidence'
import type { ModeDef } from '../types/mode'
import type { FamiliarStateId } from '../types/familiar'

export const COMMANDS: Record<string, Command> = {
  stretch: {
    id: 'stretch',
    label: 'Stretch',
    description: 'Ask the familiar to stretch — a visible state transition.',
    kind: 'local'
  },
  nap: {
    id: 'nap',
    label: 'Nap / wake',
    description: 'Toggle the sleeping state. Sleeping familiars never nudge.',
    kind: 'local'
  },
  'checkin-note': {
    id: 'checkin-note',
    label: 'Log a check-in',
    description: 'Capture a one-line note about right now (verified, session-only).',
    kind: 'local'
  },
  'summarize-day': {
    id: 'summarize-day',
    label: 'Summarize today',
    description: 'Session summary via the local mock AI seam. No Fable needed.',
    kind: 'ai'
  },
  'plan-next': {
    id: 'plan-next',
    label: 'Plan next step',
    description: 'Deeper reasoning — the router decides if Fable is worth it.',
    kind: 'ai'
  },
  'open-dexter': {
    id: 'open-dexter',
    label: 'Dexter Inspect',
    description: 'Project necromancy lens: lineage, decisions, risks, rot.',
    kind: 'panel',
    panel: 'dexter'
  },
  'open-stack': {
    id: 'open-stack',
    label: 'Stack Status',
    description: 'Process health, storage, attention budget (mock diagnostics).',
    kind: 'panel',
    panel: 'stack'
  },
  'open-packet': {
    id: 'open-packet',
    label: 'Packet Forge',
    description: 'Forge a high-signal context packet from current state.',
    kind: 'panel',
    panel: 'packet'
  },
  'open-audit': {
    id: 'open-audit',
    label: 'Self-Audit',
    description: 'Run the constitution compliance harness against live state.',
    kind: 'panel',
    panel: 'audit'
  },
  'open-operations': {
    id: 'open-operations',
    label: 'Operational controls',
    description: 'Project sessions, unfinished work, interruption contracts, and behavioral memory.',
    kind: 'panel',
    panel: 'operations'
  }
}

/** Canned router prompts used by the drawer's AI quick actions. */
export const AI_COMMAND_PROMPTS: Record<string, string> = {
  'summarize-day': 'Summarize this session so far.',
  'plan-next':
    'Plan and design the next architecture refactor for the familiar — and explain why in that order.'
}

const DEEP_SIGNALS = [
  'why',
  'plan',
  'strategy',
  'architect',
  'refactor',
  'design',
  'analyze',
  'analyse',
  'compare',
  'decide',
  'roadmap',
  'debug'
]

/** Cheap, deterministic complexity heuristic (0..1). Tier: inferred. */
export function scoreComplexity(input: string): number {
  const text = input.trim().toLowerCase()
  if (!text) return 0
  let score = Math.min(0.4, text.split(/\s+/).length / 40)
  for (const s of DEEP_SIGNALS) {
    if (text.includes(s)) score += 0.22
  }
  if (text.includes('?')) score += 0.05
  return Math.min(1, Number(score.toFixed(2)))
}

export function routeInput(input: string, fableBudgetRemaining: number): RouterDecision {
  const complexity = scoreComplexity(input)
  if (complexity < 0.35) {
    return {
      path: 'local_logic',
      reason: 'Deterministic local logic is enough — no model needed.',
      complexity,
      estimatedCost: 'low',
      requiresGate: false,
      evidenceTier: 'inferred'
    }
  }
  if (complexity < 0.7) {
    return {
      path: 'local_mock_ai',
      reason: 'Medium complexity — the local mock AI seam handles it. Fable stays in reserve.',
      complexity,
      estimatedCost: 'low',
      requiresGate: false,
      evidenceTier: 'inferred'
    }
  }
  if (fableBudgetRemaining <= 0) {
    return {
      path: 'local_mock_ai',
      reason: 'Deep question, but the Fable budget is spent. Falling back to the local seam.',
      complexity,
      estimatedCost: 'medium',
      requiresGate: false,
      budgetExhausted: true,
      evidenceTier: 'inferred'
    }
  }
  return {
    path: 'fable',
    reason:
      'High complexity. Fable is scarce — the gate must be passed and one budget unit spent.',
    complexity,
    estimatedCost: 'high',
    requiresGate: true,
    evidenceTier: 'inferred'
  }
}

export interface LocalContext {
  mode: ModeDef
  familiarState: FamiliarStateId
  openTaskCount: number
  sessionEventCount: number
}

/** Deterministic local answers. What it truly knows is verified. */
export function runLocalLogic(input: string, ctx: LocalContext, decision: RouterDecision): RouterResult {
  const text = input.trim().toLowerCase()
  let responseText: string
  let responseTier: RouterResult['responseTier'] = 'verified'
  if (text.includes('time')) {
    responseText = `Local clock: ${new Date().toLocaleTimeString()}.`
  } else if (text.includes('mode')) {
    responseText = `Current mode is ${ctx.mode.label} — ${ctx.mode.tagline}`
  } else if (text.includes('task')) {
    responseText = `${ctx.openTaskCount} open tasks in the mock task set.`
    responseTier = 'inferred'
  } else if (text.includes('state')) {
    responseText = `The familiar is currently «${ctx.familiarState}».`
  } else {
    responseText = `Noted locally (${ctx.sessionEventCount + 1} session events). No model was consulted.`
  }
  return { decision, responseText, responseTier }
}

/** The local mock AI seam. Everything it says is openly mock. */
export function runMockAi(input: string, ctx: LocalContext, decision: RouterDecision): RouterResult {
  return {
    decision,
    responseText:
      `[mock AI seam] In ${ctx.mode.label} mode, with ${ctx.openTaskCount} open mock tasks, ` +
      `a plausible-but-fake take on “${input.trim()}”: prefer the smallest local step, ` +
      `write it down, and let the familiar stay quiet while you do it. ` +
      `(A real local model would attach here — this seam exists so it can.)`,
    responseTier: 'mock'
  }
}

/** Fable path — future seam. Spending the budget forges a packet; no real call. */
export function runFable(packetId: string, decision: RouterDecision): RouterResult {
  return {
    decision,
    responseText:
      `[future_seam] The Fable reasoning core is not connected in v1. ` +
      `One budget unit was spent and context packet ${packetId} was forged and parked locally — ` +
      `inspect it in the Packet panel. When Fable lands, this seam transmits that packet and nothing more.`,
    responseTier: 'future_seam'
  }
}

/** Real routing events from THIS session (tier: verified). Audit reads this. */
export interface SessionRouteEntry extends Evidenced {
  at: string
  input: string
  path: RouterDecision['path']
}

const sessionLog: SessionRouteEntry[] = []

export function logSessionRoute(input: string, path: RouterDecision['path']): void {
  sessionLog.push({ at: new Date().toISOString(), input, path, evidenceTier: 'verified' })
}

export function getSessionRouteLog(): readonly SessionRouteEntry[] {
  return sessionLog
}
