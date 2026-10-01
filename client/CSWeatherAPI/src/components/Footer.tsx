import { useCityCountrySideStore, useThemeStore } from "@/stores/store";
import { MoonStarIcon, SunIcon } from "@animateicons/react/lucide";
import { BuildingComplex, Trees } from "lucide-react";

const Footer = () => {
    const theme = useThemeStore(state => state.theme);
    const setTheme = useThemeStore(state => state.setTheme);
    const cityCountrySide = useCityCountrySideStore(state => state.cityCountrySide);
    const setCityCountrySide = useCityCountrySideStore(state => state.setCityCountrySide);
  return (
    <>
      <footer className="relative flex mt-10">
        <div className="flex w-full text-center my-auto px-4 py-2
         text-zinc-800/90 font-semibold dark:text-neutral-100 border-t
          border-zinc-800/80 dark:border-neutral-200/30"
        >
          <div className="flex flex-1 items-center justify-start">
            <img 
              src="./weatherwindow-cropped.webp" 
              alt="Weather Window Icon"
              className="relative w-12.5"
            />
          </div>
          <div className="flex flex-1 text-center items-center justify-center gap-2 sm:gap-10">
            <button
              onClick={() => setCityCountrySide(cityCountrySide === 'country' ? 'city' : 'country')}
              className="flex items-center gap-2.5 bg-slate-200/80 dark:bg-slate-950/80 border border-cyan-500/30 px-3.5 py-1.5 rounded-2xl shadow-[0_0_10px_rgba(6,182,212,0.15)] cursor-pointer"
              aria-label="Countryside or City view"
            >
              <Trees className={`transition-[color,transform,filter,opacity] duration-300 ${cityCountrySide === 'country' ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.7)] scale-110' : 'text-slate-600 opacity-40'}`} />
              <div className="w-px h-3.5 bg-slate-800" />
              <BuildingComplex className={`transition-[color,transform,filter,opacity] duration-300 ${cityCountrySide === 'city' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)] scale-110' : 'text-slate-600 opacity-40'}`} />
            </button>

            <div className="flex shrink-0 text-center items-center my-auto gap-1">
              <span className="hidden sm:flex">Made by me </span> 💛
            </div>
            
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="flex items-center gap-2.5 bg-slate-200/80 dark:bg-slate-950/80 border border-cyan-500/30 px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.15)] cursor-pointer"
              aria-label="Light or Dark theme"
            >
              <SunIcon className={`transition-[color,transform,filter,opacity] duration-300 ${theme === 'light' ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]' : 'text-slate-600 opacity-40'}`} />
              <div className="w-px h-3.5 bg-slate-800" />
              <MoonStarIcon className={`transition-[color,transform,filter,opacity] duration-300 ${theme === 'dark' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]' : 'text-slate-600 opacity-40'}`} />
            </button>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <img 
              src="./weatherwindow-cropped.webp" 
              alt="Weather Window Icon"
              className="relative w-12.5"
            />
          </div>
          
        </div>
      </footer>
    </>
  );
};

export default Footer;