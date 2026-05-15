import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export default function Navigation() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <nav className="main-nav">
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/devices">Devices</NavLink>
      <NavLink to="/repairs">Repairs</NavLink>
      {user.role === "ADMIN" && <NavLink to="/admin">Users</NavLink>}
      {user.role === "EDITOR" && <NavLink to="/editor">Editor</NavLink>}
      <NavLink to="/me">Profile</NavLink>
    </nav>
  );
}