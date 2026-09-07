import { Link } from "react-router-dom"
import { useMovementHistory } from "../api/hooks"
import type { Movement } from "../api/types"
import { Sparkline } from "../components/charts/Sparkline"
import { XYChart } from "../components/charts/XYChart"
import { BackArrowIcon, PlusIcon } from "../components/icons"
import { PageShell } from "../components/layout/PageShell"
import { ModeBadge } from "../components/workouts/ModeBadge"
import { formatShortDate } from "../lib/format"

export function WorkoutDetailMobeta({ movement }: { movement: Movement }) {
  const { entries } = useMovementHistory(movement.id)
  const chronological = [...entries].reverse()

  const scatterData = chronological.map((e) => ({ weight: e.weight, seconds: e.repsOrTime }))
  const holdTimeData = chronological.map((e) => ({ date: formatShortDate(e.timestamp), seconds: e.repsOrTime }))

  const best = chronological.reduce<(typeof chronological)[number] | null>(
    (max, e) => (!max || e.repsOrTime > max.repsOrTime ? e : max),
    null,
  )

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
              <ModeBadge mode="mobeta" size="lg" />
            </div>
            <div className="text-[13px] text-muted">
              {movement.entryCount} holds logged
              {movement.lastLoggedAt && ` · last hold ${formatShortDate(movement.lastLoggedAt)}`}
            </div>
          </div>
        </div>
        <Link
          to={`/workouts/${movement.id}/log`}
          className="flex items-center gap-2 rounded-[10px] bg-mobeta-dark px-5 py-3 text-sm font-semibold text-white"
        >
          <PlusIcon size={16} />
          Log Hold
        </Link>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="text-[15px] font-semibold text-ink">Hold Time vs. Added Weight</div>
          <div className="text-xs text-faint">All logged holds</div>
        </div>
        <XYChart
          data={scatterData}
          xKey="weight"
          yKey="seconds"
          variant="scatter-trend"
          accentColor="#D99A36"
          xLabel="Weight (lb)"
          yLabel="Time (s)"
          height={280}
          valueFormatter={(v) => `Held ${v}s`}
          labelFormatter={(x) => `${x} lb added`}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-3.5 rounded-2xl border border-border bg-card p-[22px]">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-ink">Hold Time by Day</div>
            <div className="text-xs text-faint">All sessions</div>
          </div>
          <XYChart
            data={holdTimeData}
            xKey="date"
            yKey="seconds"
            variant="line"
            accentColor="#2E6B42"
            valueFormatter={(v) => `${v}s`}
          />
        </div>

        <div className="flex flex-col justify-center gap-4 rounded-2xl border border-border bg-card p-[22px]">
          <div className="text-sm font-semibold text-ink">Personal Best</div>
          {best ? (
            <>
              <div className="flex items-baseline gap-2.5">
                <div className="text-[44px] font-semibold tabular-nums text-mobeta-dark">{best.repsOrTime}s</div>
                <div className="text-[13px] text-faint">
                  at {best.weight} lb added · {formatShortDate(best.timestamp)}
                </div>
              </div>
              <Sparkline data={holdTimeData} xKey="date" yKey="seconds" accentColor="#D99A36" height={44} />
            </>
          ) : (
            <div className="text-sm text-faint">No holds logged yet.</div>
          )}
        </div>
      </div>
    </PageShell>
  )
}
