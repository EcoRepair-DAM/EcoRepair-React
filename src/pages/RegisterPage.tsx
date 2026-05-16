import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import AuthVisual from "../components/AuthVisual";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({ email, password, role: "USER" });
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
