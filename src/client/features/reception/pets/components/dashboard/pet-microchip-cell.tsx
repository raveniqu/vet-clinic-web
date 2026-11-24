import { Check, Copy } from "lucide-react";
import { formatMicrochipNumber } from "#/client/shared/helpers/formatters";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import { usePetRowActions } from "#/client/features/reception/pets/hooks/use-pet-row-actions";
import { hasNonEmptyText } from "#/client/features/reception/pets/models/pets-table";

export function PetMicrochipCell() {
  const { pet, isMicrochipCopied, handleCopyMicrochip } = usePetRowActions();

  if (!hasNonEmptyText(pet.microchipNumber)) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-xs text-foreground">
        {formatMicrochipNumber(pet.microchipNumber)}
      </span>
      <Button
        type="button"
        size="icon-xs"
        variant="ghost"
        aria-label={`คัดลอกหมายเลขไมโครชิปของ ${pet.petName}`}
        onClick={handleCopyMicrochip}
      >
        {isMicrochipCopied ? (
          <Check className="text-primary" aria-hidden="true" />
        ) : (
          <Copy aria-hidden="true" />
        )}
      </Button>
    </div>
  );
}
