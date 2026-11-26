import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound, useParams } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { getOwnerByIdQuery } from "#/client/caches/owners/queries/get-owner-by-id.query";
import {
	formatPhoneNumber,
	formatTaxId,
	formatThaiLongDate,
} from "#/client/shared/helpers/formatters";
import { toast } from "#/client/shared/shadcn/components/ui/toast";
import { useOwnerDeleteContext } from "../contexts/owner-delete.context";
import { useOwnerFormContext } from "../contexts/owner-form.context";
import {
	formatAcquisitionChannelLabel,
	formatFullAddress,
	GENDER_LABEL_MAP,
	getOwnerDisplayName,
	getPdpaConsentSummary,
	OWNER_TYPE_LABEL_MAP,
	PREFIX_LABEL_MAP,
} from "../models/owners-table.model";

export function useOwnerDetails() {
	const { ownerId: rawOwnerId } = useParams({
		from: "/_private/owners/$ownerId",
	});
	const numericOwnerId = Number(rawOwnerId);

	if (!Number.isInteger(numericOwnerId) || numericOwnerId <= 0) {
		throw notFound();
	}

	const { data: owner } = useSuspenseQuery(getOwnerByIdQuery(numericOwnerId));
	const { openEdit } = useOwnerFormContext();
	const { requestDelete } = useOwnerDeleteContext();

	const displayName = useMemo(() => getOwnerDisplayName(owner), [owner]);
	const formattedPhone = useMemo(
		() => formatPhoneNumber(owner.phoneNumber),
		[owner.phoneNumber],
	);
	const formattedTaxId = useMemo(() => formatTaxId(owner.taxId), [owner.taxId]);
	const formattedDob = useMemo(
		() => formatThaiLongDate(owner.dateOfBirth),
		[owner.dateOfBirth],
	);
	const formattedCreatedAt = useMemo(
		() => formatThaiLongDate(owner.createdAt),
		[owner.createdAt],
	);
	const formattedUpdatedAt = useMemo(
		() => formatThaiLongDate(owner.updatedAt),
		[owner.updatedAt],
	);
	const residentialFullAddress = useMemo(
		() => formatFullAddress(owner.addresses.residential),
		[owner.addresses.residential],
	);
	const billingFullAddress = useMemo(
		() =>
			owner.addresses.billing
				? formatFullAddress(owner.addresses.billing)
				: null,
		[owner.addresses.billing],
	);
	const pdpaSummary = useMemo(
		() => getPdpaConsentSummary(owner.consents),
		[owner.consents],
	);

	const handleEditOwner = useCallback(() => {
		openEdit(owner.ownerId);
	}, [openEdit, owner.ownerId]);

	const handleDeleteOwner = useCallback(() => {
		requestDelete({
			ownerId: owner.ownerId,
			displayName,
			ownerCode: owner.ownerCode,
			redirectToList: true,
		});
	}, [displayName, owner.ownerCode, owner.ownerId, requestDelete]);

	const handleAddPetComingSoon = useCallback(() => {
		toast.add({
			description: "ระบบลงทะเบียนสัตว์เลี้ยงกำลังอยู่ในระหว่างพัฒนา API",
			type: "info",
		});
	}, []);

	return {
		owner,
		displayName,
		ownerTypeLabel: OWNER_TYPE_LABEL_MAP[owner.ownerType],
		prefixLabel: PREFIX_LABEL_MAP[owner.prefix],
		genderLabel: GENDER_LABEL_MAP[owner.gender],
		acquisitionChannelLabel: formatAcquisitionChannelLabel(
			owner.acquisitionChannel,
		),
		formattedPhone,
		formattedTaxId,
		formattedDob,
		formattedCreatedAt,
		formattedUpdatedAt,
		residentialFullAddress,
		billingFullAddress,
		isResidentialDefault: owner.addresses.residential?.isDefault ?? false,
		isBillingDefault: owner.addresses.billing?.isDefault ?? false,
		pdpaSummary,
		handleEditOwner,
		handleDeleteOwner,
		handleAddPetComingSoon,
	};
}
