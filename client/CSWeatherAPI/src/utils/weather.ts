export interface CityData {
  country: string;
  id: number;
  name: string;
  population: number;
  sunrise: number;
  sunset: number;
  timezone: number;
};

export interface Coordinates {
  lat: number;
  lon: number;
};

export interface LocationData {
  country: string;
  lat: number;
  lon: number;
  name: string;
  state: string;
};

export interface WeatherData {
  city: CityData;
  list: WeatherDataItem[];
};

export interface WeatherDataItem {
  dt: number;
  dt_txt: string;
  main: WeatherMainData;
  weather: WeatherWeatherData[];
  clouds: {
    all: number;
  };
  wind: WeatherWindData;
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
};

export interface WeatherMainData {
  feels_like: number;
  humidity: number;
  pressure: number;
  sea_level: number;
  temp: number;
  temp_max: number;
  temp_min: number;
};

export interface WeatherProps {
  weather: WeatherData | null;
};

export interface WeatherWeatherData {
  description: string;
  icon: string;
  id: number;
  main: string;
};

export interface WeatherWindData {
  deg: number;
  gust: number;
  speed: number;
};

export interface UVWeatherProps {
  ok: boolean;
  latitude: number;
  longitude: number;
  timezone: {
    id: string;
    name: string;
  };
  now: {
    date: string;
    time: string;
    uvi: number;
  };
  today: {
    date: string;
    max: {
      time: string;
      uv_index: number;
    };
  };
  tomorrow: {
    date: string;
    max: {
      time: string;
      uv_index: number;
    };
  };
};