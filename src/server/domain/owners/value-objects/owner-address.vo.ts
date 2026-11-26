import { normalizeRequiredString } from "#/server/domain/common/domain-guards";
import { ValidationDomainError } from "#/server/domain/common/errors";
import { ValueObject } from "#/server/domain/common/value-object.base";

export interface OwnerAddressProps {
	readonly addressId: number | null;
	readonly isDefault: boolean;
	readonly addressLine: string;
	readonly subdistrict: string;
	readonly district: string;
	readonly province: string;
	readonly postalCode: string;
}

export interface CreateOwnerAddressInput {
	readonly addressId?: number | null;
	readonly isDefault?: boolean;
	readonly addressLine: string;
	readonly subdistrict: string;
	readonly district: string;
	readonly province: string;
	readonly postalCode: string;
}

export class OwnerAddress extends ValueObject<OwnerAddressProps> {
	private constructor(props: OwnerAddressProps) {
		super(props);
	}

	static create(input: CreateOwnerAddressInput): OwnerAddress {
		const addressId = input.addressId ?? null;
		if (
			addressId !== null &&
			(!Number.isInteger(addressId) || addressId <= 0)
		) {
			throw new ValidationDomainError(
				"รหัสที่อยู่ (addressId) ต้องเป็นจำนวนเต็มบวกเมื่อมีการระบุ",
			);
		}

		return new OwnerAddress({
			addressId,
			isDefault: Boolean(input.isDefault ?? false),
			addressLine: normalizeRequiredString(
				input.addressLine,
				"addressLine",
				255,
			),
			subdistrict: normalizeRequiredString(
				input.subdistrict,
				"subdistrict",
				100,
			),
			district: normalizeRequiredString(input.district, "district", 100),
			province: normalizeRequiredString(input.province, "province", 100),
			postalCode: normalizeRequiredString(input.postalCode, "postalCode", 10),
		});
	}

	withDefault(isDefault: boolean): OwnerAddress {
		if (this.props.isDefault === isDefault) {
			return this;
		}
		return new OwnerAddress({
			...this.props,
			isDefault,
		});
	}

	get addressId(): number | null {
		return this.props.addressId;
	}

	get isDefault(): boolean {
		return this.props.isDefault;
	}

	get addressLine(): string {
		return this.props.addressLine;
	}

	get subdistrict(): string {
		return this.props.subdistrict;
	}

	get district(): string {
		return this.props.district;
	}

	get province(): string {
		return this.props.province;
	}

	get postalCode(): string {
		return this.props.postalCode;
	}

	toPlainObject(): OwnerAddressProps {
		return { ...this.props };
	}
}
