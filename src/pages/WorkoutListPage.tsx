import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMovementsList } from "../api/hooks"
import type { Mode } from "../api/types"
import { PageShell } from "../components/layout/PageShell"
import { PlusIcon } from "../components/icons"
import { WorkoutCard } from "../components/workouts/WorkoutCard"

function NewWorkoutPrompt() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [movementId, setMovementId] = useState("")
  const [mode, setMode] = useState<Mode>("isotonic")

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="col-span-2 flex min-h-[88px] items-center justify-center gap-3.5 rounded-3xl border border-dashed border-border text-faint"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-isotonic-tint">
          <PlusIcon size={18} color="#6F9445" />
        </div>
        <div className="text-sm font-medium">Start a new workout</div>
      </button>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const id = movementId.trim().toLowerCase().replace(/\s+/g, "_")
        if (!id) return
        navigate(`/workouts/${id}/log?mode=${mode}`)
      }}
      className="col-span-2 flex flex-wrap items-end gap-4 rounded-3xl border border-border bg-card p-6"
    >
      <div className="flex flex-1 min-w-[200px] flex-col gap-2">
        <label className="text-[13px] font-medium text-muted">Movement name</label>
        <input
          autoFocus
          value={movementId}
          onChange={(e) => setMovementId(e.target.value)}
          placeholder="e.g. bench press"
          className="rounded-[10px] border border-border bg-cream px-4 py-2.5 text-sm text-ink outline-none focus:border-isotonic"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-medium text-muted">Mode</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="rounded-[10px] border border-border bg-cream px-4 py-2.5 text-sm text-ink outline-none focus:border-isotonic"
        >
          <option value="isotonic">Isotonic (sets &times; reps)</option>
          <option value="mobeta">Mobeta (timed hold)</option>
        </select>
      </div>
      <button type="submit" className="rounded-[10px] bg-isotonic px-5 py-2.5 text-sm font-semibold text-white">
        Start
      </button>
      <button type="button" onClick={() => setOpen(false)} className="text-sm text-faint">
        Cancel
      </button>
    </form>
  )
}

export function WorkoutListPage() {
  const { movements, status } = useMovementsList()

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-[26px] font-semibold text-ink">Your Workouts</div>
          <div className="text-sm text-muted">
            {status === "success" ? `${movements.length} workouts` : "Loading…"}
          </div>
        </div>
      </div>

      {status === "loading" && <div className="text-sm text-faint">Loading your workouts…</div>}
      {status === "error" && <div className="text-sm text-[#B91C1C]">Couldn't load your workouts. Try refreshing.</div>}

      {status === "success" && (
        <div className="grid grid-cols-2 gap-[22px]">
          {movements.map((summary, i) => (
            <WorkoutCard key={summary.movement.id} summary={summary} rotationIndex={i} />
          ))}
          <NewWorkoutPrompt />
        </div>
      )}
    </PageShell>
  )
}
