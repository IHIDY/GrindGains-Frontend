import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js"

const userPool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
})

export function login(email: string, password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool })
    const details = new AuthenticationDetails({ Username: email, Password: password })

    user.authenticateUser(details, {
      onSuccess: (session) => resolve(session.getIdToken().getJwtToken()),
      onFailure: (err) => reject(err),
    })
  })
}

/**
 * `username` is stored in the standard `preferred_username` attribute (present on
 * every Cognito pool by default — no schema change needed). NOTE: this pool has not
 * been confirmed to enforce uniqueness on it (that requires the pool's alias
 * attributes to be configured at pool-creation time, which is not something the
 * frontend can verify or change). Real double-registration prevention for usernames
 * needs a small backend addition (a Pre-Signup check reserving `USERNAME#<value>` in
 * DynamoDB, mirroring the existing invite-code reservation pattern) — until that
 * lands, this only sets the display value, without a hard uniqueness guarantee.
 */
export function signup(email: string, password: string, inviteCode: string, username: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const attributeList = [new CognitoUserAttribute({ Name: "preferred_username", Value: username })]
    userPool.signUp(
      email,
      password,
      attributeList,
      [],
      (err) => {
        if (err) reject(err)
        else resolve()
      },
      { invite_code: inviteCode },
    )
  })
}

export function confirmSignup(email: string, code: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool })
    user.confirmRegistration(code, true, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export function resendConfirmationCode(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool })
    user.resendConfirmationCode((err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export function getCurrentIdToken(): Promise<string | null> {
  return new Promise((resolve) => {
    const user = userPool.getCurrentUser()
    if (!user) {
      resolve(null)
      return
    }
    user.getSession((err: Error | null, session: import("amazon-cognito-identity-js").CognitoUserSession | null) => {
      if (err || !session || !session.isValid()) {
        resolve(null)
        return
      }
      resolve(session.getIdToken().getJwtToken())
    })
  })
}

/** Resolves the current signed-in CognitoUser with a valid session attached, or null. */
function currentSessionUser(): Promise<CognitoUser | null> {
  return new Promise((resolve) => {
    const user = userPool.getCurrentUser()
    if (!user) {
      resolve(null)
      return
    }
    user.getSession((err: Error | null, session: import("amazon-cognito-identity-js").CognitoUserSession | null) => {
      resolve(err || !session || !session.isValid() ? null : user)
    })
  })
}

export async function getUsername(): Promise<string | null> {
  const user = await currentSessionUser()
  if (!user) return null

  return new Promise((resolve, reject) => {
    user.getUserAttributes((err, attributes) => {
      if (err) {
        reject(err)
        return
      }
      resolve(attributes?.find((a) => a.getName() === "preferred_username")?.getValue() ?? null)
    })
  })
}

export async function updateUsername(username: string): Promise<void> {
  const user = await currentSessionUser()
  if (!user) throw new Error("Not authenticated")

  return new Promise((resolve, reject) => {
    user.updateAttributes([new CognitoUserAttribute({ Name: "preferred_username", Value: username })], (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export function logout(): void {
  userPool.getCurrentUser()?.signOut()
}
