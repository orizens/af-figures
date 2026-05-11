const BASE_URL = "https://appfigures.com/_u/careers/api";

export async function fetchApi<T>(
	path: string,
	params?: Record<string, string>,
	signal?: AbortSignal,
): Promise<T> {
	const url = new URL(`${BASE_URL}${path}`);

	if (params) {
		for (const [key, value] of Object.entries(params)) {
			url.searchParams.set(key, value);
		}
	}

	const response = await fetch(url.toString(), { signal });

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	return response.json() as Promise<T>;
}
