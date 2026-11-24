import { AlertTriangle, ShieldAlert } from "lucide-react";
import { usePetRowActions } from "#/client/features/reception/pets/hooks/use-pet-row-actions";
import {
  formatPetRegisteredDate,
  getPetInitials,
  getPetStatusLabel,
  getReproductiveSeverity,
  getTemperamentSeverity,
  hasNonEmptyText,
  PET_SEX_LABEL_MAP,
  REPRODUCTIVE_STATUS_LABEL_MAP,
  TEMPERAMENT_LABEL_MAP,
} from "#/client/features/reception/pets/models/pets-table";
import { GhostBadge, NegativeBadge, WarningBadge } from "#/client/shared/components/app-badge";
import { AppSpeciesIcon } from "#/client/shared/components/app-species-icon";
import { formatPetAge } from "#/client/shared/helpers/formatters";
import { Avatar, AvatarFallback, AvatarImage } from "#/client/shared/shadcn/components/ui/avatar";
import { Badge } from "#/client/shared/shadcn/components/ui/badge";
import { PetAllergiesPopover } from "../pet-allergies-popover";
import { PetMedicalNotesPopover } from "../pet-medical-notes-popover";
import { PetMicrochipCell } from "../pet-microchip-cell";
import { PetRowActions } from "../pet-row-actions";

export function PetListCell() {
  const { pet, columnId, speciesCode } = usePetRowActions();

  switch (columnId) {
    case "pet":
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9 shrink-0">
            <AvatarImage src={pet.photo} alt={pet.petName} />
            <AvatarFallback className="text-xs font-medium">
              {getPetInitials(pet.petName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium text-foreground">{pet.petName}</span>
            <span className="font-mono text-xs text-muted-foreground">{pet.petCode}</span>
          </div>
        </div>
      );

    case "speciesBreed":
      return (
        <div className="flex items-center gap-2">
          <AppSpeciesIcon code={speciesCode} className="size-4 shrink-0 text-muted-foreground" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium text-foreground">{pet.speciesName}</span>
            <span className="truncate text-xs text-muted-foreground">{pet.breedName}</span>
          </div>
        </div>
      );

    case "age":
      return formatPetAge(pet);

    case "weight":
      return (
        <>
          {pet.weight} <span className="text-xs font-normal text-muted-foreground">กก.</span>
        </>
      );

    case "allergies":
      return <PetAllergiesPopover />;

    case "owner":
      return (
        <span className="block max-w-44 truncate font-medium text-foreground">{pet.ownerName}</span>
      );

    case "sexReproductive":
      return (
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary">{PET_SEX_LABEL_MAP[pet.sex]}</Badge>
          {getReproductiveSeverity(pet.reproductiveStatus) === "warning" ? (
            <WarningBadge>{REPRODUCTIVE_STATUS_LABEL_MAP[pet.reproductiveStatus]}</WarningBadge>
          ) : (
            <Badge variant="outline">{REPRODUCTIVE_STATUS_LABEL_MAP[pet.reproductiveStatus]}</Badge>
          )}
        </div>
      );

    case "temperament":
      return getTemperamentSeverity(pet.temperament) === "danger" ? (
        <NegativeBadge className="gap-1">
          <ShieldAlert aria-hidden="true" />
          <span>{TEMPERAMENT_LABEL_MAP[pet.temperament]}</span>
        </NegativeBadge>
      ) : getTemperamentSeverity(pet.temperament) === "warning" ? (
        <WarningBadge className="gap-1">
          <AlertTriangle aria-hidden="true" />
          <span>{TEMPERAMENT_LABEL_MAP[pet.temperament]}</span>
        </WarningBadge>
      ) : (
        <GhostBadge>{TEMPERAMENT_LABEL_MAP[pet.temperament]}</GhostBadge>
      );

    case "microchip":
      return <PetMicrochipCell />;

    case "color":
      return hasNonEmptyText(pet.color) ? (
        <span className="text-sm text-foreground">{pet.color}</span>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      );

    case "medicalNotes":
      return <PetMedicalNotesPopover />;

    case "status":
      return <Badge variant="secondary">{getPetStatusLabel(pet.status)}</Badge>;

    case "createdAt":
      return formatPetRegisteredDate(pet.createdAt);

    case "actions":
      return <PetRowActions />;

    default:
      return null;
  }
}
