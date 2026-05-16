import { apiRequest } from "./apiClient";
import type { Repair, RepairPayload } from "../types/ecorepair";

export function getRepairs() {
  return apiRequest<Repair[]>("/repairs");
}

export function getRepair(id: string | number) {
  return apiRequest<Repair>(`/repairs/${id}`);
}

export function createRepair(payload: RepairPayload) {
  return apiRequest<Repair>("/repairs", {
    method: "POST",
    body: payload,
  });
}

export function updateRepair(id: number, payload: RepairPayload) {
  return apiRequest<Repair>(`/repairs/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteRepair(id: number) {
  return apiRequest<void>(`/repairs/${id}`, {
    method: "DELETE",
  });
}
