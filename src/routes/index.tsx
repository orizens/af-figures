import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ReviewsPage } from "@/features/reviews/ReviewsPage";

const ratingSchema = z
	.union([
		z.string().transform((s) =>
			s
				.split(",")
				.map(Number)
				.filter((n) => Number.isInteger(n) && n >= 1 && n <= 5),
		),
		z.array(z.number().int().min(1).max(5)),
	])
	.pipe(z.array(z.number().int().min(1).max(5)).min(1))
	.optional()
	.catch(undefined);

const dateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/)
	.optional()
	.catch(undefined);

export const Route = createFileRoute("/")({
	validateSearch: z.object({
		q: z.string().default("").catch(""),
		rating: ratingSchema,
		page: z.coerce.number().int().min(1).default(1).catch(1),
		sort: z.enum(["asc", "desc"]).default("desc").catch("desc"),
		start: dateSchema,
		end: dateSchema,
	}),
	component: ReviewsPage,
});
