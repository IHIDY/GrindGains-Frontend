import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useLogEntry } from "../api/hooks"
import type { Movement } from "../api/types"
import { TextInput } from "../components/forms/FormField"
import { BackArrowIcon, PlusIcon } from "../components/icons"
import { PageShell } from "../components/layout/PageShell"
import { ModeBadge } from "../components/workouts/ModeBadge"

interface SetRow {
  reps: string
  weight: string
  rpe: string
}

const emptyRow = (): SetRow => ({ reps: "", weight: "", rpe: "" })

export function NewEntryIsotonic({ movement }: { movement: Movement }) {
  const navigate = useNavigate()
  const { logEntry, isSubmitting, error } = useLogEntry()
  const [rows, setRows] = useState<SetRow[]>([emptyRow()])
  const [submitError, setSubmitError] = useState<string | null>(null)

  function updateRow(index: number, field: keyof SetRow, value: string) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)))
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()])
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    // Each set gets its own POST (sets: 1) rather than one call for the whole session,
    // since reps/weight/RPE can differ set to set — the API's `sets` count only repeats
    // one identical set, it can't encode a per-set breakdown.
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      try {
        await logEntry({
          movementId: movement.id,
          mode: "isotonic",
          weight: Number(row.weight),
          repsOrTime: Number(row.reps),
          sets: 1,
          rpe: row.rpe ? Number(row.rpe) : undefined,
        })
      } catch (err) {
        setSubmitError(
          `Set ${i + 1} of ${rows.length} failed to save (${err instanceof Error ? err.message : "unknown error"}). ` +
            `${i > 0 ? `The first ${i} set(s) were already saved.` : ""}`,
        )
        return
      }
    }
    navigate(`/workouts/${movement.id}`)
  }

  return (
    <PageShell>
      <div className="flex flex-col items-center gap-6">
        <div className="flex w-[640px] items-center gap-3.5">
          <Link to={`/workouts/${movement.id}`} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] border border-border">
            <BackArrowIcon />
          </Link>
          <div className="flex flex-col gap-0.5">
            <div className="text-xl font-semibold text-ink">Log a Set</div>
            <div className="flex items-center gap-2">
              <div className="text-[13px] text-muted">{movement.displayName}</div>
              <ModeBadge mode="isotonic" size="lg" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex w-[640px] flex-col gap-6 rounded-2xl border border-border bg-card p-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-muted">Sets</label>
              <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-1.5 rounded-lg border border-border-light px-3 py-1.5 text-xs font-medium text-muted"
              >
                <PlusIcon size={12} color="#7D7261" />
                Add Set
              </button>
            </div>

            <div className="grid grid-cols-[28px_1fr_1fr_1fr_28px] items-center gap-2.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-faint">
              <div />
              <div>Reps</div>
              <div>Weight (lb)</div>
              <div>RPE</div>
              <div />
            </div>

            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-[28px_1fr_1fr_1fr_28px] items-center gap-2.5">
                <div className="text-center text-[13px] font-semibold text-faint">{i + 1}</div>
                <TextInput
                  type="number"
                  required
                  min={1}
                  value={row.reps}
                  onChange={(e) => updateRow(i, "reps", e.target.value)}
                />
                <TextInput
                  type="number"
                  required
                  min={0}
                  step="any"
                  value={row.weight}
                  onChange={(e) => updateRow(i, "weight", e.target.value)}
                />
                <TextInput
                  type="number"
                  min={1}
                  max={10}
                  placeholder="1-10"
                  value={row.rpe}
                  onChange={(e) => updateRow(i, "rpe", e.target.value)}
                />
                {rows.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    aria-label={`Remove set ${i + 1}`}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-faint hover:bg-cream"
                  >
                    ×
                  </button>
                ) : (
                  <div />
                )}
              </div>
            ))}
          </div>

          {(submitError || error) && <div className="text-sm text-[#B91C1C]">{submitError ?? error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-[10px] bg-isotonic px-5 py-3.5 text-[15px] font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : rows.length > 1 ? `Save ${rows.length} Sets` : "Save Set"}
          </button>
        </form>
      </div>
    </PageShell>
  )
}
