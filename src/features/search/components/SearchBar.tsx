import { useSearchFilters } from "../hooks/useSearchFilters";


export function SearchBar(): React.ReactElement {
  const { q, handleSearchChange: onChange } = useSearchFilters();
  return (
    <section aria-label="Reviews search" className="sticky top-8 z-10 rounded-xl border border-border bg-surface/60 backdrop-blur-md px-4 py-3 shadow-sm">
      <label className="flex flex-col gap-1 flex-1 text-sm font-medium text-text">
        Search
        <input
          type="search"
          aria-label="Search reviews"
          placeholder="Search reviews…"
          value={q}
          onChange={onChange}
          className="px-4 py-2 border border-border rounded-base text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface" />
      </label>
    </section>
  );
}
