import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import StatusMessage from "../components/StatusMessage";
import { getDevices } from "../services/devicesService";
import { getRepairs } from "../services/repairsService";
import type { Device, Repair } from "../types/ecorepair";

export default function RepairsPage() {
  const { user } = useAuth();
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canManage = user?.role === "ADMIN" || user?.role === "EDITOR";

  async function loadData() {
    setLoading(true);
    try {
      const [repairData, deviceData] = await Promise.all([
        getRepairs(),
        getDevices(),
      ]);
      setRepairs(repairData);
      setDevices(deviceData);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Repairs could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredRepairs = useMemo(() => {
    return repairs
      .filter((repair) => repair.description.toLowerCase().includes(search.toLowerCase()))
      .filter((repair) => status === "all" || String(repair.repair) === status)
      .sort((a, b) => {
        const result = a.description.localeCompare(b.description);
        return sort === "asc" ? result : -result;
      });
  }, [repairs, search, sort, status]);

  function getDeviceName(deviceId: number) {
    return devices.find((device) => device.id === deviceId)?.name ?? `Device ${deviceId}`;
  }

  return (
    <section>
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 page-info">
        <div>
          <p className="eyebrow">Technical service</p>
          <h2>Repairs</h2>
          <p>Review repair records, costs and completion status.</p>
        </div>
        {canManage && (
          <Link className="btn btn-success fw-bold" to="/repairs/new">
            New repair
          </Link>
        )}
      </div>

      <StatusMessage loading={loading} error={error} />

      <div className="row g-2 mb-3">
        <div className="col-md">
          <input className="form-control" placeholder="Search by description" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="true">Finished</option>
            <option value="false">Pending</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="table-responsive rounded border bg-white shadow-sm">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Description</th>
              <th>Cost</th>
              <th>Repair date</th>
              <th>Device</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRepairs.map((repair) => (
              <tr key={repair.id}>
                <td>{repair.description}</td>
                <td>{repair.cost.toFixed(2)} EUR</td>
                <td>{repair.repairDate}</td>
                <td>{getDeviceName(repair.deviceId)}</td>
                <td><span className={`badge ${repair.repair ? "text-bg-success" : "text-bg-secondary"}`}>{repair.repair ? "Finished" : "Pending"}</span></td>
                <td>
                  <Link className="btn btn-outline-dark btn-sm fw-bold" to={`/repairs/${repair.id}`}>
                    {canManage ? "Edit" : "Details"}
                  </Link>
                </td>
              </tr>
            ))}
            {filteredRepairs.length === 0 && (
              <tr><td colSpan={6}>No repairs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
