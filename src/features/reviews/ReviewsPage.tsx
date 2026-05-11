import { ReviewsList } from "@/features/reviews/components/ReviewsList";
import { SearchFilters } from "@/features/reviews/components/SearchFilters";
import { ReviewsSummaryConnected } from "@/features/reviews/components/ReviewsSummaryConnected";

export function ReviewsPage(): React.ReactElement {
	return (
		<main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
			<SearchFilters />
			<ReviewsSummaryConnected />
			<ReviewsList />
		</main>
	);
}
