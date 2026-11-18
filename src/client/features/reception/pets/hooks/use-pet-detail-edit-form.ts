import { usePetDetailContext } from "../contexts/pet-detail.context";
import { usePetDetails } from "./use-pet-details";

export function usePetDetailEditForm() {
  const { pet } = usePetDetails();
  const { isEditOpen, setIsEditOpen, openEditDialog } = usePetDetailContext();

  return {
    pet,
    isEditOpen,
    setIsEditOpen,
    openEditDialog,
  };
}
