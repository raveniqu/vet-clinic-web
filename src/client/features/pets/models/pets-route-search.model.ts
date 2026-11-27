import { z } from "zod";

export const petsRouteSearchSchema = z.object({
	openAddNewForm: z.boolean().optional(),
	editPetId: z.coerce.number<number | string>().int().positive().optional(),
});

export type PetsRouteSearch = z.infer<typeof petsRouteSearchSchema>;
