import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LocationData } from "@/utils/weather";

interface ThemeStore {
  theme: "light" | "dark";
  setTheme: ( theme: "light" | "dark") => void;
};

export const useThemeStore = create<ThemeStore>((setState) => ({
  theme: (typeof window !== "undefined" && localStorage.getItem("theme") === "dark" ) ? "dark" : "light",
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setState({ theme })
  }
}));

interface CityCountrySideStore {
  cityCountrySide: "city" | "country";
  setCityCountrySide: ( cityCountrySide: "city" | "country" ) => void;
};

export const useCityCountrySideStore = create<CityCountrySideStore>()(
  persist(
    (set) => ({
      cityCountrySide: "country",
      setCityCountrySide: (cityCountrySide) => set({ cityCountrySide }),
    }),
    {
      name: "cityCountrySide",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

interface FavouriteStore {
  favourite: LocationData[];
  addFavourite: (location: LocationData[] | null | undefined) => void;
  removeFavourite: (location: LocationData[] | null | undefined) => void;
  toggleFavourite: (location: LocationData[] | null | undefined) => void;
  reset: () => void;
};

export const useFavouriteStore = create<FavouriteStore>()(
  persist(
    (set) => ({
      favourite: [],
      // favourite: initialState.favourite,
      addFavourite: (location) =>
        set((state) => {
          const loc = location?.[0];
          if (!loc) return state;
          const checkFavourite = state.favourite.some((fav: LocationData) => fav.name === loc.name );
          if (checkFavourite) return state;
          return {
            favourite: [...state.favourite, loc],
          };
        }),
      removeFavourite: (location) =>
        set((state) => {
          const loc = location?.[0];
          if (!loc) return state;
          return { favourite: state.favourite.filter((fav) => fav.name !== loc.name) };
        }),
      toggleFavourite: (location) => 
        set((state) => {
          const loc = location?.[0];
          if (!loc) return state;

          const exists = state.favourite.some((fav) => fav.name === loc.name);
          return { favourite: exists
                    ? state.favourite.filter((fav) => fav.name !== loc.name)
                    : [...state.favourite, loc]
          }
        }),
      reset: () => set({ favourite: [] }),
    }),
    {
      name: "favourites",
      storage: createJSONStorage(() => localStorage),
    },
  )
);