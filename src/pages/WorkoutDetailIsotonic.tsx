import { Link } from "react-router-dom"
import { useMovementHistory } from "../api/hooks"
import type { Movement } from "../api/types"
import { XYChart } from "../components/charts/XYChart"
import { BackArrowIcon, PlusIcon } from "../components/icons"
import { PageShell } from "../components/layout/PageShell"
import { ModeBadge } from "../components/workouts/ModeBadge"
import { TrainingLogTable } from "../components/workouts/TrainingLogTable"
import { formatShortDate } from "../lib/format"

export function WorkoutDetailIsotonic({ movement }: { movement: Movement }) {
  const { entries } = useMovementHistory(movement.id)
  const chronological = [...entries].reverse()

  const volumeData = chronological.map((e) => ({
    date: formatShortDate(e.timestamp),
    volume: e.weight * e.repsOrTime * e.sets,
  }))
  const weightData = chronological.map((e) => ({
    date: formatShortDate(e.timestamp),
    weight: e.weight,
  }))

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <Link to="/workouts" className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border">
            <BackArrowIcon />
          </Link>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-semibold text-ink">{movement.displayName}</div>
              <ModeBadge mode="isotonic" size="lg" />
            </div>
            <div className="text-[13px] text-muted">
              {movement.entryCount} sets logged
              {movement.lastLoggedAt && ` · last set ${formatShortDate(movement.lastLoggedAt)}`}
            </div>
          </div>
        </div>
        <Link
          to={`/workouts/${movement.id}/log`}
          className="flex items-center gap-2 rounded-[10px] bg-isotonic px-5 py-3 text-sm font-semibold text-white"
        >
          <PlusIcon size={16} />
          Log Set
        </Link>
      </div>

      <TrainingLogTable entries={entries} />

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-3.5 rounded-2xl border border-border bg-card p-[22px]">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-ink">Volume by Day</div>
            <div className="text-xs text-faint">All sessions</div>
          </div>
          <XYChart
            data={volumeData}
            xKey="date"
            yKey="volume"
            variant="line"
            accentColor="#2E6B42"
            valueFormatter={(v) => `${v.toLocaleString()} lb`}
          />
        </div>
        <div className="flex flex-col gap-3.5 rounded-2xl border border-border bg-card p-[22px]">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-ink">Weight by Day</div>
            <div className="text-xs text-faint">All sessions</div>
          </div>
          <XYChart
            data={weightData}
            xKey="date"
            yKey="weight"
            variant="line"
            accentColor="#6F9445"
            valueFormatter={(v) => `${v} lb`}
          />
        </div>
      </div>
    </PageShell>
  )
}
