import { useEffect, useMemo, useState } from "react"
import { useAuth } from "../auth/AuthContext"
import { humanizeMovementId } from "../lib/format"
import { api } from "./client"
import type { LogEntry, Mode, Movement } from "./types"

type FetchStatus = "loading" | "success" | "error"

export interface MovementSummary {
  movement: Movement
  history: LogEntry[]
}

/** Backs the Workout List page, using the real "list every movement" endpoint. */
export function useMovementsList(): { movements: MovementSummary[]; status: FetchStatus } {
  const { isAuthenticated, getToken } = useAuth()
  const [movements, setMovements] = useState<MovementSummary[]>([])
  const [status, setStatus] = useState<FetchStatus>("loading")

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    setStatus("loading")

    getToken()
      .then((token) => {
        if (!token) throw new Error("Not authenticated")
        return api.listMovements(token).then((latestPerMovement) =>
          Promise.all(
            latestPerMovement.map(async (latest) => {
              const history = [...(await api.getMovementHistory(token, latest.movementId))].reverse()
              const summary: MovementSummary = {
                movement: {
                  id: latest.movementId,
                  displayName: humanizeMovementId(latest.movementId),
                  mode: latest.mode,
                  lastLoggedAt: latest.timestamp,
                  entryCount: history.length,
                },
                history,
              }
              return summary
            }),
          ),
        )
      })
      .then((results) => {
        if (!cancelled) {
          setMovements(results)
          setStatus("success")
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error")
      })

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, getToken])

  return { movements, status }
}

export function useMovementHistory(movementId: string) {
  const { isAuthenticated, getToken } = useAuth()
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [status, setStatus] = useState<FetchStatus>("loading")
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    setStatus("loading")

    getToken()
      .then((token) => {
        if (!token) throw new Error("Not authenticated")
        return api.getMovementHistory(token, movementId)
      })
      .then((data) => {
        if (cancelled) return
        // Oldest-first from the API — reverse so callers get most-recent-first.
        setEntries([...data].reverse())
        setStatus("success")
      })
      .catch(() => {
        if (!cancelled) setStatus("error")
      })

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, getToken, movementId, refreshKey])

  const refetch = () => setRefreshKey((k) => k + 1)

  return { entries, status, refetch }
}

/**
 * `fallbackMode` covers the one case where mode can't come from history: a movement
 * that has never been logged yet, navigated to straight from "Start a new workout"
 * (which passes the chosen mode via a `?mode=` query param — see WorkoutListPage /
 * NewEntryPage). Once a movement has at least one entry, its real logged mode wins.
 */
export function useMovement(
  movementId: string,
  fallbackMode?: Mode,
): { movement: Movement | null; status: FetchStatus; refetch: () => void } {
  const { entries, status, refetch } = useMovementHistory(movementId)

  const movement = useMemo<Movement | null>(() => {
    if (status !== "success") return null
    if (entries.length === 0) {
      return {
        id: movementId,
        displayName: humanizeMovementId(movementId),
        mode: fallbackMode ?? "isotonic",
        lastLoggedAt: null,
        entryCount: 0,
      }
    }
    const latest = entries[0]
    return {
      id: movementId,
      displayName: humanizeMovementId(movementId),
      mode: latest.mode,
      lastLoggedAt: latest.timestamp,
      entryCount: entries.length,
    }
  }, [entries, status, movementId, fallbackMode])

  return { movement, status, refetch }
}

export function useLogEntry() {
  const { getToken } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const logEntry = async (payload: Parameters<typeof api.logEntry>[1]) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error("Not authenticated")
      return await api.logEntry(token, payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save entry")
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return { logEntry, isSubmitting, error }
}
