import type { LogEntry, Mode } from "./types"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

/** Clean shape the backend returns (PK/SK cleanup landed 2026-09-07). */
interface RawLogEntry {
  movement_id: string
  timestamp: string
  mode: Mode
  weight: number
  reps_or_time: number
  sets: number
}

function normalizeEntry(raw: RawLogEntry): LogEntry {
  return {
    movementId: raw.movement_id,
    mode: raw.mode,
    weight: raw.weight,
    repsOrTime: raw.reps_or_time,
    sets: raw.sets,
    timestamp: raw.timestamp,
  }
}

class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function request<T>(
  query: string,
  opts: RequestInit & { token: string },
): Promise<T> {
  const { token, headers, ...rest } = opts
  const res = await fetch(`${BASE_URL}/${query}`, {
    ...rest,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
      ...headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    throw new ApiError(res.status, body.error ?? `Request failed with ${res.status}`)
  }

  return res.json()
}

export interface LogEntryPayload {
  movementId: string
  mode: Mode
  weight: number
  repsOrTime: number
  sets?: number
}

export const api = {
  logEntry: async (token: string, entry: LogEntryPayload): Promise<LogEntry> => {
    const raw = await request<RawLogEntry>("", {
      method: "POST",
      token,
      body: JSON.stringify({
        movement_id: entry.movementId,
        mode: entry.mode,
        weight: entry.weight,
        reps_or_time: entry.repsOrTime,
        sets: entry.sets ?? 1,
      }),
    })
    return normalizeEntry(raw)
  },

  getMovementHistory: async (token: string, movementId: string): Promise<LogEntry[]> => {
    const raw = await request<RawLogEntry[]>(`?movement_id=${encodeURIComponent(movementId)}`, {
      method: "GET",
      token,
    })
    return raw.map(normalizeEntry)
  },

  /** Every movement this user has logged, one entry each (their most recent). */
  listMovements: async (token: string): Promise<LogEntry[]> => {
    const raw = await request<RawLogEntry[]>("", { method: "GET", token })
    return raw.map(normalizeEntry)
  },
}

export { ApiError }
