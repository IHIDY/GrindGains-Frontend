export type Mode = "isotonic" | "mobeta"

/** One row returned by the training-data API (POST response or an item in the GET array). */
export interface LogEntry {
  movementId: string
  mode: Mode
  weight: number
  /** Rep count for isotonic movements, seconds held for mobeta movements. */
  repsOrTime: number
  sets: number
  /** ISO timestamp. */
  timestamp: string
  /**
   * Rate of Perceived Exertion (1-10), per set. NOT YET SUPPORTED by the backend
   * schema (`README backend.md` only documents movement_id/mode/weight/reps_or_time/sets) -
   * the frontend sends it optimistically and reads it back if present, but until the
   * backend adds an `rpe` field to its DynamoDB item shape, this value is not persisted.
   */
  rpe?: number
}

/**
 * A "Workout" in the UI IS a single Movement — the backend has no session/routine
 * grouping, only flat per-movement logs. This summary is derived client-side from
 * a movement's own log history (see api/hooks.ts), not returned directly by the API.
 */
export interface Movement {
  id: string
  displayName: string
  mode: Mode
  lastLoggedAt: string | null
  entryCount: number
}

export interface ChartPoint {
  x: string | number
  y: number
  label?: string
}
