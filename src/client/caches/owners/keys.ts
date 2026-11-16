export const ownerKeys = {
  all: ["owners"] as const,
  lists: () => [...ownerKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...ownerKeys.lists(), filters] as const,
  details: () => [...ownerKeys.all, "detail"] as const,
  detail: (id: number) => [...ownerKeys.details(), id] as const,
};
