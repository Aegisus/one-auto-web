import { create } from "zustand";

interface SelectedKeysState {
  selectedKeys: Set<string>;
  setSelectedKeys: (keys: Set<string>) => void;
}

export const useSelectedKeysStore = create<SelectedKeysState>((set) => ({
  selectedKeys: new Set([""]),
  setSelectedKeys: (keys) => set({ selectedKeys: keys }),
}));
