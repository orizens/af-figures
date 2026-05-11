import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import type { ReviewGroup } from "@/features/reviews/utils/dateGroups";
import { groupReviewsByDate } from "@/features/reviews/utils/dateGroups";
import { getReviews } from "@/shared/api/reviews";
import type { ReviewsResponse } from "@/shared/types/reviews";

const PAGE_SIZE = 25;

export interface UseReviewsResult {
	groups: ReviewGroup[];
	totalReviews: number;
	pagesLoaded: number;
	isFetching: boolean;
	isFetchingNextPage: boolean;
	isError: boolean;
	error: Error | null;
	hasNextPage: boolean;
	fetchNextPage: () => void;
}

export function useReviews(): UseReviewsResult {
	const { q, rating, page: urlPage } = useSearch({ from: "/" });

	const query = useInfiniteQuery<ReviewsResponse, Error>({
		queryKey: ["reviews", { q, rating }],
		queryFn: async ({ pageParam, signal }) => {
			const currentPage = pageParam as number;

			// Page restoration: on the initial fetch (pageParam=1), if the URL has
			// page>1, request all accumulated reviews in a single network call.
			const isRestoringPages = currentPage === 1 && urlPage > 1;
			const count = isRestoringPages ? urlPage * PAGE_SIZE : PAGE_SIZE;
			const page = isRestoringPages ? 1 : currentPage;

			return getReviews({ q, rating, page, count }, signal);
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			const totalPages = Math.ceil(lastPage.total / PAGE_SIZE);
			const nextPage = lastPage.this_page + 1;
			return nextPage <= totalPages ? nextPage : undefined;
		},
		placeholderData: (prev) => prev,
	});

	const allReviews = query.data?.pages.flatMap((p) => p.reviews) ?? [];
	const totalReviews = query.data?.pages[0]?.total ?? 0;
	const pagesLoaded = query.data?.pages.at(-1)?.this_page ?? 0;
	const groups = groupReviewsByDate(allReviews);

	return {
		groups,
		totalReviews,
		pagesLoaded,
		isFetching: query.isFetching,
		isFetchingNextPage: query.isFetchingNextPage,
		isError: query.isError,
		error: query.error,
		hasNextPage: query.hasNextPage,
		fetchNextPage: query.fetchNextPage,
	};
}
