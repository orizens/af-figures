import { useNavigate, useSearch } from "@tanstack/react-router";
import { useRef, useState } from "react";

const DEBOUNCE_DELAY = 300;
export function SearchFilters(): React.ReactElement {
	const { q: urlQ, rating: urlRating, start: urlStart, end: urlEnd } = useSearch({ from: "/" });
	const navigate = useNavigate({ from: "/" });

	const [localQ, setLocalQ] = useState(urlQ);
	const [prevUrlQ, setPrevUrlQ] = useState(urlQ);
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	// Render-time derived state: sync input when URL changes externally (back/forward)
	if (urlQ !== prevUrlQ) {
		setPrevUrlQ(urlQ);
		setLocalQ(urlQ);
	}

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const value = event.target.value;
		setLocalQ(value);
		clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			void navigate({
				search: (prev) => ({ ...prev, q: value, page: 1 }),
				replace: false,
			});
		}, DEBOUNCE_DELAY);
	}

	const handleRatingChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
	): void => {
		const value = event.target.value;
		const rating = value === "" ? undefined : value.split(",").map(Number);
		void navigate({
			search: (prev) => ({ ...prev, rating, page: 1 }),
			replace: false,
		});
	}

	const handleStartChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const value = event.target.value || undefined;
		void navigate({
			search: (prev) => ({ ...prev, start: value, page: 1 }),
			replace: false,
		});
	};

	const handleEndChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const value = event.target.value || undefined;
		void navigate({
			search: (prev) => ({ ...prev, end: value, page: 1 }),
			replace: false,
		});
	};

	const ratingValue = urlRating ? urlRating.join(",") : "";

	return (
		<search
			aria-label="Reviews search"
			className="flex flex-col sm:flex-row gap-3 items-end"
		>
			<label className="flex flex-col gap-1 flex-1 text-sm font-medium text-[var(--color-text)]">
				Search
				<input
					type="search"
					aria-label="Search reviews"
					placeholder="Search reviews…"
					value={localQ}
					onChange={handleSearchChange}
					className="px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-base)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-surface)]"
				/>
			</label>
			<label className="flex flex-col gap-1 text-sm font-medium text-[var(--color-text)]">
				Rating
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
			</label>
			<label className="flex flex-col gap-1 text-sm font-medium text-[var(--color-text)]">
				From
				<input
					type="date"
					aria-label="Start date"
					value={urlStart ?? ""}
					onChange={handleStartChange}
					className="px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-base)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-surface)]"
				/>
			</label>
			<label className="flex flex-col gap-1 text-sm font-medium text-[var(--color-text)]">
				To
				<input
					type="date"
					aria-label="End date"
					value={urlEnd ?? ""}
					onChange={handleEndChange}
					className="px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-base)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-surface)]"
				/>
			</label>
		</search>
	);
}
