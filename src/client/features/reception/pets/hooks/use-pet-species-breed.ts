import { useQuery } from "@tanstack/react-query";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  breedsBySpeciesQueryOptions,
  speciesQueryOptions,
} from "#/client/caches/pets/queries/pets.query";
import { useAddNewPetFormContext } from "#/client/features/reception/pets/contexts/add-new-pet-form-provider";
import { useFormErrors, useFormValues } from "#/client/shared/hooks/use-wizard-form";
import type { BreedItem, SpeciesItem } from "#/shared/schemas/pet.schema";

const PET_SPECIES_BREED_KEYS = ["speciesId", "breedId", "customBreedName"] as const;
const PET_SPECIES_BREED_ERROR_KEYS = ["speciesId", "breedId"] as const;

export function usePetSpeciesBreed() {
  const { form, setMultipleFields } = useAddNewPetFormContext();
  const values = useFormValues(form, PET_SPECIES_BREED_KEYS);
  const stepErrors = useFormErrors(form, PET_SPECIES_BREED_ERROR_KEYS);

  const { data: fetchedSpecies = [] } = useQuery(speciesQueryOptions());
  const { data: fetchedBreeds = [] } = useQuery(breedsBySpeciesQueryOptions(values.speciesId));

  // Local state for dynamically added custom breeds/species during session
  const [localCustomSpecies, setLocalCustomSpecies] = useState<SpeciesItem[]>([]);
  const [localCustomBreeds, setLocalCustomBreeds] = useState<BreedItem[]>([]);

  const allSpecies = useMemo(
    () => [...fetchedSpecies, ...localCustomSpecies],
    [fetchedSpecies, localCustomSpecies]
  );

  const breedsForSpecies = useMemo(
    () => [...fetchedBreeds, ...localCustomBreeds.filter((b) => b.speciesId === values.speciesId)],
    [fetchedBreeds, localCustomBreeds, values.speciesId]
  );

  const [isExoticMode, setIsExoticMode] = useState(() => values.speciesId > 2);

  useEffect(() => {
    setIsExoticMode(values.speciesId > 2);
  }, [values.speciesId]);
  const [isExoticPopoverOpen, setIsExoticPopoverOpen] = useState(false);
  const [exoticSearchQuery, setExoticSearchQuery] = useState("");
  const [isAddingNewSpeciesInline, setIsAddingNewSpeciesInline] = useState(false);
  const [newSpeciesName, setNewSpeciesName] = useState("");

  const [isBreedPopoverOpen, setIsBreedPopoverOpen] = useState(false);
  const [breedSearchQuery, setBreedSearchQuery] = useState("");
  const [isAddingCustomBreedInline, setIsAddingCustomBreedInline] = useState(false);
  const [newCustomBreedInput, setNewCustomBreedInput] = useState("");

  // Filter exotic species (id > 2)
  const filteredExoticSpecies = useMemo(() => {
    const list = allSpecies.filter((s) => s.id > 2);
    if (!exoticSearchQuery.trim()) return list;
    const q = exoticSearchQuery.toLowerCase().trim();
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.nameTh.toLowerCase().includes(q) ||
        s.group.toLowerCase().includes(q)
    );
  }, [allSpecies, exoticSearchQuery]);

  // Filter breeds
  const filteredBreeds = useMemo(() => {
    if (!breedSearchQuery.trim()) return breedsForSpecies;
    const q = breedSearchQuery.toLowerCase().trim();
    return breedsForSpecies.filter((b) => b.breedName.toLowerCase().includes(q));
  }, [breedsForSpecies, breedSearchQuery]);

  // Active species details
  const selectedSpecies = allSpecies.find((s) => s.id === values.speciesId);
  const isDog = values.speciesId === 1;
  const isCat = values.speciesId === 2;

  // Selected breed label
  const selectedBreed = breedsForSpecies.find((b) => b.id === values.breedId);
  const currentBreedLabel =
    selectedBreed?.breedName || values.customBreedName || "Select or search breed";

  const handleSelectSpecies = useCallback(
    (speciesId: number) => {
      // Reset breed for newly selected species atomically
      const relevantBreeds = [
        ...fetchedBreeds,
        ...localCustomBreeds.filter((b) => b.speciesId === speciesId),
      ];
      const defaultBreed =
        relevantBreeds[0]?.id ?? (speciesId === 1 ? 101 : speciesId === 2 ? 201 : 301);

      setMultipleFields({
        speciesId,
        breedId: defaultBreed,
        customBreedName: "",
      });
      setIsExoticPopoverOpen(false);
    },
    [fetchedBreeds, localCustomBreeds, setMultipleFields]
  );

  const handleEnterExoticMode = useCallback(() => {
    setIsExoticMode(true);
    if (values.speciesId <= 2) {
      const firstExotic = allSpecies.find((s) => s.id > 2);
      if (firstExotic) {
        handleSelectSpecies(firstExotic.id);
      }
    }
  }, [allSpecies, handleSelectSpecies, values.speciesId]);

  const handleLeaveExoticMode = useCallback(() => {
    setIsExoticMode(false);
    handleSelectSpecies(1); // Default back to Dog
  }, [handleSelectSpecies]);

  const handleSelectBreed = useCallback(
    (breedId: number) => {
      setMultipleFields({
        breedId,
        customBreedName: "",
      });
      setIsBreedPopoverOpen(false);
    },
    [setMultipleFields]
  );

  const handleCreateCustomBreed = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;

      const fallbackId = breedsForSpecies[0]?.id ?? 101;
      const customItem: BreedItem = {
        id: Date.now(),
        speciesId: values.speciesId,
        breedName: trimmed,
        isCustom: true,
      };

      setLocalCustomBreeds((prev) => [...prev, customItem]);
      setMultipleFields({
        breedId: fallbackId,
        customBreedName: trimmed,
      });
      setBreedSearchQuery("");
      setIsBreedPopoverOpen(false);
    },
    [breedsForSpecies, setMultipleFields, values.speciesId]
  );

  const handleCreateCustomSpecies = useCallback(() => {
    const enName = newSpeciesName.trim();
    if (!enName) return;

    const newId = Date.now();
    const newSpeciesItem: SpeciesItem = {
      id: newId,
      code: enName.toUpperCase().replace(/\s+/g, "_"),
      name: enName,
      nameTh: enName,
      group: "OTHER",
      icon: "PawPrint",
    };

    setLocalCustomSpecies((prev) => [...prev, newSpeciesItem]);
    handleSelectSpecies(newId);
    setIsAddingNewSpeciesInline(false);
    setNewSpeciesName("");
    setExoticSearchQuery("");
    setIsExoticPopoverOpen(false);
  }, [handleSelectSpecies, newSpeciesName]);

  const handleStartAddNewSpecies = useCallback(() => {
    setIsAddingNewSpeciesInline(true);
    setNewSpeciesName(exoticSearchQuery.trim());
  }, [exoticSearchQuery]);

  const handleCancelNewSpeciesInline = useCallback(() => {
    setIsAddingNewSpeciesInline(false);
    setNewSpeciesName("");
  }, []);

  const handleStartAddCustomBreed = useCallback(() => {
    setIsAddingCustomBreedInline(true);
    setNewCustomBreedInput("");
  }, []);

  const handleCancelCustomBreedInline = useCallback(() => {
    setIsAddingCustomBreedInline(false);
    setNewCustomBreedInput("");
  }, []);

  const handleExoticSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setExoticSearchQuery(e.target.value);
  }, []);

  const handleBreedSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setBreedSearchQuery(e.target.value);
  }, []);

  const handleNewSpeciesNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewSpeciesName(e.target.value);
  }, []);

  const handleNewCustomBreedInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewCustomBreedInput(e.target.value);
  }, []);

  const handleBreedSearchKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Escape") {
      e.stopPropagation();
    }
  }, []);

  const handleExoticSearchKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Escape") {
      e.stopPropagation();
    }
  }, []);

  const handleNewSpeciesNameKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        handleCreateCustomSpecies();
      } else if (e.key !== "Escape") {
        e.stopPropagation();
      }
    },
    [handleCreateCustomSpecies]
  );

  const handleCustomBreedInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        handleCreateCustomBreed(newCustomBreedInput);
        setIsAddingCustomBreedInline(false);
        setNewCustomBreedInput("");
      } else if (e.key !== "Escape") {
        e.stopPropagation();
      }
    },
    [handleCreateCustomBreed, newCustomBreedInput]
  );

  const isQuickAddCustomBreedVisible = Boolean(
    breedSearchQuery.trim() &&
      !breedsForSpecies.some(
        (b) => b.breedName.toLowerCase() === breedSearchQuery.trim().toLowerCase()
      )
  );

  return {
    speciesId: values.speciesId,
    selectedSpecies,
    isDog,
    isCat,
    isExoticMode,
    isExoticPopoverOpen,
    setIsExoticPopoverOpen,
    exoticSearchQuery,
    filteredExoticSpecies,
    isAddingNewSpeciesInline,
    newSpeciesName,
    speciesError: stepErrors.speciesId,

    breedId: values.breedId,
    currentBreedLabel,
    breedsForSpecies,
    filteredBreeds,
    isBreedPopoverOpen,
    setIsBreedPopoverOpen,
    breedSearchQuery,
    isAddingCustomBreedInline,
    newCustomBreedInput,
    isQuickAddCustomBreedVisible,
    breedError: stepErrors.breedId,

    handleSelectSpecies,
    handleEnterExoticMode,
    handleLeaveExoticMode,
    handleSelectBreed,
    handleCreateCustomBreed,
    handleCreateCustomSpecies,
    handleStartAddNewSpecies,
    handleCancelNewSpeciesInline,
    handleStartAddCustomBreed,
    handleCancelCustomBreedInline,
    handleExoticSearchChange,
    handleBreedSearchChange,
    handleNewSpeciesNameChange,
    handleNewCustomBreedInputChange,
    handleBreedSearchKeyDown,
    handleCustomBreedInputKeyDown,
    handleExoticSearchKeyDown,
    handleNewSpeciesNameKeyDown,
  };
}
