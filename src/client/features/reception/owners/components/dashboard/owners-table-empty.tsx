import { UsersRound } from "lucide-react";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/client/shared/shadcn/components/ui/empty";
import { useOwnersList } from "#/client/features/reception/owners/hooks/use-owners-list";
import { useOwnersSearch } from "#/client/features/reception/owners/hooks/use-owners-search";

export function OwnersTableEmpty() {
  const { isEmptyDataset, hasActiveFilter } = useOwnersList();
  const { resetFilters } = useOwnersSearch();

  return (
    <Empty className="py-10">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UsersRound aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>
          {isEmptyDataset ? "No owners registered yet" : "No owners match your filters"}
        </EmptyTitle>
        <EmptyDescription>
          {isEmptyDataset
            ? "Register a new pet owner from the button above to get started."
            : "Try adjusting your search term or quick filters."}
        </EmptyDescription>
      </EmptyHeader>
      {hasActiveFilter ? (
        <EmptyContent>
          <Button type="button" size="sm" variant="outline" onClick={resetFilters}>
            Clear all filters
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}
