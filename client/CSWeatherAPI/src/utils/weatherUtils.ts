import type { WeatherData } from "./weather";
import dailyAverages from '../utils/dailyAverages';
import CloudyCity from "@/images/CloudyCity.webp";
import CloudyCountrySide from "@/images/CloudyCountrySide.webp";
import HeavyRainCity from "@/images/HeavyRainCity.webp";
import HeavyRainCountrySide from "@/images/HeavyRainCountrySide.webp";
import LightRainCity from "@/images/LightRainCity.webp";
import LightRainCountrySide from "@/images/LightRainCountrySide.webp";
import MistyFoggyCity from "@/images/MistyFoggyCity.webp";
import MistyFoggyCountrySide from "@/images/MistyFoggyCountrySide.webp";
import PartlyCloudyCity from "@/images/PartlyCloudyCity.webp";
import PartlyCloudyCountrySide from "@/images/PartlyCloudyCountrySide.webp";
import SnowyCity from "@/images/SnowyCity.webp";
import SnowyCountrySide from "@/images/SnowyCountrySide.webp";
import SunnyCity from "@/images/SunnyCity.webp";
import SunnyCountrySide from "@/images/SunnyCountrySide.webp";
import ThunderStormCity from "@/images/ThunderstormCity.webp"
import ThunderStormCountrySide from "@/images/ThunderstormCountrySide.webp";

export const getDayOfWeek = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-GB", { weekday: "short" });
};

export const getDateOfDay = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-GB", { day: "numeric" });
};

export const getTimeOfDay = (timestamp?: number) => {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000)
  const time = date.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return time;
};

export const simpleTime = () => {
  const now: Date = new Date();
  const hours: number = now.getHours();
  const minutes: number = now.getMinutes();
  const time: string = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  return time;
};

interface WeatherProps {
  weather: WeatherData | null;
};

export const dailyAggregates = ({weather}: WeatherProps) => weather ? dailyAverages(weather?.list) : {};

interface WeatherWindowThemeProps {
  label: string;
  ids: number[];
  city: string;
  countrySide: string;
};

export const weatherWindowTheme: WeatherWindowThemeProps[] = [
  {label: "Thunderstorm", ids: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],  city: ThunderStormCity, countrySide: ThunderStormCountrySide},
  {label: "Drizzle", ids: [300, 301, 302, 310, 311, 313, 321],  city: LightRainCity, countrySide: LightRainCountrySide},
  {label: "Light-Rain", ids: [500, 501],  city: LightRainCity, countrySide: LightRainCountrySide},
  {label: "Heavy-Rain", ids: [312, 314, 502, 503, 504, 511, 520, 521, 522, 531],  city: HeavyRainCity, countrySide: HeavyRainCountrySide},
  {label: "Snow", ids: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],  city: SnowyCity, countrySide: SnowyCountrySide},
  {label: "Fog-Haze-Mist", ids: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],  city: MistyFoggyCity, countrySide: MistyFoggyCountrySide},
  {label: "Clear", ids: [800],  city: SunnyCity, countrySide: SunnyCountrySide},
  {label: "Partial-Cloud", ids: [801, 802, 803],  city: PartlyCloudyCity, countrySide: PartlyCloudyCountrySide},
  {label: "Cloud", ids: [804],  city: CloudyCity, countrySide: CloudyCountrySide},
];

export const preload_images = [
  CloudyCity, CloudyCountrySide, HeavyRainCity, HeavyRainCountrySide,
  LightRainCity, LightRainCountrySide, MistyFoggyCity, MistyFoggyCountrySide,
  PartlyCloudyCity, PartlyCloudyCountrySide, SnowyCity, SnowyCountrySide,
  SunnyCity, SunnyCountrySide, ThunderStormCity, ThunderStormCountrySide
];