import { cn } from "cn";
import { CheckCircle, Info, Microscope, PawPrint, Pencil } from "lucide-react";

import { Alert, AlertTitle } from "#/client/shared/shadcn/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "#/client/shared/shadcn/components/ui/avatar";
import { Badge } from "#/client/shared/shadcn/components/ui/badge";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/client/shared/shadcn/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/client/shared/shadcn/components/ui/empty";

import { usePetsGrid } from "#/client/features/reception/pets/hooks/use-pets-grid";
import { getPetInitials } from "#/client/features/reception/pets/models/pets-table";
import { useSidebar } from "#/client/shared/shadcn/components/ui/sidebar";
import { formatMicrochipNumber, formatPetAge } from "#/client/shared/helpers/formatters";

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
    setEditingPet,
  } = usePetsGrid();
  const { open: isSidebarOpen } = useSidebar();

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
          <Card key={pet.id} className="justify-start">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Avatar className="size-16">
                  <AvatarImage src={pet.photo} alt={pet.petName} />
                  <AvatarFallback>{getPetInitials(pet.petName)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <CardTitle>{pet.petName}</CardTitle>
                  <CardDescription className="text-xs">{pet.breedName}</CardDescription>

                  <div className="flex items-center gap-1">
                    <Badge variant="secondary">{pet.sex}</Badge>
                    <Badge
                      variant={pet.reproductiveStatus === "Intact" ? "destructive" : "outline"}
                    >
                      {pet.reproductiveStatus}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardAction>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => setEditingPet(pet)}
                  aria-label={`Edit ${pet.petName}`}
                >
                  <Pencil aria-hidden="true" />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="mt-auto flex flex-col gap-4">
              <div className="flex justify-between rounded-xl bg-muted-foreground/5 p-4">
                <p className="text-xs">
                  <span>Age:</span>
                  <span className="font-semibold"> {formatPetAge(pet)}</span>
                </p>
                <p className="text-xs">
                  <span>Latest Weight:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {" "}
                    {pet.weight}
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400"> kg.</span>
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs">
                  <span>Owner:</span>
                  <span className="font-semibold"> {pet.ownerName}</span>
                </p>

                {pet.microchipNumber ? (
                  <Badge variant="secondary" className="font-mono">
                    {formatMicrochipNumber(pet.microchipNumber)}
                  </Badge>
                ) : null}
              </div>
              {pet.allergies ? (
                <Alert className="border-0 bg-primary/5 px-2 py-1 text-primary ring-1 ring-primary/50 dark:bg-primary/5 dark:text-primary dark:ring-primary/50">
                  <Info aria-hidden="true" />
                  <AlertTitle className="text-sm font-medium">{pet.allergies}</AlertTitle>
                </Alert>
              ) : (
                <Alert className="border-0 px-2 py-1 ring-1 ring-border">
                  <CheckCircle
                    className="stroke-emerald-600 dark:stroke-emerald-400"
                    aria-hidden="true"
                  />
                  <AlertTitle className="text-sm font-medium">No Allergy Records</AlertTitle>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="justify-between border-t">
              <Button size="xs" variant="outline">
                <Microscope data-icon="inline-start" aria-hidden="true" />
                <span>Open EMR</span>
              </Button>
              <Button size="xs" variant="link">
                View Profile
              </Button>
            </CardFooter>
          </Card>
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
