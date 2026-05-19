import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AppShell } from "./components/AppShell.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { AuditLogsPage } from "./pages/AuditLogsPage.jsx";
import { DegreesPage } from "./pages/DegreesPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { UniversitiesPage } from "./pages/UniversitiesPage.jsx";
import { VerificationPage } from "./pages/VerificationPage.jsx";
import { clearSession, loadSession, saveSession } from "./utils/auth.js";
import { useState } from "react";
import { canAccess, defaultRouteForRole, roles } from "./utils/roleAccess.js";

export function App() {
  const navigate = useNavigate();
  const [session, setSession] = useState(loadSession);

  function handleLogin(nextSession) {
    saveSession(nextSession);
    setSession(nextSession);
    navigate("/");
  }

  function handleLogout() {
    clearSession();
    setSession({ token: null, user: null });
    navigate("/login");
  }

  if (!session.token) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppShell user={session.user} onLogout={handleLogout}>
      <Routes>
        <Route
          path="/"
          element={
            canAccess(session.user.role, [roles.SUPER_ADMIN, roles.UNIVERSITY_ADMIN, roles.AUDITOR]) ? (
              <DashboardPage token={session.token} />
            ) : (
              <Navigate to={defaultRouteForRole(session.user.role)} replace />
            )
          }
        />
        <Route
          path="/universities"
          element={
            canAccess(session.user.role, [roles.SUPER_ADMIN]) ? (
              <UniversitiesPage token={session.token} />
            ) : (
              <Navigate to={defaultRouteForRole(session.user.role)} replace />
            )
          }
        />
        <Route
          path="/degrees"
          element={
            canAccess(session.user.role, [
              roles.SUPER_ADMIN,
              roles.UNIVERSITY_ADMIN,
              roles.UNIVERSITY_STAFF,
              roles.STUDENT,
            ]) ? (
              <DegreesPage token={session.token} user={session.user} />
            ) : (
              <Navigate to={defaultRouteForRole(session.user.role)} replace />
            )
          }
        />
        <Route path="/verify" element={<VerificationPage />} />
        <Route
          path="/audit"
          element={
            canAccess(session.user.role, [roles.SUPER_ADMIN, roles.AUDITOR]) ? (
              <AuditLogsPage token={session.token} />
            ) : (
              <Navigate to={defaultRouteForRole(session.user.role)} replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
