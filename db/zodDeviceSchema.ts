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

export const ComportDevicesSchema = z.record(ComportDeviceSchema);
export const PyvisaDevicesSchema = z.record(PyvisaDeviceSchema);
