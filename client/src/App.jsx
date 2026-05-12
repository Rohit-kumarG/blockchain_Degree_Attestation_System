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
        <Route path="/" element={<DashboardPage token={session.token} />} />
        <Route path="/universities" element={<UniversitiesPage token={session.token} />} />
        <Route path="/degrees" element={<DegreesPage token={session.token} />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/audit" element={<AuditLogsPage token={session.token} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
