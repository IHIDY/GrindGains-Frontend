import type { ComponentType } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { useMovement } from "../api/hooks"
import type { Mode, Movement } from "../api/types"
import { PageShell } from "../components/layout/PageShell"
import { NewEntryIsotonic } from "./NewEntryIsotonic"
import { NewEntryMobeta } from "./NewEntryMobeta"

const MODE_ENTRY_COMPONENTS: Record<Mode, ComponentType<{ movement: Movement }>> = {
  isotonic: NewEntryIsotonic,
  mobeta: NewEntryMobeta,
}

export function NewEntryPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  // Only relevant for a movement that's never been logged yet (see WorkoutListPage's
  // "Start a new workout" flow) — once a movement has history, its real mode wins.
  const modeParam = searchParams.get("mode")
  const fallbackMode: Mode | undefined = modeParam === "isotonic" || modeParam === "mobeta" ? modeParam : undefined
  const { movement, status } = useMovement(id!, fallbackMode)

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

  const Component = MODE_ENTRY_COMPONENTS[movement.mode]
  return <Component movement={movement} />
}
