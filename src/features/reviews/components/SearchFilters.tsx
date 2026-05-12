import { StarIcon } from "@/components/StarIcon";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useRef, useState } from "react";

const DEBOUNCE_DELAY = 300;
const STAR_VALUES = [5, 4, 3, 2, 1] as const;

const inputClassName =
	"px-4 py-2 border border-border rounded-base text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface";

function useSearchFilters() {
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
		debounceRef.current = setTimeout(async () => {
			await navigate({
				search: (prev) => ({ ...prev, q: value, page: 1 }),
				replace: false,
			});
		}, DEBOUNCE_DELAY);
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
			<legend>Rating</legend>
			<div className="flex gap-3 py-2">
				{STAR_VALUES.map((star) => (
					<label key={star} className="flex items-center gap-1 cursor-pointer">
						<input
							type="checkbox"
							value={star}
							checked={urlRating?.includes(star) ?? false}
							onChange={() => onToggle(star)}
							className="accent-primary"
						/>
						{star}
						<StarIcon />
					</label>
				))}
			</div>
		</fieldset>
	);
}

export function SearchFilters(): React.ReactElement {
	const {
		localQ,
		urlRating,
		urlStart,
		urlEnd,
		handleSearchChange,
		handleStarToggle,
		handleStartChange,
		handleEndChange,
	} = useSearchFilters();

	return (
		<search
			aria-label="Reviews search"
			className="flex flex-col sm:flex-row gap-3 items-end"
		>
			<label className="flex flex-col gap-1 flex-1 text-sm font-medium text-text">
				Search
				<input
					type="search"
					aria-label="Search reviews"
					placeholder="Search reviews…"
					value={localQ}
					onChange={handleSearchChange}
					className={inputClassName}
				/>
			</label>
			<StarRatingFilter urlRating={urlRating} onToggle={handleStarToggle} />
			<label className="flex flex-col gap-1 text-sm font-medium text-text">
				From
				<input
					type="date"
					aria-label="Start date"
					value={urlStart ?? ""}
					onChange={handleStartChange}
					className={inputClassName}
				/>
			</label>
			<label className="flex flex-col gap-1 text-sm font-medium text-text">
				To
				<input
					type="date"
					aria-label="End date"
					value={urlEnd ?? ""}
					onChange={handleEndChange}
					className={inputClassName}
				/>
			</label>
		</search>
	);
}
