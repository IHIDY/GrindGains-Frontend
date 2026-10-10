// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { LogEntry } from "../../api/types"

const updateEntry = vi.fn()

vi.mock("../../api/hooks", () => ({
  useUpdateEntry: () => ({ updateEntry, isSubmitting: false, error: null }),
}))

import { TrainingLogTable } from "./TrainingLogTable"

const entry: LogEntry = {
  movementId: "bench_press",
  mode: "isotonic",
  weight: 185,
  repsOrTime: 5,
  sets: 1,
  timestamp: "2026-09-07T18:41:00.067781Z",
  rpe: 8,
}

function comesBefore(a: HTMLElement, b: HTMLElement) {
  return Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
}

function renderTable(onUpdated = vi.fn()) {
  render(<TrainingLogTable entries={[entry]} movementId="bench_press" onUpdated={onUpdated} />)
  return onUpdated
}

beforeEach(() => {
  updateEntry.mockReset()
  updateEntry.mockResolvedValue({})
})

afterEach(cleanup)

describe("TrainingLogTable", () => {
  it("orders the columns Date, Weight, Sets × Reps, RPE, Volume", () => {
    renderTable()

    const headers = ["Date", "Weight", "Sets × Reps", "RPE", "Volume"].map((name) => screen.getByText(name))
    for (let i = 0; i < headers.length - 1; i++) {
      expect(comesBefore(headers[i], headers[i + 1])).toBe(true)
    }
  })

  it("shows the weight cell before the sets × reps cell in each row", () => {
    renderTable()

    expect(comesBefore(screen.getByText("185 lb"), screen.getByText("1 × 5"))).toBe(true)
  })

  it("edits with the weight input before the reps input and saves the right values", async () => {
    const onUpdated = renderTable()

    fireEvent.click(screen.getByRole("button", { name: "Edit" }))
    const [first, second] = screen.getAllByRole("spinbutton") as HTMLInputElement[]
    expect(first.value).toBe("185")
    expect(second.value).toBe("5")

    fireEvent.change(first, { target: { value: "200" } })
    fireEvent.change(second, { target: { value: "3" } })
    fireEvent.click(screen.getByRole("button", { name: "Save" }))

    await waitFor(() => expect(updateEntry).toHaveBeenCalledTimes(1))
    expect(updateEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        movementId: "bench_press",
        mode: "isotonic",
        timestamp: entry.timestamp,
        weight: 200,
        repsOrTime: 3,
        sets: 1,
        rpe: 8,
      }),
    )
    await waitFor(() => expect(onUpdated).toHaveBeenCalled())
  })
})
