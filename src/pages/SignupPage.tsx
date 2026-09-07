import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import { TextInput } from "../components/forms/FormField"
import { LeafSprig, LogoMark } from "../components/icons"

export function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    setSubmitting(true)
    try {
      await signup(email, password, inviteCode)
      navigate("/workouts")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <form
        onSubmit={handleSubmit}
        className="flex w-[440px] flex-col gap-7 rounded-[20px] border border-border bg-card px-10 py-11 shadow-[0_20px_48px_rgba(74,68,56,0.10)]"
      >
        <div className="flex flex-col items-center gap-3.5">
          <LeafSprig />
          <div className="flex items-center gap-2.5">
            <LogoMark size={28} />
            <span className="text-[22px] font-bold text-isotonic">TrainingGPT</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="text-[22px] font-semibold text-ink">Create your account</div>
            <div className="text-sm text-muted">You'll need an invite code to sign up.</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-muted">Email</label>
            <TextInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-muted">Password</label>
            <TextInput type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-muted">Confirm password</label>
            <TextInput type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-muted">Invite code</label>
            <TextInput
              type="text"
              required
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="e.g. FALCON-2C9X"
              className="rounded-[10px] border border-border bg-cream px-4 py-3 text-[15px] tracking-wide text-ink outline-none focus:border-isotonic"
            />
            <div className="text-xs text-faint">Don't have one? Ask whoever invited you.</div>
          </div>
        </div>

        {error && <div className="text-sm text-[#B91C1C]">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-[10px] bg-isotonic px-5 py-3.5 text-[15px] font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create Account"}
        </button>

        <div className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-isotonic">
            Log in
          </Link>
        </div>
      </form>
    </div>
  )
}
