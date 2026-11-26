import { ValidationDomainError } from "#/server/domain/common/errors";
import type { OwnerClassification } from "#/server/domain/owners/entities/owner.entity";
import { Owner } from "#/server/domain/owners/entities/owner.entity";
import type { IOwnerRepository } from "#/server/domain/owners/interfaces/owner.interface";
import type { OwnerGender } from "#/server/domain/owners/types/owner.types";
import { CalendarDate } from "#/server/domain/owners/value-objects/calendar-date.vo";
import { OwnerAddress } from "#/server/domain/owners/value-objects/owner-address.vo";
import { OwnerCode } from "#/server/domain/owners/value-objects/owner-code.vo";
import { OwnerConsents } from "#/server/domain/owners/value-objects/owner-consents.vo";
import { TaxId } from "#/server/domain/owners/value-objects/tax-id.vo";
import type { ApiClient } from "../http/api-client";
import { UpstreamServiceError } from "../http/errors";
import type {
	OwnerApiAddressInput,
	OwnerApiDetailAddress,
	OwnerApiDetailResponse,
	OwnerApiWriteRequest,
} from "./owner-api.schemas";
import {
	ownerApiCreatedResponseSchema,
	ownerApiDetailResponseSchema,
	ownerApiWriteRequestSchema,
} from "./owner-api.schemas";

function assertPositiveOwnerId(ownerId: number): void {
	if (!Number.isInteger(ownerId) || ownerId <= 0) {
		throw new ValidationDomainError("ownerId must be a positive integer.");
	}
}

function mapWireAddress(
	wire: OwnerApiDetailAddress | null,
): OwnerAddress | null {
	if (!wire) {
		return null;
	}
	return OwnerAddress.create({
		addressId: wire.id,
		isDefault: wire.is_default,
		addressLine: wire.address_line,
		subdistrict: wire.subdistrict,
		district: wire.district,
		province: wire.province,
		postalCode: wire.postal_code,
	});
}

function mapWireGender(
	wireGender: "MALE" | "FEMALE" | "OTHER" | null,
): OwnerGender {
	if (wireGender === "MALE" || wireGender === "FEMALE") {
		return wireGender;
	}
	return "NOT_SPECIFIED";
}

function mapDomainGenderToWire(
	gender: OwnerGender,
): "MALE" | "FEMALE" | "OTHER" {
	if (gender === "MALE" || gender === "FEMALE") {
		return gender;
	}
	return "OTHER";
}

function mapWireClassification(
	wire: OwnerApiDetailResponse,
): OwnerClassification {
	if (wire.type === "INDIVIDUAL") {
		return {
			ownerType: "INDIVIDUAL",
			prefix: wire.prefix,
			lastName: wire.last_name,
			dateOfBirth: wire.date_of_birth
				? CalendarDate.create(wire.date_of_birth)
				: null,
			gender: mapWireGender(wire.gender),
		};
	}

	return {
		ownerType: "JURISTIC",
		prefix: wire.prefix,
		lastName: wire.last_name,
		dateOfBirth: null,
		gender: "NOT_SPECIFIED",
	};
}

function mapDomainAddressToWireInput(
	address: OwnerAddress,
): OwnerApiAddressInput {
	return {
		is_default: address.isDefault,
		address_line: address.addressLine,
		subdistrict: address.subdistrict,
		district: address.district,
		province: address.province,
		postal_code: address.postalCode,
	};
}

export class ApiOwnerRepository implements IOwnerRepository {
	constructor(private readonly apiClient: ApiClient) {}

	async findById(ownerId: number): Promise<Owner | null> {
		assertPositiveOwnerId(ownerId);

		const wire = await this.apiClient.getOptionalJson(
			`/api/v1/owners/${ownerId}`,
			ownerApiDetailResponseSchema,
		);

		if (!wire) {
			return null;
		}

		return this.toEntity(wire);
	}

