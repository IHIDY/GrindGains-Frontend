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

// The real timer counts on a 1s interval; this stand-in sets the seconds on demand.
vi.mock("../components/forms/HoldTimer", () => ({
  HoldTimer: ({ onChange }: { onChange: (seconds: number) => void }) => (
    <div>
      <div>Time Held</div>
      <button type="button" onClick={() => onChange(42)}>
        Set 42s
      </button>
    </div>
  ),
}))

import { NewEntryMobeta } from "./NewEntryMobeta"

const movement: Movement = {
  id: "plank",
  displayName: "Plank",
  mode: "mobeta",
  lastLoggedAt: null,
  entryCount: 0,
}

function renderForm() {
  return render(
    <MemoryRouter>
      <NewEntryMobeta movement={movement} />
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

describe("NewEntryMobeta", () => {
  it("shows the Added weight field before the hold timer", () => {
    renderForm()

    expect(comesBefore(screen.getByText("Added weight (lb)"), screen.getByText("Time Held"))).toBe(true)
  })

  it("saves the entered weight and the timed seconds to the right fields", async () => {
    renderForm()

    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "25" } })
    fireEvent.click(screen.getByRole("button", { name: "Set 42s" }))
    fireEvent.click(screen.getByRole("button", { name: "Save Hold" }))

    await waitFor(() => expect(logEntry).toHaveBeenCalledTimes(1))
    expect(logEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        movementId: "plank",
        mode: "mobeta",
        weight: 25,
        repsOrTime: 42,
        sets: 1,
      }),
    )
  })
})
