import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useLogEntry } from "../api/hooks"
import type { Movement } from "../api/types"
import { FormField, TextInput } from "../components/forms/FormField"
import { HoldTimer } from "../components/forms/HoldTimer"
import { BackArrowIcon } from "../components/icons"
import { PageShell } from "../components/layout/PageShell"
import { ModeBadge } from "../components/workouts/ModeBadge"

export function NewEntryMobeta({ movement }: { movement: Movement }) {
  const navigate = useNavigate()
  const { logEntry, isSubmitting, error } = useLogEntry()
  const [weight, setWeight] = useState("")
  const [seconds, setSeconds] = useState(0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await logEntry({
      movementId: movement.id,
      mode: "mobeta",
      weight: Number(weight) || 0,
      repsOrTime: seconds,
      sets: 1,
    })
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
            <div className="text-xl font-semibold text-ink">Log a Hold</div>
            <div className="flex items-center gap-2">
              <div className="text-[13px] text-muted">{movement.displayName}</div>
              <ModeBadge mode="mobeta" size="lg" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex w-[640px] flex-col gap-6 rounded-2xl border border-border bg-card p-8">
          <FormField label="Added weight (lb)">
            <TextInput type="number" min={0} step="any" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </FormField>

          <HoldTimer seconds={seconds} onChange={setSeconds} />

          {error && <div className="text-sm text-[#B91C1C]">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting || seconds === 0}
            className="rounded-[10px] bg-mobeta-dark px-5 py-3.5 text-[15px] font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : "Save Hold"}
          </button>
        </form>
      </div>
    </PageShell>
  )
}
