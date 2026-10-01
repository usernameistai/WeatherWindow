import axios from "axios";
import type { 
  UVWeatherProps, 
  Coordinates, 
  LocationData, 
  WeatherData 
} from "./weather";
import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_URL || `http://localhost:5033`;

const fetchWeather = async <T,>( url: string, signal: AbortSignal ): Promise<T> => {
  const res = await axios.get<T>(url, { signal });
  return res.data;
};

export const useLocation = (city: string ) => {
  return useQuery({
    queryKey: ['location', city],
    queryFn: ({ signal }) => {
      const cityUrl = `${BASE}/weather/${city}`;
      return fetchWeather<LocationData[] | null>(cityUrl, signal);
    },
    staleTime: 1000 * 60 * 60 * 3,
    refetchOnWindowFocus: false,
    retry: (count, error) => {
      if (axios.isAxiosError(error) && (error.response?.status === 429 || error.response?.status === 400)) {
        return false;
      }
      return count < 1;
    },
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
  });
};

export const useWeather = ( coords: Coordinates ) => {
  return useQuery({
    queryKey: ['weather', coords?.lat, coords?.lon],
    queryFn: ({ signal }) => {
      const weatherUrl = `${BASE}/forecast/${coords!.lat}/${coords!.lon}`;
      return fetchWeather<WeatherData | null>(weatherUrl, signal);
    },
    enabled: !!coords?.lat && !!coords?.lon,
    staleTime: 1000 * 60 * 60 * 3,
    refetchOnWindowFocus: false,
    retry: (count, error) => {
      if (axios.isAxiosError(error) && (error.response?.status === 429 || error.response?.status === 400)) {
        return false;
      }
      return count < 1;
    },
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
  });
};

// GeoJSON Stuff UK CityCounty Map
export interface CityCounty {
  county: string;
  name: string;
  coordinates: [number, number];
};

interface OpenWeatherResponse {
  main: {
    temp: number;
    humidity?: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
};

export const useCountyUKWeather = (citiesList: CityCounty[]) => {
  return useQueries({
    queries: citiesList.map((city) => {
      const [ lon, lat ] = city.coordinates;
      return {
        queryKey: ['current-weather', lat, lon],
        queryFn: async ({ signal }) => {
          const url = `${BASE}/weather/current/${lat}/${lon}`;
          const res = await axios.get<OpenWeatherResponse>(url, { signal });

          return {
            county: city.county,
            cityName: city.name,
            coordinates: city.coordinates,
            temp: res.data?.main?.temp != null ? Math.round(res.data.main.temp) : "N/A",
            description: res.data?.weather?.[0]?.description || "",
            icon: res.data?.weather?.[0]?.icon || ""
          };
        },
        staleTime: 1000 * 60 * 60 * 3, // 3-hour cache matching your configurations
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1
      };
    })
  });
};

export const useUVIData = ( coords: Coordinates ) => {
  return useQuery({
    queryKey: ['uvi', coords?.lat, coords?.lon],
    queryFn: ({ signal }) => {
      const url = `https://currentuvindex.com/api/v1/uvi?latitude=${coords!.lat}&longitude=${coords!.lon}`;
      return fetchWeather<UVWeatherProps | null>(url, signal);
    },
    enabled: Boolean(coords?.lat && coords?.lon),
    staleTime: 1000 * 60 * 60 * 6,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData
  });
};