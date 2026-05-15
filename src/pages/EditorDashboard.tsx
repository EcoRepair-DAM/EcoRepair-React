import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StatusMessage from "../components/StatusMessage";
import { getDevices } from "../services/devicesService";
import { getRepairs } from "../services/repairsService";
import type { Device, Repair } from "../types/ecorepair";

export default function EditorDashboard() {
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

  const pendingRepairs = useMemo(
    () => repairs.filter((repair) => !repair.repair),
    [repairs],
  );
  const singleUseDevices = useMemo(
    () => devices.filter((device) => !device.reusable),
    [devices],
  );
  const repairCost = repairs.reduce((total, repair) => total + repair.cost, 0);

  return (
    <section>
      <div className="page-info">
        <p className="eyebrow">Editor dashboard</p>
        <h2>Repair operations</h2>
        <p>Prioritize pending repairs and keep device records accurate.</p>
      </div>

      <StatusMessage loading={loading} error={error} />

      {!loading && !error && (
        <>
          <div className="summary-grid">
            <Summary label="Pending repairs" value={pendingRepairs.length} />
            <Summary label="Finished repairs" value={repairs.length - pendingRepairs.length} />
            <Summary label="Single use devices" value={singleUseDevices.length} />
            <Summary label="Repair cost EUR" value={Math.round(repairCost)} />
          </div>

          <div className="dashboard-visual editor-dashboard-visual">
            <div>
              <p className="eyebrow">Editor tools</p>
              <h3>Manage repair status and inventory quality</h3>
              <p className="muted-text">Editors can create and edit devices, update repairs and close pending work.</p>
            </div>
            <Link className="primary-button" to="/repairs">Manage repairs</Link>
            <Link className="secondary-button" to="/devices">Manage devices</Link>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Pending repair</th>
                  <th>Device ID</th>
                  <th>Date</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {pendingRepairs.slice(0, 6).map((repair) => (
                  <tr key={repair.id}>
                    <td>{repair.description}</td>
                    <td>{repair.deviceId}</td>
                    <td>{repair.repairDate}</td>
                    <td>{repair.cost.toFixed(2)} EUR</td>
                  </tr>
                ))}
                {pendingRepairs.length === 0 && (
                  <tr><td colSpan={4}>No pending repairs.</td></tr>
                )}
              </tbody>
            </table>
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
