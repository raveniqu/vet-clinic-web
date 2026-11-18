import {
  AppDashboardActions,
  AppDashboardContent,
  AppDashboardFooter,
  AppDashboardHeader,
  AppDashboardRoot,
  AppDashboardTitle,
} from "#/client/shared/components/app-dashboard";
import { PetsMainTable } from "../components/dashboard/pets-main-table";
import { PetsSummary } from "../components/dashboard/pets-summary";
import { PetsToolbar } from "../components/dashboard/pets-toolbar";
import { AddNewPetForm } from "../components/form/create/add-new-pet-form";
import { PetOwnerCreateModal } from "../components/form/create/add-new-pet-form/pet-owner-create-modal";
import { PetPhotoQrModal } from "../components/form/create/add-new-pet-form/pet-photo-qr-modal";
import { EditPetForm } from "../components/form/update/edit-pet-form";
import { AddNewPetFormProvider } from "../contexts/add-new-pet-form-provider";
import { PetsProvider } from "../contexts/pets.context";

export function PetsScreen() {
  return (
    <PetsProvider>
      <AppDashboardRoot className="mx-auto max-w-7xl">
        <AppDashboardHeader>
          <AppDashboardTitle>Pet Information</AppDashboardTitle>
          <AppDashboardActions>
            <AddNewPetFormProvider>
              <AddNewPetForm />
              <PetOwnerCreateModal />
              <PetPhotoQrModal />
            </AddNewPetFormProvider>
          </AppDashboardActions>
        </AppDashboardHeader>
        <AppDashboardContent>
          <PetsSummary />
        </AppDashboardContent>
        <AppDashboardContent>
          <PetsToolbar />
        </AppDashboardContent>
        <AppDashboardContent>
          <PetsMainTable />
        </AppDashboardContent>
        <AppDashboardFooter>
          <EditPetForm />
        </AppDashboardFooter>
      </AppDashboardRoot>
    </PetsProvider>
  );
}
