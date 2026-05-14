import { useReviews } from "@/features/reviews/hooks/useReviews";
import { ReviewsSummary } from "@/features/reviews/components/ReviewsSummary";
import { useSearch } from "@tanstack/react-router";

export function ReviewsSummaryConnected(): React.ReactElement {
	const { totalReviews, pagesLoaded, isFetching } = useReviews();
	const { q, rating } = useSearch({ from: "/" });
	return (
		<ReviewsSummary
			totalReviews={totalReviews}
			pagesLoaded={pagesLoaded}
			isFetching={isFetching}
			q={q}
			rating={rating}
		/>
	);
}
