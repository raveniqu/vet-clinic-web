import type { Cell } from "@tanstack/react-table";
import { PetRowProvider } from "#/client/features/reception/pets/contexts/pet-row.context";
import { usePetsTable } from "#/client/features/reception/pets/hooks/use-pets-table";
import type { dataTableFeatures } from "#/client/shared/components/app-data-table";
import { AppDataTable } from "#/client/shared/components/app-data-table";
import { PAGE_SIZE_OPTIONS } from "#/shared/schemas/pagination.schema";
import type { PetDto } from "#/shared/schemas/pet.schema";
import { PetsTableEmpty } from "../pets-table-empty";
import { PetListCell } from "./pet-list-cell";

export function PetsListView() {
  const { table, isLoading, speciesCodeById, copiedMicrochipPetId, copyMicrochip } = usePetsTable();

  const renderCell = (cell: Cell<typeof dataTableFeatures, PetDto, unknown>) => {
    const pet = cell.row.original;
    const speciesCode = speciesCodeById.get(pet.speciesId);

    return (
      <PetRowProvider
        pet={pet}
        columnId={cell.column.id}
        speciesCode={speciesCode}
        isMicrochipCopied={copiedMicrochipPetId === pet.id}
        onCopyMicrochip={copyMicrochip}
      >
        <PetListCell />
      </PetRowProvider>
    );
  };

  return (
    <AppDataTable
      table={table}
      isLoading={isLoading}
      className="col-span-full"
      emptyState={<PetsTableEmpty />}
      itemLabel="pets"
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      renderCell={renderCell}
    />
  );
}
