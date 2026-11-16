import { formatPhoneNumber, formatRegisteredDate } from "#/client/shared/helpers/formatters";
import type { OwnerDto, PreferredChannel } from "#/shared/schemas/owner.schema";

export type OwnerColumnKey =
  | "owner"
  | "contact"
  | "pets"
  | "pdpaConsent"
  | "taxId"
  | "additionalContacts"
  | "address"
  | "preferredSchedule"
  | "referralSource"
  | "createdAt";

export interface OwnerColumnDefinition {
  key: OwnerColumnKey;
  label: string;
  locked?: boolean;
  defaultVisible: boolean;
}

export const OWNER_TABLE_COLUMNS: readonly OwnerColumnDefinition[] = [
  { key: "owner", label: "Owner", locked: true, defaultVisible: true },
  { key: "contact", label: "Contact", defaultVisible: true },
  { key: "pets", label: "Pets", defaultVisible: true },
  { key: "pdpaConsent", label: "PDPA Consent", defaultVisible: true },
  { key: "taxId", label: "Tax ID", defaultVisible: false },
  { key: "additionalContacts", label: "Additional Contacts", defaultVisible: false },
  { key: "address", label: "Address", defaultVisible: false },
  { key: "preferredSchedule", label: "Pref. Time & Lang", defaultVisible: false },
  { key: "referralSource", label: "Referral Source", defaultVisible: false },
  { key: "createdAt", label: "Registered", defaultVisible: false },
] as const;

export const DEFAULT_VISIBLE_OWNER_COLUMNS: readonly OwnerColumnKey[] = OWNER_TABLE_COLUMNS.filter(
  (col) => col.defaultVisible
).map((col) => col.key);

export const LOCKED_OWNER_COLUMNS: ReadonlySet<OwnerColumnKey> = new Set(
  OWNER_TABLE_COLUMNS.filter((col) => col.locked).map((col) => col.key)
);

export const OWNER_COLUMNS_STORAGE_KEY = "vet-clinic.owners.list-visible-columns.v1";

export type OwnerQuickFilterKey = "preferredLine" | "juristic";

export interface OwnerQuickFilterDefinition {
  key: OwnerQuickFilterKey;
  label: string;
  predicate: (owner: OwnerDto) => boolean;
}

export const OWNER_QUICK_FILTERS: readonly OwnerQuickFilterDefinition[] = [
  {
    key: "preferredLine",
    label: "LINE",
    predicate: (owner) => owner.preferredChannel === "LINE",
  },
  {
    key: "juristic",
    label: "Juristic",
    predicate: (owner) => owner.customerType === "JURISTIC",
  },
] as const;

export const OWNER_QUICK_FILTER_PREDICATES: Record<
  OwnerQuickFilterKey,
  (owner: OwnerDto) => boolean
> = {
  preferredLine: OWNER_QUICK_FILTERS[0].predicate,
  juristic: OWNER_QUICK_FILTERS[1].predicate,
};

export const OWNER_MOBILE_BATCH_SIZE = 5;

const VALID_COLUMN_KEY_SET = new Set<string>(OWNER_TABLE_COLUMNS.map((col) => col.key));

const CHANNEL_LABEL_MAP: Record<PreferredChannel, string> = {
  LINE: "LINE",
  PHONE: "Phone",
  SMS: "SMS",
  EMAIL: "Email",
};

export interface PdpaConsentItem {
  key: "privacyNotice" | "reminders" | "marketing" | "media";
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

export function hasNonEmptyText(value: string): boolean {
  return value.trim().length > 0;
}

export function normalizeVisibleOwnerColumns(raw: unknown): OwnerColumnKey[] {
  if (!Array.isArray(raw)) {
    return [...DEFAULT_VISIBLE_OWNER_COLUMNS];
  }

  const incoming = new Set<OwnerColumnKey>();
  for (const item of raw) {
    if (typeof item === "string" && VALID_COLUMN_KEY_SET.has(item)) {
      incoming.add(item as OwnerColumnKey);
    }
  }

  for (const lockedKey of LOCKED_OWNER_COLUMNS) {
    incoming.add(lockedKey);
  }

  return OWNER_TABLE_COLUMNS.filter((col) => incoming.has(col.key)).map((col) => col.key);
}

export function getOwnerDisplayName(owner: OwnerDto): string {
  const parts =
    owner.customerType === "JURISTIC"
      ? [owner.prefix, owner.firstName]
      : [owner.prefix, owner.firstName, owner.lastName];

  return parts.filter((part) => part.trim().length > 0).join(" ");
}

export function getOwnerInitials(owner: OwnerDto): string {
  const first = Array.from(owner.firstName.trim())[0] ?? "";
  const last = Array.from(owner.lastName.trim())[0] ?? "";

  if (first && last) {
    return `${first}${last}`.toUpperCase();
  }

  const compact = Array.from(owner.firstName.replace(/\s+/g, ""));
  return compact.slice(0, 2).join("").toUpperCase() || "OW";
}

export function formatPreferredChannelDetail(owner: OwnerDto): string {
  const label = CHANNEL_LABEL_MAP[owner.preferredChannel];

  if (owner.preferredChannel === "LINE" && hasNonEmptyText(owner.lineId)) {
    return `${label} · ${owner.lineId.trim()}`;
  }
  if (owner.preferredChannel === "EMAIL" && hasNonEmptyText(owner.email)) {
    return `${label} · ${owner.email.trim()}`;
  }
  if (owner.preferredChannel === "SMS") {
    return `${label} · ${formatPhoneNumber(owner.phonePrimary)}`;
  }

  return `Preferred: ${label}`;
}

export function getPdpaConsentSummary(owner: OwnerDto): PdpaConsentSummary {
  const items: readonly PdpaConsentItem[] = [
    { key: "privacyNotice", label: "Privacy Notice", granted: owner.pdpaPrivacyNotice },
    { key: "reminders", label: "Appointment Reminders", granted: owner.pdpaReminders },
    { key: "marketing", label: "Marketing Updates", granted: owner.pdpaMarketing },
    { key: "media", label: "Media & Photos", granted: owner.pdpaMedia },
  ];

  const grantedCount = items.filter((item) => item.granted).length;
  const totalCount = items.length;
  const isFullConsent = grantedCount === totalCount;

  return {
    grantedCount,
    totalCount,
    isFullConsent,
    badgeLabel: isFullConsent ? "Full Consent" : `Partial (${grantedCount}/${totalCount})`,
    items,
  };
}

export function formatAddressArea(owner: OwnerDto): string {
  return [owner.district, owner.province].filter((part) => part.trim().length > 0).join(", ");
}

export function formatFullAddress(owner: OwnerDto): string {
  return [owner.addressLine, owner.subdistrict, owner.district, owner.province, owner.postalCode]
    .filter((part) => part.trim().length > 0)
    .join(", ");
}

export function formatOwnerRegisteredDate(isoDate: string): string {
  return formatRegisteredDate(isoDate, isoDate);
}
