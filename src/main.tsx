import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import { parseSearch, stringifySearch } from "./shared/utils/searchParams";

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
