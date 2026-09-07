import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/AuthContext"
import { LogoMark } from "../icons"

export function NavBar() {
  const { logout, getUsername, updateUsername } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [draft, setDraft] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
        setEditing(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [menuOpen])

  function toggleMenu() {
    setMenuOpen((open) => {
      const next = !open
      if (next) getUsername().then(setUsername)
      return next
    })
  }

  function startEditing() {
    setDraft(username ?? "")
    setError(null)
    setEditing(true)
  }

  async function handleSaveUsername(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(draft)) {
      setError("3-20 characters: letters, numbers, or underscores")
      return
    }
    setSaving(true)
    setError(null)
    try {
      await updateUsername(draft)
      setUsername(draft)
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update username")
    } finally {
      setSaving(false)
    }
  }

  function handleLogout() {
    logout()
    navigate("/login")
  }

  const initials = (username ?? "?").slice(0, 2).toUpperCase()

  return (
    <div className="flex items-center justify-between border-b border-border px-12 py-5">
      <Link to="/workouts" className="flex items-center gap-2.5">
        <LogoMark />
        <span className="text-xl font-bold text-isotonic">GrindGains</span>
      </Link>
      <div className="flex items-center gap-7">
        <Link to="/workouts" className="text-sm font-semibold text-ink">
          Workouts
        </Link>
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={toggleMenu}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-isotonic-tint text-xs font-semibold text-muted"
          >
            {initials}
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-xl border border-border bg-card p-3 shadow-[0_12px_28px_rgba(74,68,56,0.14)]">
              {editing ? (
                <form onSubmit={handleSaveUsername} className="flex flex-col gap-2">
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="rounded-lg border border-border bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-isotonic"
                  />
                  {error && <div className="text-xs text-[#B91C1C]">{error}</div>}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 rounded-lg bg-isotonic px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {saving ? "Saving…" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="rounded-lg border border-border-light px-3 py-1.5 text-xs font-medium text-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="px-1 pb-1 text-sm font-semibold text-ink">{username ?? "Set a username"}</div>
                  <button
                    type="button"
                    onClick={startEditing}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-ink hover:bg-cream"
                  >
                    Edit username
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-ink hover:bg-cream"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
