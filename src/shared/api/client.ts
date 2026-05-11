const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchApi<T>(
	path: string,
	params?: Record<string, string>,
	signal?: AbortSignal,
): Promise<T> {
	const url = new URL(`${BASE_URL}${path}`);

	Object.entries(params ?? {}).forEach(([key, value]) =>
		url.searchParams.set(key, value),
	);

	const response = await fetch(url.toString(), { signal });

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	return response.json() as Promise<T>;
}
