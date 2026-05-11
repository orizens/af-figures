import { fetchApi } from "@/shared/api/client";
import type {
	ReviewSearchParams,
	ReviewsResponse,
} from "@/shared/types/reviews";

const PAGE_SIZE = 25;

export function getReviews(
	params: ReviewSearchParams & { count?: number },
	signal?: AbortSignal,
): Promise<ReviewsResponse> {
	const queryParams: Record<string, string> = {
		sort: "-date",
		page: String(params.page),
		count: String(params.count ?? PAGE_SIZE),
	};

	if (params.q) {
		queryParams["q"] = params.q;
	}

	if (params.rating && params.rating.length > 0) {
		queryParams["rating"] = params.rating.join(",");
	}

	if (params.start) {
		queryParams["start"] = params.start;
	}

	if (params.end) {
		queryParams["end"] = params.end;
	}

	return fetchApi<ReviewsResponse>("/reviews", queryParams, signal);
}
