import { cn } from "cn";
import { PawPrint } from "lucide-react";
import { PetGridCard } from "../pet-grid-card";
import { PetRowProvider } from "#/client/features/reception/pets/contexts/pet-row.context";
import { usePetsGrid } from "#/client/features/reception/pets/hooks/use-pets-grid";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import { Card, CardContent } from "#/client/shared/shadcn/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/client/shared/shadcn/components/ui/empty";

export function PetsGridView() {
  const {
    displayedPets,
    shownCount,
    totalCount,
    remainingCount,
    nextBatchCount,
    hasMore,
    loadMore,
    isEmptyDataset,
    hasActiveFilter,
    clearFilters,
    isSidebarOpen,
  } = usePetsGrid();

  if (displayedPets.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent>
          <Empty className="p-8">
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
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="col-span-full flex flex-col gap-6">
      <div
        className={cn("grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", {
          "lg:grid-cols-2 xl:grid-cols-3": isSidebarOpen,
        })}
      >
        {displayedPets.map((pet) => (
          <PetRowProvider key={pet.id} pet={pet}>
            <PetGridCard />
          </PetRowProvider>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground">
          Showing {shownCount} of {totalCount} pets
        </p>
        {hasMore ? (
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full sm:w-auto sm:min-w-64"
            onClick={loadMore}
          >
            Load {nextBatchCount} More ({remainingCount} remaining)
          </Button>
        ) : null}
      </div>
    </div>
  );
}
