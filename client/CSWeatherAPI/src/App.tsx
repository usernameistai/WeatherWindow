import { lazy, Suspense, useEffect, useState } from "react";
import type { LocationData, Coordinates } from "./utils/weather";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Nav from "./components/Nav";
import SearchBar from "./components/SearchBar";
import WeatherWindow from "./components/WeatherWindow";

const Favourites = lazy(() => import("./components/Favourites"));
const FiveDayForecast = lazy(() => import("./components/FiveDayForecast"));
const WeatherChart = lazy(() => import("./components/WeatherChart"));
const WeatherMap = lazy(() => import("./components/WeatherMap"));
// import Favourites from "./components/Favourites";
// import FiveDayForecast from "./components/FiveDayForecast";
// import WeatherChart from "./components/WeatherChart";
// import WeatherMap from "./components/WeatherMap";
import { useThemeStore } from "./stores/store";
import { useLocation, useUVIData, useWeather } from "./utils/weatherApi";
import { weatherWindowTheme } from "./utils/weatherUtils";

const WeatherLoader = ({ message = "ANALYSING DATA..." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center p-8 text-[#06b6d4] font-mono text-xs tracking-widest animate-pulse">
    <span>// {message}</span>
  </div>
)

const App = () => {
  const [city, setCity] = useState<string>("london");
  const [coords, setCoords] = useState<Coordinates>({ lat: 51.073, lon: -0.1276 });
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const { data: location, isLoading: isLocationLoading, error: isLocationError } = useLocation(city);
  const { data: weather, isLoading: isWeatherLoading, error: isWeatherError } = useWeather(coords);
  const { data: uvi, isLoading: isUVILoading, error: isUVIError } = useUVIData(coords);
  const theme = useThemeStore(state => state.theme);
  
  {/* Image Pre Load useEffect */}
  useEffect(() => {
    const preloadImages = weatherWindowTheme.flatMap((item) => [
      item.city,
      item.countrySide,
    ]);

    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === preloadImages.length) {
        console.log("All weather window assets preloaded into memory.");
      }
    };

    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Fallback so a failed load doesn't lock the counter
    });
  }, []);
  // useEffect(() => {
  //   if ('scrollRestoration' in window.history) {
  //     window.history.scrollRestoration = 'manual';
  //   }
  //   let loadedCount = 0;
  //   let timeoutId: number | undefined = undefined;

  //   const handleImageLoad = () => {
  //     loadedCount++;
  //     if (loadedCount === preload_images.length) {
  //       // setIsLoading(false);
        
  //       timeoutId = window.setTimeout(() => {
  //         const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  //         window.scrollTo({
  //           top: 0,
  //           behavior: prefersReducedMotion ? 'instant' : 'smooth',
  //         });
  //       }, 0);
  //     }
  //   };

  //   preload_images.forEach((src) => {
  //     const img = new Image();
  //     img.src = src;
  //     img.onload = handleImageLoad;
  //     img.onerror = handleImageLoad;
  //   });

  //   return () => {
  //     if (timeoutId) {
  //       window.clearTimeout(timeoutId ?? 0);
  //     }
  //   };
  // }, []);
  {/* Location useEffect */}
  useEffect(() => {
    const latLon = async () => {
      if (location?.length) {
        const { lat, lon } = location[0];
        setCoords({ lat, lon });
        setSelectedLocation(location[0]);
      }
    }
    latLon();
  }, [location])
  {/* Light/Dark Theme useEffect */}
  useEffect(() => {
    // Synchronise the HTML root element class on boot with Tailwind v4
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  if ( isLocationLoading || isUVILoading || isWeatherLoading ) {
    return (
      <>
        <div role="status" aria-live="polite" aria-label="Loading Crypto Data"
          className="fixed inset-0 w-screen h-screen bg-neutral-900/80 
          flex flex-col items-center justify-center z-200 text-white">
          <p className="animate-pulse font-mono tracking-[0.3em] uppercase mb-4">
            Syncing Weather Data...
          </p>

          <div className="frontier-loader" aria-hidden="true">
            <div className="outer-ring"></div>
            <div className="middle-base">
                <div className="middle-wavefront"></div>
            </div>
            <div className="inner-fill-empty"></div>
          </div>

        </div> 
      </>
    )
  };
  if ( isLocationError || isUVIError || isWeatherError ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-red-500 font-mono">
        <WeatherLoader message="[ERROR]: SECTOR_CONNECTION_FAILED" />
      </div>
    )
  };

  return (
    <>
      <div className="relative min-h-screen bg-slate-100/80 dark:bg-slate-900/80">
        <Nav>
          <SearchBar onSearch={setCity} />
        </Nav>

        <Suspense fallback={<WeatherLoader message="LOADING_FAVOURITES" />}>
          <Favourites 
            onSelectLocation={(location) => {
              setCoords({ lat: location.lat, lon: location.lon });
              setSelectedLocation(location);
            }} 
          />
        </Suspense>

        <section className="space-y-25">
          <Main>
            <WeatherWindow weather={weather ?? null} location={selectedLocation} uvi={uvi ?? null}/>

            <Suspense fallback={<WeatherLoader message={"EXTRAPOLATING_FORECAST_DATA"} />}>
              <FiveDayForecast weather={weather ?? null} />
            </Suspense>
          </Main>

          <Suspense fallback={<WeatherLoader message="WEATHER_DATA_COMPILING"  />} >
            <WeatherChart data={weather?.list ?? null} location={location} />
          </Suspense>

          <WeatherMap className="mt-25"/>
        </section>

        <Footer />
      </div>
    </>
  )
};

export default App;