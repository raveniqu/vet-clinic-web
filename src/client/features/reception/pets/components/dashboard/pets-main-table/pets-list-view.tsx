import { cn } from "cn";
import {
  AlertTriangle,
  Check,
  Copy,
  EllipsisVertical,
  Eye,
  Microscope,
  PawPrint,
  Pencil,
  ShieldAlert,
} from "lucide-react";

import {
  formatPetRegisteredDate,
  getPetInitials,
  getReproductiveSeverity,
  getTemperamentSeverity,
  hasNonEmptyText,
} from "#/client/features/reception/pets/models/pets-table";
import { GhostBadge, NegativeBadge, WarningBadge } from "#/client/shared/components/app-badge";
import { AppCard, AppCardContent, AppCardFooter } from "#/client/shared/components/app-card";
import { AppPagination } from "#/client/shared/components/app-pagination";
import { AppSpeciesIcon } from "#/client/shared/components/app-species-icon";
import { formatMicrochipNumber, formatPetAge } from "#/client/shared/helpers/formatters";
import { Avatar, AvatarFallback, AvatarImage } from "#/client/shared/shadcn/components/ui/avatar";
import { Badge } from "#/client/shared/shadcn/components/ui/badge";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/client/shared/shadcn/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/client/shared/shadcn/components/ui/empty";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "#/client/shared/shadcn/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/client/shared/shadcn/components/ui/table";

import { usePetsTable } from "#/client/features/reception/pets/hooks/use-pets-table";
import { AppRowsPerPageSelector } from "#/client/shared/components/app-rows-per-page-selector";

