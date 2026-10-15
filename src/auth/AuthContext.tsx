import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import * as cognito from "./cognito"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

interface AuthContextValue {
  status: AuthStatus
  /** True once we know whether the visitor is signed in — safe to gate rendering on. */
  isAuthenticated: boolean
  /**
   * Always fetches a fresh ID token (amazon-cognito-identity-js transparently refreshes
   * it via the stored refresh token if the cached one is past its 1-hour expiry — see
   * docs/auth.md in the GrindGains-Backend repo ("ID tokens expire after 1 hour"). Never cache
   * the return value across requests; call this right before each API call instead.
   */
  getToken: () => Promise<string | null>
  login: (email: string, password: string) => Promise<void>
  /** Registers the user only — Cognito requires email verification before login works, see confirmSignup. */
  signup: (email: string, password: string, inviteCode: string, username: string) => Promise<void>
  confirmSignup: (email: string, code: string) => Promise<void>
  resendConfirmationCode: (email: string) => Promise<void>
  getUsername: () => Promise<string | null>
  updateUsername: (username: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading")

  useEffect(() => {
    cognito.getCurrentIdToken().then((token) => {
      setStatus(token ? "authenticated" : "unauthenticated")
    })
  }, [])

  const getToken = useCallback(() => cognito.getCurrentIdToken(), [])

  const login = useCallback(async (email: string, password: string) => {
    await cognito.login(email, password)
    setStatus("authenticated")
  }, [])

  const signup = useCallback(async (email: string, password: string, inviteCode: string, username: string) => {
    await cognito.signup(email, password, inviteCode, username)
  }, [])

  const confirmSignup = useCallback((email: string, code: string) => cognito.confirmSignup(email, code), [])

  const resendConfirmationCode = useCallback((email: string) => cognito.resendConfirmationCode(email), [])

  const getUsername = useCallback(() => cognito.getUsername(), [])

  const updateUsername = useCallback((username: string) => cognito.updateUsername(username), [])

  const logout = useCallback(() => {
    cognito.logout()
    setStatus("unauthenticated")
  }, [])

  const value = useMemo(
    () => ({
      status,
      isAuthenticated: status === "authenticated",
      getToken,
      login,
      signup,
      confirmSignup,
      resendConfirmationCode,
      getUsername,
      updateUsername,
      logout,
    }),
    [status, getToken, login, signup, confirmSignup, resendConfirmationCode, getUsername, updateUsername, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
