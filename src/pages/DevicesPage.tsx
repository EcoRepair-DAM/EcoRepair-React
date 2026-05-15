import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import StatusMessage from "../components/StatusMessage";
import { getDevices } from "../services/devicesService";
import type { Device } from "../types/ecorepair";
import { resolveImgUrl } from "../utils/resolveImgUrl";

export default function DevicesPage() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canManage = user?.role === "ADMIN" || user?.role === "EDITOR";

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

  return (
    <section>
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 page-info">
        <div>
          <p className="eyebrow">Inventory</p>
          <h2>Devices</h2>
          <p>Review reusable hardware and registered devices.</p>
        </div>
        {canManage && (
          <Link className="btn btn-success fw-bold" to="/devices/new">
            New device
          </Link>
        )}
      </div>

      <StatusMessage loading={loading} error={error} />

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
              <th>Image</th>
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
                <td>
                  {resolveImgUrl(device.imageUrl) ? (
                    <img
                      alt={device.name}
                      className="device-thumb rounded border"
                      src={resolveImgUrl(device.imageUrl)}
                    />
                  ) : (
                    <span className="text-secondary">No image</span>
                  )}
                </td>
                <td>{device.name}</td>
                <td>{device.brand}</td>
                <td>{device.type}</td>
                <td>{device.purchaseDate}</td>
                <td><span className={`badge ${device.reusable ? "text-bg-success" : "text-bg-secondary"}`}>{device.reusable ? "Reusable" : "Single use"}</span></td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <Link className="btn btn-outline-dark btn-sm fw-bold" to={`/devices/${device.id}`}>
                      {canManage ? "Edit" : "Details"}
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {filteredDevices.length === 0 && (
              <tr><td colSpan={7}>No devices found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
