import { ValidationDomainError } from "#/server/domain/common/errors";

export function normalizeRequiredString(
	value: string,
	fieldName: string,
	max: number,
): string {
	const trimmed = value.trim();
	if (trimmed.length === 0 || trimmed.length > max) {
		throw new ValidationDomainError(
			`${fieldName} ต้องมีความยาวระหว่าง 1 ถึง ${max} ตัวอักษร`,
		);
	}
	return trimmed;
}

export function normalizeOptionalString(
	value: string | null | undefined,
	fieldName: string,
	max: number,
): string | null {
	if (value === null || value === undefined) {
		return null;
	}
	const trimmed = value.trim();
	if (trimmed.length === 0) {
		return null;
	}
	if (trimmed.length > max) {
		throw new ValidationDomainError(`${fieldName} ต้องไม่เกิน ${max} ตัวอักษร`);
	}
	return trimmed;
}

const BASIC_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function normalizeEmail(raw: string | null): string | null {
	const normalized = normalizeOptionalString(raw, "email", 255);
	if (normalized === null) {
		return null;
	}
	if (!BASIC_EMAIL_PATTERN.test(normalized)) {
		throw new ValidationDomainError(`รูปแบบอีเมล "${raw}" ไม่ถูกต้อง`);
	}
	return normalized;
}
