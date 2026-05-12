import { useId } from "react";
import { ReviewCard } from "@/features/reviews/components/ReviewCard";
import type { ReviewGroup as ReviewGroupType } from "@/features/reviews/utils/dateGroups";

interface ReviewGroupProps {
	group: ReviewGroupType;
}

export function ReviewGroup({ group }: ReviewGroupProps): React.ReactElement {
	const headingId = useId();

	return (
		<section aria-labelledby={headingId} className="flex flex-col gap-3">
			<h2
				id={headingId}
				className="text-xs font-semibold uppercase tracking-wider text-text-muted sticky top-0 bg-surface-raised py-2 px-1"
			>
				{group.label}
			</h2>
			<ul className="flex flex-col gap-3 list-none p-0 m-0">
				{group.reviews.map((review) => (
					<li key={`review-${review.id}`}>
						<ReviewCard review={review} />
					</li>
				))}
			</ul>
		</section>
	);
}
