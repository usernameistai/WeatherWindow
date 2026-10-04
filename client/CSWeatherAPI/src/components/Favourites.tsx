import { useFavouriteStore } from "../stores/store";
import dailyAverages from '../utils/dailyAverages';
import { useWeather } from "@/utils/weatherApi"; 
import type { LocationData } from "../utils/weather";
import { 
  ChevronsDownIcon, ChevronsUpIcon, DropletsIcon, MouseIcon,
  type MouseIconHandle,
  NavigationIcon, Trash2Icon, WindIcon 
} from "@animateicons/react/lucide";
import { useRef } from "react";

interface FavouritesProps {
  onSelectLocation?: (location: LocationData) => void;
};

const FavoriteItem = ({
  fav,
  onSelectLocation,
  onRemove,
}: {
  fav: LocationData;
  onSelectLocation: (location: LocationData) => void;
  onRemove: (location: LocationData[] | null | undefined) => void;
}) => {
  const { data: weather } = useWeather({ lat: fav.lat, lon: fav.lon });
  const weatherVar = weather?.list?.[0];
  const mainVar = weatherVar?.main; 
  const currentTemp = mainVar?.temp;
  const weathVar = weatherVar?.weather?.[0];
  const weatherDesc = weathVar?.description;
  const dailyAggregates = weather ? dailyAverages(weather?.list) : {};

  return (
    <>
      <div className="group flex items-center justify-between p-3 rounded-md bg-slate-100/80 dark:bg-slate-950/40 hover:bg-white/70 hover:dark:bg-slate-900/60 border border-slate-300/95 dark:border-slate-700/50 transition-all">
        <div
          onClick={() => onSelectLocation(fav) }
          className="flex-1 text-left flex items-center justify-between cursor-pointer pr-2"
        >
          <div aria-label="location" className="flex items-center gap-3 w-full">
            <NavigationIcon className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 group-hover:translate-x-0.5 transition-transform duration-200 shrink-0" />
            <div className="min-w-0 pr-2">
              <div className="text-sm text-zinc-700/80 dark:text-slate-100 tracking-wide truncate">{fav.name}</div>
              <div className="flex flex-row gap-1 text-[11px] text-slate-400 uppercase">
                <span>{fav.state ? `${fav.state}, ` : ""}{fav.country}</span>
                <span className="text-cyan-400">|</span>
                <span className="hidden sm:flex"> {fav.lat.toFixed(2)}, {fav.lon.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div aria-label="temp, feels like, min, max" className="hidden sm:flex flex-row items-center justify-center flex-1">
            <div className="hidden sm:flex text-cyan-400">{mainVar?.temp.toFixed(1)}°C</div>
            <div className="mx-5 sm:mx-10 text-xs text-center px-4 py-2 ">
              <div className="text-slate-400">Feels like {mainVar?.feels_like.toFixed(1)}°</div>
              <div className="flex font-bold gap-2 text-[11px] sm:text-xs">
                <div className="text-sky-600 flex justify-center">
                  <ChevronsDownIcon size={15}/><div className="">{mainVar?.temp_min.toFixed(1)}</div>
                </div>
                <div className="text-rose-600 flex justify-center">
                  <ChevronsUpIcon size={15}/><div className="">{mainVar?.temp_max.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </div>

          <div aria-label="Weather Status Icon" className="flex flex-row items-center text-center mx-auto text-sm rounded-3xl w-full">
            <img 
              src={`https://openweathermap.org/img/wn/${weathVar?.icon}@2x.png`} 
              alt={weatherDesc}
              className="flex items-center w-14 mx-10 my-0 sm:-m-5"
            />
            <p className="hidden sm:flex items-center capitalize text-[11px] text-zinc-700/80 dark:text-slate-200 tracking-wider ml-5">{weatherDesc}</p>
          </div>

          <div aria-label="Ave Humidity & Wind" className="hidden sm:block">
            {Object.keys(dailyAggregates).slice(0, 1).map((date) => {
              const aggregate = dailyAggregates[date];

              return (
                <div key={date} className="hidden sm:flex flex-col items-center my-2
                  gap-1 text-[11px] pt-2 sm:w-full sm:justify-center"
                >
                  <div className="flex items-center gap-1">
                    <DropletsIcon className="text-sky-500" size={13} />
                    <span className="text-zinc-700/80 dark:text-slate-100">{aggregate.averageHumidity.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <WindIcon className="text-emerald-500" size={13} />
                    <span className="text-zinc-700/80 dark:text-slate-100">{aggregate.averageWindSpeed.toFixed(1)}ms<sup>-1</sup></span>
                  </div>
                </div>
              )
            })}
          </div>

          <div aria-label="summary" className="text-right text-xs ml-5">
            {currentTemp !== undefined ? (
              <>
                <div className="text-cyan-400 font-semibold">{Math.round(currentTemp)}°C</div>
                <div className="text-[10px] text-slate-400 capitalize truncate max-w-20 tracking-wide">
                  {weatherDesc}
                </div>
              </>
            ) : (
              <div className="text-slate-500 text-[10px]">SYNC...</div>
            )}
          </div>
        </div>

        <button
          onClick={() => onRemove([fav])}
          className="p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer shrink-0"
        >
          <Trash2Icon className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};

const Favourites = ({ onSelectLocation }: FavouritesProps) => {
  const favourite = useFavouriteStore((state) => state.favourite);
  const removeFavourite = useFavouriteStore((state) => state.removeFavourite);
  const mouseRef = useRef<MouseIconHandle>(null);

  if (favourite.length === 0) {
    return (
      <div className="flex justify-center text-center dark:border dark:border-slate-800 rounded-lg dark:bg-slate-900/50 text-zinc-700/80 dark:text-slate-300/80 text-sm font-mono gap-2 p-5"
        onMouseEnter={() => mouseRef.current?.startAnimation()}
        onMouseLeave={() => mouseRef.current?.stopAnimation()}
      >
        <MouseIcon size={30} 
          className="flex items-center my-auto text-cyan-400 dark:text-cyan-100"
          ref={mouseRef}
        /> 
        <div className="flex my-auto">
          Click the map icon next to the country / state
        </div>
      </div>
    );
  };

  return (
    <>
      <aside className="flex flex-col mx-auto max-w-6xl space-y-2 mt-5 mb-10 p-4 border-slate-300/60 dark:border-slate-800 rounded-lg bg-neutral-100/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="text-xs tracking-[2px] text-zinc-700/80 dark:text-cyan-400 uppercase mb-3 font-mono font-semibold">
          My Favourite Cities / Places ({favourite.length})
        </div>
        <div className="space-y-2">
          {favourite.map((fav) => (
            <FavoriteItem
              key={`${fav.name}-${fav.lat}-${fav.lon}`}
              fav={fav}
              onSelectLocation={onSelectLocation ?? (() => undefined)}
              onRemove={removeFavourite}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default Favourites;