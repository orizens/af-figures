import { Outlet } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { BackgroundBlobs } from "@/components/BackgroundBlobs";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorFallback } from "@/components/ErrorFallback";

export function App(): React.ReactElement {
	return (
		<ErrorBoundary fallback={({ reset }) => <ErrorFallback reset={reset} />}>
			<div className="relative min-h-screen bg-[var(--color-surface-raised)]">
				<BackgroundBlobs />
				<AppHeader />
				<Outlet />
			</div>
		</ErrorBoundary>
	);
}
