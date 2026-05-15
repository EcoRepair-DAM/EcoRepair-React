import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import StatusMessage from "../components/StatusMessage";
import {
  createDevice,
  deleteDevice,
  getDevices,
  updateDevice,
} from "../services/devicesService";
import type { Device, DevicePayload } from "../types/ecorepair";

const emptyDevice: DevicePayload = {
  name: "",
  type: "",
  brand: "",
  reusable: false,
  purchaseDate: "",
};

export default function DevicesPage() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [form, setForm] = useState<DevicePayload>(emptyDevice);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canWrite = user?.role === "ADMIN" || user?.role === "EDITOR";

  async function loadDevices() {
    setLoading(true);
    try {
      setDevices(await getDevices());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Devices could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDevices();
  }, []);

  const filteredDevices = useMemo(() => {
    return devices
      .filter((device) => device.name.toLowerCase().includes(search.toLowerCase()))
      .filter((device) => status === "all" || String(device.reusable) === status)
      .sort((a, b) => {
        const result = a.name.localeCompare(b.name);
        return sort === "asc" ? result : -result;
      });
  }, [devices, search, sort, status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (editingId) {
        await updateDevice(editingId, form);
      } else {
        await createDevice(form);
      }
      resetForm();
      await loadDevices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Device could not be saved.");
    }
  }

  function startEdit(device: Device) {
    setEditingId(device.id);
    setForm({
      name: device.name,
      type: device.type,
      brand: device.brand,
      reusable: device.reusable,
      purchaseDate: device.purchaseDate,
    });
  }

  async function removeDevice(id: number) {
    if (!confirm("Delete this device?")) return;

    try {
      await deleteDevice(id);
      await loadDevices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Device could not be deleted.");
    }
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyDevice);
  }

  return (
    <section>
      <div className="page-info">
        <p className="eyebrow">Inventory</p>
        <h2>Devices</h2>
        <p>Manage reusable hardware and registered devices.</p>
      </div>

      <StatusMessage loading={loading} error={error} />

      {canWrite ? (
        <form className="card card-body shadow-sm mb-4" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit device" : "New device"}</h3>
          <div className="row g-3 mt-1">
            <div className="col-md-6">
              <label className="form-label fw-bold">Name</label>
              <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Type</label>
              <input className="form-control" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Brand</label>
              <input className="form-control" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Purchase date</label>
              <input className="form-control" type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} required />
            </div>
          </div>
          <label className="form-check mt-3">
            <input className="form-check-input" type="checkbox" checked={form.reusable} onChange={(e) => setForm({ ...form, reusable: e.target.checked })} />
            <span className="form-check-label">Reusable</span>
          </label>
          <div className="d-flex flex-wrap gap-2 mt-3">
            <button className="btn btn-success fw-bold" type="submit">Save device</button>
            <button className="btn btn-outline-dark fw-bold" type="button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      ) : (
        <p className="text-secondary fw-semibold">Your role can view devices but cannot change them.</p>
      )}

      <div className="row g-2 mb-3">
        <div className="col-md">
          <input className="form-control" placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="col-md-3">
        <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="true">Reusable</option>
          <option value="false">Single use</option>
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
              <th>Name</th>
              <th>Brand</th>
              <th>Type</th>
              <th>Purchase date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map((device) => (
              <tr key={device.id}>
                <td>{device.name}</td>
                <td>{device.brand}</td>
                <td>{device.type}</td>
                <td>{device.purchaseDate}</td>
                <td><span className={`badge ${device.reusable ? "text-bg-success" : "text-bg-secondary"}`}>{device.reusable ? "Reusable" : "Single use"}</span></td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <Link className="btn btn-outline-dark btn-sm fw-bold" to={`/devices/${device.id}`}>Details</Link>
                    {canWrite && <button className="btn btn-outline-dark btn-sm fw-bold" onClick={() => startEdit(device)}>Edit</button>}
                    {canWrite && <button className="btn btn-outline-danger btn-sm fw-bold" onClick={() => removeDevice(device.id)}>Delete</button>}
                  </div>
                </td>
              </tr>
            ))}
            {filteredDevices.length === 0 && (
              <tr><td colSpan={6}>No devices found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
