import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { ownersListQueryOptions } from "#/client/caches/owners/queries/owners.query";
import { useAddNewPetFormContext } from "#/client/features/reception/pets/contexts/add-new-pet-form-provider";
import { useFormField, useFormFieldError } from "#/client/shared/hooks/use-wizard-form";
import type { OwnerDto } from "#/shared/schemas/owner.schema";
import { mapOwnerToSelectedSummary } from "../models/pet-form";

export function usePetOwnerSelection() {
  const {
    form,
    isOpen,
    setFieldValue,
    selectedOwnerSummary,
    setSelectedOwnerSummary,
    setIsNewOwnerModalOpen,
  } = useAddNewPetFormContext();

  const ownerId = useFormField(form, "ownerId");
  const ownerError = useFormFieldError(form, "ownerId");

  const { data: allOwners = [], isLoading: isLoadingOwners } = useQuery({
    ...ownersListQueryOptions(),
    enabled: isOpen,
  });

  const selectedOwner = useMemo(
    () => allOwners.find((o) => o.id === ownerId) ?? null,
    [allOwners, ownerId]
  );

  // Auto-sync owner details (including primary phone) from cache if summary has empty phone
  useEffect(() => {
    if (selectedOwner && !selectedOwnerSummary?.phone) {
      setSelectedOwnerSummary(mapOwnerToSelectedSummary(selectedOwner));
    }
  }, [selectedOwner, selectedOwnerSummary, setSelectedOwnerSummary]);

  const handleSelectOwner = useCallback(
    (owner: OwnerDto) => {
      setFieldValue("ownerId", owner.id);
      setSelectedOwnerSummary(mapOwnerToSelectedSummary(owner));
    },
    [setFieldValue, setSelectedOwnerSummary]
  );

  const handleClearOwner = useCallback(() => {
    setSelectedOwnerSummary(null);
    setFieldValue("ownerId", "");
  }, [setFieldValue, setSelectedOwnerSummary]);

  const openNewOwnerModal = useCallback(() => {
    setIsNewOwnerModalOpen(true);
  }, [setIsNewOwnerModalOpen]);

  const filterOwner = useCallback((owner: OwnerDto, query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      owner.firstName.toLowerCase().includes(q) ||
      owner.lastName.toLowerCase().includes(q) ||
      owner.phonePrimary.includes(q) ||
      owner.customerCode.toLowerCase().includes(q)
    );
  }, []);

  const getOwnerLabel = useCallback(
    (owner: OwnerDto) => `${owner.prefix} ${owner.firstName} ${owner.lastName}`.trim(),
    []
  );

  const isOwnerEqualToValue = useCallback((a: OwnerDto, b: OwnerDto) => a.id === b.id, []);

  return {
    allOwners,
    isLoadingOwners,
    selectedOwner,
    selectedOwnerSummary,
    ownerError,
    handleSelectOwner,
    handleClearOwner,
    openNewOwnerModal,
    filterOwner,
    getOwnerLabel,
    isOwnerEqualToValue,
  };
}
