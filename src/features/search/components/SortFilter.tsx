import { Radio } from "@/components/Radio";
import { useSearchFilters } from "@/features/search/hooks/useSearchFilters";

export function SortFilter(): React.ReactElement {
	const { urlSort, handleSortChange } = useSearchFilters();

	return (
		<fieldset className="flex flex-col gap-2 text-sm font-medium text-text">
			<legend className="mb-2">Sort</legend>
			<Radio
				name="sort"
				value="desc"
				checked={urlSort === "desc"}
				onChange={() => handleSortChange("desc")}
				ariaLabel="Newest first"
			>
				Newest first
			</Radio>
			<Radio
				name="sort"
				value="asc"
				checked={urlSort === "asc"}
				onChange={() => handleSortChange("asc")}
				ariaLabel="Oldest first"
			>
				Oldest first
			</Radio>
		</fieldset>
	);
}
