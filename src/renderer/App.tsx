/**
 * WESTCAT Familiar — root component. The stage is transparent; the
 * familiar is the only permanent tenant (Law 1/2). Drawer and panels are
 * summoned and dismissed around it.
 */
import { useEffect, useState } from 'react'
import { Familiar } from './components/familiar/Familiar'
import { CommandDrawer } from './components/drawer/CommandDrawer'
import { DexterInspect } from './components/panels/DexterInspect'
import { StackStatus } from './components/panels/StackStatus'
import { ContextPacketView } from './components/panels/ContextPacketView'
import { SelfAuditView } from './components/panels/SelfAuditView'
import { getMode } from './domain/modeManager'
import { getLastPersistedPacket } from './engines/packetForge'
import { useAttentionStore } from './state/useAttentionStore'
import { useFamiliarStore } from './state/useFamiliarStore'
import { useModeStore } from './state/useModeStore'
import type { PanelId } from './types'
import type { ContextPacket } from './types/packet'

const ATTENTION_TICK_MS = 5000
const WHISPER_TTL_MS = 4000

export default function App(): JSX.Element {
  const modeId = useModeStore((s) => s.modeId)
  const mode = getMode(modeId)
  const position = useFamiliarStore((s) => s.position)
  const whisper = useFamiliarStore((s) => s.whisper)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activePanel, setActivePanel] = useState<PanelId | null>(null)
  const [lastPacket, setLastPacket] = useState<ContextPacket | null>(getLastPersistedPacket())

  // Real interactions feed the attention engine (tier: verified).
  useEffect(() => {
    const record = (): void => useAttentionStore.getState().recordInteraction()
    window.addEventListener('pointerdown', record)
    window.addEventListener('keydown', record)
    return () => {
      window.removeEventListener('pointerdown', record)
      window.removeEventListener('keydown', record)
    }
  }, [])

  // Attention tick: the engine decides; a nudge lifts the familiar once.
  useEffect(() => {
    const tick = window.setInterval(() => {
      const fam = useFamiliarStore.getState()
      const decision = useAttentionStore
        .getState()
        .evaluate(mode.attention, drawerOpen, fam.stateId === 'sleeping')
      if (decision.action === 'nudge') {
        fam.requestState('watching')
        fam.setWhisper(decision.reason)
      }
    }, ATTENTION_TICK_MS)
    return () => window.clearInterval(tick)
  }, [mode, drawerOpen])

  // Whispers fade on their own.
  useEffect(() => {
    if (!whisper) return
    const t = window.setTimeout(() => useFamiliarStore.getState().setWhisper(null), WHISPER_TTL_MS)
    return () => window.clearTimeout(t)
  }, [whisper])

  // Esc: close panel first, then drawer. The familiar is never closed.
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key !== 'Escape') return
      setActivePanel((panel) => {
        if (panel !== null) return null
        setDrawerOpen(false)
        return null
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="stage" data-mode={modeId}>
      <Familiar
        onSummon={() => setDrawerOpen((o) => !o)}
        onOpenPanel={(p) => setActivePanel(p)}
      />

      {drawerOpen ? (
        <CommandDrawer
          mode={mode}
          anchor={position}
          onClose={() => setDrawerOpen(false)}
          openPanel={(p) => setActivePanel(p)}
          setLastPacket={setLastPacket}
        />
      ) : null}

      {activePanel === 'dexter' ? <DexterInspect onClose={() => setActivePanel(null)} /> : null}
      {activePanel === 'stack' ? <StackStatus onClose={() => setActivePanel(null)} /> : null}
      {activePanel === 'packet' ? (
        <ContextPacketView
          onClose={() => setActivePanel(null)}
          lastPacket={lastPacket}
          setLastPacket={setLastPacket}
        />
      ) : null}
      {activePanel === 'audit' ? <SelfAuditView onClose={() => setActivePanel(null)} /> : null}

      <footer className="lawline" aria-hidden="true">
        local-first · everything labeled · fable is scarce · attention is earned
      </footer>
    </div>
  )
}
