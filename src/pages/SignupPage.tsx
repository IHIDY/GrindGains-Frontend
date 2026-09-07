import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import { TextInput } from "../components/forms/FormField"
import { LogoMark } from "../components/icons"

type Step = "form" | "verify"

export function SignupPage() {
  const { signup, confirmSignup, resendConfirmationCode, login } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>("form")

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [code, setCode] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      setError("Username must be 3-20 characters: letters, numbers, or underscores")
      return
    }

    setSubmitting(true)
    try {
      await signup(email, password, inviteCode, username)
      setStep("verify")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await confirmSignup(email, code)
      await login(email, password)
      navigate("/workouts")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify your email")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResend() {
    setError(null)
    setResendMessage(null)
    try {
      await resendConfirmationCode(email)
      setResendMessage("Code resent — check your inbox.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend the code")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <form
        onSubmit={step === "verify" ? handleVerify : handleCreateAccount}
        className="flex w-[440px] flex-col gap-7 rounded-[20px] border border-border bg-card px-10 py-11 shadow-[0_20px_48px_rgba(74,68,56,0.10)]"
      >
        <div className="flex flex-col items-center gap-3.5">
          <div className="flex items-center gap-2.5">
            <LogoMark size={28} />
            <span className="text-[22px] font-bold text-isotonic">GrindGains</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="text-[22px] font-semibold text-ink">Create your account</div>
            <div className="text-sm text-muted">You'll need an invite code to sign up.</div>
          </div>
        </div>

        <div className="relative">
          <div className={step === "verify" ? "flex flex-col gap-4 opacity-50 blur-[3px]" : "flex flex-col gap-4"}>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-muted">Username</label>
              <TextInput
                type="text"
                required
                disabled={step === "verify"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. jamie_lifts"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-muted">Email</label>
              <TextInput
                type="email"
                required
                disabled={step === "verify"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-muted">Password</label>
              <TextInput
                type="password"
                required
                disabled={step === "verify"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-muted">Confirm password</label>
              <TextInput
                type="password"
                required
                disabled={step === "verify"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-muted">Invite code</label>
              <TextInput
                type="text"
                required
                disabled={step === "verify"}
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="e.g. FALCON-2C9X"
                className="rounded-[10px] border border-border bg-cream px-4 py-3 text-[15px] tracking-wide text-ink outline-none focus:border-isotonic"
              />
              <div className="text-xs text-faint">Don't have one? Ask whoever invited you.</div>
            </div>
          </div>

          {step === "verify" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex w-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-[0_16px_34px_rgba(74,68,56,0.18)]">
                <div className="text-sm font-semibold text-ink">Check your email</div>
                <div className="text-xs text-muted">Enter the verification code we sent to {email}.</div>
                <TextInput
                  type="text"
                  inputMode="numeric"
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                />
                <button type="button" onClick={handleResend} className="self-start text-xs font-semibold text-isotonic">
                  Resend code
                </button>
                {resendMessage && <div className="text-xs text-isotonic">{resendMessage}</div>}
              </div>
            </div>
          )}
        </div>

        {error && <div className="text-sm text-[#B91C1C]">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-[10px] bg-isotonic px-5 py-3.5 text-[15px] font-semibold text-white disabled:opacity-60"
        >
          {step === "verify"
            ? submitting
              ? "Verifying…"
              : "Verify Email"
            : submitting
              ? "Creating account…"
              : "Create Account"}
        </button>

        {step === "form" && (
          <div className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-isotonic">
              Log in
            </Link>
          </div>
        )}
      </form>
    </div>
  )
}
