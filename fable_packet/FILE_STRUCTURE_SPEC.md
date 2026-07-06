# File Structure Spec — WESTCAT Familiar (Electron + React + TS + Vite)

Target root after scaffolding:

```
westcat-familiar/
├── package.json
├── README.md
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json (if needed)
├── electron.vite.config.ts (or equivalent)
├── src/
│   ├── main/
│   │   ├── electronMain.ts          # Electron main process
│   │   └── preload.ts               # Secure contextBridge
│   ├── renderer/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   ├── familiar.ts
│   │   │   ├── mode.ts
│   │   │   ├── evidence.ts
│   │   │   ├── packet.ts
│   │   │   └── audit.ts
│   │   ├── domain/
│   │   │   ├── familiarStateMachine.ts
│   │   │   ├── attentionEngine.ts
│   │   │   ├── modeManager.ts
│   │   │   ├── commandRouter.ts
│   │   │   └── evidence.ts
│   │   ├── data/
│   │   │   ├── mocks/
│   │   │   │   ├── projects.ts
│   │   │   │   ├── tasks.ts
│   │   │   │   ├── stackDiagnostics.ts
│   │   │   │   ├── artifacts.ts
│   │   │   │   ├── attentionConditions.ts
│   │   │   │   ├── routerHistory.ts
│   │   │   │   ├── dexterExamples.ts
│   │   │   │   └── auditResults.ts
│   │   │   └── evidenceTiers.ts
│   │   ├── state/
│   │   │   ├── useFamiliarStore.ts   # or Zustand/Jotai/Redux
│   │   │   ├── useModeStore.ts
│   │   │   ├── useAttentionStore.ts
│   │   │   └── persistence.ts
│   │   ├── engines/
│   │   │   ├── animationEngine.ts
│   │   │   ├── packetForge.ts
│   │   │   ├── selfAudit.ts
│   │   │   └── continuityFirewall.ts
│   │   ├── components/
│   │   │   ├── familiar/
│   │   │   │   ├── Familiar.tsx
│   │   │   │   ├── FamiliarAnimator.tsx
│   │   │   │   └── states/
│   │   │   ├── drawer/
│   │   │   │   ├── CommandDrawer.tsx
│   │   │   │   └── QuickActions.tsx
│   │   │   ├── panels/
│   │   │   │   ├── DexterInspect.tsx
│   │   │   │   ├── StackStatus.tsx
│   │   │   │   ├── ContextPacketView.tsx
│   │   │   │   ├── SelfAuditView.tsx
│   │   │   │   └── ModeSwitcher.tsx
│   │   │   ├── common/
│   │   │   │   ├── EvidenceBadge.tsx
│   │   │   │   └── ScarcityGate.tsx
│   │   │   └── ...
│   │   └── styles/
│   │       ├── tokens.css
│   │       └── familiar.css
│   └── shared/
│       └── constants.ts
├── public/
│   └── assets/                      # familiar images, svgs, cluster previews if any
├── fable_packet/                    # (this handoff packet, can be referenced or copied in)
└── ...
```

## Key Files and Their Responsibilities

- `electronMain.ts`: Window creation, lifecycle, future native hooks.
- `preload.ts`: Minimal safe surface for renderer → main.
- `Familiar.tsx` + state machine: The heart. Must be alive first.
- `familiarStateMachine.ts`: Explicit states + allowed transitions + animation mapping.
- `attentionEngine.ts`: Decides when to be proactive vs quiet.
- `commandRouter.ts` + `packetForge.ts`: Core of "summon drawer → route command → optionally forge Fable packet" with scarcity gate.
- `mocks/` directory: All transparent mock data + generators. Every item carries evidence tier.
- `DexterInspect.tsx`: The "project necromancy lens" — graveyard of old WestCat experiments, current structure, decisions, risks.
- `SelfAuditView.tsx` + `selfAudit.ts`: Local runnable audit harness that checks the app against the constitution and data quality.
- `EvidenceBadge.tsx`: Reusable component that must be used wherever data is shown.

## Persistence (v1)

- Use a small persistence layer that can later swap `localStorage` for filesystem.
- At minimum persist: familiar position, current mode, some user prefs, last audit timestamp.

## Animation

- Keep animation concerns in `engines/animationEngine.ts` or inside the Familiar component tree.
- Map states to visuals (CSS transitions, SVG, canvas, or imported Lottie/SMIL if chosen). Start simple and explicit.

## Testing / Verification Path (for the build)

The structure must make it easy to:
- Run the app and immediately see the familiar.
- Open drawer from familiar.
- Switch modes and observe behavioral change.
- View evidence labels.
- Trigger self-audit and Dexter.
- Forge a context packet.
- See that Fable recommendations are gated.

Do not invent extra top-level folders that dilute the "familiar first" focus.
