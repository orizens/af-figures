import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";

export function SearchFilters(): React.ReactElement {
	const { q: urlQ, rating: urlRating } = useSearch({ from: "/" });
	const navigate = useNavigate({ from: "/" });

	const [localQ, setLocalQ] = useState(urlQ);
	const debouncedQ = useDebounce(localQ, 400);
	// Track when URL changed externally so we skip the debounce navigate
	const urlSyncRef = useRef(false);

	// Sync input back when URL changes externally (back/forward navigation)
	useEffect(() => {
		urlSyncRef.current = true;
		setLocalQ(urlQ);
	}, [urlQ]);

	// Navigate when debounced search value settles
	useEffect(() => {
		if (urlSyncRef.current) {
			urlSyncRef.current = false;
			return;
		}
		if (debouncedQ === urlQ) return;
		void navigate({
			search: (prev) => ({ ...prev, q: debouncedQ, page: 1 }),
			replace: false,
		});
	}, [debouncedQ, urlQ, navigate]);

	function handleRatingChange(
		event: React.ChangeEvent<HTMLSelectElement>,
	): void {
		const value = event.target.value;
		const rating = value === "" ? undefined : value.split(",").map(Number);
		void navigate({
			search: (prev) => ({ ...prev, rating, page: 1 }),
			replace: false,
		});
	}

	const ratingValue = urlRating ? urlRating.join(",") : "";

	return (
		<search
			aria-label="Reviews search"
			className="flex flex-col sm:flex-row gap-3"
		>
			<input
				type="search"
				aria-label="Search reviews"
				placeholder="Search reviews…"
				value={localQ}
				onChange={(e) => setLocalQ(e.target.value)}
				className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-base)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-surface)]"
			/>
			<select
				aria-label="Filter by rating"
				value={ratingValue}
				onChange={handleRatingChange}
				className="px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-base)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-surface)]"
			>
				<option value="">All ratings</option>
				<option value="5">5 stars</option>
				<option value="4">4 stars</option>
				<option value="3">3 stars</option>
				<option value="2">2 stars</option>
				<option value="1">1 star</option>
			</select>
		</search>
	);
}
