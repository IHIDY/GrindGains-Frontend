import { Link } from "react-router-dom"
import type { MovementSummary } from "../../api/hooks"
import { formatShortDate } from "../../lib/format"
import { Sparkline } from "../charts/Sparkline"
import { IconBadge } from "./IconBadge"
import { ModeBadge } from "./ModeBadge"

const SPARKLINE_WINDOW = 7

export function WorkoutCard({ summary, rotationIndex }: { summary: MovementSummary; rotationIndex: number }) {
  const { movement, history } = summary
  const isIsotonic = movement.mode === "isotonic"

  const recent = [...history].slice(0, SPARKLINE_WINDOW).reverse()
  const chartData = recent.map((entry, i) => ({
    x: i,
    y: isIsotonic ? entry.weight * entry.repsOrTime * entry.sets : entry.repsOrTime,
  }))
  const currentValue = chartData.length > 0 ? chartData[chartData.length - 1].y : 0
  const metricLabel = isIsotonic ? `Volume · last ${chartData.length}` : `Hold time · last ${chartData.length}`
  const valueLabel = isIsotonic ? `${currentValue.toLocaleString()} lb` : `${currentValue}s`

  return (
    <Link
      to={`/workouts/${movement.id}`}
      className="flex flex-col gap-[18px] rounded-3xl border bg-card p-[26px] shadow-[0_12px_26px_rgba(74,68,56,0.07)]"
      style={{ borderColor: isIsotonic ? "#E4F0E6" : "#F6E8CC" }}
    >
      <div className="flex items-center gap-4">
        <IconBadge mode={movement.mode} rotationIndex={rotationIndex} />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="text-lg font-semibold text-ink">{movement.displayName}</div>
          <ModeBadge mode={movement.mode} />
        </div>
        <div className="text-right text-xs text-faint">
          {movement.lastLoggedAt ? (
            <>
              Last logged
              <br />
              {formatShortDate(movement.lastLoggedAt)}
            </>
          ) : (
            "Not logged yet"
          )}
        </div>
      </div>

      {chartData.length > 0 ? (
        <div
          className="rounded-2xl border px-[18px] pb-2.5 pt-3.5"
          style={{ background: "#FBFBF6", borderColor: isIsotonic ? "#E4F0E6" : "#F6E8CC" }}
        >
          <div className="mb-1.5 flex items-baseline justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-faint">{metricLabel}</div>
            <div className="text-sm font-semibold" style={{ color: isIsotonic ? "#2E6B42" : "#B8811F" }}>
              {valueLabel}
            </div>
          </div>
          <Sparkline data={chartData} xKey="x" yKey="y" accentColor={isIsotonic ? "#2E6B42" : "#D99A36"} />
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border px-[18px] py-6 text-center text-xs text-faint">
          No sets logged yet
        </div>
      )}
    </Link>
  )
}
