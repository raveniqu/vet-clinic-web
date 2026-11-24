import { Dot, Undo2 } from "lucide-react";
import { GhostBadge, InfoBadge, SuccessBadge } from "#/client/shared/components/app-badge";
import {
  AppDashboardActions,
  AppDashboardDescription,
  AppDashboardFooter,
  AppDashboardHeader,
  AppDashboardRoot,
  AppDashboardTitle,
} from "#/client/shared/components/app-dashboard";
import { AppButtonLink } from "#/client/shared/components/app-link";
import { formatPetAge } from "#/client/shared/helpers/formatters";
import { PetDetailEditButton } from "../components/dashboard/pet-detail-edit-button";
import { PetDetailEditForm } from "../components/form/update/pet-detail-edit-form";
import { PetDetailProvider } from "../contexts/pet-detail.context";
import { usePetDetails } from "../hooks/use-pet-details";
import { PET_SEX_LABEL_MAP, REPRODUCTIVE_STATUS_LABEL_MAP } from "../models/pets-table";

export function PetDetailsScreen() {
  const { pet, isMobile } = usePetDetails();

  return (
    <PetDetailProvider>
      <AppDashboardRoot className="mx-auto max-w-7xl">
        {!isMobile ? (
          <AppButtonLink
            to="/pets"
            size="xs"
            variant="ghost"
            className="w-fit border-0 shadow-md/10 inset-shadow-sm/5"
          >
            <Undo2 aria-hidden="true" />
            <span>กลับไปหน้ารายชื่อสัตว์เลี้ยง</span>
          </AppButtonLink>
        ) : null}
        <AppDashboardHeader>
          <AppDashboardTitle className="flex flex-wrap items-center gap-2">
            <span>{pet.petName}</span>
          </AppDashboardTitle>
          <AppDashboardDescription asChild className="flex flex-col gap-1.5 sm:gap-3">
            <p className="flex items-center">
              <span>{pet.speciesName}</span>
              <Dot />
              <span>{pet.breedName}</span>
              <Dot />
              <span>{PET_SEX_LABEL_MAP[pet.sex]}</span>
            </p>
            <div className="flex items-center gap-2 p-px sm:gap-3 md:gap-4">
              <SuccessBadge className="md:p-2.5 md:text-sm">{pet.weight} กก.</SuccessBadge>
              <GhostBadge className="md:p-2.5 md:text-sm">{formatPetAge(pet)}</GhostBadge>
              <InfoBadge className="md:p-2.5 md:text-sm">
                {REPRODUCTIVE_STATUS_LABEL_MAP[pet.reproductiveStatus]}
              </InfoBadge>
            </div>
          </AppDashboardDescription>
          <AppDashboardActions>
            <PetDetailEditButton />
          </AppDashboardActions>
        </AppDashboardHeader>
        <AppDashboardFooter>
          <PetDetailEditForm />
        </AppDashboardFooter>
      </AppDashboardRoot>
    </PetDetailProvider>
  );
}
