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
        <form className="management-form stacked-form" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit repair" : "New repair request"}</h3>
          <label>Description</label>
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <label>Cost</label>
          <input type="number" min="0" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} required />
          <label>Repair date</label>
          <input type="date" value={form.repairDate} onChange={(e) => setForm({ ...form, repairDate: e.target.value })} required />
          <label>Device</label>
          <select value={form.deviceId} onChange={(e) => setForm({ ...form, deviceId: Number(e.target.value) })} required>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>{device.name}</option>
            ))}
          </select>
          {canManage && (
            <label className="checkbox-row">
              <input type="checkbox" checked={form.repair} onChange={(e) => setForm({ ...form, repair: e.target.checked })} />
              Finished
            </label>
          )}
          <div className="button-row">
            <button className="primary-button" type="submit">Save repair</button>
            <button className="secondary-button" type="button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      ) : (
        <p className="status-text">Your role can view repairs but cannot change them.</p>
      )}

      <div className="toolbar">
        <input placeholder="Search by description" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="true">Finished</option>
          <option value="false">Pending</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
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
                <td><span className={`badge ${repair.repair ? "status-ok" : "status-pending"}`}>{repair.repair ? "Finished" : "Pending"}</span></td>
                <td>
                  {canManage ? (
                    <div className="button-row">
                      <button className="secondary-button" onClick={() => startEdit(repair)}>Edit</button>
                      <button className="danger-button" onClick={() => removeRepair(repair.id)}>Delete</button>
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