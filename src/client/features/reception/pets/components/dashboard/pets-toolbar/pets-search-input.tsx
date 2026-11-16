import { Search, X } from "lucide-react";
import { usePetSearch } from "#/client/features/reception/pets/hooks/use-pet-search";
import { AppInputGroup, AppInputGroupInput } from "#/client/shared/components/app-input-group";
import {
  InputGroupAddon,
  InputGroupButton,
} from "#/client/shared/shadcn/components/ui/input-group";

export function PetSearchInput() {
  const { inputRef, searchTerm, handleSearchChange, hasSearchTerm, clearSearch } = usePetSearch();

  return (
    <AppInputGroup>
      <AppInputGroupInput
        ref={inputRef}
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full placeholder:text-sm md:w-fit"
        placeholder="Search by name, breed, color, or species"
        aria-label="Search pets"
      />
      <InputGroupAddon>
        <Search aria-hidden="true" />
      </InputGroupAddon>
      {hasSearchTerm ? (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            size="icon-xs"
            variant="ghost"
            aria-label="Clear search"
            onClick={clearSearch}
          >
            <X aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
      ) : null}
    </AppInputGroup>
  );
}
