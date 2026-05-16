import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export default function Navigation() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const dashboardPath =
    user.role === "ADMIN"
      ? "/dashboard/admin"
      : user.role === "EDITOR"
        ? "/dashboard/editor"
        : "/dashboard/user";

  return (
    <nav className="main-nav shadow-sm">
      <div className="container d-flex flex-wrap justify-content-center gap-2 py-2">
        <NavLink className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`} to={dashboardPath}>Dashboard</NavLink>
        <NavLink className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`} to="/devices">Devices</NavLink>
        <NavLink className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`} to="/repairs">Repairs</NavLink>
        {user.role === "ADMIN" && <NavLink className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`} to="/admin">Users</NavLink>}
        {user.role === "EDITOR" && <NavLink className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`} to="/editor">Editor</NavLink>}
        <NavLink className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`} to="/me">Profile</NavLink>
      </div>
    </nav>
  );
}
