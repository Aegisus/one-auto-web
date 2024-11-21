import { z } from "zod";

export const ComportDeviceSchema = z.object({
  com_port: z.string(),
  ID_MODEL: z.string(),
  ID_SERIAL: z.string(),
  ID_FROM_DATABASE: z.string(),
});

export const PyvisaDeviceSchema = z.object({
  IDN: z.string(),
  pyvisa_address: z.string(),
});

const ComportDevicesSchema = z.array(ComportDeviceSchema);
const PyvisaDevicesSchema = z.array(PyvisaDeviceSchema);
export const DeviceSchema = z.union([
  ComportDevicesSchema,
  PyvisaDevicesSchema,
]);
// export const DeviceSchema = z.union([ComportDeviceSchema, PyvisaDeviceSchema]);

export type DeviceType = z.infer<typeof DeviceSchema>;
export const DevicesArraySchema = z.array(DeviceSchema);
export type DevicesArray = z.infer<typeof DevicesArraySchema>;

export interface DeviceState {
  devices: DevicesArray;
  setDevices: (devices: DevicesArray) => void;
  connectDeviceToSSE: () => () => void;
}

export interface DBDeviceState {
  devices: DevicesArray;
  setDevices: (devices: DevicesArray) => void;
}
