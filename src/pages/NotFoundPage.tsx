import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="card card-body shadow-sm">
      <h2>Page not found</h2>
      <p className="text-secondary">The page you requested does not exist.</p>
      <Link className="btn btn-success fw-bold align-self-start" to="/dashboard">Go to dashboard</Link>
    </section>
  );
}
