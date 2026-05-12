import { ReviewsList } from "@/features/reviews/components/ReviewsList";
import { SidebarFilters } from "@/features/search/components/SearchFilters";
import { SearchBar } from "../search/components/SearchBar";
import { ReviewsSummaryConnected } from "@/features/reviews/components/ReviewsSummaryConnected";

export function ReviewsPage(): React.ReactElement {
	return (
		<div className="max-w-5xl mx-auto px-4 py-8">
			<div className="flex gap-8 items-start">
				<SidebarFilters />
				<main className="flex-1 flex flex-col gap-6 min-w-0">
					<SearchBar />
					<ReviewsSummaryConnected />
					<ReviewsList />
				</main>
			</div>
		</div>
	);
}
