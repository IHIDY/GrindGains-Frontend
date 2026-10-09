import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

const BASE_URL = "https://api.example.test"
const TOKEN = "test-id-token"

type ClientModule = typeof import("./client")
let api: ClientModule["api"]
let ApiError: ClientModule["ApiError"]

const fetchMock = vi.fn<typeof fetch>()

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })
}

function lastRequest() {
  const [url, init] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1]
  return {
    url: String(url),
    method: init?.method,
    headers: init?.headers as Record<string, string>,
    body: init?.body ? JSON.parse(init.body as string) : undefined,
  }
}

const rawEntry = {
  movement_id: "pushup",
  timestamp: "2026-09-07T18:41:00.067781Z",
  mode: "isotonic",
  weight: 0,
  reps_or_time: 20,
  sets: 3,
  rpe: 8,
}

beforeAll(async () => {
  // client.ts reads VITE_API_BASE_URL once at import time, so stub it before importing.
  vi.stubEnv("VITE_API_BASE_URL", BASE_URL)
  const mod = await import("./client")
  api = mod.api
  ApiError = mod.ApiError
})

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal("fetch", fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("api.logEntry", () => {
  it("POSTs the entry as snake_case with a bearer token", async () => {
    fetchMock.mockResolvedValue(jsonResponse(rawEntry, 201))

    await api.logEntry(TOKEN, {
      movementId: "pushup",
      mode: "isotonic",
      weight: 0,
      repsOrTime: 20,
      sets: 3,
      rpe: 8,
    })

    const req = lastRequest()
    expect(req.url).toBe(`${BASE_URL}/`)
    expect(req.method).toBe("POST")
    expect(req.headers.authorization).toBe(`Bearer ${TOKEN}`)
    expect(req.headers["content-type"]).toBe("application/json")
    expect(req.body).toEqual({
      movement_id: "pushup",
      mode: "isotonic",
      weight: 0,
      reps_or_time: 20,
      sets: 3,
      rpe: 8,
    })
  })

  it("defaults sets to 1 and omits rpe when not provided", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ...rawEntry, sets: 1, rpe: null }, 201))

    await api.logEntry(TOKEN, { movementId: "plank", mode: "mobeta", weight: 0, repsOrTime: 45 })

    const { body } = lastRequest()
    expect(body.sets).toBe(1)
    expect(body).not.toHaveProperty("rpe")
  })

  it("normalizes the response into camelCase", async () => {
    fetchMock.mockResolvedValue(jsonResponse(rawEntry, 201))

    const entry = await api.logEntry(TOKEN, {
      movementId: "pushup",
      mode: "isotonic",
      weight: 0,
      repsOrTime: 20,
    })

    expect(entry).toEqual({
      movementId: "pushup",
      mode: "isotonic",
      weight: 0,
      repsOrTime: 20,
      sets: 3,
      timestamp: "2026-09-07T18:41:00.067781Z",
      rpe: 8,
    })
  })
})

describe("api.updateEntry", () => {
  it("PUTs the full entry including its timestamp", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ...rawEntry, weight: 185, reps_or_time: 8 }))

    await api.updateEntry(TOKEN, {
      movementId: "pushup",
      timestamp: rawEntry.timestamp,
      mode: "isotonic",
      weight: 185,
      repsOrTime: 8,
      sets: 1,
      rpe: 8.5,
    })

    const req = lastRequest()
    expect(req.method).toBe("PUT")
    expect(req.body).toEqual({
      movement_id: "pushup",
      timestamp: rawEntry.timestamp,
      mode: "isotonic",
      weight: 185,
      reps_or_time: 8,
      sets: 1,
      rpe: 8.5,
    })
  })
})

describe("api.getMovementHistory", () => {
  it("GETs with the movement id URL-encoded and normalizes each entry", async () => {
    fetchMock.mockResolvedValue(jsonResponse([rawEntry]))

    const entries = await api.getMovementHistory(TOKEN, "bench press")

    const req = lastRequest()
    expect(req.method).toBe("GET")
    expect(req.url).toBe(`${BASE_URL}/?movement_id=bench%20press`)
    expect(entries).toHaveLength(1)
    expect(entries[0].repsOrTime).toBe(20)
  })
})

describe("api.listMovements", () => {
  it("GETs the base URL with no query string", async () => {
    fetchMock.mockResolvedValue(jsonResponse([rawEntry]))

    const entries = await api.listMovements(TOKEN)

    expect(lastRequest().url).toBe(`${BASE_URL}/`)
    expect(entries[0].movementId).toBe("pushup")
  })
})

describe("error handling", () => {
  it("throws an ApiError with the status and the server's error message", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: "rpe must be between 1 and 10" }, 400))

    const err = await api
      .logEntry(TOKEN, { movementId: "pushup", mode: "isotonic", weight: 0, repsOrTime: 20, rpe: 99 })
      .catch((e: unknown) => e)

    expect(err).toBeInstanceOf(ApiError)
    expect((err as InstanceType<typeof ApiError>).status).toBe(400)
    expect((err as Error).message).toBe("rpe must be between 1 and 10")
  })

  it("falls back to the status text when the error body is not JSON", async () => {
    fetchMock.mockResolvedValue(new Response("gateway down", { status: 502, statusText: "Bad Gateway" }))

    const err = await api.listMovements(TOKEN).catch((e: unknown) => e)

    expect(err).toBeInstanceOf(ApiError)
    expect((err as InstanceType<typeof ApiError>).status).toBe(502)
    expect((err as Error).message).toBe("Bad Gateway")
  })
})
