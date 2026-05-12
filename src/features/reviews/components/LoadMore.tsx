import { useNavigate, useSearch } from "@tanstack/react-router";

interface LoadMoreProps {
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	fetchNextPage: () => void;
}

export function LoadMore({
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
}: LoadMoreProps): React.ReactElement | null {
	const { page } = useSearch({ from: "/" });
	const navigate = useNavigate({ from: "/" });

	if (!hasNextPage) return null;

	const handleClick = (): void => {
		void navigate({
			search: (prev) => ({ ...prev, page: page + 1 }),
			replace: false,
		});
		fetchNextPage();
	}

	return (
		<div className="flex justify-center py-6">
			<button
				type="button"
				aria-label="Load more reviews"
				aria-busy={isFetchingNextPage}
				onClick={handleClick}
				disabled={isFetchingNextPage}
				className="px-6 py-2 bg-primary text-white rounded-base text-sm font-medium hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
			>
				{isFetchingNextPage ? "Loading…" : "Load more reviews"}
			</button>
		</div>
	);
}
