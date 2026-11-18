import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";
import type { OwnersSearch } from "#/shared/schemas/owner.schema";
import { ownersSearchSchema } from "#/shared/schemas/owner.schema";

export function useOwnersSearch() {
  const navigate = useNavigate();
  const rawSearch = useSearch({ strict: false });
  const search = ownersSearchSchema.parse(rawSearch);

  const updateSearch = useCallback(
    (patch: Partial<OwnersSearch>, options?: { replace?: boolean }) => {
      void navigate({
        to: "/owners",
        search: (prev) => ({
          ...ownersSearchSchema.parse(prev),
          ...patch,
        }),
        replace: options?.replace ?? true,
      });
    },
    [navigate]
  );

  const resetFilters = useCallback(() => {
    updateSearch({
      search: "",
      quickFilters: [],
      page: 1,
    });
  }, [updateSearch]);

  return {
    search,
    updateSearch,
    resetFilters,
  };
}
