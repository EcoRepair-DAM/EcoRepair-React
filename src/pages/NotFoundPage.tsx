import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="page-card">
      <h2>Page not found</h2>
      <p className="muted-text">The page you requested does not exist.</p>
      <Link className="primary-button" to="/dashboard">Go to dashboard</Link>
    </section>
  );
}