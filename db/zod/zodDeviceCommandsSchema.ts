import { z } from "zod";

const DeviceCommandsSchema = z.object({
  id: z.number(),
  uid: z.string(),
  name: z.string(),
  commands: z.union([z.array(z.object({}).passthrough()), z.null()]),
  created_at: z.nullable(z.string()),
  updated_at: z.nullable(z.string()),
});

export type DeviceCommandsType = z.infer<typeof DeviceCommandsSchema>;
export const DeviceCommandsArraySchema = z.array(DeviceCommandsSchema);
export type DeviceCommandsArray = z.infer<typeof DeviceCommandsArraySchema>;

export interface DeviceCommandsState {
  deviceCommands: DeviceCommandsArray;
  setDeviceCommands: (deviceCommands: DeviceCommandsArray) => void;
}
