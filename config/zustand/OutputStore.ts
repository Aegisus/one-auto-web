import { create } from "zustand";

interface OutputState {
  outputs: { [key: string]: { [key: string]: string } }; // Categorized outputs
  addOutput: (outputID: string, output: string) => void;
  clearOutput: (outputID: string) => void;
  clearAllOutputs: () => void;
}

export const useOutputStore = create<OutputState>((set) => ({
  outputs: {},
  addOutput: (outputID, output) => {
    return set((state) => {
      const [baseID, functionName] = outputID.split("|"); // Split the outputID
      const newOutputs = { ...state.outputs };

      // Add to the specific function category
      if (!newOutputs[baseID]) {
        newOutputs[baseID] = {};
      }
      newOutputs[baseID][functionName] =
        (newOutputs[baseID][functionName] || "") +
        (newOutputs[baseID][functionName] ? "\n" : "") +
        output;

      // Add to the "all" category
      if (!newOutputs[baseID]["all"]) {
        newOutputs[baseID]["all"] = "";
      }
      newOutputs[baseID]["all"] +=
        (newOutputs[baseID]["all"] ? "\n" : "") + output;

      return { outputs: newOutputs };
    });
  },
  clearOutput: (outputID) => {
    return set((state) => {
      const [baseID, functionName] = outputID.split("|");
      const newOutputs = { ...state.outputs };

      if (newOutputs[baseID]) {
        if (functionName) {
          // Clear specific function output
          delete newOutputs[baseID][functionName];
        } else {
          // Clear all outputs for the baseID
          delete newOutputs[baseID];
        }
      }

      return { outputs: newOutputs };
    });
  },
  clearAllOutputs: () =>
    set(() => ({
      outputs: {},
    })),
}));
