import { create } from "zustand";

interface OutputState {
  outputs: { [key: string]: string };
  setOutput: (outputID: string, output: string) => void;
  clearOutput: (outputID: string) => void;
  clearAllOutputs: () => void;
}

export const useOutputStore = create<OutputState>((set) => ({
  outputs: {},
  setOutput: (outputID, output) =>
    set((state) => ({
      outputs: {
        ...state.outputs,
        [outputID]: output,
      },
    })),
  clearOutput: (outputID) =>
    set((state) => {
      const newOutputs = { ...state.outputs };
      delete newOutputs[outputID];
      return { outputs: newOutputs };
    }),
  clearAllOutputs: () =>
    set(() => ({
      outputs: {},
    })),
}));
