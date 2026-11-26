import { ValidationDomainError } from "#/server/domain/common/errors";
import type {
	CreateOwnerParams,
	Owner,
	OwnerWriteAddresses,
	OwnerWriteClassification,
	UpdateOwnerProfileParams,
} from "#/server/domain/owners/entities/owner.entity";
import { CalendarDate } from "#/server/domain/owners/value-objects/calendar-date.vo";
import { OwnerAddress } from "#/server/domain/owners/value-objects/owner-address.vo";
import { OwnerConsents } from "#/server/domain/owners/value-objects/owner-consents.vo";
import { TaxId } from "#/server/domain/owners/value-objects/tax-id.vo";
import type {
	OwnerAddressDto,
	OwnerAddressInputDto,
	OwnerDetailsResponse,
	OwnerWritePayload,
} from "#/shared/schemas/owners.schema";

function mapAddressToDto(address: OwnerAddress | null): OwnerAddressDto | null {
	if (!address) {
		return null;
	}
	return address.toPlainObject();
}

function mapInputAddressToVo(input: OwnerAddressInputDto): OwnerAddress {
	return OwnerAddress.create({
		addressId: null,
		isDefault: input.isDefault,
		addressLine: input.addressLine,
		subdistrict: input.subdistrict,
		district: input.district,
		province: input.province,
		postalCode: input.postalCode,
	});
}

function mapWriteAddresses(
	addresses: OwnerWritePayload["addresses"],
): OwnerWriteAddresses {
	return {
		residential: mapInputAddressToVo(addresses.residential),
		billing: addresses.billing ? mapInputAddressToVo(addresses.billing) : null,
	};
}

function mapWriteClassification(
	payload: OwnerWritePayload,
): OwnerWriteClassification {
	if (payload.ownerType === "INDIVIDUAL") {
		return {
			ownerType: "INDIVIDUAL",
			prefix: payload.prefix,
			lastName: payload.lastName,
			dateOfBirth: CalendarDate.create(payload.dateOfBirth),
			gender: payload.gender,
		};
	}

	return {
		ownerType: "JURISTIC",
		prefix: payload.prefix,
		lastName: null,
		dateOfBirth: null,
		gender: "NOT_SPECIFIED",
	};
}

function mapToWriteParams(payload: OwnerWritePayload): CreateOwnerParams {
	return {
		classification: mapWriteClassification(payload),
		firstName: payload.firstName,
		taxId: TaxId.create(payload.taxId),
		phoneNumber: payload.phoneNumber,
		lineId: payload.lineId,
		email: payload.email,
		acquisitionChannel: payload.acquisitionChannel,
		addresses: mapWriteAddresses(payload.addresses),
		consents: OwnerConsents.create({
			privacyPolicy: payload.consents.privacyPolicy,
			marketing: payload.consents.marketing,
			appointment: payload.consents.appointment,
			media: payload.consents.media,
			research: payload.consents.research,
		}),
	};
}

export class OwnerMapper {
	static toCreateParams(payload: OwnerWritePayload): CreateOwnerParams {
		return mapToWriteParams(payload);
	}

	static toUpdateProfileParams(
		payload: OwnerWritePayload,
	): UpdateOwnerProfileParams {
		return mapToWriteParams(payload);
	}

	static toDto(owner: Owner): OwnerDetailsResponse {
		if (!owner.ownerCode) {
			throw new ValidationDomainError(
				"Cannot serialize an unpersisted owner without an ownerCode.",
			);
		}

		const base = {
			ownerId: owner.id,
			ownerCode: owner.ownerCode.value,
			firstName: owner.firstName,
			lastName: owner.lastName,
			taxId: owner.taxId.value,
			phoneNumber: owner.phoneNumber,
			lineId: owner.lineId,
			email: owner.email,
			acquisitionChannel: owner.acquisitionChannel,
			addresses: {
				residential: mapAddressToDto(owner.residentialAddress),
				billing: mapAddressToDto(owner.billingAddress),
			},
			consents: owner.consents.toPlainObject(),
			createdAt: owner.createdAt.toISOString(),
			updatedAt: owner.updatedAt.toISOString(),
		};

		const classification = owner.classification;
		if (classification.ownerType === "INDIVIDUAL") {
			return {
				...base,
				ownerType: "INDIVIDUAL",
				prefix: classification.prefix,
				dateOfBirth: classification.dateOfBirth?.isoDate ?? null,
				gender: classification.gender,
			};
		}

		return {
			...base,
			ownerType: "JURISTIC",
			prefix: classification.prefix,
			dateOfBirth: null,
			gender: "NOT_SPECIFIED",
		};
	}
}
