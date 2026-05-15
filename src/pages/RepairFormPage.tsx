import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatusMessage from "../components/StatusMessage";
import { getDevices } from "../services/devicesService";
import { createRepair } from "../services/repairsService";
import type { Device, RepairPayload } from "../types/ecorepair";

const emptyRepair: RepairPayload = {
  description: "",
  cost: 0,
  repairDate: "",
  repair: false,
  deviceId: 0,
};

export default function RepairFormPage() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<Device[]>([]);
  const [form, setForm] = useState<RepairPayload>(emptyRepair);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDevices() {
      try {
        const deviceData = await getDevices();
        setDevices(deviceData);
        setForm((current) => ({
          ...current,
          deviceId: current.deviceId || deviceData[0]?.id || 0,
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Devices could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    loadDevices();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const repair = await createRepair(form);
      navigate(`/repairs/${repair.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Repair could not be created.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <div className="page-info">
        <p className="eyebrow">Technical service</p>
        <h2>New repair</h2>
        <p>Create a repair record for an existing device.</p>
      </div>

      <StatusMessage loading={loading} error={error} />

      {!loading && (
        <form className="card card-body shadow-sm" onSubmit={handleSubmit}>
          <div className="row g-3">
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

          <label className="form-check mt-3">
            <input className="form-check-input" type="checkbox" checked={form.repair} onChange={(e) => setForm({ ...form, repair: e.target.checked })} />
            <span className="form-check-label">Finished</span>
          </label>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <button className="btn btn-success fw-bold" type="submit" disabled={saving || devices.length === 0}>
              {saving ? "Saving..." : "Create repair"}
            </button>
            <Link className="btn btn-outline-dark fw-bold" to="/repairs">Cancel</Link>
          </div>
        </form>
      )}
    </section>
  );
}
