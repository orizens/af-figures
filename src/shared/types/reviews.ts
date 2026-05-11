export interface Review {
	id: string;
	author: string;
	title: string;
	review: string;
	original_title: string;
	original_review: string;
	/** String decimal, e.g. "5.00" — parse with parseFloat before use */
	stars: string;
	iso: string;
	version: string | null;
	date: string;
	deleted: boolean;
	has_response: boolean;
	product: number;
	product_id: number;
	product_name: string;
	vendor_id: string;
	store: string;
	weight: number;
	predicted_langs: string[];
	tags: string[];
}

export interface ReviewsResponse {
	total: number;
	totals_per_product: Record<string, number>;
	/** Total number of pages given the requested count */
	pages: number;
	this_page: number;
	reviews: Review[];
}

export interface ReviewSearchParams {
	q: string;
	rating: number[] | undefined;
	page: number;
	/** yyyy-mm-dd — only reviews created on or after this date */
	start?: string;
	/** yyyy-mm-dd — only reviews created on or before this date */
	end?: string;
}
