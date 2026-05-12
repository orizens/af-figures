import { useRef, useCallback } from "react";

export function useDebouncedCallback<T extends unknown[]>(
	callback: (...args: T) => void,
	delay: number,
): (...args: T) => void {
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	return useCallback(
		(...args: T) => {
			if (timerRef.current !== null) clearTimeout(timerRef.current);
			timerRef.current = setTimeout(() => {
				callback(...args);
			}, delay);
		},
		[callback, delay],
	);
}
