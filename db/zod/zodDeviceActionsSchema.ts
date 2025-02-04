import { z } from "zod";

const DynamicObjectArraySchema = z.array(z.object({}).passthrough()).nullable();
export type DynamicObjectArray = NonNullable<
  z.infer<typeof DynamicObjectArraySchema>
>;

const DeviceActionsSchema = z.object({
  id: z.number(),
  uid: z.string(),
  name: z.string(),
  // functions: z.union([z.object({}).passthrough(), z.null()]),
  // commands: z.union([z.object({}).passthrough(), z.null()]),
  // layout: z.union([z.object({}).passthrough(), z.null()]),
  // functions: z.array(z.object({}).passthrough()).nullable(),
  // commands: z.array(z.object({}).passthrough()).nullable(),
  // layout: z.array(z.object({}).passthrough()).nullable(),
  functions: DynamicObjectArraySchema,
  commands: DynamicObjectArraySchema,
  layout: DynamicObjectArraySchema,
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
