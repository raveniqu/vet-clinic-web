export const petKeys = {
  all: ["pets"] as const,
  lists: () => [...petKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...petKeys.lists(), filters] as const,
  details: () => [...petKeys.all, "detail"] as const,
  detail: (id: number) => [...petKeys.details(), id] as const,
  catalogs: ["pets-catalog"] as const,
  speciesList: () => [...petKeys.catalogs, "species"] as const,
  breeds: (speciesId?: number) => [...petKeys.catalogs, "breeds", speciesId] as const,
};