	async create(owner: Owner): Promise<Owner> {
		const requestBody = this.toWriteRequest(owner);
		const wire = await this.apiClient.postJson(
			"/api/v1/owners",
			requestBody,
			ownerApiCreatedResponseSchema,
		);

		if ("owner_code" in wire) {
			return this.toEntity(wire);
		}

		// Fallback when upstream/mock returns only { id } per current OpenAPI component schema.
		const created = await this.findById(wire.id);
		if (!created) {
			throw new UpstreamServiceError(
				`Created owner ${wire.id} could not be retrieved from upstream API.`,
			);
		}
		return created;
	}

	async update(owner: Owner): Promise<void> {
		assertPositiveOwnerId(owner.id);
		const requestBody = this.toWriteRequest(owner);
		await this.apiClient.putNoContent(
			`/api/v1/owners/${owner.id}`,
			requestBody,
		);
	}

	async deleteById(ownerId: number): Promise<void> {
		assertPositiveOwnerId(ownerId);
		await this.apiClient.deleteNoContent(`/api/v1/owners/${ownerId}`);
	}

	private toWriteRequest(owner: Owner): OwnerApiWriteRequest {
		if (!owner.residentialAddress) {
			throw new ValidationDomainError(
				"Residential address is required to persist owner.",
			);
		}
		if (!owner.acquisitionChannel) {
			throw new ValidationDomainError(
				"Acquisition channel is required to persist owner.",
			);
		}
		if (!owner.consents.privacyPolicy) {
			throw new ValidationDomainError(
				"Privacy policy consent must be true to persist owner.",
			);
		}

		const common = {
			first_name: owner.firstName,
			tax_id: owner.taxId.value,
			phone_no: owner.phoneNumber,
			email: owner.email,
			line_id: owner.lineId,
			acquisition_channel: owner.acquisitionChannel,
			addresses: {
				residential: mapDomainAddressToWireInput(owner.residentialAddress),
				billing: owner.billingAddress
					? mapDomainAddressToWireInput(owner.billingAddress)
					: null,
			},
			consents: {
				privacy_policy: true as const,
				marketing: owner.consents.marketing,
				appointment: owner.consents.appointment,
				media: owner.consents.media,
				research: owner.consents.research,
			},
		};

		const classification = owner.classification;
		if (classification.ownerType === "INDIVIDUAL") {
			if (!classification.lastName || !classification.dateOfBirth) {
				throw new ValidationDomainError(
					"INDIVIDUAL owner requires lastName and dateOfBirth.",
				);
			}

			return ownerApiWriteRequestSchema.parse({
				...common,
				type: "INDIVIDUAL",
				prefix: classification.prefix,
				last_name: classification.lastName,
				date_of_birth: classification.dateOfBirth.isoDate,
				gender: mapDomainGenderToWire(classification.gender),
			});
		}

		return ownerApiWriteRequestSchema.parse({
			...common,
			type: "JURISTIC",
			prefix: classification.prefix,
		});
	}

	private toEntity(wire: OwnerApiDetailResponse): Owner {
		return Owner.reconstitute(wire.id, {
			ownerCode: OwnerCode.create(wire.owner_code),
			classification: mapWireClassification(wire),
			firstName: wire.first_name,
			taxId: TaxId.create(wire.tax_id),
			phoneNumber: wire.phone_no,
			lineId: wire.line_id,
			email: wire.email,
			acquisitionChannel: wire.acquisition_channel,
			addresses: {
				residential: mapWireAddress(wire.addresses.residential),
				billing: mapWireAddress(wire.addresses.billing),
			},
			consents: OwnerConsents.create({
				privacyPolicy: wire.consents.privacy_policy,
				marketing: wire.consents.marketing,
				appointment: wire.consents.appointment,
				media: wire.consents.media,
				research: wire.consents.research,
			}),
			createdAt: new Date(wire.created_at),
			updatedAt: new Date(wire.updated_at),
		});
	}
}
