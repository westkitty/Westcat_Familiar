import type { FamiliarStateId } from '../types'
import type { EvidenceTier } from '../types/evidence'

export interface FamiliarFrameManifest {
  canonicalAssetRoot: string
  sourceRepo: string
  originalSourcePath: string
  evidenceTier: EvidenceTier
  auditContactSheetPath: string
  copiedAssetPaths: { [key: string]: string }
  stateToFrameMapping: { [key in FamiliarStateId]: string }
  fallbackFrame: string
}

export const familiarFrameManifest: FamiliarFrameManifest = {
  canonicalAssetRoot: 'assets/familiar/canonical',
  sourceRepo: 'west_cat_overlay',
  originalSourcePath: 'assets/source/transparent',
  evidenceTier: 'verified',
  auditContactSheetPath: 'qa/frame_source_audit/west_cat_overlay_transparent_contact.png',
  copiedAssetPaths: {
    idle: 'assets/familiar/canonical/idle.png',
    blink: 'assets/familiar/canonical/blink.png',
    happy: 'assets/familiar/canonical/happy.png',
    happy_2: 'assets/familiar/canonical/happy_2.png',
    sad: 'assets/familiar/canonical/sad.png',
    sleep: 'assets/familiar/canonical/sleep.png',
    sparkles: 'assets/familiar/canonical/sparkles.png',
    wake: 'assets/familiar/canonical/wake.png',
    pause: 'assets/familiar/canonical/pause.png',
    pause_2: 'assets/familiar/canonical/pause_2.png',
    icon_app: 'assets/familiar/canonical/icon_app.png'
  },
  stateToFrameMapping: {
    idle: 'assets/familiar/canonical/idle.png',
    watching: 'assets/familiar/canonical/wake.png',
    thinking: 'assets/familiar/canonical/pause.png',
    working: 'assets/familiar/canonical/happy.png',
    judging: 'assets/familiar/canonical/pause_2.png',
    annoyed: 'assets/familiar/canonical/sad.png',
    alert: 'assets/familiar/canonical/sparkles.png',
    blocked: 'assets/familiar/canonical/sad.png',
    sleeping: 'assets/familiar/canonical/sleep.png',
    summoning: 'assets/familiar/canonical/happy_2.png'
  },
  fallbackFrame: 'assets/familiar/canonical/idle.png'
}
