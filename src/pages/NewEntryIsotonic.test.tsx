// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { MemoryRouter } from "react-router-dom"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { Movement } from "../api/types"

const logEntry = vi.fn()

vi.mock("../api/hooks", () => ({
  useLogEntry: () => ({ logEntry, isSubmitting: false, error: null }),
}))

// The real PageShell renders a NavBar that needs the auth provider.
vi.mock("../components/layout/PageShell", () => ({
  PageShell: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

import { NewEntryIsotonic } from "./NewEntryIsotonic"

const movement: Movement = {
  id: "bench_press",
  displayName: "Bench Press",
  mode: "isotonic",
  lastLoggedAt: null,
  entryCount: 0,
}

function renderForm() {
  return render(
    <MemoryRouter>
      <NewEntryIsotonic movement={movement} />
    </MemoryRouter>,
  )
}

function comesBefore(a: HTMLElement, b: HTMLElement) {
  return Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
}

beforeEach(() => {
  logEntry.mockReset()
  logEntry.mockResolvedValue({})
})

afterEach(cleanup)

describe("NewEntryIsotonic", () => {
  it("lists the Weight, Reps and RPE column headers in that order", () => {
    renderForm()

    const weight = screen.getByText("Weight (lb)")
    const reps = screen.getByText("Reps")
    const rpe = screen.getByText("RPE")

    expect(comesBefore(weight, reps)).toBe(true)
    expect(comesBefore(reps, rpe)).toBe(true)
  })

  it("submits the first field as weight and the second as reps", async () => {
    renderForm()

    const [first, second] = screen.getAllByRole("spinbutton")
    fireEvent.change(first, { target: { value: "185" } })
    fireEvent.change(second, { target: { value: "5" } })
    fireEvent.submit(first.closest("form")!)

    await waitFor(() => expect(logEntry).toHaveBeenCalledTimes(1))
    expect(logEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        movementId: "bench_press",
        mode: "isotonic",
        weight: 185,
        repsOrTime: 5,
        sets: 1,
      }),
    )
  })
})
