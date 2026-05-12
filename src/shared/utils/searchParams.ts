/** Serialize search params: rating number[] → comma-separated string */
export function stringifySearch(search: Record<string, unknown>): string {
	const params = new URLSearchParams(
		Object.entries(search)
			.filter(([key, value]) => {
				if (value === undefined || value === null || value === "") return false;
				if (key === "page" && value === 1) return false;
				return true;
			})
			.flatMap(([key, value]) =>
				Array.isArray(value) ? [[key, value.join(",")]] : [[key, String(value)]]
			)
	);

	const str = params.toString();
	return str ? `?${str}` : "";
}

/** Parse search string: comma-separated rating → kept as string for Zod to coerce */
export function parseSearch(searchStr: string): Record<string, string> {
	return Object.fromEntries(new URLSearchParams(searchStr).entries());
}
