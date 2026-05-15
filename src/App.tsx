import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/authContext";
import { useAuth } from "./auth/authContext";
import RequireAuth from "./auth/RequireAuth";
import RequireRole from "./auth/RequireRole";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import AdminDashboard from "./pages/AdminDashboard";
import DeviceDetailPage from "./pages/DeviceDetailPage";
import DevicesPage from "./pages/DevicesPage";
import EditorDashboard from "./pages/EditorDashboard";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MePage from "./pages/MePage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import RepairsPage from "./pages/RepairsPage";
import UserDashboard from "./pages/UserDashboard";
import UsersPage from "./pages/UsersPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Navigation />
        <main className="main-wrapper">
          <div className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <DashboardRedirect />
                  </RequireAuth>
                }
              />
              <Route
                path="/dashboard/user"
                element={
                  <RequireAuth>
                    <RequireRole allowedRoles={["USER"]}>
                      <UserDashboard />
                    </RequireRole>
                  </RequireAuth>
                }
              />
              <Route
                path="/dashboard/editor"
                element={
                  <RequireAuth>
                    <RequireRole allowedRoles={["EDITOR"]}>
                      <EditorDashboard />
                    </RequireRole>
                  </RequireAuth>
                }
              />
              <Route
                path="/dashboard/admin"
                element={
                  <RequireAuth>
                    <RequireRole allowedRoles={["ADMIN"]}>
                      <AdminDashboard />
                    </RequireRole>
                  </RequireAuth>
                }
              />
              <Route
                path="/admin"
                element={
                  <RequireAuth>
                    <RequireRole allowedRoles={["ADMIN"]}>
                      <UsersPage />
                    </RequireRole>
                  </RequireAuth>
                }
              />
              <Route
                path="/editor"
                element={
                  <RequireAuth>
                    <RequireRole allowedRoles={["EDITOR"]}>
                      <EditorDashboard />
                    </RequireRole>
                  </RequireAuth>
                }
              />
              <Route
                path="/devices"
                element={
                  <RequireAuth>
                    <DevicesPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/devices/:id"
                element={
                  <RequireAuth>
                    <DeviceDetailPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/repairs"
                element={
                  <RequireAuth>
                    <RepairsPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/me"
                element={
                  <RequireAuth>
                    <MePage />
                  </RequireAuth>
                }
              />
              <Route path="/old-static" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

function DashboardRedirect() {
  const { user } = useAuth();

  if (user?.role === "ADMIN") {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (user?.role === "EDITOR") {
    return <Navigate to="/dashboard/editor" replace />;
  }

  return <Navigate to="/dashboard/user" replace />;
}
