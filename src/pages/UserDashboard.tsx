import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import StatusMessage from "../components/StatusMessage";
import { getDevices } from "../services/devicesService";
import { getRepairs } from "../services/repairsService";
import type { Device, Repair } from "../types/ecorepair";

export default function UserDashboard() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [deviceData, repairData] = await Promise.all([
          getDevices(),
          getRepairs(),
        ]);
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

  const reusableDevices = devices.filter((device) => device.reusable);
  const pendingRepairs = repairs.filter((repair) => !repair.repair);
  const latestDevices = useMemo(
    () => [...devices].sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate)).slice(0, 4),
    [devices],
  );
  const latestRepairs = useMemo(
    () => [...repairs].sort((a, b) => b.repairDate.localeCompare(a.repairDate)).slice(0, 4),
    [repairs],
  );

  return (
    <section>
      <div className="page-info">
        <p className="eyebrow">User dashboard</p>
        <h2>Welcome back</h2>
        <p>{user?.email} can review available devices and create repair requests.</p>
      </div>

      <StatusMessage loading={loading} error={error} />

      {!loading && !error && (
        <>
          <div className="summary-grid">
            <Summary label="Devices available" value={devices.length} />
            <Summary label="Reusable devices" value={reusableDevices.length} />
            <Summary label="Open repairs" value={pendingRepairs.length} />
            <Summary label="Finished repairs" value={repairs.length - pendingRepairs.length} />
          </div>

          <div className="dashboard-visual user-dashboard-visual">
            <div>
              <p className="eyebrow">Your access</p>
              <h3>Browse, inspect and request repairs</h3>
              <p className="muted-text">User accounts can read the inventory and send repair requests for registered devices.</p>
            </div>
            <Link className="primary-button" to="/devices">View devices</Link>
            <Link className="secondary-button" to="/repairs">Request repair</Link>
          </div>

          <div className="dashboard-columns">
            <DashboardList title="Latest devices">
              {latestDevices.map((device) => (
                <li key={device.id}>
                  <span>{device.name}</span>
                  <span className={`badge ${device.reusable ? "status-ok" : "status-pending"}`}>
                    {device.reusable ? "Reusable" : "Single use"}
                  </span>
                </li>
              ))}
            </DashboardList>

            <DashboardList title="Recent repairs">
              {latestRepairs.map((repair) => (
                <li key={repair.id}>
                  <span>{repair.description}</span>
                  <span className={`badge ${repair.repair ? "status-ok" : "status-pending"}`}>
                    {repair.repair ? "Finished" : "Pending"}
                  </span>
                </li>
              ))}
            </DashboardList>
          </div>
        </>
      )}
    </section>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="summary-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DashboardList({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="dashboard-panel">
      <h3>{title}</h3>
      <ul className="dashboard-list">{children}</ul>
    </div>
  );
}
