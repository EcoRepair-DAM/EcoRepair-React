import { apiRequest } from "./apiClient";
import type { Device, DevicePayload } from "../types/ecorepair";

function toDeviceFormData(payload: DevicePayload, file?: File | null) {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("type", payload.type);
  formData.append("brand", payload.brand);
  formData.append("reusable", String(payload.reusable));
  formData.append("purchaseDate", payload.purchaseDate);

  if (file) {
    formData.append("file", file);
  }

  return formData;
}

export function getDevices() {
  return apiRequest<Device[]>("/v2/devices");
}

export function getDevice(id: string | number) {
  return apiRequest<Device>(`/v2/devices/${id}`);
}

export function createDevice(payload: DevicePayload, file?: File | null) {
  return apiRequest<Device>("/v2/devices", {
    method: "POST",
    body: toDeviceFormData(payload, file),
  });
}

export function updateDevice(id: number, payload: DevicePayload, file?: File | null) {
  return apiRequest<Device>(`/v2/devices/${id}`, {
    method: "PUT",
    body: toDeviceFormData(payload, file),
  });
}

export function deleteDevice(id: number) {
  return apiRequest<void>(`/v2/devices/${id}`, {
    method: "DELETE",
  });
}
