import { ReviewsList } from "@/features/reviews/components/ReviewsList";
import { ReviewsSummary } from "@/features/reviews/components/ReviewsSummary";
import { SearchFilters } from "@/features/reviews/components/SearchFilters";
import { useReviews } from "@/features/reviews/hooks/useReviews";

function ReviewsSummaryConnected(): React.ReactElement {
	const { totalReviews, isFetching } = useReviews();
	return <ReviewsSummary totalReviews={totalReviews} isFetching={isFetching} />;
}

export function ReviewsPage(): React.ReactElement {
	return (
		<main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
			<SearchFilters />
			<ReviewsSummaryConnected />
			<ReviewsList />
		</main>
	);
}
