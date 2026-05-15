import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="nav-container">
        <Link to="/" className="logo">ECOREPAIR</Link>
        {user && (
          <div className="session-info">
            <span>{user.email} ({user.role})</span>
            <button className="secondary-button" onClick={logout}>Log out</button>
          </div>
        )}
      </div>
    </header>
  );
}