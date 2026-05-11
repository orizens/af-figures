import { describe, expect, test } from "bun:test";
import type { Review } from "@/shared/types/reviews";
import { groupReviewsByDate } from "./dateGroups";

function makeReview(date: string, id = date): Review {
	return {
		id,
		author: "Test User",
		title: "Test Title",
		review: "Test body",
		original_title: "Test Title",
		original_review: "Test body",
		stars: "5.00",
		iso: "US",
		version: null,
		date,
		deleted: false,
		has_response: false,
		product: 1,
		product_id: 1,
		product_name: "App",
		vendor_id: "1",
		store: "apple",
		weight: 0,
		predicted_langs: ["en"],
	};
}

// Fixed "now": Wednesday 2024-03-13T12:00:00
// Week starts Monday 2024-03-11
const NOW = new Date("2024-03-13T12:00:00");

describe("groupReviewsByDate", () => {
	test("returns empty array for empty input", () => {
		expect(groupReviewsByDate([], NOW)).toEqual([]);
	});

	test("places review from today in Today bucket", () => {
		const groups = groupReviewsByDate([makeReview("2024-03-13T08:00:00")], NOW);
		expect(groups).toHaveLength(1);
		expect(groups[0].label).toBe("Today");
	});

	test("places review from yesterday in Yesterday bucket", () => {
		const groups = groupReviewsByDate([makeReview("2024-03-12T23:59:59")], NOW);
		expect(groups[0].label).toBe("Yesterday");
	});

	test("places review from earlier this week (Mon) in This Week", () => {
		const groups = groupReviewsByDate([makeReview("2024-03-11T10:00:00")], NOW);
		expect(groups[0].label).toBe("This Week");
	});

	test("places review from last week in Last Week", () => {
		const groups = groupReviewsByDate([makeReview("2024-03-06T10:00:00")], NOW);
		expect(groups[0].label).toBe("Last Week");
	});

	test("start of last week (Mon) is in Last Week", () => {
		const groups = groupReviewsByDate([makeReview("2024-03-04T00:00:00")], NOW);
		expect(groups[0].label).toBe("Last Week");
	});

	test("places review from earlier this month (before last week) in This Month", () => {
		const groups = groupReviewsByDate([makeReview("2024-03-01T00:00:00")], NOW);
		expect(groups[0].label).toBe("This Month");
	});

	test("places review from last month in Last Month", () => {
		const groups = groupReviewsByDate([makeReview("2024-02-15T10:00:00")], NOW);
		expect(groups[0].label).toBe("Last Month");
	});

	test('places review from 2 months ago in a "Month YYYY" bucket', () => {
		const groups = groupReviewsByDate([makeReview("2024-01-10T10:00:00")], NOW);
		expect(groups[0].label).toBe("January 2024");
	});

	test("section order is Today → Yesterday → This Week → Last Week → This Month → Last Month", () => {
		const reviews = [
			makeReview("2024-01-01T00:00:00", "1"), // older
			makeReview("2024-02-05T00:00:00", "2"), // last month
			makeReview("2024-03-02T00:00:00", "3"), // this month
			makeReview("2024-03-06T00:00:00", "4"), // last week
			makeReview("2024-03-11T00:00:00", "5"), // this week
			makeReview("2024-03-12T00:00:00", "6"), // yesterday
			makeReview("2024-03-13T08:00:00", "7"), // today
		];
		const groups = groupReviewsByDate(reviews, NOW);
		const labels = groups.map((g) => g.label);
		expect(labels).toEqual([
			"Today",
			"Yesterday",
			"This Week",
			"Last Week",
			"This Month",
			"Last Month",
			"January 2024",
		]);
	});

	test("empty sections are omitted", () => {
		const groups = groupReviewsByDate([makeReview("2024-03-13T08:00:00")], NOW);
		expect(groups).toHaveLength(1);
		expect(groups[0].label).toBe("Today");
	});

	test("multiple reviews in same section are grouped together", () => {
		const reviews = [
			makeReview("2024-03-13T08:00:00", "a"),
			makeReview("2024-03-13T10:00:00", "b"),
		];
		const groups = groupReviewsByDate(reviews, NOW);
		expect(groups).toHaveLength(1);
		expect(groups[0].reviews).toHaveLength(2);
	});

	test("review at exact start of today (midnight) is Today", () => {
		const groups = groupReviewsByDate([makeReview("2024-03-13T00:00:00")], NOW);
		expect(groups[0].label).toBe("Today");
	});

	test("review at Monday of current week (week boundary) is This Week", () => {
		// NOW is Wednesday 2024-03-13; week started Monday 2024-03-11
		const groups = groupReviewsByDate([makeReview("2024-03-11T00:00:00")], NOW);
		expect(groups[0].label).toBe("This Week");
	});

	test("now is a Monday — This Week and Yesterday both map correctly", () => {
		const monday = new Date("2024-03-11T12:00:00");
		const groups = groupReviewsByDate(
			[
				makeReview("2024-03-11T08:00:00", "today"),
				makeReview("2024-03-10T08:00:00", "yesterday"),
			],
			monday,
		);
		const labels = groups.map((g) => g.label);
		expect(labels).toContain("Today");
		expect(labels).toContain("Yesterday");
	});
});
