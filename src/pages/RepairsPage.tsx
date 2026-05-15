import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/authContext";
import StatusMessage from "../components/StatusMessage";
import { getDevices } from "../services/devicesService";
import {
  createRepair,
  deleteRepair,
  getRepairs,
  updateRepair,
} from "../services/repairsService";
import type { Device, Repair, RepairPayload } from "../types/ecorepair";

const emptyRepair: RepairPayload = {
  description: "",
  cost: 0,
  repairDate: "",
  repair: false,
  deviceId: 0,
};

export default function RepairsPage() {
  const { user } = useAuth();
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [form, setForm] = useState<RepairPayload>(emptyRepair);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canCreate = user?.role === "ADMIN" || user?.role === "EDITOR" || user?.role === "USER";
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
      setForm((current) => ({
        ...current,
        deviceId: current.deviceId || deviceData[0]?.id || 0,
      }));
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (editingId) {
        await updateRepair(editingId, form);
      } else {
        await createRepair(form);
      }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Repair could not be saved.");
    }
  }

  function startEdit(repair: Repair) {
    setEditingId(repair.id);
    setForm({
      description: repair.description,
      cost: repair.cost,
      repairDate: repair.repairDate,
      repair: repair.repair,
      deviceId: repair.deviceId,
    });
  }

  async function removeRepair(id: number) {
    if (!confirm("Delete this repair?")) return;

    try {
      await deleteRepair(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Repair could not be deleted.");
    }
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      ...emptyRepair,
      deviceId: devices[0]?.id || 0,
    });
  }

  function getDeviceName(deviceId: number) {
    return devices.find((device) => device.id === deviceId)?.name ?? `Device ${deviceId}`;
  }

  return (
    <section>
      <div className="page-info">
        <p className="eyebrow">Technical service</p>
        <h2>Repairs</h2>
        <p>Manage repair records, costs and completion status.</p>
      </div>

      <StatusMessage loading={loading} error={error} />

      {canCreate ? (
        <form className="card card-body shadow-sm mb-4" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit repair" : "New repair request"}</h3>
          <div className="row g-3 mt-1">
            <div className="col-md-6">
              <label className="form-label fw-bold">Description</label>
              <input className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Cost</label>
              <input className="form-control" type="number" min="0" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} required />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Repair date</label>
              <input className="form-control" type="date" value={form.repairDate} onChange={(e) => setForm({ ...form, repairDate: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Device</label>
              <select className="form-select" value={form.deviceId} onChange={(e) => setForm({ ...form, deviceId: Number(e.target.value) })} required>
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>{device.name}</option>
                ))}
              </select>
            </div>
          </div>
          {canManage && (
            <label className="form-check mt-3">
              <input className="form-check-input" type="checkbox" checked={form.repair} onChange={(e) => setForm({ ...form, repair: e.target.checked })} />
              <span className="form-check-label">Finished</span>
            </label>
          )}
          <div className="d-flex flex-wrap gap-2 mt-3">
            <button className="btn btn-success fw-bold" type="submit">Save repair</button>
            <button className="btn btn-outline-dark fw-bold" type="button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      ) : (
        <p className="text-secondary fw-semibold">Your role can view repairs but cannot change them.</p>
      )}

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
                  {canManage ? (
                    <div className="d-flex flex-wrap gap-2">
                      <button className="btn btn-outline-dark btn-sm fw-bold" onClick={() => startEdit(repair)}>Edit</button>
                      <button className="btn btn-outline-danger btn-sm fw-bold" onClick={() => removeRepair(repair.id)}>Delete</button>
                    </div>
                  ) : "Request sent"}
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
