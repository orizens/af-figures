import { StarIcon } from "@/components/StarIcon";
import { useSearchFilters } from "../hooks/useSearchFilters";

const STAR_VALUES = [5, 4, 3, 2, 1] as const;
export function StarRatingFilter(): React.ReactElement {
  const { urlRating, handleStarToggle: onToggle } = useSearchFilters();
  return (
    <fieldset className="flex flex-col gap-1 text-sm font-medium text-text">
      <legend className="mb-2">Rating</legend>
      <div className="flex flex-col gap-1">
        {STAR_VALUES.map((star) => {
          const isChecked = urlRating?.includes(star) ?? false;
          return (
            <label
              key={`${star}-star-filter`}
              className={`relative flex items-center gap-1 cursor-pointer rounded-base px-2 py-1 transition-opacity ${isChecked ? "opacity-100 ring-1 ring-primary rounded" : "opacity-60 hover:opacity-100"}`}
            >
              <input
                type="checkbox"
                value={star}
                checked={isChecked}
                onChange={() => onToggle(star)}
                aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer m-0" />
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon
                  key={`${star}-star-icon-${i}`}
                  size={16}
                  fill={i < star ? "var(--color-star-filled)" : "var(--color-star-empty)"} />
              ))}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
