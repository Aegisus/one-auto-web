import { z } from "zod";

export const DeviceSchema = z.object({
  com_port: z.string(),
  ID_MODEL: z.string(),
  ID_SERIAL: z.string(),
  ID_FROM_DATABASE: z.string(),
});

export const DevicesSchema = z.record(DeviceSchema);
