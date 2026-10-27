import type { WeatherData } from "@/utils/weather";

const WeatherChange = ({ weather }: { weather: WeatherData | null }) => {
  const list = weather?.list;
  
  if (!Array.isArray(list)) return null;
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now() / 1000;

  const severeWeather = (id?: number) => {
    if (!id) return false;
    return (
      (id >= 300 && id <= 322) ||
      id === 500 || id === 501 || id === 520 || id === 521 || 
      id === 600 || id === 611 || id === 612 || id === 613 || 
      id === 615 || id === 616 || id === 620 || id === 621 ||
      id === 700 || id === 711 || id === 721 || id === 731 || 
      id === 741 || id === 751 ||
      (id >= 800 && id <= 804)
    );
  };

  const upcoming = list.find((item) => item.dt > now && severeWeather(item.weather?.[0]?.id));
  if (!upcoming) return null;

  const timeDiffSeconds = upcoming.dt - now;
  const daysInt = Math.floor(timeDiffSeconds / 86400);

  if (daysInt >= 3) return null;

  const hoursInt = Math.floor((timeDiffSeconds % 86400) / 3600);
  const minsInt = Math.floor((timeDiffSeconds % 3600) / 60);
  
  const desc = upcoming.weather?.[0]?.description ?? "Severe Weather";
  const timeStr = daysInt > 0 
                  ? `${daysInt}d ${hoursInt}h ${minsInt}m` 
                  : hoursInt > 0
                    ? `${hoursInt}h ${minsInt}m`
                    : `${Math.max(1, minsInt)}m`;


  return (
    <>
      <section aria-label="Severe Weather Warning" className="w-full max-w-3xl mx-auto px-4 py-2 my-3">
        <div className="relative -top-20 sm:-top-0 overflow-hidden rounded-2xl bg-linear-to-r
        from-white/15 via-black/10 to-white/15 border-t-6 border-l-6 border-white/25 
        shadow-white/35 backdrop-blur-xl px-5 py-3 flex 
        items-center justify-between text-natural-100 backdrop-blur-sm">
          
          {/* Pulsing warning accent line */}
          <div className="absolute rounded-xl left-0 top-0 bottom-0 w-1.5 bg-white/20 animate-pulse" />
          <div className="absolute rounded-xl left-0 top-0 bottom-0 w-full h-1.5 bg-white/20 animate-pulse" />

          <div className="flex items-center space-x-3 pl-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/40 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white/40"></span>
            </span>
            <div>
              <p className="text-[11px] sm:text-xs uppercase tracking-widest text-natural-400 font-bold">Incoming Weather</p>
              <p className="text-xs sm:text-base font-semibold tracking-wide">
                <span className="capitalize text-white underline decoration-natural-500 underline-offset-4">{desc}</span>
              </p>
            </div>
          </div>

          <div className="pl-2 sm:pl-4 text-center justify-center items-center my-auto">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-natural-300/80 block">T-Minus</span>
            <span className="font-mono text-base sm:text-lg font-bold text-white tracking-tight">
              {timeStr} 
            </span>
          </div>

        </div>
      </section>
    </>
  );
};

export default WeatherChange;