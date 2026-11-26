import { ValidationDomainError } from "#/server/domain/common/errors";
import { ValueObject } from "#/server/domain/common/value-object.base";

const CALENDAR_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export class CalendarDate extends ValueObject<{ readonly isoDate: string }> {
	private constructor(isoDate: string) {
		super({ isoDate });
	}

	static create(raw: string): CalendarDate {
		const normalized = raw.trim();
		const match = CALENDAR_DATE_PATTERN.exec(normalized);
		if (!match) {
			throw new ValidationDomainError(
				`รูปแบบวันที่ "${raw}" ไม่ถูกต้อง รูปแบบที่ต้องการคือ YYYY-MM-DD`,
			);
		}

		const year = Number(match[1]);
		const month = Number(match[2]);
		const day = Number(match[3]);
		const utcCheck = new Date(Date.UTC(year, month - 1, day));

		if (
			utcCheck.getUTCFullYear() !== year ||
			utcCheck.getUTCMonth() !== month - 1 ||
			utcCheck.getUTCDate() !== day
		) {
			throw new ValidationDomainError(`วันที่ "${raw}" ไม่มีอยู่จริงในปฏิทิน`);
		}

		return new CalendarDate(normalized);
	}

	get isoDate(): string {
		return this.props.isoDate;
	}
}
