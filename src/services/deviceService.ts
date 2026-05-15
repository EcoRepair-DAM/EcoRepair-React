import { apiRequest } from "./apiClient";
import type { Device, DevicePayload } from "../types/ecorepair";

export function getDevices() {
  return apiRequest<Device[]>("/devices");
}

export function getDevice(id: string | number) {
  return apiRequest<Device>(`/devices/${id}`);
}

export function createDevice(payload: DevicePayload) {
  return apiRequest<Device>("/devices", {
    method: "POST",
    body: payload,
  });
}

export function updateDevice(id: number, payload: DevicePayload) {
  return apiRequest<Device>(`/devices/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteDevice(id: number) {
  return apiRequest<void>(`/devices/${id}`, {
    method: "DELETE",
  });
}