import { create } from "zustand";
import { useDeviceActionsStore } from "@/stores/useDeviceActionsStore";
import { FunctionDetails } from "@/lib/types"; // Import the shared type

// Extract the type of a single function object from DynamicObjectArray
// type DynamicObject = DynamicObjectArray[number];

export interface DeviceStore {
  // exeFunctions: Record<string, Required<DynamicObject>>;
  exeFunctions: Record<string, FunctionDetails>; // Use FunctionDetails here
  fetchDeviceExeFunctions: () => void;
  deviceUID: string | null; // Add deviceUID to the store
  setDeviceUID: (uid: string) => void; // Add a setter for deviceUID
  // getSCPICommand: (deviceUID: string, commandKey: string) => string | null;
  // executeFunction: (
  //   deviceUID: string,
  //   functionName: string,
  //   deviceType: string,
  //   params?: Record<string, any>
  // ) => Promise<void>;
}

export const useDeviceExecutionStore = create<DeviceStore>((set, get) => {
  const fetchDeviceExeFunctions = () => {
    const { deviceActions } = useDeviceActionsStore.getState();
    const { deviceUID } = get(); // Get the current deviceUID from the store
    const exeFunctions: Record<string, FunctionDetails> = {};

    if (!deviceUID) return; // If no deviceUID is set, do nothing
    // deviceActions.forEach((action) => {
    //   if (action.uid === deviceUID) {
    //     action.functions?.forEach((func) => {
    //       if (typeof func === "object" && typeof func.name === "string") {
    //         exeFunctions[func.name] = func as Required<FunctionDetails>;
    //       }
    //     });
    //   }
    // });

    deviceActions.forEach((action) => {
      if (action.uid === deviceUID) {
        action.functions?.forEach((func) => {
          if (typeof func === "object" && typeof func.name === "string") {
            exeFunctions[func.name] = {
              name: func.name,
              steps: Array.isArray(func.steps) ? func.steps : [], // Ensure steps is an array
              parameters: func.parameters || {}, // Default to an empty object
              description:
                typeof func.description === "string" ? func.description : "", // Ensure description is a string
            };
          }
        });
      }
    });

    set({ exeFunctions });
  };

  return {
    exeFunctions: {},
    deviceUID: null, // Initialize deviceUID as null
    setDeviceUID: (uid) => set({ deviceUID: uid }), // Setter for deviceUID
    fetchDeviceExeFunctions,
  };
});
