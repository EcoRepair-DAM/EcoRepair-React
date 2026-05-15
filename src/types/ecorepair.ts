export interface Device {
  id: number;
  name: string;
  type: string;
  brand: string;
  reusable: boolean;
  purchaseDate: string;
}

export interface DevicePayload {
  name: string;
  type: string;
  brand: string;
  reusable: boolean;
  purchaseDate: string;
}

export interface Repair {
  id: number;
  description: string;
  cost: number;
  repairDate: string;
  repair: boolean;
  deviceId: number;
}

export interface RepairPayload {
  description: string;
  cost: number;
  repairDate: string;
  repair: boolean;
  deviceId: number;
}