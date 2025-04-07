import { create } from "zustand";

interface SwitchState {
  isSelected: boolean;
  setIsSelected: (value: boolean) => void;
}

export const useSwitchStateStore = create<SwitchState>((set) => ({
  isSelected: false, // Default value
  setIsSelected: (value) => set({ isSelected: value }),
}));
