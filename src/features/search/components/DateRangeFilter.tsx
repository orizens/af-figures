import { useSearchFilters } from "@/features/search/hooks/useSearchFilters";

interface DateInputProps {
	ariaLabel: string;
	value: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
	children: React.ReactNode;
}

function DateInput({
	ariaLabel,
	value,
	onChange,
	children,
}: DateInputProps): React.ReactElement {
	return (
		<label className="flex flex-col gap-1 text-sm font-medium text-text">
			{children}
			<input
				type="date"
				aria-label={ariaLabel}
				value={value}
				onChange={onChange}
				className="px-4 py-2 border border-border rounded-base text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
			/>
		</label>
	);
}

export function DateRangeFilter(): React.ReactElement {
	const { urlStart, urlEnd, handleStartChange, handleEndChange } =
		useSearchFilters();

	return (
		<div className="flex flex-col gap-3">
			<span className="text-sm font-medium text-text">Date range</span>
			<DateInput
				ariaLabel="Start date"
				value={urlStart ?? ""}
				onChange={handleStartChange}
			>
				From
			</DateInput>
			<DateInput
				ariaLabel="End date"
				value={urlEnd ?? ""}
				onChange={handleEndChange}
			>
				To
			</DateInput>
		</div>
	);
}
