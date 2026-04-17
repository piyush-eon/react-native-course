import { create } from "zustand";

export type PropertyType = "apartment" | "house" | "villa" | "studio" | null;

interface FilterState {
  search: string;
  type: PropertyType;
  bedrooms: number | null;
  minPrice: number | null;
  maxPrice: number | null;

  setSearch: (value: string) => void;
  setType: (value: PropertyType) => void;
  setBedrooms: (value: number | null) => void;
  setMinPrice: (value: number | null) => void;
  setMaxPrice: (value: number | null) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: "",
  type: null,
  bedrooms: null,
  minPrice: null,
  maxPrice: null,

  setSearch: (value) => set({ search: value }),
  setType: (value) => set({ type: value }),
  setBedrooms: (value) => set({ bedrooms: value }),
  setMinPrice: (value) => set({ minPrice: value }),
  setMaxPrice: (value) => set({ maxPrice: value }),
  resetFilters: () =>
    set({
      search: "",
      type: null,
      bedrooms: null,
      minPrice: null,
      maxPrice: null,
    }),
}));
