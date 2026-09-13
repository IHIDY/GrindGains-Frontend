/** "bench_press" -> "Bench Press" (the backend stores no separate display-name field). */
export function humanizeMovementId(id: string): string {
  return id
    .split(/[_-]/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

export function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

/**
 * Groups timestamped rows (log entries are now one-per-set, see NewEntryIsotonic) by
 * calendar day, in the same order the days first appear. Charts that aggregate "by
 * day" (total volume, average weight, etc.) should group with this first rather than
 * plotting one point per raw entry - otherwise a single session with 3 sets shows up
 * as 3 separate points instead of one day's total.
 */
export function groupByDay<T extends { timestamp: string }>(rows: T[]): Array<{ dateKey: string; rows: T[] }> {
  const groups = new Map<string, T[]>()
  for (const row of rows) {
    const key = row.timestamp.slice(0, 10)
    const group = groups.get(key)
    if (group) group.push(row)
    else groups.set(key, [row])
  }
  return [...groups.entries()].map(([dateKey, groupRows]) => ({ dateKey, rows: groupRows }))
}
