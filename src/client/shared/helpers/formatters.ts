/**
 * Format phone numbers for visual clarity (Thai phone numbering format).
 * Bangkok Landlines (02): 02-XXX-XXXX (9 digits)
 * Provincial Landlines (03x, 04x, 05x, 07x): 0XX-XXX-XXX (9 digits)
 * Mobile Numbers (06x, 08x, 09x): 0XX-XXX-XXXX (10 digits)
 */
export function formatPhoneNumber(value: string | undefined | null): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");

  // Bangkok Landline (starts with 02)
  if (digits.startsWith("02")) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5, 9)}`;
  }

  // 9-digit provincial or 10-digit mobile
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

/**
 * Format 13-digit Citizen / Tax ID with visual groupings (1-4-5-2-1).
 * Example: 1-1005-00889-21-1
 */
export function formatTaxId(value: string | undefined | null): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");

  if (digits.length <= 1) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 1)}-${digits.slice(1)}`;
  if (digits.length <= 10) return `${digits.slice(0, 1)}-${digits.slice(1, 5)}-${digits.slice(5)}`;
  if (digits.length <= 12)
    return `${digits.slice(0, 1)}-${digits.slice(1, 5)}-${digits.slice(5, 10)}-${digits.slice(10)}`;
  return `${digits.slice(0, 1)}-${digits.slice(1, 5)}-${digits.slice(5, 10)}-${digits.slice(10, 12)}-${digits.slice(12, 13)}`;
}

/**
 * Format 15-digit ISO 11784/11785 RFID microchip number (3-3-3-3-3).
 * Standard grouping used by veterinary scanners and pet registries.
 * Example: 900-115-000-123-456
 */
export function formatMicrochipNumber(value: string | undefined | null): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "").slice(0, 15);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length <= 12)
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}-${digits.slice(9)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}-${digits.slice(9, 12)}-${digits.slice(12, 15)}`;
}

export interface PetAgeInput {
  dateOfBirth?: string | null;
  birthDateIsEstimated?: boolean;
  estimatedYears?: number;
  estimatedMonths?: number;
}

/**
 * Format pet age consistently across views in Thai.
 * Examples: "5 ปี 5 เดือน", "5 ปี", "4 เดือน", "< 1 เดือน", "~2 ปี 4 เดือน"
 */
export function formatPetAge(pet: PetAgeInput): string {
  const isEstimated = Boolean(pet.birthDateIsEstimated);

  let years = pet.estimatedYears ?? 0;
  let months = pet.estimatedMonths ?? 0;

  if (!isEstimated && pet.dateOfBirth) {
    const dob = parseDateInput(pet.dateOfBirth);
    if (dob) {
      const now = new Date();
      years = now.getFullYear() - dob.getFullYear();
      months = now.getMonth() - dob.getMonth();

      if (now.getDate() < dob.getDate()) {
        months -= 1;
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      if (years < 0) {
        years = 0;
        months = 0;
      }
    }
  }

  const prefix = isEstimated ? "~" : "";

  if (years > 0 && months > 0) {
    return `${prefix}${years} ปี ${months} เดือน`;
  }
  if (years > 0 && months === 0) {
    return `${prefix}${years} ปี`;
  }
  if (years === 0 && months > 0) {
    return `${prefix}${months} เดือน`;
  }
  return `${prefix}< 1 เดือน`;
}

const THAI_SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const THAI_LONG_DATE_FORMATTER = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function parseDateInput(value: Date | string): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const trimmed = value.trim();
  if (!trimmed) return null;

  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (dateOnlyMatch) {
    const year = Number(dateOnlyMatch[1]);
    const month = Number(dateOnlyMatch[2]);
    const day = Number(dateOnlyMatch[3]);
    const parsed = new Date(year, month - 1, day);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Format a Date or ISO date string into Thai short Buddhist Era date (e.g. "10 ม.ค. 2569").
 */
export function formatThaiShortDate(value: Date | string, invalidFallback = "—"): string {
  if (!value) return "—";
  const parsed = parseDateInput(value);
  if (!parsed) return invalidFallback;
  return THAI_SHORT_DATE_FORMATTER.format(parsed);
}

/**
 * Format a Date or ISO date string into Thai long Buddhist Era date (e.g. "10 มกราคม 2569").
 */
export function formatThaiLongDate(value: Date | string, invalidFallback = "—"): string {
  if (!value) return "—";
  const parsed = parseDateInput(value);
  if (!parsed) return invalidFallback;
  return THAI_LONG_DATE_FORMATTER.format(parsed);
}

/**
 * Format an ISO date string into Thai short Buddhist Era date (e.g. "10 ม.ค. 2569").
 */
export function formatRegisteredDate(isoDate: string, invalidFallback = "—"): string {
  return formatThaiShortDate(isoDate, invalidFallback);
}
