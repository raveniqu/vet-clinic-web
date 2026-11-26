import type { ColumnVisibilityState } from "@tanstack/react-table";
import type { TableColumnDefinition } from "#/client/shared/hooks/use-persisted-columns";
import type {
	AcquisitionChannelDto,
	OwnerAddressDto,
	OwnerConsentsDto,
	OwnerGenderDto,
	OwnerListItem,
	OwnerPrefixDto,
	OwnerSummaryAddressDto,
	OwnerTypeDto,
} from "#/shared/schemas/owners.schema";

export type OwnerColumnKey =
	| "owner"
	| "contact"
	| "pets"
	| "pdpaConsent"
	| "taxId"
	| "additionalContacts"
	| "address"
	| "acquisitionChannel"
	| "createdAt";

export const OWNER_TABLE_COLUMNS: readonly TableColumnDefinition<OwnerColumnKey>[] =
	[
		{
			key: "owner",
			label: "เจ้าของสัตว์เลี้ยง",
			locked: true,
			defaultVisible: true,
		},
		{ key: "contact", label: "เบอร์โทรศัพท์", defaultVisible: true },
		{ key: "pets", label: "สัตว์เลี้ยง", defaultVisible: true },
		{ key: "createdAt", label: "วันที่ลงทะเบียน", defaultVisible: true },
		{ key: "taxId", label: "เลขผู้เสียภาษี", defaultVisible: false },
		{
			key: "additionalContacts",
			label: "ช่องทางติดต่อเพิ่มเติม",
			defaultVisible: false,
		},
		{ key: "address", label: "ที่อยู่", defaultVisible: false },
		{
			key: "acquisitionChannel",
			label: "ช่องทางที่รู้จักคลินิก",
			defaultVisible: false,
		},
		{ key: "pdpaConsent", label: "ความยินยอม PDPA", defaultVisible: false },
	] as const;

export const OWNER_COLUMN_LABEL_MAP: Record<OwnerColumnKey, string> =
	Object.fromEntries(
		OWNER_TABLE_COLUMNS.map((col) => [col.key, col.label]),
	) as Record<OwnerColumnKey, string>;

export const DEFAULT_VISIBLE_OWNER_COLUMNS: readonly OwnerColumnKey[] =
	OWNER_TABLE_COLUMNS.filter((col) => col.defaultVisible).map((col) => col.key);

export const LOCKED_OWNER_COLUMNS: ReadonlySet<OwnerColumnKey> = new Set(
	OWNER_TABLE_COLUMNS.filter((col) => col.locked).map((col) => col.key),
);

export const OWNER_COLUMNS_STORAGE_KEY =
	"vet-care.owners.list-visible-columns.v1";

export const OWNER_TYPE_LABEL_MAP: Record<OwnerTypeDto, string> = {
	INDIVIDUAL: "บุคคลธรรมดา",
	JURISTIC: "นิติบุคคล",
};

export const PREFIX_LABEL_MAP: Record<OwnerPrefixDto, string> = {
	MR: "นาย",
	MRS: "นาง",
	MS: "นางสาว",
	COMMERCIAL: "บริษัท / ห้างหุ้นส่วน",
	NON_PROFIT: "มูลนิธิ / สมาคม",
	OTHER: "นิติบุคคลอื่น ๆ",
};

export const GENDER_LABEL_MAP: Record<OwnerGenderDto, string> = {
	MALE: "ชาย",
	FEMALE: "หญิง",
	NOT_SPECIFIED: "ไม่ระบุ",
};

export const ACQUISITION_CHANNEL_LABEL_MAP: Record<
	AcquisitionChannelDto,
	string
> = {
	WALK_IN: "มาที่คลินิกโดยตรง",
	LINE_OA: "LINE OA",
	WEB_PORTAL: "เว็บไซต์",
	REFERRAL: "คนรู้จักแนะนำ",
	SOCIAL_MEDIA: "โซเชียลมีเดีย",
	CAMPAIGN: "แคมเปญ / โฆษณา",
};

export interface PdpaConsentItem {
	key: keyof OwnerConsentsDto;
	label: string;
	granted: boolean;
}

