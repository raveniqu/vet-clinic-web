import { useMemo } from "react";
import { usePetsDashboardContext } from "../contexts/pets-dashboard-provider";

export function usePets() {
  const {
    allPets,
    filteredPets,
    isLoading,
    isError,
    error,
    hasActiveFilter,
    clearFilters,
    editingPet,
    setEditingPet,
  } = usePetsDashboardContext();

  const metrics = useMemo(() => {
    let totalDogs = 0;
    let totalCats = 0;
    let totalAllergies = 0;

    for (const pet of allPets) {
      if (pet.speciesName === "Dog") {
        totalDogs += 1;
      } else if (pet.speciesName === "Cat") {
        totalCats += 1;
      }

      if (pet.allergies && pet.allergies.trim() !== "") {
        totalAllergies += 1;
      }
    }

    return {
      totalPets: allPets.length,
      totalDogs,
      totalCats,
      totalAllergies,
    };
  }, [allPets]);

  return {
    allPets,
    filteredPets,
    isLoading,
    isError,
    error,
    hasActiveFilter,
    clearFilters,
    editingPet,
    setEditingPet,
    ...metrics,
  };
}
