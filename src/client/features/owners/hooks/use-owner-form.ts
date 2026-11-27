import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRegisterOwnerMutation } from "#/client/caches/owners/mutates/register-owner.mutate";
import { useUpdateOwnerMutation } from "#/client/caches/owners/mutates/update-owner.mutate";
import { getOwnerByIdQuery } from "#/client/caches/owners/queries/get-owner-by-id.query";
import { parseRpcError } from "#/client/shared/helpers/rpc-error";
import { useWizardForm } from "#/client/shared/hooks/use-wizard-form";
import type { OwnerDetailsResponse } from "#/shared/schemas/owners.schema";
import type { OwnerFormValues } from "../models/owner-form.model";
import {
	applyOwnerFormFieldSideEffects,
	INITIAL_OWNER_FORM_VALUES,
	mapFormValuesToWritePayload,
	mapOwnerDetailsToFormValues,
	OWNER_STEP_SCHEMAS,
	ownerFormFullSchema,
	parseOwnerConflictError,
	resolveOwnerFieldStep,
} from "../models/owner-form.model";
import { ownersRouteSearchSchema } from "../models/owners-route-search.model";

export interface UseOwnerFormOptions {
	onCreated?: (owner: OwnerDetailsResponse) => void;
}

export function useOwnerForm(options?: UseOwnerFormOptions) {
	const location = useLocation();
	const navigate = useNavigate();
	const rawSearch = useSearch({ strict: false });

	const isOwnersListRoute = location.pathname === "/owners";
	const parsedRouteSearch = ownersRouteSearchSchema.safeParse(rawSearch);
	const routeOpenCreate = isOwnersListRoute
		? Boolean(
				parsedRouteSearch.success && parsedRouteSearch.data.openAddNewForm,
			)
		: false;
	const routeEditOwnerId =
		isOwnersListRoute && parsedRouteSearch.success
			? (parsedRouteSearch.data.editOwnerId ?? null)
			: null;

	const [localOpen, setLocalOpen] = useState(false);
	const [localMode, setLocalMode] = useState<"create" | "edit">("create");
	const [localEditOwnerId, setLocalEditOwnerId] = useState<number | null>(null);
	const [conflictBanner, setConflictBanner] = useState<string | null>(null);

	const editingOwnerId = isOwnersListRoute
		? routeEditOwnerId
		: localEditOwnerId;
	const mode: "create" | "edit" = isOwnersListRoute
		? routeEditOwnerId !== null
			? "edit"
			: "create"
		: localMode;
	const isEdit = mode === "edit";
	const isOpen = isOwnersListRoute
		? routeOpenCreate || routeEditOwnerId !== null
		: localOpen;

	const ownerQuery = useQuery({
		...getOwnerByIdQuery(editingOwnerId ?? 0),
		enabled: isOpen && isEdit && editingOwnerId !== null && editingOwnerId > 0,
	});

	const registerMutation = useRegisterOwnerMutation();
	const updateMutation = useUpdateOwnerMutation();
	const submitHandlerRef = useRef<
		((values: OwnerFormValues) => Promise<void>) | null
	>(null);
	const onCreatedRef = useRef(options?.onCreated);
	onCreatedRef.current = options?.onCreated;
	const hydratedKeyRef = useRef<string | null>(null);

	const handleControlledOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (!nextOpen) {
				setConflictBanner(null);
			}

			if (isOwnersListRoute) {
				void navigate({
					to: "/owners",
					search: (prev) => {
						const parsed = ownersRouteSearchSchema.safeParse(prev);
						const current = parsed.success
							? parsed.data
							: ownersRouteSearchSchema.parse({});
						return {
							...current,
							openAddNewForm: nextOpen ? current.openAddNewForm : undefined,
							editOwnerId: nextOpen ? current.editOwnerId : undefined,
						};
					},
					replace: true,
				});
				return;
			}

			setLocalOpen(nextOpen);
			if (!nextOpen) {
				setLocalEditOwnerId(null);
			}
		},
		[isOwnersListRoute, navigate],
	);

	const wizard = useWizardForm<OwnerFormValues>({
		initialValues: INITIAL_OWNER_FORM_VALUES,
		resetValues: INITIAL_OWNER_FORM_VALUES,
		routePath: "/owners",
		isOpenControlled: isOpen,
		onOpenChangeControlled: handleControlledOpenChange,
		stepSchemas: OWNER_STEP_SCHEMAS,
		fullSchema: ownerFormFullSchema,
		resolveFieldStep: resolveOwnerFieldStep,
		onFieldChangeSideEffects: applyOwnerFormFieldSideEffects,
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
		setConflictBanner(null);
		resetWizardState(INITIAL_OWNER_FORM_VALUES);
	}, [resetWizardState]);

	const openCreate = useCallback(() => {
		setConflictBanner(null);
		hydratedKeyRef.current = "create";
		resetWizardState(INITIAL_OWNER_FORM_VALUES);

		if (isOwnersListRoute) {
			void navigate({
				to: "/owners",
				search: (prev) => {
					const parsed = ownersRouteSearchSchema.safeParse(prev);
					const current = parsed.success
						? parsed.data
						: ownersRouteSearchSchema.parse({});
					return {
						...current,
						openAddNewForm: true,
						editOwnerId: undefined,
					};
				},
				replace: true,
			});
			return;
		}

		setLocalMode("create");
		setLocalEditOwnerId(null);
		setLocalOpen(true);
	}, [isOwnersListRoute, navigate, resetWizardState]);

	const openEdit = useCallback(
		(ownerId: number) => {
			setConflictBanner(null);
			hydratedKeyRef.current = null;

			if (isOwnersListRoute) {
				void navigate({
					to: "/owners",
					search: (prev) => {
						const parsed = ownersRouteSearchSchema.safeParse(prev);
						const current = parsed.success
							? parsed.data
							: ownersRouteSearchSchema.parse({});
						return {
							...current,
							openAddNewForm: undefined,
							editOwnerId: ownerId,
						};
					},
					replace: true,
				});
				return;
			}

			setLocalMode("edit");
			setLocalEditOwnerId(ownerId);
			setLocalOpen(true);
		},
		[isOwnersListRoute, navigate],
	);

	useEffect(() => {
		if (!isOpen) {
			hydratedKeyRef.current = null;
			return;
		}

		if (isEdit && ownerQuery.data && editingOwnerId !== null) {
			const nextHydrationKey = `${editingOwnerId}:${ownerQuery.dataUpdatedAt}`;
			if (hydratedKeyRef.current !== nextHydrationKey) {
				hydratedKeyRef.current = nextHydrationKey;
				resetWizardState(mapOwnerDetailsToFormValues(ownerQuery.data));
			}
			return;
		}

		if (!isEdit && hydratedKeyRef.current !== "create") {
			hydratedKeyRef.current = "create";
			resetWizardState(INITIAL_OWNER_FORM_VALUES);
		}
	}, [
		isOpen,
		isEdit,
		editingOwnerId,
		ownerQuery.data,
		ownerQuery.dataUpdatedAt,
		resetWizardState,
	]);

	submitHandlerRef.current = async (values: OwnerFormValues) => {
		setConflictBanner(null);
		const payload = mapFormValuesToWritePayload(values);

		try {
			if (isEdit && editingOwnerId !== null) {
				await updateMutation.mutateAsync({
					ownerId: editingOwnerId,
					payload,
				});
				setIsOpen(false);
				return;
			}

			const createdOwner = await registerMutation.mutateAsync(payload);
			setIsOpen(false);
			resetForm();
			onCreatedRef.current?.(createdOwner);
		} catch (error) {
			const parsed = parseRpcError(error);
			if (parsed?.code === "CONFLICT") {
				const mapped = parseOwnerConflictError(parsed.detail);
				if (mapped) {
					form.setFieldMeta(mapped.field, (prev) => ({
						isValidating: prev?.isValidating ?? false,
						isTouched: true,
						isBlurred: prev?.isBlurred ?? false,
						isDirty: prev?.isDirty ?? false,
						errorSourceMap: {
							...prev?.errorSourceMap,
							onSubmit: "form" as const,
						},
						_arrayVersion: prev?._arrayVersion ?? 0,
						_pendingValidationsCount: prev?._pendingValidationsCount ?? 0,
						errorMap: { ...prev?.errorMap, onSubmit: mapped.message },
					}));
					setConflictBanner(mapped.message);
					goToStep(1);
					return;
				}
				setConflictBanner(parsed.detail);
			}
		}
	};

	const { refetch: refetchOwner } = ownerQuery;

	const retryLoadOwner = useCallback(() => {
		void refetchOwner();
	}, [refetchOwner]);

	const ownerCode = isEdit ? (ownerQuery.data?.ownerCode ?? null) : null;
	const isLoadingOwner = isEdit && isOpen && ownerQuery.isPending;
	const isLoadOwnerError = isEdit && isOpen && ownerQuery.isError;
	const isSubmitting =
		wizard.isSubmitting ||
		registerMutation.isPending ||
		updateMutation.isPending;

	return useMemo(
		() => ({
			form,
			mode,
			isEdit,
			editingOwnerId,
			ownerCode,
			isOpen,
			isLoadingOwner,
			isLoadOwnerError,
			conflictBanner,
			currentStep: wizard.currentStep,
			isSubmitting,
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
			retryLoadOwner,
		}),
		[
			form,
			mode,
			isEdit,
			editingOwnerId,
			ownerCode,
			isOpen,
			isLoadingOwner,
			isLoadOwnerError,
			conflictBanner,
			wizard.currentStep,
			isSubmitting,
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
			retryLoadOwner,
		],
	);
}
