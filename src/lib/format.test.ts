import { describe, expect, it } from "vitest"
import { formatSeconds, groupByDay, humanizeMovementId } from "./format"

describe("humanizeMovementId", () => {
  it("title-cases underscore-separated ids", () => {
    expect(humanizeMovementId("bench_press")).toBe("Bench Press")
  })

  it("treats hyphens as separators too", () => {
    expect(humanizeMovementId("pull-up")).toBe("Pull Up")
  })

  it("ignores empty segments from repeated or leading separators", () => {
    expect(humanizeMovementId("__bench__press_")).toBe("Bench Press")
  })

  it("handles a single word", () => {
    expect(humanizeMovementId("pushup")).toBe("Pushup")
  })

  it("returns an empty string for an empty id", () => {
    expect(humanizeMovementId("")).toBe("")
  })
})

describe("formatSeconds", () => {
  it("formats seconds under a minute as 0:SS", () => {
    expect(formatSeconds(0)).toBe("0:00")
    expect(formatSeconds(7)).toBe("0:07")
    expect(formatSeconds(59)).toBe("0:59")
  })

  it("rolls over into minutes", () => {
    expect(formatSeconds(60)).toBe("1:00")
    expect(formatSeconds(125)).toBe("2:05")
  })

  it("drops fractional seconds", () => {
    expect(formatSeconds(45.9)).toBe("0:45")
  })
})

describe("groupByDay", () => {
  const row = (timestamp: string, reps: number) => ({ timestamp, reps })

  it("returns an empty array for empty input", () => {
    expect(groupByDay([])).toEqual([])
  })

  it("collapses several sets on the same day into one group", () => {
    const rows = [
      row("2026-09-07T18:41:00.000Z", 10),
      row("2026-09-07T18:45:00.000Z", 8),
      row("2026-09-07T18:50:00.000Z", 6),
    ]
    const groups = groupByDay(rows)
    expect(groups).toHaveLength(1)
    expect(groups[0].dateKey).toBe("2026-09-07")
    expect(groups[0].rows).toEqual(rows)
  })

  it("keeps separate days apart, in the order each day first appears", () => {
    const groups = groupByDay([
      row("2026-09-08T10:00:00.000Z", 5),
      row("2026-09-07T10:00:00.000Z", 6),
      row("2026-09-08T11:00:00.000Z", 7),
    ])
    expect(groups.map((g) => g.dateKey)).toEqual(["2026-09-08", "2026-09-07"])
    expect(groups[0].rows.map((r) => r.reps)).toEqual([5, 7])
    expect(groups[1].rows.map((r) => r.reps)).toEqual([6])
  })
})
