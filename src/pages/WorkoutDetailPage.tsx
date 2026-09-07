import type { ComponentType } from "react"
import { useParams } from "react-router-dom"
import { useMovement } from "../api/hooks"
import type { Mode, Movement } from "../api/types"
import { PageShell } from "../components/layout/PageShell"
import { WorkoutDetailIsotonic } from "./WorkoutDetailIsotonic"
import { WorkoutDetailMobeta } from "./WorkoutDetailMobeta"

const MODE_DETAIL_COMPONENTS: Record<Mode, ComponentType<{ movement: Movement }>> = {
  isotonic: WorkoutDetailIsotonic,
  mobeta: WorkoutDetailMobeta,
}

export function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { movement, status } = useMovement(id!)

  if (status === "loading") {
    return (
      <PageShell>
        <div className="text-sm text-faint">Loading…</div>
      </PageShell>
    )
  }

  if (status === "error" || !movement) {
    return (
      <PageShell>
        <div className="text-sm text-[#B91C1C]">Couldn't load this workout.</div>
      </PageShell>
    )
  }

  const Component = MODE_DETAIL_COMPONENTS[movement.mode]
  return <Component movement={movement} />
}
