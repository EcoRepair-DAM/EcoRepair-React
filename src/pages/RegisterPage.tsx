import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import AuthVisual from "../components/AuthVisual";
import type { AppRole } from "../types/auth";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AppRole>("USER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({ email, password, role });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Register failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-layout">
      <AuthVisual />
      <div className="card auth-panel shadow-lg">
        <div className="card-body p-4">
        <p className="eyebrow">New account</p>
        <h2 className="fw-bold">Register</h2>
        <form onSubmit={handleSubmit} className="vstack gap-3 mt-3">
          <label className="form-label fw-bold mb-0" htmlFor="register-email">Email</label>
          <input className="form-control" id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label className="form-label fw-bold mb-0" htmlFor="register-password">Password</label>
          <input className="form-control" id="register-password" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />

          <label className="form-label fw-bold mb-0" htmlFor="register-role">Role</label>
          <select className="form-select" id="register-role" value={role} onChange={(e) => setRole(e.target.value as AppRole)}>
            <option value="USER">User</option>
            <option value="EDITOR">Editor</option>
            <option value="ADMIN">Admin</option>
          </select>

          {error && <p className="alert alert-danger fw-semibold mb-0">{error}</p>}

          <button className="btn btn-success fw-bold" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="text-secondary mt-3 mb-0">Already registered? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </section>
  );
}
