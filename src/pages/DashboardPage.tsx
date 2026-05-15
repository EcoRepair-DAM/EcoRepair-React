import { useEffect, useMemo, useState } from "react";
import StatusMessage from "../components/StatusMessage";
import { useAuth } from "../auth/authContext";
import { getDevices } from "../services/devicesService";
import { getRepairs } from "../services/repairsService";
import type { Device, Repair } from "../types/ecorepair";

export default function DashboardPage() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
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

    loadData();
  }, []);

  const rows = useMemo(() => {
    return [
      ...devices.map((device) => ({
        type: "Device",
        name: device.name,
        status: device.reusable ? "Reusable" : "Single use",
        ok: device.reusable,
        date: device.purchaseDate,
      })),
      ...repairs.map((repair) => ({
        type: "Repair",
        name: repair.description,
        status: repair.repair ? "Finished" : "Pending",
        ok: repair.repair,
        date: repair.repairDate,
      })),
    ]
      .filter((row) => row.name.toLowerCase().includes(search.toLowerCase()))
      .filter((row) => !date || row.date === date)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [date, devices, repairs, search]);

  const reusableCount = devices.filter((device) => device.reusable).length;
  const finishedRepairs = repairs.filter((repair) => repair.repair).length;
  const reusablePercent = devices.length ? Math.round((reusableCount / devices.length) * 100) : 0;
  const repairPercent = repairs.length ? Math.round((finishedRepairs / repairs.length) * 100) : 0;

  return (
    <section>
      <div className="page-info">
        <p className="eyebrow">{user?.role} dashboard</p>
        <h2>Operational dashboard</h2>
        <p>Explore devices and repair activity with reactive filters.</p>
      </div>

      <StatusMessage loading={loading} error={error} />

      {!loading && !error && (
        <>
          <div className="summary-grid">
            <Summary label="Total devices" value={devices.length} />
            <Summary label="Reusable devices" value={reusableCount} />
            <Summary label="Finished repairs" value={finishedRepairs} />
            <Summary label="Pending repairs" value={repairs.length - finishedRepairs} />
          </div>

          <div className="dashboard-visual">
            <div>
              <p className="eyebrow">Impact</p>
              <h3>Reuse and repair progress</h3>
              <p className="muted-text">A quick view of how much registered work supports device reuse.</p>
            </div>
            <ProgressCard label="Reusable devices" value={reusablePercent} />
            <ProgressCard label="Finished repairs" value={repairPercent} />
          </div>

          <div className="toolbar">
            <input placeholder="Search devices or repairs" value={search} onChange={(e) => setSearch(e.target.value)} />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={`${row.type}-${row.name}-${row.date}`}>
                    <td>{row.type}</td>
                    <td>{row.name}</td>
                    <td><span className={`badge ${row.ok ? "status-ok" : "status-pending"}`}>{row.status}</span></td>
                    <td>{row.date}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={4}>No data found.</td></tr>
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

function ProgressCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="progress-card">
      <div className="progress-ring" style={{ "--value": `${value}%` } as React.CSSProperties}>
        <span>{value}%</span>
      </div>
      <strong>{label}</strong>
    </div>
  );
}