export function PetsListView() {
  const {
    paginatedPets,
    totalCount,
    isEmptyDataset,
    hasActiveFilter,
    clearFilters,
    pagination,
    hasColumn,
    visibleColSpan,
    speciesCodeById,
    copiedMicrochipPetId,
    copyMicrochip,
    setEditingPet,
  } = usePetsTable();

  return (
    <AppCard className="col-span-full">
      <AppCardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-52">Pet</TableHead>
              {hasColumn("speciesBreed") ? (
                <TableHead className="min-w-44">Species / Breed</TableHead>
              ) : null}
              {hasColumn("age") ? <TableHead>Age</TableHead> : null}
              {hasColumn("weight") ? <TableHead className="text-right">Weight</TableHead> : null}
              {hasColumn("allergies") ? (
                <TableHead className="min-w-44">Allergies</TableHead>
              ) : null}
              {hasColumn("owner") ? <TableHead className="min-w-40">Owner</TableHead> : null}
              {hasColumn("sexReproductive") ? <TableHead>Sex / Neutered</TableHead> : null}
              {hasColumn("temperament") ? <TableHead>Temperament</TableHead> : null}
              {hasColumn("microchip") ? (
                <TableHead className="min-w-44">Microchip</TableHead>
              ) : null}
              {hasColumn("color") ? <TableHead>Color</TableHead> : null}
              {hasColumn("medicalNotes") ? (
                <TableHead className="min-w-48">Medical Notes</TableHead>
              ) : null}
              {hasColumn("status") ? <TableHead>Status</TableHead> : null}
              {hasColumn("createdAt") ? <TableHead>Registered</TableHead> : null}
              <TableHead className="sticky right-0 z-10 w-0 p-0 pointer-coarse:w-auto pointer-coarse:px-3">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColSpan} className="p-0">
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
                </TableCell>
              </TableRow>
            ) : (
              paginatedPets.map((pet) => (
                <TableRow key={pet.id} className="group/row">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9 shrink-0">
                        <AvatarImage src={pet.photo} alt={pet.petName} />
                        <AvatarFallback className="text-xs font-medium">
                          {getPetInitials(pet.petName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium text-foreground">{pet.petName}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {pet.petCode}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {hasColumn("speciesBreed") ? (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AppSpeciesIcon
                          code={speciesCodeById.get(pet.speciesId)}
                          className="size-4 shrink-0 text-muted-foreground"
                        />
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-medium text-foreground">
                            {pet.speciesName}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {pet.breedName}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  ) : null}

                  {hasColumn("age") ? (
                    <TableCell className="text-foreground">{formatPetAge(pet)}</TableCell>
                  ) : null}

                  {hasColumn("weight") ? (
                    <TableCell className="text-right font-medium text-foreground">
                      {pet.weight}{" "}
                      <span className="text-xs font-normal text-muted-foreground">kg</span>
                    </TableCell>
                  ) : null}

                  {hasColumn("allergies") ? (
                    <TableCell>
                      {hasNonEmptyText(pet.allergies) ? (
                        <Popover>
                          <PopoverTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="xs"
                                className="h-auto max-w-48 p-0"
                                aria-label={`Read full allergy record for ${pet.petName}`}
                              />
                            }
                          >
                            <NegativeBadge className="max-w-44 gap-1">
                              <AlertTriangle className="shrink-0" aria-hidden="true" />
                              <span className="truncate">{pet.allergies}</span>
                            </NegativeBadge>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-72">
                            <PopoverHeader>
                              <PopoverTitle className="text-sm">
                                Allergy Record — {pet.petName}
                              </PopoverTitle>
                              <PopoverDescription className="text-xs text-foreground">
                                {pet.allergies}
                              </PopoverDescription>
                            </PopoverHeader>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </TableCell>
                  ) : null}

                  {hasColumn("owner") ? (
                    <TableCell>
                      <span className="block max-w-44 truncate font-medium text-foreground">
                        {pet.ownerName}
                      </span>
                    </TableCell>
                  ) : null}

                  {hasColumn("sexReproductive") ? (
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary">{pet.sex}</Badge>
                        {getReproductiveSeverity(pet.reproductiveStatus) === "warning" ? (
                          <WarningBadge>{pet.reproductiveStatus}</WarningBadge>
                        ) : (
                          <Badge variant="outline">{pet.reproductiveStatus}</Badge>
                        )}
                      </div>
                    </TableCell>
                  ) : null}

                  {hasColumn("temperament") ? (
                    <TableCell>
                      {getTemperamentSeverity(pet.temperament) === "danger" ? (
                        <NegativeBadge className="gap-1">
                          <ShieldAlert aria-hidden="true" />
                          <span>{pet.temperament}</span>
                        </NegativeBadge>
                      ) : getTemperamentSeverity(pet.temperament) === "warning" ? (
                        <WarningBadge className="gap-1">
                          <AlertTriangle aria-hidden="true" />
                          <span>{pet.temperament}</span>
                        </WarningBadge>
                      ) : (
                        <GhostBadge>{pet.temperament}</GhostBadge>
                      )}
                    </TableCell>
                  ) : null}

                  {hasColumn("microchip") ? (
                    <TableCell>
                      {hasNonEmptyText(pet.microchipNumber) ? (
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs text-foreground">
                            {formatMicrochipNumber(pet.microchipNumber)}
                          </span>
                          <Button
                            type="button"
                            size="icon-xs"
                            variant="ghost"
                            aria-label={`Copy microchip number for ${pet.petName}`}
                            onClick={() => void copyMicrochip(pet.id, pet.microchipNumber)}
                          >
                            {copiedMicrochipPetId === pet.id ? (
                              <Check className="text-primary" aria-hidden="true" />
                            ) : (
                              <Copy aria-hidden="true" />
                            )}
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  ) : null}

                  {hasColumn("color") ? (
                    <TableCell>
                      {hasNonEmptyText(pet.color) ? (
                        <span className="text-sm text-foreground">{pet.color}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  ) : null}

                  {hasColumn("medicalNotes") ? (
                    <TableCell>
                      {hasNonEmptyText(pet.medicalNotes) ? (
                        <Popover>
                          <PopoverTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="xs"
                                className="h-auto max-w-48 justify-start px-1.5 py-0.5 text-left font-normal"
                                aria-label={`Read medical notes for ${pet.petName}`}
                              />
                            }
                          >
                            <span className="truncate text-xs text-foreground">
                              {pet.medicalNotes}
                            </span>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-80">
                            <PopoverHeader>
                              <PopoverTitle className="text-sm">
                                Medical Notes — {pet.petName}
                              </PopoverTitle>
                              <PopoverDescription className="text-xs whitespace-pre-wrap text-foreground">
                                {pet.medicalNotes}
                              </PopoverDescription>
                            </PopoverHeader>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  ) : null}

                  {hasColumn("status") ? (
                    <TableCell>
                      <Badge variant="secondary">{pet.status}</Badge>
                    </TableCell>
                  ) : null}

                  {hasColumn("createdAt") ? (
                    <TableCell className="text-xs text-muted-foreground">
                      {formatPetRegisteredDate(pet.createdAt)}
                    </TableCell>
                  ) : null}

                  <TableCell className="sticky right-0 z-10 w-0 p-0 text-right align-middle pointer-coarse:w-auto pointer-coarse:px-3">
                    <div className="relative flex items-center justify-end">
                      <div
                        className={cn(
                          "pointer-events-none absolute right-3 flex translate-x-1 items-center gap-1 rounded-full p-1 opacity-0 shadow-md/10 inset-shadow-sm/5 backdrop-blur-xs transition duration-150 ease-out motion-reduce:transition-none",
                          "group-hover/row:pointer-events-auto group-hover/row:translate-x-0 group-hover/row:opacity-100",
                          "group-focus-within/row:pointer-events-auto group-focus-within/row:translate-x-0 group-focus-within/row:opacity-100 dark:ring-1 dark:ring-border",
                          "group-has-[[data-slot=dropdown-menu-trigger][aria-expanded=true]]/row:pointer-events-auto group-has-[[data-slot=dropdown-menu-trigger][aria-expanded=true]]/row:translate-x-0 group-has-[[data-slot=dropdown-menu-trigger][aria-expanded=true]]/row:opacity-100",
                          "pointer-coarse:pointer-events-auto pointer-coarse:static pointer-coarse:translate-x-0 pointer-coarse:bg-transparent pointer-coarse:p-0.5 pointer-coarse:opacity-100 pointer-coarse:shadow-sm pointer-coarse:backdrop-blur-xs"
                        )}
                      >
                        <Button
                          type="button"
                          size="xs"
                          variant="ghost"
                          className="bg-background! dark:bg-secondary!"
                        >
                          <Eye data-icon="inline-start" aria-hidden="true" />
                          <span>View Profile</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                type="button"
                                size="icon-xs"
                                variant="ghost"
                                aria-label={`More actions for ${pet.petName}`}
                              />
                            }
                          >
                            <EllipsisVertical aria-hidden="true" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-transparent backdrop-blur-md"
                          >
                            <DropdownMenuGroup>
                              <DropdownMenuItem onClick={() => setEditingPet(pet)}>
                                <Pencil aria-hidden="true" />
                                <span>Edit Profile</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Microscope aria-hidden="true" />
                                <span>Exam EMR</span>
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AppCardContent>

      {totalCount > 0 ? (
        <AppCardFooter className="flex-wrap gap-3 py-3">
          <AppRowsPerPageSelector pagination={pagination} itemLabel="pets" />

          <AppPagination
            className="ml-auto"
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            canGoPrevious={pagination.canGoPrevious}
            canGoNext={pagination.canGoNext}
            onPageChange={pagination.goToPage}
            goToPreviousPage={pagination.goToPreviousPage}
            goToNextPage={pagination.goToNextPage}
          />
        </AppCardFooter>
      ) : null}
    </AppCard>
  );
}
