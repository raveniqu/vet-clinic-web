import type { ChangeEvent, KeyboardEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	useFormErrors,
	useFormValues,
} from "#/client/shared/hooks/use-wizard-form";
import { usePetFormContext } from "../contexts/pet-form.context";
import type {
	PetBreedOption,
	PetSpeciesOption,
} from "../models/pet-form.model";
import {
	INITIAL_BREED_SEEDS,
	INITIAL_SPECIES_SEEDS,
} from "../models/pet-form.model";

const PET_SPECIES_BREED_KEYS = [
	"speciesId",
	"breedId",
	"customBreedName",
] as const;
const PET_SPECIES_BREED_ERROR_KEYS = ["speciesId", "breedId"] as const;

export function usePetSpeciesBreed() {
	const { form, setMultipleFields } = usePetFormContext();
	const values = useFormValues(form, PET_SPECIES_BREED_KEYS);
	const stepErrors = useFormErrors(form, PET_SPECIES_BREED_ERROR_KEYS);

	const [localCustomSpecies, setLocalCustomSpecies] = useState<
		PetSpeciesOption[]
	>([]);
	const [localCustomBreeds, setLocalCustomBreeds] = useState<PetBreedOption[]>(
		[],
	);

	const allSpecies = useMemo(
		() => [...INITIAL_SPECIES_SEEDS, ...localCustomSpecies],
		[localCustomSpecies],
	);

	const breedsForSpecies = useMemo(
		() => [
			...INITIAL_BREED_SEEDS.filter(
				(breed) => breed.speciesId === values.speciesId,
			),
			...localCustomBreeds.filter(
				(breed) => breed.speciesId === values.speciesId,
			),
		],
		[localCustomBreeds, values.speciesId],
	);

	const [isExoticMode, setIsExoticMode] = useState(() => values.speciesId > 2);

	useEffect(() => {
		setIsExoticMode(values.speciesId > 2);
	}, [values.speciesId]);

	const [isExoticPopoverOpen, setIsExoticPopoverOpen] = useState(false);
	const [exoticSearchQuery, setExoticSearchQuery] = useState("");
	const [isAddingNewSpeciesInline, setIsAddingNewSpeciesInline] =
		useState(false);
	const [newSpeciesName, setNewSpeciesName] = useState("");

	const [isBreedPopoverOpen, setIsBreedPopoverOpen] = useState(false);
	const [breedSearchQuery, setBreedSearchQuery] = useState("");
	const [isAddingCustomBreedInline, setIsAddingCustomBreedInline] =
		useState(false);
	const [newCustomBreedInput, setNewCustomBreedInput] = useState("");

	const filteredExoticSpecies = useMemo(() => {
		const list = allSpecies.filter((species) => species.id > 2);
		if (!exoticSearchQuery.trim()) return list;
		const query = exoticSearchQuery.toLowerCase().trim();
		return list.filter(
			(species) =>
				species.name.toLowerCase().includes(query) ||
				species.nameTh.toLowerCase().includes(query) ||
				species.group.toLowerCase().includes(query),
		);
	}, [allSpecies, exoticSearchQuery]);

	const filteredBreeds = useMemo(() => {
		if (!breedSearchQuery.trim()) return breedsForSpecies;
		const query = breedSearchQuery.toLowerCase().trim();
		return breedsForSpecies.filter((breed) =>
			breed.breedName.toLowerCase().includes(query),
		);
	}, [breedsForSpecies, breedSearchQuery]);

	const selectedSpecies = allSpecies.find(
		(species) => species.id === values.speciesId,
	);
	const isDog = values.speciesId === 1;
	const isCat = values.speciesId === 2;

	const selectedBreed = breedsForSpecies.find(
		(breed) => breed.id === values.breedId,
	);
	const currentBreedLabel =
		selectedBreed?.breedName || values.customBreedName || "เลือกหรือค้นหาสายพันธุ์";

	const handleSelectSpecies = useCallback(
		(speciesId: number, fallbackBreedId?: number) => {
			const relevantBreeds = [
				...INITIAL_BREED_SEEDS.filter((breed) => breed.speciesId === speciesId),
				...localCustomBreeds.filter((breed) => breed.speciesId === speciesId),
			];
			const defaultBreed =
				fallbackBreedId ??
				relevantBreeds[0]?.id ??
				(speciesId === 1 ? 101 : speciesId === 2 ? 201 : 301);

			setMultipleFields({
				speciesId,
				breedId: defaultBreed,
				customBreedName: "",
			});
			setIsExoticPopoverOpen(false);
		},
		[localCustomBreeds, setMultipleFields],
	);

	const handleEnterExoticMode = useCallback(() => {
		setIsExoticMode(true);
		if (values.speciesId <= 2) {
			const firstExotic = allSpecies.find((species) => species.id > 2);
			if (firstExotic) {
				handleSelectSpecies(firstExotic.id);
			}
		}
	}, [allSpecies, handleSelectSpecies, values.speciesId]);

	const handleLeaveExoticMode = useCallback(() => {
		setIsExoticMode(false);
		handleSelectSpecies(1);
	}, [handleSelectSpecies]);

	const handleSelectBreed = useCallback(
		(breedId: number) => {
			const matched = breedsForSpecies.find((breed) => breed.id === breedId);
			setMultipleFields({
				breedId,
				customBreedName: matched?.isCustom ? matched.breedName : "",
			});
			setIsBreedPopoverOpen(false);
		},
		[breedsForSpecies, setMultipleFields],
	);

	const handleCreateCustomBreed = useCallback(
		(name: string) => {
			const trimmed = name.trim();
			if (!trimmed) return;

			const customId = Date.now();
			const customItem: PetBreedOption = {
				id: customId,
				speciesId: values.speciesId,
				breedName: trimmed,
				isCustom: true,
			};

			setLocalCustomBreeds((prev) => [...prev, customItem]);
			setMultipleFields({
				breedId: customId,
				customBreedName: trimmed,
			});
			setBreedSearchQuery("");
			setIsAddingCustomBreedInline(false);
			setNewCustomBreedInput("");
			setIsBreedPopoverOpen(false);
		},
		[setMultipleFields, values.speciesId],
	);

	const handleCreateCustomSpecies = useCallback(() => {
		const trimmed = newSpeciesName.trim();
		if (!trimmed) return;

		const newSpeciesId = Date.now();
		const defaultCustomBreedId = newSpeciesId + 1;
		const newSpeciesItem: PetSpeciesOption = {
			id: newSpeciesId,
			code: trimmed.toUpperCase().replace(/\s+/g, "_"),
			name: trimmed,
			nameTh: trimmed,
			group: "OTHER",
		};
		const defaultBreedItem: PetBreedOption = {
			id: defaultCustomBreedId,
			speciesId: newSpeciesId,
			breedName: "ไม่ระบุ / พันธุ์ผสม",
			isCustom: true,
		};

		setLocalCustomSpecies((prev) => [...prev, newSpeciesItem]);
		setLocalCustomBreeds((prev) => [...prev, defaultBreedItem]);
		handleSelectSpecies(newSpeciesId, defaultCustomBreedId);
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

	const handleExoticSearchChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setExoticSearchQuery(event.target.value);
		},
		[],
	);

	const handleBreedSearchChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setBreedSearchQuery(event.target.value);
		},
		[],
	);

	const handleNewSpeciesNameChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setNewSpeciesName(event.target.value);
		},
		[],
	);

	const handleNewCustomBreedInputChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setNewCustomBreedInput(event.target.value);
		},
		[],
	);

	const handleBreedSearchKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key !== "Escape") {
				event.stopPropagation();
			}
		},
		[],
	);

	const handleExoticSearchKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key !== "Escape") {
				event.stopPropagation();
			}
		},
		[],
	);

	const handleNewSpeciesNameKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Enter") {
				event.preventDefault();
				event.stopPropagation();
				handleCreateCustomSpecies();
			} else if (event.key !== "Escape") {
				event.stopPropagation();
			}
		},
		[handleCreateCustomSpecies],
	);

	const handleCustomBreedInputKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Enter") {
				event.preventDefault();
				event.stopPropagation();
				handleCreateCustomBreed(newCustomBreedInput);
			} else if (event.key !== "Escape") {
				event.stopPropagation();
			}
		},
		[handleCreateCustomBreed, newCustomBreedInput],
	);

	const isQuickAddCustomBreedVisible = Boolean(
		breedSearchQuery.trim() &&
			!breedsForSpecies.some(
				(breed) =>
					breed.breedName.toLowerCase() ===
					breedSearchQuery.trim().toLowerCase(),
			),
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
