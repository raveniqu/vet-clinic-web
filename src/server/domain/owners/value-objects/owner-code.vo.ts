import { ValidationDomainError } from "#/server/domain/common/errors";
import { ValueObject } from "#/server/domain/common/value-object.base";

const OWNER_CODE_PATTERN = /^OWN-[0-9]{8}-[0-9]{4}$/;

export class OwnerCode extends ValueObject<{ readonly value: string }> {
	private constructor(value: string) {
		super({ value });
	}

	static create(raw: string): OwnerCode {
		const normalized = raw.trim();
		if (!OWNER_CODE_PATTERN.test(normalized)) {
			throw new ValidationDomainError(
				`รหัสเจ้าของ "${raw}" ไม่ถูกต้อง รูปแบบที่ต้องการคือ OWN-YYYYMMDD-NNNN`,
			);
		}
		return new OwnerCode(normalized);
	}

	get value(): string {
		return this.props.value;
	}
}
