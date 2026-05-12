import { DateRangeFilter } from "@/features/search/components/DateRangeFilter";
import { SortFilter } from "@/features/search/components/SortFilter";
import { StarRatingFilter } from "./StarRatingFilter";

export function SidebarFilters(): React.ReactElement {
	return (
		<aside className="flex flex-col gap-6 w-48 shrink-0 sticky top-8 self-start rounded-xl border border-border bg-surface/60 backdrop-blur-md px-4 py-5 shadow-sm">
			<SortFilter />
			<StarRatingFilter />
			<DateRangeFilter />
		</aside>
	);
}
