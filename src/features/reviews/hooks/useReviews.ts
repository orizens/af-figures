import { useQueries } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import type { ReviewGroup } from "@/features/reviews/utils/dateGroups";
import { groupReviewsByDate } from "@/features/reviews/utils/dateGroups";
import { getReviews } from "@/shared/api/reviews";
import { useDebounce } from "@/shared/hooks/useDebounce";
import type { ReviewsResponse } from "@/shared/types/reviews";

const PAGE_SIZE = 25;
const DEBOUNCE_DELAY = 300;

export interface UseReviewsResult {
	groups: ReviewGroup[];
	totalReviews: number;
	pagesLoaded: number;
	isFetching: boolean;
	isFetchingNextPage: boolean;
	isError: boolean;
	error: Error | null;
	hasNextPage: boolean;
}

export function useReviews(): UseReviewsResult {
	const {
		q,
		rating,
		page: urlPage,
		sort,
		start,
		end,
	} = useSearch({ from: "/" });
	const debouncedQ = useDebounce(q, DEBOUNCE_DELAY);

	const queries = useQueries({
		queries: Array.from({ length: urlPage }, (_, i) => ({
			queryKey: [
				"reviews",
				{ q: debouncedQ, rating, page: i + 1, sort, start, end },
			],
			queryFn: ({ signal }: { signal: AbortSignal }) =>
				getReviews(
					{
						q: debouncedQ,
						rating,
						page: i + 1,
						count: PAGE_SIZE,
						sort,
						start,
						end,
					},
					signal,
				),
			placeholderData: (prev: ReviewsResponse | undefined) => prev,
		})),
	});

	const allReviews = queries.flatMap((result) => result.data?.reviews ?? []);
	const totalReviews = queries[0]?.data?.total ?? 0;
	const pagesLoaded = queries.filter((q) => !!q.data).length;
	const isFetching = queries.some((q) => q.isFetching);
	const isFetchingNextPage = queries.at(-1)?.isFetching ?? false;
	const isError = queries.some((q) => q.isError);
	const error = queries.find((q) => q.isError)?.error ?? null;
	const totalPages = totalReviews > 0 ? Math.ceil(totalReviews / PAGE_SIZE) : 0;
	const hasNextPage = urlPage < totalPages;
	const groups = groupReviewsByDate(allReviews);

	return {
		groups,
		totalReviews,
		pagesLoaded,
		isFetching,
		isFetchingNextPage,
		isError,
		error,
		hasNextPage,
	};
}
