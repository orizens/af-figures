import { useState, useRef } from "react";
import { useSearchFilters } from "../hooks/useSearchFilters";


export function SearchBar(): React.ReactElement {
  const { q: urlQ, navigateQ } = useSearchFilters();
  const [localValue, setLocalValue] = useState(urlQ ?? '');
  const [prevUrlQ, setPrevUrlQ] = useState(urlQ);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derived state: sync input when URL changes externally (back/forward)
  if (urlQ !== prevUrlQ) {
    setPrevUrlQ(urlQ);
    setLocalValue(urlQ ?? '');
  }

  return (
    <section aria-label="Reviews search" className="sticky top-8 z-10 rounded-xl border border-border bg-surface/60 backdrop-blur-md px-4 py-3 shadow-sm">
      <label className="flex flex-col gap-1 flex-1 text-sm font-medium text-text">
        Search
        <input
          type="search"
          aria-label="Search reviews"
          placeholder="Search reviews…"
          value={localValue}
          onChange={(e) => {
            const value = e.target.value;
            setLocalValue(value);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => { navigateQ(value); }, 400);
          }}
          className="px-4 py-2 border border-border rounded-base text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface" />
      </label>
    </section>
  );
}
