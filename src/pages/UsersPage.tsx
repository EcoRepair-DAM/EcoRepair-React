import { useEffect, useState } from "react";
import StatusMessage from "../components/StatusMessage";
import { deleteUser, getUsers, updateUserRole } from "../services/usersService";
import type { AppRole, AuthUser } from "../types/auth";

export default function UsersPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    setLoading(true);
    try {
      // ✅ SOLUCIÓN: Primero esperamos de verdad a que la API responda de forma asíncrona
      const data = await getUsers();
      // ✅ Luego actualizamos el estado con los datos ya limpios
      setUsers(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Users could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function changeRole(id: number, role: AppRole) {
    try {
      await updateUserRole(id, role);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Role could not be updated.");
    }
  }

  async function removeUser(id: number) {
    if (!confirm("Delete this user?")) return;

    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "User could not be deleted.");
    }
  }

  return (
    <section>
      <div className="page-info">
        <p className="eyebrow">Admin</p>
        <h2>Users and roles</h2>
        <p>Manage access levels for the application.</p>
      </div>

      <StatusMessage loading={loading} error={error} />

      <div className="table-responsive rounded border bg-white shadow-sm">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    className="form-select"
                    value={user.role}
                    onChange={(event) => changeRole(user.id, event.target.value as AppRole)}
                  >
                    <option value="USER">USER</option>
                    <option value="EDITOR">EDITOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-outline-danger btn-sm fw-bold" onClick={() => removeUser(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4}>No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
