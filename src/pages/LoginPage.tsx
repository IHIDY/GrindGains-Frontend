import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import { TextInput } from "../components/forms/FormField"
import { LeafSprig, LogoMark } from "../components/icons"

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      navigate("/workouts")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <form
        onSubmit={handleSubmit}
        className="flex w-[440px] flex-col gap-8 rounded-[20px] border border-border bg-card px-10 py-11 shadow-[0_20px_48px_rgba(74,68,56,0.10)]"
      >
        <div className="flex flex-col items-center gap-3.5">
          <LeafSprig />
          <div className="flex items-center gap-2.5">
            <LogoMark size={28} />
            <span className="text-[22px] font-bold text-isotonic">TrainingGPT</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="text-[22px] font-semibold text-ink">Welcome back</div>
            <div className="text-sm text-muted">Log in to keep your training log up to date.</div>
          </div>
        </div>

        <div className="flex flex-col gap-[18px]">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-muted">Email</label>
            <TextInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-muted">Password</label>
            <TextInput type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>

        {error && <div className="text-sm text-[#B91C1C]">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-[10px] bg-isotonic px-5 py-3.5 text-[15px] font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Logging in…" : "Log In"}
        </button>

        <div className="text-center text-sm text-muted">
          New here?{" "}
          <Link to="/signup" className="font-semibold text-isotonic">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  )
}
