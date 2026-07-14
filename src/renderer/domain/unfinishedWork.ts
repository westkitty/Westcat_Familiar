import type { UnfinishedWorkItem } from '../../shared/governance'

const URGENCY_WEIGHT: Record<UnfinishedWorkItem['urgency'], number> = {
  critical: 80,
  high: 45,
  normal: 20,
  low: 5
}

const RECOVERABILITY_WEIGHT: Record<UnfinishedWorkItem['recoverability'], number> = {
  high: 22,
  medium: 10,
  low: 2
}

export function unfinishedPressure(item: UnfinishedWorkItem, now = Date.now()): number {
  if (item.completedAt !== undefined || item.dismissedAt !== undefined) return 0
  if (item.snoozedUntil !== undefined && Date.parse(item.snoozedUntil) > now) return 0

  const ageDays = Math.max(0, now - Date.parse(item.lastActivityAt)) / 86_400_000
  const staleDecay = Math.max(0.25, 1 - ageDays / 30)
  const blockingWeight = item.blocking ? 35 : 0
  return Math.round((URGENCY_WEIGHT[item.urgency] + RECOVERABILITY_WEIGHT[item.recoverability] + blockingWeight) * staleDecay)
}

export function selectMostUsefulUnfinished(
  items: readonly UnfinishedWorkItem[],
  now = Date.now()
): UnfinishedWorkItem | undefined {
  return items
    .map((item) => ({ item, score: unfinishedPressure(item, now) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => {
      if (left.score !== right.score) return right.score - left.score
      return right.item.lastActivityAt.localeCompare(left.item.lastActivityAt)
    })[0]?.item
}

export function totalUnfinishedPressure(items: readonly UnfinishedWorkItem[], now = Date.now()): number {
  const scores = items.map((item) => unfinishedPressure(item, now)).sort((left, right) => right - left)
  const [highest = 0, ...rest] = scores
  const minorContribution = rest.reduce((sum, score) => sum + Math.min(score, 8), 0)
  return Math.min(100, highest + Math.min(20, minorContribution))
}
