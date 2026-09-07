import type { ReactNode } from "react"
import { NavBar } from "./NavBar"

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <NavBar />
      <main className="flex flex-1 flex-col gap-7 px-12 py-9">{children}</main>
    </div>
  )
}
