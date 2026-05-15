import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="container d-flex min-vh-header align-items-center justify-content-between gap-3 py-3">
        <Link to="/" className="brand-logo">ECOREPAIR</Link>
        {user && (
          <div className="d-flex flex-wrap align-items-center gap-2 text-white-50">
            <span>{user.email} ({user.role})</span>
            <button className="btn btn-outline-light btn-sm" onClick={logout}>Log out</button>
          </div>
        )}
      </div>
    </header>
  );
}
