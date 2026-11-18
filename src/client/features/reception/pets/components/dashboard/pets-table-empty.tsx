import { PawPrint } from "lucide-react";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/client/shared/shadcn/components/ui/empty";
import { usePetsEmpty } from "#/client/features/reception/pets/hooks/use-pets-empty";

export function PetsTableEmpty() {
  const { isEmptyDataset, hasActiveFilter, clearFilters } = usePetsEmpty();

  return (
    <Empty className="py-10">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PawPrint aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>
          {isEmptyDataset ? "No pets registered yet" : "No pets match your filters"}
        </EmptyTitle>
        <EmptyDescription>
          {isEmptyDataset
            ? "Register a new pet from the button above to get started."
            : "Try adjusting your search term, species, or quick filters."}
        </EmptyDescription>
      </EmptyHeader>
      {hasActiveFilter ? (
        <EmptyContent>
          <Button size="sm" variant="outline" onClick={clearFilters}>
            Clear all filters
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}
