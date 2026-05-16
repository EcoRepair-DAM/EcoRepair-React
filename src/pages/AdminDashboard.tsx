import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StatusMessage from "../components/StatusMessage";
import { getDevices } from "../services/devicesService";
import { getRepairs } from "../services/repairsService";
import { getUsers } from "../services/usersService";
import type { AuthUser } from "../types/auth";
import type { Device, Repair } from "../types/ecorepair";

export default function AdminDashboard() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [userData, deviceData, repairData] = await Promise.all([
          getUsers(),
          getDevices(),
          getRepairs(),
        ]);
        setUsers(userData);
        setDevices(deviceData);
        setRepairs(repairData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Dashboard could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const roleTotals = useMemo(
    () => ({
      admins: users.filter((user) => user.role === "ADMIN").length,
      editors: users.filter((user) => user.role === "EDITOR").length,
      regularUsers: users.filter((user) => user.role === "USER").length,
    }),
    [users],
  );

  const pendingRepairs = repairs.filter((repair) => !repair.repair).length;

  return (
    <section>
      <div className="page-info">
        <p className="eyebrow">Admin dashboard</p>
        <h2>System overview</h2>
        <p>Control users, roles and the health of the EcoRepair workspace.</p>
      </div>

      <StatusMessage loading={loading} error={error} />

      {!loading && !error && (
        <>
          <div className="summary-grid">
            <Summary label="Total users" value={users.length} />
            <Summary label="Editors" value={roleTotals.editors} />
            <Summary label="Devices" value={devices.length} />
            <Summary label="Pending repairs" value={pendingRepairs} />
          </div>

          <div className="dashboard-visual admin-dashboard-visual">
            <div>
              <p className="eyebrow">Admin controls</p>
              <h3>Manage access and supervise operations</h3>
              <p className="text-secondary">Admins can review users, assign roles and keep the whole system aligned.</p>
            </div>
            <Link className="btn btn-success fw-bold" to="/admin">Manage users</Link>
            <Link className="btn btn-outline-light fw-bold" to="/repairs">Audit repairs</Link>
          </div>

          <div className="dashboard-columns">
            <div className="card shadow-sm">
              <div className="card-body">
              <h3>Roles</h3>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0"><span>Admins</span><strong>{roleTotals.admins}</strong></li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0"><span>Editors</span><strong>{roleTotals.editors}</strong></li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0"><span>Users</span><strong>{roleTotals.regularUsers}</strong></li>
              </ul>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-body">
              <h3>Recent users</h3>
              <ul className="list-group list-group-flush">
                {users.slice(0, 5).map((user) => (
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0" key={user.id}>
                    <span>{user.email}</span>
                    <span className="badge text-bg-success">{user.role}</span>
                  </li>
                ))}
                {users.length === 0 && <li className="list-group-item px-0">No users found.</li>}
              </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="card summary-item shadow-sm">
      <div className="card-body">
        <span className="text-secondary fw-bold">{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
