import { useNavigate, useSearch } from "@tanstack/react-router";

interface LoadMoreProps {
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
}

export function LoadMore({
	hasNextPage,
	isFetchingNextPage,
}: LoadMoreProps): React.ReactElement | null {
	const { page } = useSearch({ from: "/" });
	const navigate = useNavigate({ from: "/" });

	if (!hasNextPage) return null;

	const handleClick = (): void => {
		void navigate({
			search: (prev) => ({ ...prev, page: page + 1 }),
			replace: false,
			resetScroll: false,
		});
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
				{isFetchingNextPage ? (
					<span className="flex items-center gap-2">
						<span
							aria-hidden="true"
							className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
						/>
						Loading…
					</span>
				) : (
					"Load more reviews"
				)}
			</button>
		</div>
	);
}
