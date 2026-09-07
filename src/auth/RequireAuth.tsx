import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./AuthContext"

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-cream text-muted">
        Loading…
      </div>
    )
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
