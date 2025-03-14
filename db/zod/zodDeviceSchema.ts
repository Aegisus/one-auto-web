import { z } from "zod";

// Define individual device schemas
export const ComportDeviceSchema = z.object({
  type: z.literal("comport"), // Add a literal type for better type narrowing
  com_port: z.string(),
  ID_MODEL: z.string(),
  ID_SERIAL: z.string(),
  ID_FROM_DATABASE: z.string(),
});

export const PyvisaDeviceSchema = z.object({
  type: z.literal("pyvisa"), // Add a literal type for better type narrowing
  IDN: z.string(),
  pyvisa_address: z.string(),
});

// Define a union of individual devices, NOT arrays
export const DeviceSchema = z.union([ComportDeviceSchema, PyvisaDeviceSchema]);

// Define an array of mixed devices
export const DevicesArraySchema = z.array(DeviceSchema);

// Type Inference
export type DeviceType = z.infer<typeof DeviceSchema>; // Single device
export type DevicesArray = z.infer<typeof DevicesArraySchema>; // Array of mixed devices

// Device State Interfaces
export interface DeviceState {
  devices: DevicesArray;
  setDevices: (devices: DevicesArray) => void;
  connectDeviceToSSE: () => () => void;
}

export interface DBDeviceState {
  devices: DevicesArray;
  setDevices: (devices: DevicesArray) => void;
}
