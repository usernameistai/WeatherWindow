import { NavigationIcon } from '@animateicons/react/lucide';
import { useState, type ReactNode } from 'react';

interface HoverProps {
  title: ReactNode;
  children: ReactNode;
}

const Hover = ({ title, children }: HoverProps) => {
  const [isOpen, setIsOpen] = useState(!false);

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className="relative rounded-md w-full flex flex-col"
    >
      <div className="p-3 cursor-pointer select-none text-sm font-medium text-zinc-700/80 flex items-center justify-center sm:justify-between gap-10 transition-colors duration-200">
        <div className="flex items-center gap-2 flex-1 text-zinc-700/80 dark:text-neutral-200/80">{title}</div>
        <span
          className={`relative right-2 text-cyan-400 text-xs font-mono transition-transform duration-200 ${
            isOpen ? '-translate-y-1 rotate-135' : '-rotate-45 translate-y-1.5'
          }`}
        >
          <NavigationIcon />
        </span>
      </div>

      <div
        className={`transition-all duration-200 ease-out ${
          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0' // added overflow-hidden
        }`}
      >
        <div className="flex flex-row sm:flex-col justify-between sm:justify-start z-50 p-3 border-t border-slate-700/50">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Hover;