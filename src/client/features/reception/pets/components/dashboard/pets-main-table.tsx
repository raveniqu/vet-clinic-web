import { usePetTabs } from "#/client/features/reception/pets/hooks/use-pet-tabs";
import { PetsGridView } from "./pets-main-table/pets-grid-view";
import { PetsListView } from "./pets-main-table/pets-list-view";

export function PetsMainTable() {
  const { effectiveTab } = usePetTabs();

  return (
    <>
      {effectiveTab === "grid" ? <PetsGridView /> : null}
      {effectiveTab === "list" ? <PetsListView /> : null}
    </>
  );
}
