import { AlertTriangle } from "lucide-react";
import { NegativeBadge } from "#/client/shared/components/app-badge";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "#/client/shared/shadcn/components/ui/popover";
import { usePetRowActions } from "#/client/features/reception/pets/hooks/use-pet-row-actions";
import { hasNonEmptyText } from "#/client/features/reception/pets/models/pets-table";

export function PetAllergiesPopover() {
  const { pet } = usePetRowActions();

  if (!hasNonEmptyText(pet.allergies)) {
    return <span className="text-xs text-muted-foreground">None</span>;
  }

  return (
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
          <PopoverTitle className="text-sm">Allergy Record — {pet.petName}</PopoverTitle>
          <PopoverDescription className="text-xs text-foreground">
            {pet.allergies}
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}
