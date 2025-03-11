import { create } from "zustand";

interface MultiDropdownState {
  dropdowns: { [key: string]: Set<string> };
  setDropdownKeys: (dropdownID: string, keys: Set<string>) => void;
}

export const useMultiDropdownStore = create<MultiDropdownState>((set) => ({
  dropdowns: {},
  setDropdownKeys: (dropdownID, keys) =>
    set((state) => ({
      dropdowns: {
        ...state.dropdowns,
        [dropdownID]: keys,
      },
    })),
}));
