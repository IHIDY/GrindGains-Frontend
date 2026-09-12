import type { LogEntry } from "../../api/types"
import { formatShortDate } from "../../lib/format"

const COLUMNS = "110px 1fr 110px 80px 120px"

export function TrainingLogTable({ entries }: { entries: LogEntry[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-[#E4F0E6] px-6 py-[18px]">
        <div className="text-base font-semibold text-ink">Training Log</div>
        <div className="text-sm text-faint">{entries.length} sets logged</div>
      </div>

      <div
        className="grid gap-4 border-b border-[#E4F0E6] px-6 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-faint"
        style={{ gridTemplateColumns: COLUMNS }}
      >
        <div>Date</div>
        <div>Sets &times; Reps</div>
        <div>Weight</div>
        <div>RPE</div>
        <div>Volume</div>
      </div>

      {entries.length === 0 ? (
        <div className="px-6 py-8 text-center text-sm text-faint">No sets logged yet.</div>
      ) : (
        entries.map((entry, i) => (
          <div
            key={`${entry.timestamp}-${i}`}
            className={`grid gap-4 px-6 py-3.5 text-sm ${i < entries.length - 1 ? "border-b border-[#E4F0E6]" : ""}`}
            style={{ gridTemplateColumns: COLUMNS }}
          >
            <div className="text-faint">{formatShortDate(entry.timestamp)}</div>
            <div>
              {entry.sets} &times; {entry.repsOrTime}
            </div>
            <div>{entry.weight} lb</div>
            <div className="text-faint">{entry.rpe ?? "—"}</div>
            <div>{(entry.weight * entry.repsOrTime * entry.sets).toLocaleString()} lb</div>
          </div>
        ))
      )}
    </div>
  )
}
