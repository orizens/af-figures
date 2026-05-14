import type { SortOrder } from "@/shared/types/reviews";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

export function useSearchFilters() {
	const {
		q: urlQ,
		rating: urlRating,
		start: urlStart,
		end: urlEnd,
		sort: urlSort,
	} = useSearch({ from: "/" });
	const navigate = useNavigate({ from: "/" });

	const navigateQ = useCallback(
		(value: string) => {
			navigate({
				search: (prev) => ({ ...prev, q: value, page: 1 }),
				replace: false,
			});
		},
		[navigate],
	);

	const handleSearchChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		navigateQ(event.target.value);
	};

	const handleStarToggle = async (star: number): Promise<void> => {
		const current = urlRating ?? [];
		const next = current.includes(star)
			? current.filter((s) => s !== star)
			: [...current, star];
		const rating = next.length === 0 ? undefined : next;
		await navigate({
			search: (prev) => ({ ...prev, rating, page: 1 }),
			replace: false,
		});
	};

	const handleStartChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	): Promise<void> => {
		const value = event.target.value || undefined;
		await navigate({
			search: (prev) => ({ ...prev, start: value, page: 1 }),
			replace: false,
		});
	};

	const handleEndChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	): Promise<void> => {
		const value = event.target.value || undefined;
		await navigate({
			search: (prev) => ({ ...prev, end: value, page: 1 }),
			replace: false,
		});
	};

	const handleSortChange = async (value: SortOrder): Promise<void> => {
		await navigate({
			search: (prev) => ({ ...prev, sort: value, page: 1 }),
			replace: false,
		});
	};

	return {
		q: urlQ,
		urlRating,
		urlStart,
		urlEnd,
		urlSort,
		navigateQ,
		handleSearchChange,
		handleStarToggle,
		handleStartChange,
		handleEndChange,
		handleSortChange,
	};
}
