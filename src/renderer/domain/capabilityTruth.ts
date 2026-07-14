import type { CapabilityObservation, WorkspaceInspection } from '../../shared/governance'
import { createEvidence } from './evidenceModel'

const CAPABILITY_TTL_MS = 5 * 60 * 1000

function expiry(checkedAt: string): string {
  return new Date(Date.parse(checkedAt) + CAPABILITY_TTL_MS).toISOString()
}

function capability(
  id: string,
  label: string,
  available: boolean,
  inspection: WorkspaceInspection,
  method: string,
  remediationHint: string
): CapabilityObservation {
  return {
    id,
    workspaceId: inspection.workspacePath,
    label,
    state: available ? 'available' : 'unavailable',
    evidence: createEvidence(
      'observed',
      `${label} was ${available ? 'confirmed' : 'not confirmed'} by ${method}.`,
      'Electron workspace inspection',
      { observedAt: inspection.checkedAt, expiresAt: expiry(inspection.checkedAt) }
    ),
    observationMethod: method,
    lastCheckedAt: inspection.checkedAt,
    expiresAt: expiry(inspection.checkedAt),
    failureReason: available ? undefined : inspection.errors.join('; ') || `${label} unavailable`,
    remediationHint,
    environment: inspection.workspacePath,
    safeToRerun: true
  }
}

export function capabilitiesFromInspection(inspection: WorkspaceInspection): CapabilityObservation[] {
  const prefix = inspection.workspacePath
  return [
    capability(`${prefix}:read`, 'Repository readable', inspection.readable, inspection, 'filesystem access check', 'Select a readable local folder.'),
    capability(`${prefix}:write`, 'Repository writable', inspection.writable, inspection, 'filesystem access check', 'Adjust folder permissions before modifying files.'),
    capability(`${prefix}:git`, 'Git available', inspection.gitAvailable, inspection, 'allowlisted git --version', 'Install Git or use a non-Git workflow.'),
    capability(`${prefix}:node`, 'Node available', inspection.nodeAvailable, inspection, 'live Electron process observation', 'Install Node for JavaScript project validation.'),
    capability(`${prefix}:dependencies`, 'Project dependencies installed', inspection.dependenciesInstalled, inspection, 'node_modules metadata check', 'Run the project package manager install command with approval.'),
    capability(`${prefix}:build`, 'Local build declared', inspection.buildScriptAvailable, inspection, 'selected package.json script names', 'Add or document a build script.'),
    capability(`${prefix}:typecheck`, 'Type checking declared', inspection.typecheckScriptAvailable, inspection, 'selected package.json script names', 'Add or document a typecheck script.')
  ]
}

export function capabilityStateAt(
  capability: CapabilityObservation,
  now = Date.now()
): CapabilityObservation['state'] {
  if (Date.parse(capability.expiresAt) <= now && capability.state === 'available') return 'stale'
  return capability.state
}