export interface PdpaConsentSummary {
	grantedCount: number;
	totalCount: number;
	isFullConsent: boolean;
	badgeLabel: string;
	items: readonly PdpaConsentItem[];
}

export type OwnerDisplayIdentity = {
	ownerType: OwnerTypeDto;
	prefix: OwnerPrefixDto;
	firstName: string;
	lastName: string | null;
};

export function hasNonEmptyText(
	value: string | null | undefined,
): value is string {
	return typeof value === "string" && value.trim().length > 0;
}

export function getOwnerDisplayName(owner: OwnerDisplayIdentity): string {
	if (owner.ownerType === "JURISTIC") {
		return owner.firstName.trim();
	}

	const parts = [
		PREFIX_LABEL_MAP[owner.prefix],
		owner.firstName,
		owner.lastName ?? "",
	];
	return parts.filter((part) => part.trim().length > 0).join(" ");
}

export function getOwnerInitials(owner: {
	firstName: string;
	lastName: string | null;
}): string {
	const first = Array.from(owner.firstName.trim())[0] ?? "";
	const last = Array.from((owner.lastName ?? "").trim())[0] ?? "";

	if (first && last) {
		return `${first}${last}`.toUpperCase();
	}

	const compact = Array.from(owner.firstName.replace(/\s+/g, ""));
	return compact.slice(0, 2).join("").toUpperCase() || "จข";
}

export function getPdpaConsentSummary(
	consents: OwnerConsentsDto,
): PdpaConsentSummary {
	const items: readonly PdpaConsentItem[] = [
		{
			key: "privacyPolicy",
			label: "นโยบายความเป็นส่วนตัว",
			granted: consents.privacyPolicy,
		},
		{
			key: "appointment",
			label: "แจ้งเตือนนัดหมายและวัคซีน",
			granted: consents.appointment,
		},
		{
			key: "marketing",
			label: "ข่าวสารและโปรโมชัน",
			granted: consents.marketing,
		},
		{
			key: "media",
			label: "ภาพถ่ายและสื่อประชาสัมพันธ์",
			granted: consents.media,
		},
		{
			key: "research",
			label: "ข้อมูลเพื่อการวิจัยทางสัตวแพทย์",
			granted: consents.research,
		},
	];

	const grantedCount = items.filter((item) => item.granted).length;
	const totalCount = items.length;
	const isFullConsent = grantedCount === totalCount;

	return {
		grantedCount,
		totalCount,
		isFullConsent,
		badgeLabel: isFullConsent
			? "ยินยอมครบทุกข้อ"
			: `ยินยอมบางส่วน (${grantedCount}/${totalCount})`,
		items,
	};
}

export function formatAddressArea(
	address: OwnerSummaryAddressDto | OwnerAddressDto | null | undefined,
): string {
	if (!address) return "";
	return [address.district, address.province]
		.filter((part) => part.trim().length > 0)
		.join(", ");
}

export function formatFullAddress(
	address: OwnerSummaryAddressDto | OwnerAddressDto | null | undefined,
): string {
	if (!address) return "—";
	const parts = [
		address.addressLine,
		address.subdistrict,
		address.district,
		address.province,
		address.postalCode,
	].filter((part) => part.trim().length > 0);
	return parts.length > 0 ? parts.join(", ") : "—";
}

export function formatAcquisitionChannelLabel(
	channel: AcquisitionChannelDto | null | undefined,
): string {
	if (!channel) return "—";
	return ACQUISITION_CHANNEL_LABEL_MAP[channel];
}

export function getOwnerColumnVisibilityState(
	visibleColumns: readonly OwnerColumnKey[],
): ColumnVisibilityState {
	const visibleSet = new Set<OwnerColumnKey>(visibleColumns);
	const visibility: ColumnVisibilityState = {};

	for (const col of OWNER_TABLE_COLUMNS) {
		visibility[col.key] = col.locked ? true : visibleSet.has(col.key);
	}
	visibility.actions = true;

	return visibility;
}

export function getOwnerTaxIdCopyHint(owner: OwnerListItem): boolean {
	return !owner.taxId.includes("X");
}
