import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import { useAppSelector } from "./hooks/redux";
import BlogsPage from "./pages/BlogsPage";
import DashboardHome from "./pages/DashboardHome";
import EventsPage from "./pages/EventsPage";
import ExperiencesPage from "./pages/ExperiencesPage";
import HireRequestsPage from "./pages/HireRequestsPage";
import LoginPage from "./pages/LoginPage";
import MessagesPage from "./pages/MessagesPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProfilePage from "./pages/ProfilePage";
import ProjectsPage from "./pages/ProjectsPage";
import ServicesPage from "./pages/ServicesPage";
import SettingsPage from "./pages/SettingsPage";
import SkillsPage from "./pages/SkillsPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}

export default function App() {
  const theme = useAppSelector((s) => s.ui.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="experiences" element={<ExperiencesPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="problems" element={<ProblemsPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="hire-requests" element={<HireRequestsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
