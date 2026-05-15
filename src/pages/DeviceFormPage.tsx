import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatusMessage from "../components/StatusMessage";
import { createDevice } from "../services/devicesService";
import type { DevicePayload } from "../types/ecorepair";

const emptyDevice: DevicePayload = {
  name: "",
  type: "",
  brand: "",
  reusable: false,
  purchaseDate: "",
};

export default function DeviceFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<DevicePayload>(emptyDevice);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const device = await createDevice(form);
      navigate(`/devices/${device.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Device could not be created.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <div className="page-info">
        <p className="eyebrow">Inventory</p>
        <h2>New device</h2>
        <p>Create a device record for the inventory.</p>
      </div>

      <StatusMessage error={error} />

      <form className="card card-body shadow-sm" onSubmit={handleSubmit}>
        <div className="row g-3">
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
          <button className="btn btn-success fw-bold" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Create device"}
          </button>
          <Link className="btn btn-outline-dark fw-bold" to="/devices">Cancel</Link>
        </div>
      </form>
    </section>
  );
}
