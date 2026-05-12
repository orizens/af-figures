import { ReviewsList } from "@/features/reviews/components/ReviewsList";
import { SearchBar, SidebarFilters, useSearchFiltersState } from "@/features/reviews/components/SearchFilters";
import { ReviewsSummaryConnected } from "@/features/reviews/components/ReviewsSummaryConnected";

export function ReviewsPage(): React.ReactElement {
	const {
		localQ,
		urlRating,
		urlStart,
		urlEnd,
		handleSearchChange,
		handleStarToggle,
		handleStartChange,
		handleEndChange,
	} = useSearchFiltersState();

	return (
		<div className="max-w-5xl mx-auto px-4 py-8">
			<div className="flex gap-8 items-start">
				<SidebarFilters
					urlRating={urlRating}
					urlStart={urlStart}
					urlEnd={urlEnd}
					onStarToggle={handleStarToggle}
					onStartChange={handleStartChange}
					onEndChange={handleEndChange}
				/>
				<main className="flex-1 flex flex-col gap-6 min-w-0">
					<SearchBar localQ={localQ} onChange={handleSearchChange} />
					<ReviewsSummaryConnected />
					<ReviewsList />
				</main>
			</div>
		</div>
	);
}
