import { useQueryClient } from "@tanstack/react-query";

interface ErrorFallbackProps {
	reset: () => void;
}

export function ErrorFallback({
	reset,
}: ErrorFallbackProps): React.ReactElement {
	const queryClient = useQueryClient();

	const handleRetry = (): void => {
		void queryClient.resetQueries();
		reset();
	}

	return (
		<div
			role="alert"
			aria-live="assertive"
			className="flex flex-col items-center gap-4 py-12 text-center"
		>
			<p className="text-[var(--color-error)] font-medium">
				Something went wrong loading reviews.
			</p>
			<button
				type="button"
				onClick={handleRetry}
				className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-base)] text-sm hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-colors"
			>
				Try again
			</button>
		</div>
	);
}
