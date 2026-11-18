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

export function PetMedicalNotesPopover() {
  const { pet } = usePetRowActions();

  if (!hasNonEmptyText(pet.medicalNotes)) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
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
        <span className="truncate text-xs text-foreground">{pet.medicalNotes}</span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <PopoverHeader>
          <PopoverTitle className="text-sm">Medical Notes — {pet.petName}</PopoverTitle>
          <PopoverDescription className="text-xs whitespace-pre-wrap text-foreground">
            {pet.medicalNotes}
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}
