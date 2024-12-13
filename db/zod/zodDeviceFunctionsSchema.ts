import { z } from "zod";

const DeviceFunctionsSchema = z.object({
  id: z.number(),
  uid: z.string(),
  name: z.string(),
  functions: z.union([z.array(z.object({}).passthrough()), z.null()]),
  created_at: z.nullable(z.string()),
  updated_at: z.nullable(z.string()),
});

export type DeviceFunctionsType = z.infer<typeof DeviceFunctionsSchema>;
export const DeviceFunctionsArraySchema = z.array(DeviceFunctionsSchema);
export type DeviceFunctionsArray = z.infer<typeof DeviceFunctionsArraySchema>;

export interface DeviceFunctionsState {
  deviceFunctions: DeviceFunctionsArray;
  setDeviceFunctions: (deviceFunctions: DeviceFunctionsArray) => void;
}
