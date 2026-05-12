import { StarIcon } from "@/components/StarIcon";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const DEBOUNCE_DELAY = 300;
const STAR_VALUES = [5, 4, 3, 2, 1] as const;

const inputClassName =
	"px-4 py-2 border border-border rounded-base text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface";

function useSearchFilters() {
	const { q: urlQ, rating: urlRating, start: urlStart, end: urlEnd } = useSearch({ from: "/" });
	const navigate = useNavigate({ from: "/" });

	const [localQ, setLocalQ] = useState(urlQ);
	const [prevUrlQ, setPrevUrlQ] = useState(urlQ);
	const debouncedQ = useDebounce(localQ, DEBOUNCE_DELAY);

	// Render-time derived state: sync input when URL changes externally (back/forward)
	if (urlQ !== prevUrlQ) {
		setPrevUrlQ(urlQ);
		setLocalQ(urlQ);
	}

	useEffect(() => {
		// Skip if debounce hasn't caught up to localQ yet (user still typing, or localQ was reset from URL)
		if (debouncedQ !== localQ) return;
		// Skip navigation if the debounced value already matches the URL (prevents spurious history entries)
		if (debouncedQ === urlQ) return;
		void navigate({
			search: (prev) => ({ ...prev, q: debouncedQ, page: 1 }),
			replace: false,
		});
	}, [debouncedQ, localQ, urlQ, navigate]);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setLocalQ(event.target.value);
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

type StarRatingFilterProps = {
	urlRating: number[] | undefined;
	onToggle: (star: number) => void;
};

function StarRatingFilter({ urlRating, onToggle }: StarRatingFilterProps): React.ReactElement {
	return (
		<fieldset className="flex flex-col gap-1 text-sm font-medium text-text">
			<legend className="mb-2">Rating</legend>
			<div className="flex flex-col gap-1">
				{STAR_VALUES.map((star) => {
					const isChecked = urlRating?.includes(star) ?? false;
					return (
						<label
							key={star}
							className={`relative flex items-center gap-1 cursor-pointer rounded-base px-2 py-1 transition-opacity ${isChecked ? "opacity-100 ring-1 ring-primary rounded" : "opacity-60 hover:opacity-100"}`}
						>
							<input
								type="checkbox"
								value={star}
								checked={isChecked}
								onChange={() => onToggle(star)}
								aria-label={`${star} star${star !== 1 ? "s" : ""}`}
								className="absolute inset-0 w-full h-full opacity-0 cursor-pointer m-0"
							/>
							{Array.from({ length: 5 }, (_, i) => (
								<StarIcon
									key={i}
									size={16}
									fill={i < star ? "var(--color-star-filled)" : "var(--color-star-empty)"}
								/>
							))}
						</label>
					);
				})}
			</div>
		</fieldset>
	);
}

type SearchBarProps = {
	localQ: string | undefined;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function SearchBar({ localQ, onChange }: SearchBarProps): React.ReactElement {
	return (
		<search aria-label="Reviews search" className="sticky top-8 z-10 rounded-xl border border-border bg-surface/60 backdrop-blur-md px-4 py-3 shadow-sm">
			<label className="flex flex-col gap-1 flex-1 text-sm font-medium text-text">
				Search
				<input
					type="search"
					aria-label="Search reviews"
					placeholder="Search reviews…"
					value={localQ}
					onChange={onChange}
					className={inputClassName}
				/>
			</label>
		</search>
	);
}

type SidebarFiltersProps = {
	urlRating: number[] | undefined;
	urlStart: string | undefined;
	urlEnd: string | undefined;
	onStarToggle: (star: number) => void;
	onStartChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onEndChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function SidebarFilters({
	urlRating,
	urlStart,
	urlEnd,
	onStarToggle,
	onStartChange,
	onEndChange,
}: SidebarFiltersProps): React.ReactElement {
	return (
		<aside className="flex flex-col gap-6 w-48 shrink-0 sticky top-8 self-start rounded-xl border border-border bg-surface/60 backdrop-blur-md px-4 py-5 shadow-sm">
			<StarRatingFilter urlRating={urlRating} onToggle={onStarToggle} />
			<div className="flex flex-col gap-3">
				<span className="text-sm font-medium text-text">Date range</span>
				<label className="flex flex-col gap-1 text-sm font-medium text-text">
					From
					<input
						type="date"
						aria-label="Start date"
						value={urlStart ?? ""}
						onChange={onStartChange}
						className={inputClassName}
					/>
				</label>
				<label className="flex flex-col gap-1 text-sm font-medium text-text">
					To
					<input
						type="date"
						aria-label="End date"
						value={urlEnd ?? ""}
						onChange={onEndChange}
						className={inputClassName}
					/>
				</label>
			</div>
		</aside>
	);
}

export function useSearchFiltersState() {
	return useSearchFilters();
}
