import { Link } from "react-router-dom"
import { LogoMark } from "../icons"

export function NavBar({ userInitials = "JL" }: { userInitials?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-12 py-5">
      <Link to="/workouts" className="flex items-center gap-2.5">
        <LogoMark />
        <span className="text-xl font-bold text-isotonic">TrainingGPT</span>
      </Link>
      <div className="flex items-center gap-7">
        <Link to="/workouts" className="text-sm font-semibold text-ink">
          Workouts
        </Link>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-isotonic-tint text-xs font-semibold text-muted">
          {userInitials}
        </div>
      </div>
    </div>
  )
}
