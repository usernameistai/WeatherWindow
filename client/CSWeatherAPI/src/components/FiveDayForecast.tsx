import Hover from './Hover';
import dailyAverages from '../utils/dailyAverages';
import type { WeatherProps } from '../utils/weather';
import { getDateOfDay, getDayOfWeek } from '../utils/weatherUtils';
import { ChevronsDownIcon, ChevronsUpIcon, DropletsIcon, WindIcon } from '@animateicons/react/lucide';

const FiveDayForecast = ({ weather }: WeatherProps) => {
  const flexRow = "flex flew-row gap-2";
  const dailyAggregates = weather ? dailyAverages(weather?.list) : {};

  return (
    <>
      <div className='relative top-5 flex justify-between items-center mb-2 mx-2 sm:mx-5 text-[#06b6d4] text-[10px] sm:text-[12px] font-mono tracking-wider max-w-6xl'>
        <span className='uppercase'>// SECURE SECTOR: {weather?.city?.name}-FIVE-DAY-FORECAST</span>
        <span>STATUS: ACTIVE_CYCLE</span>
      </div>
      <section aria-label="5 day forecast" className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-5 max-w-6xl mx-auto">
        {Object.keys(dailyAggregates).slice(0, 5).map((date) => {
          const aggregate = dailyAggregates[date];

          const dayItem = weather?.list.find(item => 
            item.dt_txt.startsWith(date) && (item.dt_txt.includes("12:00:00") || item.dt_txt.includes("15:00:00"))
          ) || weather?.list.find(item => item.dt_txt.startsWith(date));

          if (!dayItem) return null;

          return (
            <div key={date} 
              className="flex flex-row sm:flex-col items-center justify-between sm:justify-start p-4 rounded-2xl 
                bg-slate-200/80 dark:bg-slate-950/80 text-zinc-800/80 dark:text-white
                border border-neutral-200/40 dark:border-neutral-800/80 bg-clip-border backdrop-blur-md 
                transition-all shadow-[0_0_30px_rgba(6,182,212,0.15)]"
            >
              <Hover title={
                <div className="flex gap-1 font-bold my-auto text-sm sm:text-base">
                  <div className="">{getDayOfWeek(dayItem.dt)}</div>
                  <div>
                    <span>{getDateOfDay(dayItem.dt)}</span>
                    <sup className="items-center text-center mx-auto my-auto text-[10px]">
                      {(getDateOfDay(dayItem.dt) === "1") 
                        ? ("st") : (getDateOfDay(dayItem.dt) === "2") 
                                    ? ("nd") : ("th")}
                    </sup>
                  </div>
                </div>
              } >
                <div className="flex flex-col sm:items-center text-left sm:text-center">
                  <div className={`${flexRow} sm:flex-col`}>
                    <div  className="hidden items-center text-center mx-auto sm:flex text-[11px] tracking-wide capitalize mt-0.5 line-clamp-1">
                      {dayItem.weather[0].description}
                    </div>
                    <img 
                      src={`https://openweathermap.org/img/wn/${dayItem.weather[0].icon}@2x.png`} // Upgraded to @2x for crisper display
                      alt={dayItem.weather[0].description}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain -my-1 mx-auto"
                      // loading="lazy"
                    />
                  </div>
                  <div className="flex sm:hidden text-[11px] tracking-wide capitalize line-clamp-1">
                    {dayItem.weather[0].description}
                  </div>
                  
                </div>

                <div className="flex flex-col items-center justify-center text-center my-auto pt-1">
                  <div className="text-2xl sm:text-3xl font-bold tracking-tighter">
                    {aggregate.averageTemp.toFixed(1)}°
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold mt-1 my-auto">
                    <span className="text-sky-500 flex items-center gap-0.5">
                      <ChevronsDownIcon size={14}/>{aggregate.absoluteMin.toFixed(1)}°
                    </span>
                    <span className="text-rose-500 flex items-center gap-0.5">
                      <ChevronsUpIcon size={14}/>{aggregate.absoluteMax.toFixed(1)}°
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center 
                  gap-2 sm:gap-3 sm:mt-4 my-auto text-xs border-none sm:border-t
                    border-neutral-300/30 dark:border-neutral-700/30 pt-2 sm:w-full 
                    sm:justify-center"
                >
                  <div className="flex items-center gap-1">
                    <DropletsIcon className="text-sky-500" size={14} />
                    <span>{aggregate.averageHumidity.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <WindIcon className="text-emerald-500" size={14} />
                    <span>{aggregate.averageWindSpeed.toFixed(1)}ms<sup>-1</sup></span>
                  </div>
                </div>
              </Hover>

            </div>
          );
        })}
      </section>
    </>
  )
}

export default FiveDayForecast;