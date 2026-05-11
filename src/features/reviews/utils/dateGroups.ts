import type { Review } from "@/shared/types/reviews";

export interface ReviewGroup {
	label: string;
	reviews: Review[];
}

function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date): Date {
	// Week starts on Monday
	const day = date.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	return startOfDay(
		new Date(date.getFullYear(), date.getMonth(), date.getDate() + diff),
	);
}

function startOfMonth(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

type SectionKey =
	| "today"
	| "yesterday"
	| "thisWeek"
	| "lastWeek"
	| "thisMonth"
	| "lastMonth"
	| string;

function getSectionKey(reviewDate: Date, now: Date): SectionKey {
	const todayStart = startOfDay(now);
	const yesterdayStart = new Date(todayStart.getTime() - 86_400_000);
	const thisWeekStart = startOfWeek(now);
	const lastWeekStart = new Date(thisWeekStart.getTime() - 7 * 86_400_000);
	const thisMonthStart = startOfMonth(now);
	const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

	const reviewStart = startOfDay(reviewDate);

	if (reviewStart >= todayStart) return "today";
	if (reviewStart >= yesterdayStart) return "yesterday";
	if (reviewStart >= thisWeekStart) return "thisWeek";
	if (reviewStart >= lastWeekStart) return "lastWeek";
	if (reviewStart >= thisMonthStart) return "thisMonth";
	if (reviewStart >= lastMonthStart) return "lastMonth";

	// Older: group by "Month YYYY"
	return `${reviewDate.toLocaleString("en-US", { month: "long", year: "numeric" })}`;
}

const SECTION_LABELS: Record<string, string> = {
	today: "Today",
	yesterday: "Yesterday",
	thisWeek: "This Week",
	lastWeek: "Last Week",
	thisMonth: "This Month",
	lastMonth: "Last Month",
};

const SECTION_ORDER: SectionKey[] = [
	"today",
	"yesterday",
	"thisWeek",
	"lastWeek",
	"thisMonth",
	"lastMonth",
];

export function groupReviewsByDate(
	reviews: Review[],
	now: Date = new Date(),
): ReviewGroup[] {
	const buckets = new Map<SectionKey, Review[]>();

	for (const review of reviews) {
		const key = getSectionKey(new Date(review.date), now);
		const existing = buckets.get(key);
		if (existing) {
			existing.push(review);
		} else {
			buckets.set(key, [review]);
		}
	}

	const groups: ReviewGroup[] = [];

	// First pass: well-known ordered sections
	for (const key of SECTION_ORDER) {
		const sectionReviews = buckets.get(key);
		if (sectionReviews && sectionReviews.length > 0) {
			groups.push({ label: SECTION_LABELS[key], reviews: sectionReviews });
			buckets.delete(key);
		}
	}

	// Second pass: remaining "Month YYYY" buckets, sorted descending
	const olderKeys = [...buckets.keys()].sort((a, b) => b.localeCompare(a));
	for (const key of olderKeys) {
		const sectionReviews = buckets.get(key);
		if (sectionReviews && sectionReviews.length > 0) {
			groups.push({ label: key, reviews: sectionReviews });
		}
	}

	return groups;
}
