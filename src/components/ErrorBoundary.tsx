import type { ReactNode } from "react";
import { Component } from "react";

interface FallbackProps {
	reset: () => void;
	error: Error;
}

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback: (props: FallbackProps) => ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	reset = (): void => {
		this.setState({ hasError: false, error: null });
	};

	render(): ReactNode {
		if (this.state.hasError && this.state.error) {
			return this.props.fallback({
				reset: this.reset,
				error: this.state.error,
			});
		}
		return this.props.children;
	}
}
