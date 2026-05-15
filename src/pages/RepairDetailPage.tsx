import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import StatusMessage from "../components/StatusMessage";
import { getDevices } from "../services/devicesService";
import {
  deleteRepair,
  getRepair,
  updateRepair,
} from "../services/repairsService";
import type { Device, Repair, RepairPayload } from "../types/ecorepair";

export default function RepairDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [repair, setRepair] = useState<Repair | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [form, setForm] = useState<RepairPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const canManage = user?.role === "ADMIN" || user?.role === "EDITOR";

  useEffect(() => {
    async function loadData() {
      try {
        const [repairData, deviceData] = await Promise.all([
          getRepair(id ?? ""),
          getDevices(),
        ]);
        setRepair(repairData);
        setDevices(deviceData);
        setForm({
          description: repairData.description,
          cost: repairData.cost,
          repairDate: repairData.repairDate,
          repair: repairData.repair,
          deviceId: repairData.deviceId,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Repair could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!repair || !form) return;

    setSaving(true);
    setError("");

    try {
      const updatedRepair = await updateRepair(repair.id, form);
      setRepair(updatedRepair);
      setForm({
        description: updatedRepair.description,
        cost: updatedRepair.cost,
        repairDate: updatedRepair.repairDate,
        repair: updatedRepair.repair,
        deviceId: updatedRepair.deviceId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Repair could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function removeRepair() {
    if (!repair || !confirm("Delete this repair?")) return;

    try {
      await deleteRepair(repair.id);
      navigate("/repairs", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Repair could not be deleted.");
    }
  }

  function getDeviceName(deviceId: number) {
    return devices.find((device) => device.id === deviceId)?.name ?? `Device ${deviceId}`;
  }

  return (
    <section className="card card-body shadow-sm">
      <p className="eyebrow">Technical service</p>
      <h2>{canManage ? "Edit repair" : "Repair details"}</h2>
      <StatusMessage loading={loading} error={error} />

      {repair && form && canManage && (
        <form onSubmit={handleSubmit}>
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
            <button className="btn btn-success fw-bold" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button className="btn btn-outline-danger fw-bold" type="button" onClick={removeRepair}>
              Delete
            </button>
            <Link className="btn btn-outline-dark fw-bold" to="/repairs">Back to repairs</Link>
          </div>
        </form>
      )}

      {repair && !canManage && (
        <>
          <dl className="detail-list">
            <dt>Description</dt>
            <dd>{repair.description}</dd>
            <dt>Cost</dt>
            <dd>{repair.cost.toFixed(2)} EUR</dd>
            <dt>Repair date</dt>
            <dd>{repair.repairDate}</dd>
            <dt>Device</dt>
            <dd>{getDeviceName(repair.deviceId)}</dd>
            <dt>Status</dt>
            <dd>
              <span className={`badge ${repair.repair ? "text-bg-success" : "text-bg-secondary"}`}>
                {repair.repair ? "Finished" : "Pending"}
              </span>
            </dd>
          </dl>
          <Link className="btn btn-outline-dark fw-bold align-self-start" to="/repairs">Back to repairs</Link>
        </>
      )}
    </section>
  );
}
