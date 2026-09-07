import type { Mode } from "../../api/types"
import { DumbbellIcon, HourglassIcon } from "../icons"

const ROTATIONS = ["-6deg", "5deg", "4deg", "-4deg", "-3deg", "6deg"]

export function IconBadge({ mode, size = 60, rotationIndex = 0 }: { mode: Mode; size?: number; rotationIndex?: number }) {
  const rotation = ROTATIONS[rotationIndex % ROTATIONS.length]
  const isIsotonic = mode === "isotonic"

  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-2xl"
      style={{
        width: size,
        height: size,
        background: isIsotonic ? "#E4F0E6" : "#F6E8CC",
        transform: `rotate(${rotation})`,
      }}
    >
      {isIsotonic ? (
        <DumbbellIcon size={Math.round(size * 0.5)} color="#2E6B42" />
      ) : (
        <HourglassIcon size={Math.round(size * 0.45)} color="#B8811F" />
      )}
    </div>
  )
}
