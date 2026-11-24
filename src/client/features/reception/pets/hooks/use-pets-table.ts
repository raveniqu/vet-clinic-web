import type { OnChangeFn, PaginationState } from "@tanstack/react-table";
import { functionalUpdate, useTable } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { speciesQueryOptions } from "#/client/caches/pets/queries/pets.query";
import {
  createAppColumnHelper,
  dataTableFeatures,
} from "#/client/shared/components/app-data-table";
import { useClipboardCopy } from "#/client/shared/hooks/use-clipboard-copy";
import type { PetDto } from "#/shared/schemas/pet.schema";
import { usePetsContext } from "../contexts/pets.context";
import { PET_COLUMN_LABEL_MAP } from "../models/pets-table";
import { usePetsList } from "./use-pets-list";
import { usePetsSearch } from "./use-pets-search";

const columnHelper = createAppColumnHelper<PetDto>();

export const petTableColumns = columnHelper.columns([
  columnHelper.accessor("petName", {
    id: "pet",
    header: PET_COLUMN_LABEL_MAP.pet,
    enableSorting: false,
    meta: {
      headClassName: "min-w-52",
    },
  }),
  columnHelper.accessor("speciesName", {
    id: "speciesBreed",
    header: PET_COLUMN_LABEL_MAP.speciesBreed,
    enableSorting: false,
    meta: {
      headClassName: "min-w-44",
    },
  }),
  columnHelper.accessor("dateOfBirth", {
    id: "age",
    header: PET_COLUMN_LABEL_MAP.age,
    enableSorting: false,
    meta: {
      cellClassName: "text-foreground",
    },
  }),
  columnHelper.accessor("weight", {
    id: "weight",
    header: PET_COLUMN_LABEL_MAP.weight,
    enableSorting: false,
    meta: {
      headClassName: "text-right",
      cellClassName: "text-right font-medium text-foreground",
    },
  }),
  columnHelper.accessor("allergies", {
    id: "allergies",
    header: PET_COLUMN_LABEL_MAP.allergies,
    enableSorting: false,
    meta: {
      headClassName: "min-w-44",
    },
  }),
  columnHelper.accessor("ownerName", {
    id: "owner",
    header: PET_COLUMN_LABEL_MAP.owner,
    enableSorting: false,
    meta: {
      headClassName: "min-w-40",
    },
  }),
  columnHelper.accessor("sex", {
    id: "sexReproductive",
    header: PET_COLUMN_LABEL_MAP.sexReproductive,
    enableSorting: false,
  }),
  columnHelper.accessor("temperament", {
    id: "temperament",
    header: PET_COLUMN_LABEL_MAP.temperament,
    enableSorting: false,
  }),
  columnHelper.accessor("microchipNumber", {
    id: "microchip",
    header: PET_COLUMN_LABEL_MAP.microchip,
    enableSorting: false,
    meta: {
      headClassName: "min-w-44",
    },
  }),
  columnHelper.accessor("color", {
    id: "color",
    header: PET_COLUMN_LABEL_MAP.color,
    enableSorting: false,
  }),
  columnHelper.accessor("medicalNotes", {
    id: "medicalNotes",
    header: PET_COLUMN_LABEL_MAP.medicalNotes,
    enableSorting: false,
    meta: {
      headClassName: "min-w-48",
    },
  }),
  columnHelper.accessor("status", {
    id: "status",
    header: PET_COLUMN_LABEL_MAP.status,
    enableSorting: false,
  }),
  columnHelper.accessor("createdAt", {
    id: "createdAt",
    header: PET_COLUMN_LABEL_MAP.createdAt,
    enableSorting: false,
    meta: {
      cellClassName: "text-xs text-muted-foreground",
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "การดำเนินการ",
    enableSorting: false,
    meta: {
      headClassName: "sticky right-0 z-10 w-0 p-0 pointer-coarse:w-auto pointer-coarse:px-3",
      cellClassName:
        "sticky right-0 z-10 w-0 p-0 text-right align-middle pointer-coarse:w-auto pointer-coarse:px-3",
      headerSrOnly: true,
    },
  }),
]);

export function usePetsTable() {
  const { filteredPets, isLoading } = usePetsList();
  const { page, pageSize, setPage, setPageSize } = usePetsSearch();
  const { columnVisibility } = usePetsContext();
  const { data: speciesList = [] } = useQuery(speciesQueryOptions());
  const { copiedKey: copiedMicrochipPetId, copyValue: copyMicrochip } = useClipboardCopy<string>();

  const speciesCodeById = useMemo(() => {
    const map = new Map<number, string>();
    for (const item of speciesList) {
      map.set(item.id, item.code);
    }
    return map;
  }, [speciesList]);

  const pageCount = Math.max(1, Math.ceil(filteredPets.length / pageSize));
  const safePageIndex = isLoading
    ? Math.max(0, page - 1)
    : Math.min(Math.max(0, page - 1), pageCount - 1);

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: safePageIndex,
      pageSize,
    }),
    [safePageIndex, pageSize]
  );

  const handlePaginationChange = useCallback<OnChangeFn<PaginationState>>(
    (updater) => {
      const next = functionalUpdate(updater, pagination);
      if (next.pageSize !== pageSize) {
        setPageSize(next.pageSize);
        return;
      }

      const nextPage = next.pageIndex + 1;
      if (nextPage !== page) {
        setPage(nextPage);
      }
    },
    [pagination, pageSize, page, setPageSize, setPage]
  );

  const table = useTable({
    features: dataTableFeatures,
    data: filteredPets,
    columns: petTableColumns,
    enableSorting: false,
    autoResetPageIndex: false,
    getRowId: (row) => row.id,
    state: {
      pagination,
      columnVisibility,
    },
    onPaginationChange: handlePaginationChange,
  });

  return {
    table,
    isLoading,
    speciesCodeById,
    copiedMicrochipPetId,
    copyMicrochip,
  };
}
