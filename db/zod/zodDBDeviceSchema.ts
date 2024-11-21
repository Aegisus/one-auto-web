import { z } from "zod";
import {
  ComportDeviceSchema,
  PyvisaDeviceSchema,
} from "@/db/zod/zodDeviceSchema";

const DBDeviceSchema = z.object({
  id: z.number(),
  uid: z.string(),
  name: z.string(),
  description: z.string(),
  // data: ComportDeviceSchema || PyvisaDeviceSchema,
  data: z.union([ComportDeviceSchema, PyvisaDeviceSchema]),
  created_at: z.nullable(z.string()),
  updated_at: z.nullable(z.string()),
});

export const DBDevicesArraySchema = z.array(DBDeviceSchema);
export type DBDeviceType = z.infer<typeof DBDeviceSchema>;
// export type DBDevicesArray = DBDeviceType[];
export type DBDevicesArray = z.infer<typeof DBDevicesArraySchema>;

export interface DBDeviceState {
  dbDevices: DBDevicesArray;
  setDBDevices: (devices: DBDevicesArray) => void;
}
