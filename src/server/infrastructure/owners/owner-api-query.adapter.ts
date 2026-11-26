import type { IOwnerQueryPort } from "#/server/application/owners/owner-query.port";
import type {
	OwnerListItem,
	OwnerListResponse,
	OwnerSummaryAddressDto,
	OwnersSearchParams,
} from "#/shared/schemas/owners.schema";
import type { ApiClient } from "../http/api-client";
import type {
	OwnerApiDefaultAddress,
	OwnerApiListItem,
	OwnerApiListResponse,
} from "./owner-api.schemas";
import { ownerApiListResponseSchema } from "./owner-api.schemas";

function mapWireDefaultAddress(
	wire: OwnerApiDefaultAddress | null,
): OwnerSummaryAddressDto | null {
	if (!wire) {
		return null;
	}
	return {
		addressId: wire.id,
		addressLine: wire.address_line,
		subdistrict: wire.subdistrict,
		district: wire.district,
		province: wire.province,
		postalCode: wire.postal_code,
	};
}

function mapWireListItem(wire: OwnerApiListItem): OwnerListItem {
	const base = {
		ownerId: wire.id,
		ownerCode: wire.owner_code,
		firstName: wire.first_name,
		lastName: wire.last_name,
		phoneNumber: wire.phone_no,
		lineId: wire.line_id,
		email: wire.email,
		taxId: wire.tax_id,
		acquisitionChannel: wire.acquisition_channel,
		defaultAddress: mapWireDefaultAddress(wire.address),
		consents: {
			privacyPolicy: wire.consents.privacy_policy,
			marketing: wire.consents.marketing,
			appointment: wire.consents.appointment,
			media: wire.consents.media,
			research: wire.consents.research,
		},
		createdAt: wire.created_at,
	};

	if (wire.type === "INDIVIDUAL") {
		return {
			...base,
			ownerType: "INDIVIDUAL",
			prefix: wire.prefix,
		};
	}

	return {
		...base,
		ownerType: "JURISTIC",
		prefix: wire.prefix,
	};
}

export class ApiOwnerQueryAdapter implements IOwnerQueryPort {
	constructor(private readonly apiClient: ApiClient) {}

	async listOwners(query: OwnersSearchParams): Promise<OwnerListResponse> {
		const wire = await this.apiClient.getJson(
			"/api/v1/owners",
			ownerApiListResponseSchema,
			{
				query: {
					page: query.page,
					limit: query.limit,
					search: query.search,
					type: query.ownerType,
					acquisition_channel: query.acquisitionChannel,
					created_from: query.createdFrom,
					created_to: query.createdTo,
					sort: query.sort,
				},
			},
		);

		return this.toListResponse(wire);
	}

	private toListResponse(wire: OwnerApiListResponse): OwnerListResponse {
		return {
			page: wire.page,
			limit: wire.limit,
			totalItems: wire.total_items,
			totalPages: wire.total_pages,
			hasNext: wire.has_next,
			hasPrev: wire.has_prev,
			data: wire.data.map(mapWireListItem),
		};
	}
}
