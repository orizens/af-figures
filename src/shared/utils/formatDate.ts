const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "long",
	day: "numeric",
});

export function formatReviewDate(dateString: string): string {
	const date = new Date(dateString);
	return DATE_FORMAT.format(date);
}
