import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorFallback } from "@/components/ErrorFallback";
import { LoadMore } from "@/features/reviews/components/LoadMore";
import { ReviewGroup } from "@/features/reviews/components/ReviewGroup";
import { useReviews } from "@/features/reviews/hooks/useReviews";

function ReviewsListContent(): React.ReactElement {
	const {
		groups,
		isFetching,
		isFetchingNextPage,
		isError,
		error,
		hasNextPage,
	} = useReviews();

	if (isError) {
		throw error;
	}

	const isEmpty = !isFetching && groups.length === 0;

	return (
		<div className="flex flex-col gap-6">
			{isFetching && groups.length > 0 && (
				<div
					role="status"
					aria-label="Updating reviews"
					className="h-0.5 rounded-full overflow-hidden bg-primary/15"
				>
					<div className="h-full w-1/4 bg-primary rounded-full [animation:progress-slide_1.1s_ease-in-out_infinite]" />
				</div>
			)}

			{isFetching && groups.length === 0 && (
				<div
					role="status"
					aria-live="polite"
					aria-label="Loading reviews"
					className="flex justify-center py-12"
				>
					<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
				</div>
			)}

			{isEmpty && (
				<p className="text-center text-text-muted py-12">
					No reviews found.
				</p>
			)}

			{groups.length > 0 && (
				<div
					role="feed"
					aria-busy={isFetching}
					aria-label="Reviews list"
					className="flex flex-col gap-8"
				>
					{groups.map((group) => (
						<ReviewGroup key={`group-${group.label}`} group={group} />
					))}
				</div>
			)}

			<LoadMore
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
			/>
		</div>
	);
}

export function ReviewsList(): React.ReactElement {
	return (
		<ErrorBoundary fallback={({ reset }) => <ErrorFallback reset={reset} />}>
			<ReviewsListContent />
		</ErrorBoundary>
	);
}
