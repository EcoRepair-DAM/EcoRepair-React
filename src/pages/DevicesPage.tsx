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
        <form className="management-form stacked-form" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit device" : "New device"}</h3>
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <label>Type</label>
          <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required />
          <label>Brand</label>
          <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
          <label>Purchase date</label>
          <input type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} required />
          <label className="checkbox-row">
            <input type="checkbox" checked={form.reusable} onChange={(e) => setForm({ ...form, reusable: e.target.checked })} />
            Reusable
          </label>
          <div className="button-row">
            <button className="primary-button" type="submit">Save device</button>
            <button className="secondary-button" type="button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      ) : (
        <p className="status-text">Your role can view devices but cannot change them.</p>
      )}

      <div className="toolbar">
        <input placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="true">Reusable</option>
          <option value="false">Single use</option>
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
                <td><span className={`badge ${device.reusable ? "status-ok" : "status-pending"}`}>{device.reusable ? "Reusable" : "Single use"}</span></td>
                <td>
                  <div className="button-row">
                    <Link className="secondary-button" to={`/devices/${device.id}`}>Details</Link>
                    {canWrite && <button className="secondary-button" onClick={() => startEdit(device)}>Edit</button>}
                    {canWrite && <button className="danger-button" onClick={() => removeDevice(device.id)}>Delete</button>}
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