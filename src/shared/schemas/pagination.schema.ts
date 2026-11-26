import { z } from "zod";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export const sortOrderSchema = z
	.enum(["created_at:desc", "created_at:asc"])
	.default("created_at:desc");
export type SortOrder = z.infer<typeof sortOrderSchema>;

export const paginationParamsSchema = z.object({
	page: z.coerce.number<number | string>().int().min(1).default(1),
	limit: z.coerce.number<number | string>().int().min(1).max(100).default(10),
	search: z.string().trim().max(255).optional(),
	sort: sortOrderSchema,
});
export type PaginationParams = z.infer<typeof paginationParamsSchema>;

export function createPaginatedResultSchema<TItem extends z.ZodType>(
	itemSchema: TItem,
) {
	return z.object({
		page: z.int().min(1),
		limit: z.int().min(1).max(100),
		totalItems: z.int().min(0),
		totalPages: z.int().min(0),
		hasNext: z.boolean(),
		hasPrev: z.boolean(),
		data: z.array(itemSchema),
	});
}
