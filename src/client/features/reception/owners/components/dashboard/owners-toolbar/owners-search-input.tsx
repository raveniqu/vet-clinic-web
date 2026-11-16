import { Search, X } from "lucide-react";
import {
  InputGroupAddon,
  InputGroupButton,
} from "#/client/shared/shadcn/components/ui/input-group";
import { useOwnersSearch } from "#/client/features/reception/owners/hooks/use-owner-search";
import { AppInputGroup, AppInputGroupInput } from "#/client/shared/components/app-input-group";

export function OwnersSearchInput() {
  const { inputRef, searchTerm, handleSearchChange, hasSearchTerm, clearSearch } =
    useOwnersSearch();
  return (
    <AppInputGroup className="col-span-7">
      <AppInputGroupInput
        ref={inputRef}
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Name, phone, LINE ID, or tax ID..."
        aria-label="Search owners"
      />
      <InputGroupAddon>
        <Search className="size-3.5 text-muted-foreground sm:size-4" aria-hidden="true" />
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
