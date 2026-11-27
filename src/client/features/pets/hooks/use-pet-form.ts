import { useLocation, useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWizardForm } from "#/client/shared/hooks/use-wizard-form";
import { toast } from "#/client/shared/shadcn/components/ui/toast";
import type { OwnerDetailsResponse } from "#/shared/schemas/owners.schema";
import type {
	PetEditableRecord,
	PetFormValues,
	SelectedOwnerSummary,
} from "../models/pet-form.model";
import {
	INITIAL_PET_FORM_VALUES,
	mapOwnerDetailsToSummary,
	mapPetRecordToFormValues,
	PET_STEP_SCHEMAS,
	petFormFullSchema,
	resolvePetFieldStep,
} from "../models/pet-form.model";
import { petsRouteSearchSchema } from "../models/pets-route-search.model";

export interface UsePetFormOptions {
	editablePet?: PetEditableRecord | null;
}

export function usePetForm(options?: UsePetFormOptions) {
	const location = useLocation();
	const navigate = useNavigate();
	const rawSearch = useSearch({ strict: false });

	const isPetsListRoute = location.pathname === "/pets";
	const parsedRouteSearch = petsRouteSearchSchema.safeParse(rawSearch);
	const routeOpenCreate = isPetsListRoute
		? Boolean(
				parsedRouteSearch.success && parsedRouteSearch.data.openAddNewForm,
			)
		: false;
	const routeEditPetId =
		isPetsListRoute && parsedRouteSearch.success
			? (parsedRouteSearch.data.editPetId ?? null)
			: null;

	const [localOpen, setLocalOpen] = useState(false);
	const [localMode, setLocalMode] = useState<"create" | "edit">("create");
	const [localEditPetId, setLocalEditPetId] = useState<number | null>(null);
	const [isNewOwnerModalOpen, setIsNewOwnerModalOpen] = useState(false);
	const [selectedOwnerSummary, setSelectedOwnerSummary] =
		useState<SelectedOwnerSummary | null>(null);

	const editingPetId = isPetsListRoute ? routeEditPetId : localEditPetId;
	const mode: "create" | "edit" = isPetsListRoute
		? routeEditPetId !== null
			? "edit"
			: "create"
		: localMode;
	const isEdit = mode === "edit";
	const isOpen = isPetsListRoute
		? routeOpenCreate || routeEditPetId !== null
		: localOpen;

	const editablePet = options?.editablePet ?? null;
	const submitHandlerRef = useRef<
		((values: PetFormValues) => Promise<void>) | null
	>(null);
	const hydratedKeyRef = useRef<string | null>(null);

	const handleControlledOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (!nextOpen) {
				setIsNewOwnerModalOpen(false);
			}

			if (isPetsListRoute) {
				void navigate({
					to: "/pets",
					search: (prev) => {
						const parsed = petsRouteSearchSchema.safeParse(prev);
						const current = parsed.success
							? parsed.data
							: petsRouteSearchSchema.parse({});
						return {
							...current,
							openAddNewForm: nextOpen ? current.openAddNewForm : undefined,
							editPetId: nextOpen ? current.editPetId : undefined,
						};
					},
					replace: true,
				});
				return;
			}

			setLocalOpen(nextOpen);
			if (!nextOpen) {
				setLocalEditPetId(null);
			}
		},
		[isPetsListRoute, navigate],
	);

	const wizard = useWizardForm<PetFormValues>({
		initialValues: INITIAL_PET_FORM_VALUES,
		resetValues: INITIAL_PET_FORM_VALUES,
		routePath: "/pets",
		isOpenControlled: isOpen,
		onOpenChangeControlled: handleControlledOpenChange,
		stepSchemas: PET_STEP_SCHEMAS,
		fullSchema: petFormFullSchema,
		resolveFieldStep: resolvePetFieldStep,
		onSubmit: async (values) => {
			await submitHandlerRef.current?.(values);
		},
	});

	const {
		form,
		setIsOpen,
		goToStep,
		resetWizardState,
		setFieldValue,
		setMultipleFields,
	} = wizard;

	const resetForm = useCallback(() => {
		setSelectedOwnerSummary(null);
		resetWizardState(INITIAL_PET_FORM_VALUES);
	}, [resetWizardState]);

	const openCreate = useCallback(() => {
		hydratedKeyRef.current = "create";
		setSelectedOwnerSummary(null);
		resetWizardState(INITIAL_PET_FORM_VALUES);

		if (isPetsListRoute) {
			void navigate({
				to: "/pets",
				search: (prev) => {
					const parsed = petsRouteSearchSchema.safeParse(prev);
					const current = parsed.success
						? parsed.data
						: petsRouteSearchSchema.parse({});
					return {
						...current,
						openAddNewForm: true,
						editPetId: undefined,
					};
				},
				replace: true,
			});
			return;
		}

		setLocalMode("create");
		setLocalEditPetId(null);
		setLocalOpen(true);
	}, [isPetsListRoute, navigate, resetWizardState]);

	const openEdit = useCallback(
		(petId: number) => {
			hydratedKeyRef.current = null;

			if (isPetsListRoute) {
				void navigate({
					to: "/pets",
					search: (prev) => {
						const parsed = petsRouteSearchSchema.safeParse(prev);
						const current = parsed.success
							? parsed.data
							: petsRouteSearchSchema.parse({});
						return {
							...current,
							openAddNewForm: undefined,
							editPetId: petId,
						};
					},
					replace: true,
				});
				return;
			}

			setLocalMode("edit");
			setLocalEditPetId(petId);
			setLocalOpen(true);
		},
		[isPetsListRoute, navigate],
	);

	useEffect(() => {
		if (!isOpen) {
			hydratedKeyRef.current = null;
			return;
		}

		if (isEdit && editablePet && editingPetId !== null) {
			const nextHydrationKey = `edit:${editingPetId}`;
			if (hydratedKeyRef.current !== nextHydrationKey) {
				hydratedKeyRef.current = nextHydrationKey;
				resetWizardState(mapPetRecordToFormValues(editablePet));
				setSelectedOwnerSummary(editablePet.ownerSummary ?? null);
			}
			return;
		}

		if (!isEdit && hydratedKeyRef.current !== "create") {
			hydratedKeyRef.current = "create";
			setSelectedOwnerSummary(null);
			resetWizardState(INITIAL_PET_FORM_VALUES);
		}
	}, [isOpen, isEdit, editingPetId, editablePet, resetWizardState]);

	submitHandlerRef.current = async (values: PetFormValues) => {
		if (isEdit && editingPetId !== null) {
			toast.add({
				description: `จำลองการอัปเดตข้อมูลสัตว์เลี้ยง "${values.petName.trim()}" สำเร็จ (รอเชื่อมต่อ Pets API)`,
				type: "success",
			});
			setIsOpen(false);
			return;
		}

		toast.add({
			description: `จำลองการลงทะเบียนสัตว์เลี้ยง "${values.petName.trim()}" สำเร็จ (รอเชื่อมต่อ Pets API)`,
			type: "success",
		});
		setIsOpen(false);
		resetForm();
	};

	const handleOwnerCreated = useCallback(
		(newOwner: OwnerDetailsResponse) => {
			setFieldValue("ownerId", newOwner.ownerId);
			setSelectedOwnerSummary(mapOwnerDetailsToSummary(newOwner));
			setIsNewOwnerModalOpen(false);
		},
		[setFieldValue],
	);

	const retryLoadPet = useCallback(() => {}, []);

	const petCode = isEdit ? (editablePet?.petCode ?? null) : null;
	const isLoadingPet = false;
	const isLoadPetError = false;

	return useMemo(
		() => ({
			form,
			mode,
			isEdit,
			editingPetId,
			petCode,
			isOpen,
			isLoadingPet,
			isLoadPetError,
			currentStep: wizard.currentStep,
			isSubmitting: wizard.isSubmitting,
			selectedOwnerSummary,
			isNewOwnerModalOpen,
			setSelectedOwnerSummary,
			setIsNewOwnerModalOpen,
			openCreate,
			openEdit,
			setIsOpen,
			setFieldValue,
			setMultipleFields,
			nextStep: wizard.nextStep,
			prevStep: wizard.prevStep,
			goToStep,
			submitForm: wizard.submitForm,
			resetForm,
			retryLoadPet,
			handleOwnerCreated,
		}),
		[
			form,
			mode,
			isEdit,
			editingPetId,
			petCode,
			isOpen,
			wizard.currentStep,
			wizard.isSubmitting,
			selectedOwnerSummary,
			isNewOwnerModalOpen,
			openCreate,
			openEdit,
			setIsOpen,
			setFieldValue,
			setMultipleFields,
			wizard.nextStep,
			wizard.prevStep,
			goToStep,
			wizard.submitForm,
			resetForm,
			retryLoadPet,
			handleOwnerCreated,
		],
	);
}
