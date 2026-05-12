import { useDebouncedCallback } from "@/shared/hooks/useDebouncedCallback";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";

const DEBOUNCE_DELAY = 300;

export function useSearchFilters() {
	const { q: urlQ, rating: urlRating, start: urlStart, end: urlEnd } = useSearch({ from: "/" });
	const navigate = useNavigate({ from: "/" });

	const [localQ, setLocalQ] = useState(urlQ);
	const [prevUrlQ, setPrevUrlQ] = useState(urlQ);

	// Render-time derived state: sync input when URL changes externally (back/forward)
	if (urlQ !== prevUrlQ) {
		setPrevUrlQ(urlQ);
		setLocalQ(urlQ);
	}

	const navigateQ = useCallback(
		(value: string) => {
			navigate({ search: (prev) => ({ ...prev, q: value, page: 1 }), replace: false });
		},
		[navigate],
	);
	const debouncedNavigateQ = useDebouncedCallback(navigateQ, DEBOUNCE_DELAY);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const value = event.target.value;
		setLocalQ(value);
		debouncedNavigateQ(value);
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

	const handleStartChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const value = event.target.value || undefined;
		await navigate({
			search: (prev) => ({ ...prev, start: value, page: 1 }),
			replace: false,
		});
	};

	const handleEndChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const value = event.target.value || undefined;
		await navigate({
			search: (prev) => ({ ...prev, end: value, page: 1 }),
			replace: false,
		});
	};

	return { localQ, urlRating, urlStart, urlEnd, handleSearchChange, handleStarToggle, handleStartChange, handleEndChange };
}
