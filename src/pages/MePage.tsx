import { useAuth } from "../auth/authContext";

export default function MePage() {
  const { user } = useAuth();

  return (
    <section className="page-card">
      <p className="eyebrow">Session</p>
      <h2>Profile</h2>
      <dl className="detail-list">
        <dt>ID</dt>
        <dd>{user?.id}</dd>
        <dt>Email</dt>
        <dd>{user?.email}</dd>
        <dt>Role</dt>
        <dd>{user?.role}</dd>
      </dl>
    </section>
  );
}