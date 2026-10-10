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

function saveButton() {
  return screen.getByRole("button", { name: "Save Hold" }) as HTMLButtonElement
}

beforeEach(() => {
  logEntry.mockReset()
  logEntry.mockResolvedValue({})
})

afterEach(cleanup)

describe("NewEntryMobeta", () => {
  it("shows the Added weight field before the Time (s) field", () => {
    renderForm()

    expect(comesBefore(screen.getByText("Added weight (lb)"), screen.getByText("Time (s)"))).toBe(true)
  })

  it("has no stopwatch", () => {
    renderForm()

    for (const name of ["Start", "Stop", "Reset"]) {
      expect(screen.queryByRole("button", { name })).toBeNull()
    }
    expect(screen.queryByText("Time Held")).toBeNull()
  })

  it("logs the typed weight and time to the right fields", async () => {
    renderForm()

    const [weight, time] = screen.getAllByRole("spinbutton")
    fireEvent.change(weight, { target: { value: "25" } })
    fireEvent.change(time, { target: { value: "42" } })
    fireEvent.click(saveButton())

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

  it("logs weight 0 when the weight is left empty", async () => {
    renderForm()

    const [, time] = screen.getAllByRole("spinbutton")
    fireEvent.change(time, { target: { value: "30" } })
    fireEvent.click(saveButton())

    await waitFor(() => expect(logEntry).toHaveBeenCalledTimes(1))
    expect(logEntry).toHaveBeenCalledWith(expect.objectContaining({ weight: 0, repsOrTime: 30 }))
  })

  it("keeps Save disabled until a time greater than 0 is entered", () => {
    renderForm()
    expect(saveButton().disabled).toBe(true)

    const [, time] = screen.getAllByRole("spinbutton")
    fireEvent.change(time, { target: { value: "0" } })
    expect(saveButton().disabled).toBe(true)

    fireEvent.change(time, { target: { value: "42" } })
    expect(saveButton().disabled).toBe(false)
  })
})
