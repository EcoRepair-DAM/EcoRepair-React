import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <section className="home-layout">
      <div>
        <p className="eyebrow">Circular economy platform</p>
        <h1>Repair, reuse and track devices responsibly.</h1>
        <p className="intro-text">
          EcoRepair manages devices and repairs through a protected API with
          role-based access.
        </p>
        <div className="d-flex flex-wrap gap-2">
          {user ? (
            <Link className="btn btn-success fw-bold" to="/dashboard">Open dashboard</Link>
          ) : (
            <>
              <Link className="btn btn-success fw-bold" to="/login">Login</Link>
              <Link className="btn btn-outline-dark fw-bold" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
