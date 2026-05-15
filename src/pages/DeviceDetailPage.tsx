import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StatusMessage from "../components/StatusMessage";
import { getDevice } from "../services/devicesService";
import type { Device } from "../types/ecorepair";

export default function DeviceDetailPage() {
  const { id } = useParams();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDevice() {
      try {
        setDevice(await getDevice(id ?? ""));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Device could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    loadDevice();
  }, [id]);

  return (
    <section className="page-card">
      <p className="eyebrow">Device profile</p>
      <h2>Device details</h2>
      <StatusMessage loading={loading} error={error} />
      {device && (
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
            <span className={`badge ${device.reusable ? "status-ok" : "status-pending"}`}>
              {device.reusable ? "Reusable" : "Single use"}
            </span>
          </dd>
        </dl>
      )}
      <Link className="secondary-button" to="/devices">Back to devices</Link>
    </section>
  );
}