import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./auth/AuthContext"
import { RequireAuth } from "./auth/RequireAuth"
import { LoginPage } from "./pages/LoginPage"
import { NewEntryPage } from "./pages/NewEntryPage"
import { SignupPage } from "./pages/SignupPage"
import { WorkoutDetailPage } from "./pages/WorkoutDetailPage"
import { WorkoutListPage } from "./pages/WorkoutListPage"

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/workouts"
            element={
              <RequireAuth>
                <WorkoutListPage />
              </RequireAuth>
            }
          />
          <Route
            path="/workouts/:id"
            element={
              <RequireAuth>
                <WorkoutDetailPage />
              </RequireAuth>
            }
          />
          <Route
            path="/workouts/:id/log"
            element={
              <RequireAuth>
                <NewEntryPage />
              </RequireAuth>
            }
          />
          <Route path="/" element={<Navigate to="/workouts" replace />} />
          <Route path="*" element={<Navigate to="/workouts" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
