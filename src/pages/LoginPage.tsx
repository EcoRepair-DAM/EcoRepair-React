import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import AuthVisual from "../components/AuthVisual";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = (location.state as { from?: { pathname?: string } } | null)?.from
    ?.pathname;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate(from ?? "/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-layout">
      <AuthVisual />
      <div className="card auth-panel shadow-lg">
        <div className="card-body p-4">
        <p className="eyebrow">Secure access</p>
        <h2 className="fw-bold">Login</h2>
        <form onSubmit={handleSubmit} className="vstack gap-3 mt-3">
          <label className="form-label fw-bold mb-0" htmlFor="email">Email</label>
          <input className="form-control" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label className="form-label fw-bold mb-0" htmlFor="password">Password</label>
          <input className="form-control" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {error && <p className="alert alert-danger fw-semibold mb-0">{error}</p>}

          <button className="btn btn-success fw-bold" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-secondary mt-3 mb-0">No account yet? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </section>
  );
}
