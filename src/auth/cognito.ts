import {
  AuthenticationDetails,
  CognitoUser,
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

export function signup(email: string, password: string, inviteCode: string): Promise<void> {
  return new Promise((resolve, reject) => {
    userPool.signUp(
      email,
      password,
      [],
      [],
      (err) => {
        if (err) reject(err)
        else resolve()
      },
      { invite_code: inviteCode },
    )
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

export function logout(): void {
  userPool.getCurrentUser()?.signOut()
}
