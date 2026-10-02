import { useRef, useState } from "react";
import type { ChangeEvent, FC } from "react";
import { SearchIcon } from "@animateicons/react/lucide";

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  const [search, setSearch] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value
    setSearch(searchValue);
  };

  return (
    <>
      <form
        className="relative flex items-center max-w-xs group"
        onSubmit={(e) => {
          e.preventDefault();
          if (!search.trim()) return;
          onSearch(search);
          setSearch('');
          inputRef.current?.blur();
        }}
      >
        <label htmlFor="search" className="sr-only">Search City</label>
        <input 
          ref={inputRef}
          type="search"
          enterKeyHint="search"
          inputMode="search"
          autoCapitalize="none"
          spellCheck="false"
          value={search}
          name="search"
          id="search"
          autoComplete="off"
          className="w-full pl-9 pr-4 py-1.5 rounded-xl border font-medium transition-all duration-200
          text-zinc-800 bg-slate-200/50 border-neutral-300/40 placeholder-zinc-500/70
          dark:text-white dark:bg-slate-800/60 dark:border-neutral-800/80 dark:placeholder-zinc-400/50
          focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400
          dark:focus:ring-cyan-400/30 dark:focus:border-cyan-400"
          onChange={handleSearch}
          onFocus={(e) => e.target.select()}
          placeholder="Search your choice of city..."
        />
        <button 
          type="submit" 
          className="absolute left-2.5 p-1 text-zinc-500 dark:text-zinc-400 
          hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-200"
          aria-label="Submit City Search"
        >
          <SearchIcon size={20} className="relative mr-1 top-1"/>
        </button>
      </form>
    </>
  );
};

export default SearchBar;