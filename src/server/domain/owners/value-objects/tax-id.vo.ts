import { ValidationDomainError } from "#/server/domain/common/errors";
import { ValueObject } from "#/server/domain/common/value-object.base";

const TAX_ID_PATTERN = /^[0-9]{13}$/;

export class TaxId extends ValueObject<{ readonly value: string }> {
	private constructor(value: string) {
		super({ value });
	}

	static create(raw: string): TaxId {
		const normalized = raw.trim();
		if (!TAX_ID_PATTERN.test(normalized)) {
			throw new ValidationDomainError(
				"หมายเลขประจำตัวผู้เสียภาษีต้องมีตัวเลข 13 หลักพอดี",
			);
		}

		return new TaxId(normalized);
	}

	get value(): string {
		return this.props.value;
	}

	get masked(): string {
		return `${this.props.value.slice(0, 3)}XXXXXX${this.props.value.slice(-4)}`;
	}
}
