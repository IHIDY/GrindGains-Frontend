import { useEffect, useRef, useState } from "react"
import { formatSeconds } from "../../lib/format"

export function HoldTimer({ seconds, onChange }: { seconds: number; onChange: (seconds: number) => void }) {
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => onChange(seconds + 1), 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, seconds])

  return (
    <div className="flex flex-col items-center gap-4 rounded-[14px] border border-[#E4F0E6] bg-cream p-7">
      <div className="text-xs font-semibold uppercase tracking-wide text-faint">Time Held</div>
      <div className="text-[52px] font-semibold tabular-nums text-[#B8811F]">{formatSeconds(seconds)}</div>
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => {
            setRunning(false)
            onChange(0)
          }}
          className="rounded-[10px] border border-border-light px-[18px] py-2.5 text-[13px] font-semibold text-muted"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="rounded-[10px] bg-mobeta-dark px-[22px] py-2.5 text-[13px] font-semibold text-white"
        >
          {running ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  )
}
