import { useState } from "react"
import { useUpdateEntry } from "../../api/hooks"
import type { LogEntry } from "../../api/types"
import { formatShortDate } from "../../lib/format"

const COLUMNS = "110px 1fr 110px 80px 120px 130px"

interface EditDraft {
  reps: string
  weight: string
  rpe: string
}

export function TrainingLogTable({
  entries,
  movementId,
  onUpdated,
}: {
  entries: LogEntry[]
  movementId: string
  onUpdated: () => void
}) {
  const { updateEntry, isSubmitting, error } = useUpdateEntry()
  const [editingTimestamp, setEditingTimestamp] = useState<string | null>(null)
  const [draft, setDraft] = useState<EditDraft>({ reps: "", weight: "", rpe: "" })

  function startEdit(entry: LogEntry) {
    setEditingTimestamp(entry.timestamp)
    setDraft({ reps: String(entry.repsOrTime), weight: String(entry.weight), rpe: entry.rpe !== undefined ? String(entry.rpe) : "" })
  }

  async function saveEdit(entry: LogEntry) {
    await updateEntry({
      movementId,
      mode: "isotonic",
      timestamp: entry.timestamp,
      weight: Number(draft.weight),
      repsOrTime: Number(draft.reps),
      sets: entry.sets,
      rpe: draft.rpe ? Number(draft.rpe) : undefined,
    })
    setEditingTimestamp(null)
    onUpdated()
  }

  const inputClass = "w-full rounded-lg border border-border bg-cream px-2 py-1 text-sm text-ink outline-none focus:border-isotonic"

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-[#E4F0E6] px-6 py-[18px]">
        <div className="text-base font-semibold text-ink">Training Log</div>
        <div className="text-sm text-faint">{entries.length} sets logged</div>
      </div>

      {error && <div className="border-b border-[#E4F0E6] px-6 py-2 text-xs text-[#B91C1C]">{error}</div>}

      <div
        className="grid gap-4 border-b border-[#E4F0E6] px-6 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-faint"
        style={{ gridTemplateColumns: COLUMNS }}
      >
        <div>Date</div>
        <div>Sets &times; Reps</div>
        <div>Weight</div>
        <div>RPE</div>
        <div>Volume</div>
        <div />
      </div>

      {entries.length === 0 ? (
        <div className="px-6 py-8 text-center text-sm text-faint">No sets logged yet.</div>
      ) : (
        entries.map((entry, i) => {
          const isEditing = editingTimestamp === entry.timestamp
          return (
            <div
              key={`${entry.timestamp}-${i}`}
              className={`grid items-center gap-4 px-6 py-3.5 text-sm ${i < entries.length - 1 ? "border-b border-[#E4F0E6]" : ""}`}
              style={{ gridTemplateColumns: COLUMNS }}
            >
              <div className="text-faint">{formatShortDate(entry.timestamp)}</div>

              {isEditing ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="flex-shrink-0">{entry.sets} &times;</span>
                    <input
                      type="number"
                      min={1}
                      className="w-16 rounded-lg border border-border bg-cream px-2 py-1 text-sm text-ink outline-none focus:border-isotonic"
                      value={draft.reps}
                      onChange={(e) => setDraft((d) => ({ ...d, reps: e.target.value }))}
                    />
                  </div>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={inputClass}
                    value={draft.weight}
                    onChange={(e) => setDraft((d) => ({ ...d, weight: e.target.value }))}
                  />
                  <input
                    type="number"
                    min={1}
                    max={10}
                    step={0.5}
                    className={inputClass}
                    value={draft.rpe}
                    onChange={(e) => setDraft((d) => ({ ...d, rpe: e.target.value }))}
                  />
                  <div>{(Number(draft.weight) * Number(draft.reps) * entry.sets || 0).toLocaleString()} lb</div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => saveEdit(entry)}
                      disabled={isSubmitting}
                      className="rounded-md bg-isotonic px-2 py-1 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTimestamp(null)}
                      className="rounded-md border border-border-light px-2 py-1 text-xs font-medium text-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    {entry.sets} &times; {entry.repsOrTime}
                  </div>
                  <div>{entry.weight} lb</div>
                  <div className="text-faint">{entry.rpe ?? "—"}</div>
                  <div>{(entry.weight * entry.repsOrTime * entry.sets).toLocaleString()} lb</div>
                  <button type="button" onClick={() => startEdit(entry)} className="text-left text-xs font-semibold text-isotonic">
                    Edit
                  </button>
                </>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
