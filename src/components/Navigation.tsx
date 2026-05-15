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
    <nav className="main-nav">
      <NavLink to={dashboardPath}>Dashboard</NavLink>
      <NavLink to="/devices">Devices</NavLink>
      <NavLink to="/repairs">Repairs</NavLink>
      {user.role === "ADMIN" && <NavLink to="/admin">Users</NavLink>}
      {user.role === "EDITOR" && <NavLink to="/editor">Editor</NavLink>}
      <NavLink to="/me">Profile</NavLink>
    </nav>
  );
}
