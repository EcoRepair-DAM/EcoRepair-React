import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import StatusMessage from "../components/StatusMessage";
import {
  deleteDevice,
  getDevice,
  updateDevice,
} from "../services/devicesService";
import type { Device, DevicePayload } from "../types/ecorepair";
import { resolveImgUrl } from "../utils/resolveImgUrl";

export default function DeviceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [device, setDevice] = useState<Device | null>(null);
  const [form, setForm] = useState<DevicePayload | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const canManage = user?.role === "ADMIN" || user?.role === "EDITOR";

  useEffect(() => {
    async function loadDevice() {
      try {
        const loadedDevice = await getDevice(id ?? "");
        setDevice(loadedDevice);
        setForm({
          name: loadedDevice.name,
          type: loadedDevice.type,
          brand: loadedDevice.brand,
          reusable: loadedDevice.reusable,
          purchaseDate: loadedDevice.purchaseDate,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Device could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    loadDevice();
  }, [id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!device || !form) return;

    setSaving(true);
    setError("");

    try {
      const updatedDevice = await updateDevice(device.id, form, imageFile);
      setDevice(updatedDevice);
      setImageFile(null);
      setForm({
        name: updatedDevice.name,
        type: updatedDevice.type,
        brand: updatedDevice.brand,
        reusable: updatedDevice.reusable,
        purchaseDate: updatedDevice.purchaseDate,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Device could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function removeDevice() {
    if (!device || !confirm("Delete this device?")) return;

    try {
      await deleteDevice(device.id);
      navigate("/devices", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Device could not be deleted.");
    }
  }

  return (
    <section className="card card-body shadow-sm">
      <p className="eyebrow">Device profile</p>
      <h2>{canManage ? "Edit device" : "Device details"}</h2>
      <StatusMessage loading={loading} error={error} />

      {device && form && canManage && (
        <form onSubmit={handleSubmit}>
          {resolveImgUrl(device.imageUrl) && (
            <img
              alt={device.name}
              className="device-detail-image img-fluid rounded border mb-3"
              src={resolveImgUrl(device.imageUrl)}
            />
          )}

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
            <div className="col-12">
              <label className="form-label fw-bold">Replace image</label>
              <input
                accept="image/*"
                className="form-control"
                type="file"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <label className="form-check mt-3">
            <input className="form-check-input" type="checkbox" checked={form.reusable} onChange={(e) => setForm({ ...form, reusable: e.target.checked })} />
            <span className="form-check-label">Reusable</span>
          </label>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <button className="btn btn-success fw-bold" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button className="btn btn-outline-danger fw-bold" type="button" onClick={removeDevice}>
              Delete
            </button>
            <Link className="btn btn-outline-dark fw-bold" to="/devices">Back to devices</Link>
          </div>
        </form>
      )}

      {device && !canManage && (
        <>
          {resolveImgUrl(device.imageUrl) && (
            <img
              alt={device.name}
              className="device-detail-image img-fluid rounded border mb-3"
              src={resolveImgUrl(device.imageUrl)}
            />
          )}
          <dl className="detail-list">
            <dt>Name</dt>
            <dd>{device.name}</dd>
            <dt>Brand</dt>
            <dd>{device.brand}</dd>
            <dt>Type</dt>
            <dd>{device.type}</dd>
            <dt>Purchase date</dt>
            <dd>{device.purchaseDate}</dd>
            <dt>Status</dt>
            <dd>
              <span className={`badge ${device.reusable ? "text-bg-success" : "text-bg-secondary"}`}>
                {device.reusable ? "Reusable" : "Single use"}
              </span>
            </dd>
          </dl>
        </>
      )}
      {device && !canManage && (
        <Link className="btn btn-outline-dark fw-bold align-self-start" to="/devices">Back to devices</Link>
      )}
    </section>
  );
}
