import type { Mode } from "../../api/types"

const LABELS: Record<Mode, string> = { isotonic: "Isotonic", mobeta: "Mobeta" }

export function ModeBadge({ mode, size = "sm" }: { mode: Mode; size?: "sm" | "lg" }) {
  const label = size === "lg" ? LABELS[mode].toUpperCase() : LABELS[mode]

  if (size === "lg") {
    return (
      <span
        className="rounded-full border px-2.5 py-1 text-[11px] font-semibold"
        style={
          mode === "isotonic"
            ? { background: "#2E6B4224", color: "#2E6B42", borderColor: "#2E6B4259" }
            : { background: "#D99A3629", color: "#B8811F", borderColor: "#D99A3666" }
        }
      >
        {label}
      </span>
    )
  }

  return (
    <span
      className="inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={mode === "isotonic" ? { background: "#E4F0E6", color: "#2E6B42" } : { background: "#F6E8CC", color: "#B8811F" }}
    >
      {label}
    </span>
  )
}
