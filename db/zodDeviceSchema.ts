// import { z } from "zod";

// export const ComportDeviceSchema = z.object({
//   com_port: z.string(),
//   ID_MODEL: z.string(),
//   ID_SERIAL: z.string(),
//   ID_FROM_DATABASE: z.string(),
// });

// export const PyvisaDeviceSchema = z.object({
//   IDN: z.string(),
//   pyvisa_address: z.string(),
// });

// export const ComportDevicesSchema = z.record(ComportDeviceSchema);
// export const PyvisaDevicesSchema = z.record(PyvisaDeviceSchema);

// export type ComportDeviceType = z.infer<typeof ComportDeviceSchema>;
// export type ComportDevicesRecord = Record<string, ComportDeviceType>;

// export type PyvisaDeviceType = z.infer<typeof PyvisaDeviceSchema>;
// export type PyvisaDevicesRecord = Record<string, PyvisaDeviceType>;

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

// export type ComportDeviceType = z.infer<typeof ComportDeviceSchema>;
// export type ComportDevicesArray = ComportDeviceType[];

// export type PyvisaDeviceType = z.infer<typeof PyvisaDeviceSchema>;
// export type PyvisaDevicesArray = PyvisaDeviceType[];

export type DeviceType = z.infer<typeof DeviceSchema>;
// export type DevicesArray = DeviceType[];
export const DevicesArraySchema = z.array(DeviceSchema);
export type DevicesArray = z.infer<typeof DevicesArraySchema>;

// export interface DeviceState {
//   comportDevices: ComportDevicesArray;
//   setComportDevices: (comportDevices: ComportDevicesArray) => void;
//   connectComportToSSE: () => void;
//   pyvisaDevices: PyvisaDevicesArray;
//   setPyvisaDevices: (pyvisaDevices: PyvisaDevicesArray) => void;
//   connectPyvisaToSSE: () => void;
// }

// export interface DBDeviceState {
//     comportDevices: ComportDevicesArray;
//     setComportDevices: (comportDevices: ComportDevicesArray) => void;
//     pyvisaDevices: PyvisaDevicesArray;
//     setPyvisaDevices: (pyvisaDevices: PyvisaDevicesArray) => void;
//   }
// export interface DeviceState {
//   devices: DevicesArray;
//   setDevices: (devices: DevicesArray) => void;
//   connectDeviceToSSE: (deviceType: "comport" | "pyvisa") => void;
// }
export interface DeviceState {
  devices: DevicesArray;
  setDevices: (devices: DevicesArray) => void;
  connectDeviceToSSE: () => () => void;
}

export interface DBDeviceState {
  devices: DevicesArray;
  setDevices: (devices: DevicesArray) => void;
}
