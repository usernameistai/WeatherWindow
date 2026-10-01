import type { WeatherData } from "@/utils/weather";

const WeatherWarning = ({ weather }: { weather: WeatherData | null }) => {
  const list = weather?.list;
  
  if (!Array.isArray(list)) return null;
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now() / 1000;

  const severeWeather = (id?: number) => {
    if (!id) return false;
    return (
      (id >= 200 && id < 300) ||
      id === 511 ||
      [502, 503, 504, 522].includes(id) ||
      id === 601 ||
      id === 602 ||
      id === 762 ||
      id === 771 ||
      id === 781
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
      <section aria-label="Severe Weather Warning" className="w-full max-w-xl mx-auto px-4 py-2 my-3">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r
        from-yellow-950/90 via-yellow-900/70 to-yellow-950/90 border-t-6 border-l-6 border-yellow-500/60 
        shadow-[0_0_20px_rgba(239,68,68,0.25)] backdrop-blur-xl px-5 py-3 flex 
        items-center justify-between text-yellow-100">
          
          {/* Pulsing warning accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-500 animate-pulse" />
          <div className="absolute left-0 top-0 bottom-0 w-full h-1.5 bg-yellow-500 animate-pulse" />

          <div className="flex items-center space-x-3 pl-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
            <div>
              <p className="text-xs uppercase tracking-widest text-yellow-400 font-bold">Priority Weather Advisory</p>
              <p className="text-sm sm:text-base font-semibold tracking-wide">
                ⚠️ Run for your lives!! <span className="capitalize text-white underline decoration-yellow-500 underline-offset-4">{desc}</span> incoming
              </p>
            </div>
          </div>

          <div className="text-right pl-4">
            <span className="text-xs uppercase tracking-wider text-yellow-300/80 block">T-Minus</span>
            <span className="font-mono text-base sm:text-lg font-bold text-white tracking-tight">
              {timeStr}
            </span>
          </div>

        </div>
      </section>
    </>
  );
};

export default WeatherWarning;