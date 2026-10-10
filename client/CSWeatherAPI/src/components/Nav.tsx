import type { ReactNode } from "react";
import { useCityCountrySideStore, useThemeStore } from "../stores/store";
import { MoonStarIcon, SunIcon } from "@animateicons/react/lucide";
import { BuildingComplex, Trees } from "lucide-react";

const Nav = ({ children }: {children: ReactNode}) => {
  const theme = useThemeStore(state => state.theme);
  const setTheme = useThemeStore(state => state.setTheme);
  const cityCountrySide = useCityCountrySideStore(state => state.cityCountrySide);
  const setCityCountrySide = useCityCountrySideStore(state => state.setCityCountrySide);

  return (
    <>
      <header className="relative text-zinc-800/90 dark:text-neutral-100">
        <nav className="grid grid-cols-[auto_minmax(0,1fr)_auto] sm:grid-cols-[1fr_minmax(0,3fr)_1fr]
          justify-between items-center gap-5 py-2.5 font-semibold
          border-b border-zinc-800/80 dark:border-neutral-200/30"
        >
          <div className="flex flex-row items-center">
            <img 
              src="./weatherwindow-cropped.webp" 
              alt="Weather Window Icon"
              className="relative left-2 w-11 sm:w-12.5 mr-px"
            />
            <span className="relative sm:mr-px text-base hidden sm:flex left-0 scale-y-125 scale-x-95 font-mono">WeatherWindoW</span>
          </div>
            
          <div className="flex justify-center items-center min-w-0 w-full scale-95 sm:scale-100">
            {children}  
          </div>
          
          <div className="relative right-2 flex flex-row gap-1 justify-end scale-95 sm:scale-100">
            <button
              onClick={() => setCityCountrySide(cityCountrySide === 'country' ? 'city' : 'country')}
              className="flex items-center gap-2.5 bg-slate-200/80 dark:bg-slate-950/80 border border-cyan-500/30 px-3.5 py-1.5 rounded-2xl shadow-[0_0_10px_rgba(6,182,212,0.15)] cursor-pointer"
              aria-label="Countryside or City view"
            >
              <Trees className={`transition-all duration-300 ${cityCountrySide === 'country' ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.7)] scale-110' : 'text-slate-600 opacity-40'}`} />
              <div className="w-px h-3.5 bg-slate-800" />
              <BuildingComplex className={`transition-all duration-300 ${cityCountrySide === 'city' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)] scale-110' : 'text-slate-600 opacity-40'}`} />
            </button>
            
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="flex items-center gap-2.5 bg-slate-200/80 dark:bg-slate-950/80 border border-cyan-500/30 px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.15)] cursor-pointer"
              aria-label="Light or Dark theme"
            >
              <SunIcon className={`transition-all duration-300 ${theme === 'light' ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]' : 'text-slate-600 opacity-40'}`} />
              <div className="w-px h-3.5 bg-slate-800" />
              <MoonStarIcon className={`transition-all duration-300 ${theme === 'dark' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]' : 'text-slate-600 opacity-40'}`} />
            </button>
           
          </div>
        </nav>
      </header>
    </>
  )
};

export default Nav;