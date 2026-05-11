import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";

/** Serialize search params: rating number[] → comma-separated string */
function stringifySearch(search: Record<string, unknown>): string {
	const params = new URLSearchParams();

	for (const [key, value] of Object.entries(search)) {
		if (value === undefined || value === null || value === "") continue;
		// Skip default values so the URL stays clean (e.g., /?q=foo instead of /?q=foo&page=1)
		if (key === "page" && value === 1) continue;
		if (Array.isArray(value)) {
			params.set(key, value.join(","));
		} else {
			params.set(key, String(value));
		}
	}

	const str = params.toString();
	return str ? `?${str}` : "";
}

/** Parse search string: comma-separated rating → kept as string for Zod to coerce */
function parseSearch(searchStr: string): Record<string, string> {
	const params = new URLSearchParams(searchStr);
	const result: Record<string, string> = {};
	params.forEach((value, key) => {
		result[key] = value;
	});
	return result;
}

const router = createRouter({
	routeTree,
	stringifySearch,
	parseSearch,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// staleTime=0 is intentional: small app, always serve fresh data
			staleTime: 0,
			retry: 3,
			retryDelay: 0,
		},
	},
});

const rootElement = document.getElementById("root")!;

createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>,
);
