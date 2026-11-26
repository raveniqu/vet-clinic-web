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

export function formatPhoneNumber(value: string | undefined | null): string {
	if (!value) return "";
	const digits = value.replace(/\D/g, "");

	if (digits.startsWith("02")) {
		if (digits.length <= 2) return digits;
		if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}}`;
		return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5, 9)}`;
	}

	if (digits.length <= 3) return digits;
	if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
	return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export function formatTaxId(value: string | undefined | null): string {
	if (!value) return "";
	const tokens = value.toUpperCase().replace(/[^0-9]/g, "");

	if (tokens.length <= 1) return tokens;
	if (tokens.length <= 5) return `${tokens.slice(0, 1)}-${tokens.slice(1)}`;
	if (tokens.length <= 10) {
		return `${tokens.slice(0, 1)}-${tokens.slice(1, 5)}-${tokens.slice(5)}`;
	}
	if (tokens.length <= 12) {
		return `${tokens.slice(0, 1)}-${tokens.slice(1, 5)}-${tokens.slice(5, 10)}-${tokens.slice(10)}`;
	}
	return `${tokens.slice(0, 1)}-${tokens.slice(1, 5)}-${tokens.slice(5, 10)}-${tokens.slice(10, 12)}-${tokens.slice(12, 13)}`;
}

export function formatThaiShortDate(
	value: Date | string | null | undefined,
	invalidFallback = "_",
): string {
	if (!value) return invalidFallback;
	const parsed = parseDateInput(value);
	if (!parsed) return invalidFallback;
	return THAI_SHORT_DATE_FORMATTER.format(parsed);
}

export function formatThaiLongDate(
	value: Date | string | null | undefined,
	invalidFallback = "_",
): string {
	if (!value) return invalidFallback;
	const parsed = parseDateInput(value);
	if (!parsed) return invalidFallback;
	return THAI_LONG_DATE_FORMATTER.format(parsed);
}

export function formatRegisteredDate(
	isoDate: string | null | undefined,
	invalidFallback = "_",
) {
	return formatThaiShortDate(isoDate, invalidFallback);
}
