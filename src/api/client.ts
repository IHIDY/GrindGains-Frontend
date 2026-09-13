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
  /** Not in the documented schema yet - present only once the backend adds support. */
  rpe?: number
}

function normalizeEntry(raw: RawLogEntry): LogEntry {
  return {
    movementId: raw.movement_id,
    mode: raw.mode,
    weight: raw.weight,
    repsOrTime: raw.reps_or_time,
    sets: raw.sets,
    timestamp: raw.timestamp,
    rpe: raw.rpe,
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
  /** Sent optimistically - see the `rpe` note on LogEntry. Omit if not collected. */
  rpe?: number
}

/**
 * NOT YET SUPPORTED by the backend - it currently only handles POST (create) and GET
 * (read). `timestamp` (from the entry's SK) is the natural unique key to identify
 * which entry to overwrite; a PUT full-replace is proposed rather than a partial PATCH
 * since it mirrors POST's body shape exactly (just adds `timestamp`) and is simplest to
 * implement as a DynamoDB PutItem with a ConditionExpression on the existing SK.
 */
export interface UpdateEntryPayload extends LogEntryPayload {
  timestamp: string
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
        ...(entry.rpe !== undefined ? { rpe: entry.rpe } : {}),
      }),
    })
    return normalizeEntry(raw)
  },

  /** See the UpdateEntryPayload note - this hits a PUT endpoint the backend doesn't have yet. */
  updateEntry: async (token: string, entry: UpdateEntryPayload): Promise<LogEntry> => {
    const raw = await request<RawLogEntry>("", {
      method: "PUT",
      token,
      body: JSON.stringify({
        movement_id: entry.movementId,
        timestamp: entry.timestamp,
        mode: entry.mode,
        weight: entry.weight,
        reps_or_time: entry.repsOrTime,
        sets: entry.sets ?? 1,
        ...(entry.rpe !== undefined ? { rpe: entry.rpe } : {}),
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
