import { useReviews } from "@/features/reviews/hooks/useReviews";
import { ReviewsSummary } from "@/features/reviews/components/ReviewsSummary";

export function ReviewsSummaryConnected(): React.ReactElement {
	const { totalReviews, pagesLoaded, isFetching } = useReviews();
	return <ReviewsSummary totalReviews={totalReviews} pagesLoaded={pagesLoaded} isFetching={isFetching} />;
}
