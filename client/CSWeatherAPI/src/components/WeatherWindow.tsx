import type { LocationData, UVWeatherProps, WeatherData } from "../utils/weather";
import { getTimeOfDay, simpleTime, weatherWindowTheme } from "../utils/weatherUtils";
import { useCityCountrySideStore, useFavouriteStore } from "@/stores/store";
import UVAdvice from "./UVAdvice";
import WeatherWarning from "./WeatherWarning";
import WindDirections from "./WindDirections";
import { 
  AudioWaveform, ChevronsDownIcon, ChevronsUpIcon, CloudIcon, CloudSunIcon,
  CompassIcon, DropletIcon, DropletsIcon, MapIcon, MoonStarIcon,
  SunIcon, Sunrise, Sunset, WindIcon, 

} from "@animateicons/react/lucide";
import type {  AudioWaveformIconHandle, CloudSunIconHandle, MoonIconHandle, SunIconHandle, WindIconHandle } from "@animateicons/react/lucide";
import { LuTrees } from "react-icons/lu";
import { useRef } from "react";

const WeatherWindow = ({ weather, location, uvi }: { weather: WeatherData | null, location: LocationData | null, uvi: UVWeatherProps | null }) => {
  const favourite = useFavouriteStore(state => state.favourite);
  const toggleFavourite = useFavouriteStore(state => state.toggleFavourite);
  const isFavourite = location
    ? favourite.some((fav) => fav.name === location.name)
    : false;

  const cityCountrySide = useCityCountrySideStore(state => state.cityCountrySide);
  const weatherId = weather?.list?.[0]?.weather?.[0].id;
  const matchedCityCountryTheme = weatherWindowTheme.find((theme) => (
    weatherId !== undefined && theme.ids.includes(weatherId)
  ));
  // Logic for weather warning
  const weatherAlert = (() => {
    const base = weather?.list?.[0]?.weather?.[0];
    if(!base?.id) return null;
    const { id, description } = base;
    switch (true) {
      case id >= 200 && id < 300: 
        return `Looks like there will be a ${description}`;
      case id >= 300 && id < 400: 
        return `Looks like there will be a bit of ${description}`;
      case id >= 500 && id < 600: 
        return `It's cold and expect some ${description}`;
      case id >= 600 && id < 700: 
        return `Looks like there will be some ${description} today`;
      case id >= 700 && id < 800: 
       return `Looks like there's some ${description} occurring in the atmosphere, hopefully you will survive!!`;
      case id >= 801 && id <= 804: 
        return `Clouds - ${description} overhead, hopefully the sun will shine through!!`;
      default:
        return "Looks like a fine and sunny day!!!";
    }
  })();
  const cloudSunRef = useRef<CloudSunIconHandle>(null);
  const windRef = useRef<WindIconHandle>(null);
  const sunMoonRef = useRef<MoonIconHandle | SunIconHandle | null>(null);
  const audioRef = useRef<AudioWaveformIconHandle>(null);
  const flexRow = "flex flex-row gap-2";
  const details = "mb-4 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none rounded-lg px-4 py-2 sm:px-0 sm:py-0";
  const detailBulk = "relative right-0 sm:right-20 w-full hover:bg-white/25 backdrop-blur-md rounded-lg px-4 py-2 transition-all duration-200";
  const relLeft = "relative -left-2 sm:left-0";
  const relLeft1 = "relative -left-1.5 sm:left-0";
  const detailsSolo = "hover:text-zinc-950/90 hover:font-semibold hover:translate-x-3 transition-colors transition-transform duration-200 ease-in-out";
// 
  return (
    <>
      <div className='flex justify-between items-center mb-2 mx-2 text-zinc-700/80 dark:text-[#06b6d4] text-[10px] sm:text-[12px] font-mono font-semibold tracking-[2px]'>
        <span className='uppercase'>// SECTOR: {weather?.city?.name}-WEATHER-WINDOW</span>
        <span>STATUS: TEMP_UV</span>
      </div>
      <section className="relative flex flex-col pt-10 mb-15 p-5 rounded-[75px] 
        text-zinc-800/80 border-25 sm:border-35 border-neutral-300/70 dark:border-slate-900/70
        bg-clip-border backdrop-blur-md overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.15)]
        min-h-screen max-h-[125vh]"
      >
        <div aria-label="Background Image" className="absolute inset-0 z-0 overflow-hidden">
          {matchedCityCountryTheme && (
            <>
              <img 
                src={matchedCityCountryTheme.city} 
                alt="City Weather" 
                className={`absolute inset-0 w-full sm:w-[140%] h-full object-cover transition-opacity duration-300 ${
                  cityCountrySide === 'city' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              />
              <img 
                src={matchedCityCountryTheme.countrySide} 
                alt="Countryside Weather" 
                className={`absolute inset-0 w-full sm:w-[140%] h-full object-cover transition-opacity duration-300 ${
                  cityCountrySide === 'country' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              />
            </>
          )}
        </div>

        <section className="flex flex-col items-center sm:flex-row sm:items-start justify-between z-50 font-semibold mb-25">
          <section aria-label="Main Variables" className="relative flex-1 text-left ml-4 space-y-35 lg:left-3">
            <div aria-label="Location" 
              className={`${relLeft} flex justify-start mx-auto sm:mx-0 w-[95%] gap-2 mb-1 ${cityCountrySide === "city" ? "backdrop-blur-md rounded-lg px-4 py-2 sm:w-[80%] lg:w-[55%]" : ""}`}
            >
              <div className={`${cityCountrySide === "city" ? "text-white/95" : ""} tracking-wider`}>
                <span className="text-3xl sm:text-4xl">{location?.name}</span>, 
                <span className="text-base sm:text-lg"> {location?.state}</span>
              </div>
              <div className="flex items-center mt-1.5">
                <MapIcon 
                  onClick={() => toggleFavourite(location ? [location] : null)}
                  duration={2} 
                  className={`items-center ${isFavourite ? "text-yellow-300" : ""}`}
                />  
              </div>
              <div className="flex flex-col text-[8px] leading-2 pt-3.5 items-center hover:scale-125 hover:font-bold">
                <span>Lat: {location?.lat.toFixed(3)}</span>
                <span>Lon: {location?.lon.toFixed(3)}</span>
              </div>
            </div>

            <div aria-label="Country" className={`${relLeft} flex gap-5 mb-10 ml-2 sm:ml-0 font-bold tracking-wider ${cityCountrySide === "city" ? "text-white/95 backdrop-blur-md rounded-lg px-4 py-2 w-[40%] sm:w-[35%] lg:w-[25%]" : ""}`}>
              <span>{location?.country}</span><span className="text-zinc-800/80">{simpleTime()}</span>
            </div>
            
            <div aria-label="Temperature" className={`${relLeft} flex flex-row items-center mx-auto sm:mx-0 w-[95%] ${cityCountrySide === "city" ? "text-white/95 backdrop-blur-md rounded-lg px-4 py-2 mx-auto sm:mx-0 w-[95%] sm:w-[80%] lg:w-[55%]" : ""}`}>
              <div className="text-6xl sm:text-7xl">{weather?.list[0].main.temp.toFixed(1)}°</div>
              <div className="mx-5 hover:bg-white/10 hover:backdrop-blur-sm hover:rounded-xl hover:shadow-xl px-4 py-2 ">
                <div className="text-base sm:text-lg text-zinc-800/80">Feels like {weather?.list[0].main.feels_like.toFixed(1)}°</div>
                <div className="flex text-base font-bold gap-2">
                  <div className="text-sky-700 flex justify-center">
                    <ChevronsDownIcon size={20}/><div className="">{weather?.list[0].main.temp_min.toFixed(1)}</div>
                  </div>
                  <div className="text-rose-700 flex justify-center">
                    <ChevronsUpIcon size={20}/><div className="">{weather?.list[0].main.temp_max.toFixed(1)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div aria-label="Weather Status" 
              className={`${relLeft} flex flex-row font-bold rounded-lg mb-4 backdrop-blur-sm  
                px-4 py-2 sm:py-0 mx-auto sm:mx-0 w-[95%] sm:w-[80%] lg:w-[35%] ${
                cityCountrySide === "city" ? "text-white/95 backdrop-blur-md rounded-lg px-4" : ""
              }`}
            >
              <img 
                src={`https://openweathermap.org/img/wn/${weather?.list[0].weather[0].icon}@4x.png`} 
                alt={weather?.list[0].weather[0].description}
                className="-ml-4 w-30 h-25"
              />
              <p className="flex items-center capitalize text-lg sm:text-xl text-white/95 tracking-wider">{weather?.list[0].weather[0].description}</p>
            </div>
          </section>
          
          <section aria-label="Detailed Variables" className="relative w-full sm:left-20 lg:left-0 max-w-xs sm:w-70 mt-4 sm:mt-2 font-semibold tracking-wide text-white/90 md:text-zinc-800/80">
            <details aria-label="Atmospheric Details" className={`group ${relLeft1} ${details}`}>
              <summary className={`${flexRow} group cursor-pointer text-lg font-bold group-open:text-cyan-300
                ${cityCountrySide === "city" ? "group-open:text-white/95" : ""}`}
                onMouseEnter={() => cloudSunRef.current?.startAnimation()}
                onMouseLeave={() => cloudSunRef.current?.stopAnimation()}
              >
                <CloudSunIcon className="text-sky-300" ref={cloudSunRef} />
                Atmospheric
              </summary>
              <div className={`${detailBulk}`}>
                <div className={`${flexRow} ${detailsSolo}`}><CloudIcon className="text-sky-300"/>  Cover: <div>{weather?.list[0].clouds.all}%</div></div>
                <div className={`${flexRow} ${detailsSolo}`}>Probability of Precipitation {weather?.list[0].pop}%</div>
                <div className={`${flexRow} ${detailsSolo}`}><DropletsIcon className="text-sky-300"/>Humidity {weather?.list[0].main.humidity}%</div>
                <div className={`${flexRow} ${detailsSolo}`}>Air Pressure {weather?.list[0].main.pressure} hPa/mbar</div>
                <div>
                  {Object.entries(weather?.list[0].main ?? {})
                    .filter(([key]) => key === "dew_point")
                    .map(([key, value]) => (
                      <div key={key} className={`${flexRow} ${detailsSolo}`}>
                        <DropletIcon className="text-sky-300"/>Dew Point : {value}°C
                      </div>
                    )
                  )}
                </div>
              </div>
            </details>

            <details aria-label="Wind Details" className={`group ${relLeft1} ${details}`}>
              <summary className={`${flexRow} cursor-pointer text-lg font-bold group-open:text-cyan-300
                ${cityCountrySide === "city" ? "group-open:text-white/95" : ""}`}
                onMouseEnter={() => windRef.current?.startAnimation()}
                onMouseLeave={() => windRef.current?.stopAnimation()}
              >
                <WindIcon className="text-green-300" ref={windRef} /> Wind 
                <LuTrees size={24} className="text-green-300"/>
              </summary>
              <div className={`${detailBulk}`}>
                <div className={`${flexRow} ${detailsSolo}`}>
                  <WindIcon className="text-green-300"/>
                  <div>Speed {weather?.list[0].wind.speed}ms<sup>-1</sup></div>
                </div>
                <div className={`${flexRow} ${detailsSolo}`}><span>Max. Gusts {weather?.list[0].wind.gust}ms<sup> -1</sup></span></div>
                <div className={`${flexRow} ${detailsSolo}`}><CompassIcon className="text-green-300"/>Direction <WindDirections degrees={weather?.list[0].wind.deg ?? 25} /> {weather?.list[0].wind.deg}°</div>
              </div>
            </details>

            <details aria-label="Day or Night and Visibility" className={`group ${relLeft1} ${details}`}>
              <summary className={`${flexRow} cursor-pointer text-lg font-bold group-open:text-cyan-300
                ${cityCountrySide === "city" ? "group-open:text-white/95" : ""}`}
                onMouseEnter={() => sunMoonRef.current?.startAnimation()}
                onMouseLeave={() => sunMoonRef.current?.stopAnimation()}
              >
                {weather?.list[0].sys.pod === "d" ? <SunIcon className="text-yellow-300" ref={sunMoonRef}/> : <MoonStarIcon className="text-yellow-200" ref={sunMoonRef} />}
                Light
              </summary>
              <div className={`${detailBulk}`}>
                <div className={`${flexRow} ${detailsSolo}`}>Visibility {(weather?.list[0].visibility ?? 1000) / 1000}km / {((weather?.list[0].visibility ?? 1000) / 1609).toFixed(1)}miles</div>
                <div className={`${flexRow} ${detailsSolo}`}><Sunrise className="text-yellow-300"/>{getTimeOfDay(weather?.city.sunrise)}</div>
                <div className={`${flexRow} ${detailsSolo}`}><Sunset className="text-orange-400"/>{getTimeOfDay(weather?.city.sunset)}</div>
              </div>
            </details>

            <details aria-label="UV Index" className={`group ${relLeft1} ${details}`}>
              <summary className={`${flexRow} cursor-pointer text-lg font-bold group-open:text-cyan-300
                ${cityCountrySide === "city" ? "group-open:text-white/95" : ""}`}
                onMouseEnter={() => audioRef.current?.startAnimation()}
                onMouseLeave={() => audioRef.current?.stopAnimation()}
              >
                <AudioWaveform className="text-yellow-300" ref={audioRef} />
                <span>UV-Index</span><span className="">{uvi?.now?.uvi}</span>
              </summary>
              <div className={`${detailBulk}`}>
                <div className={`${detailsSolo}`}><UVAdvice uvi={uvi?.now?.uvi} /></div>
              </div>
            </details>
          </section>
        </section>

        <section aria-label="Weather Warning" className="z-999 items-center text-center mx-auto w-full">
          {weatherAlert && (
            <div className={
              `my-2 p-3 rounded-xl hover:bg-white/35 backdrop-blur-md text-white/90 text-base sm:text-lg font-semibold tracking-wide `}
            >
              {weatherAlert}
            </div>
          )}
          <WeatherWarning weather={weather} />
        </section>
      </section>
    </>
  );
};

export default WeatherWindow;