import { z } from "zod";

const DeviceActionsSchema = z.object({
  id: z.number(),
  uid: z.string(),
  name: z.string(),
  // functions: z.union([z.array(z.object({}).passthrough()), z.null()]),
  // commands: z.union([z.array(z.object({}).passthrough()), z.null()]),
  functions: z.union([z.object({}).passthrough(), z.null()]),
  commands: z.union([z.object({}).passthrough(), z.null()]),
  created_at: z.nullable(z.string()),
  updated_at: z.nullable(z.string()),
});

export type DeviceActionsType = z.infer<typeof DeviceActionsSchema>;
export const DeviceActionsArraySchema = z.array(DeviceActionsSchema);
export type DeviceActionsArray = z.infer<typeof DeviceActionsArraySchema>;

export interface DeviceActionsState {
  deviceActions: DeviceActionsArray;
  setDeviceActions: (deviceActions: DeviceActionsArray) => void;
}
