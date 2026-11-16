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
 * Format pet age consistently across views.
 * Examples: "5Y 5M", "5Y", "4M", "< 1M", "~2Y 4M"
 */
export function formatPetAge(pet: PetAgeInput): string {
  const isEstimated = Boolean(pet.birthDateIsEstimated);

  let years = pet.estimatedYears ?? 0;
  let months = pet.estimatedMonths ?? 0;

  if (!isEstimated && pet.dateOfBirth) {
    const dob = new Date(pet.dateOfBirth);
    if (!Number.isNaN(dob.getTime())) {
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
    return `${prefix}${years}Y ${months}M`;
  }
  if (years > 0 && months === 0) {
    return `${prefix}${years}Y`;
  }
  if (years === 0 && months > 0) {
    return `${prefix}${months}M`;
  }
  return `${prefix}< 1M`;
}

const REGISTERED_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/**
 * Format an ISO date string into "DD Mon YYYY" (en-GB) using a cached Intl.DateTimeFormat instance.
 */
export function formatRegisteredDate(isoDate: string, invalidFallback = "—"): string {
  if (!isoDate) return "—";
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return invalidFallback;
  return REGISTERED_DATE_FORMATTER.format(parsed);
}
