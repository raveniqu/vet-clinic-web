import { AggregateRoot } from "#/server/domain/common/aggregate-root.base";
import {
	normalizeEmail,
	normalizeOptionalString,
	normalizeRequiredString,
} from "#/server/domain/common/domain-guards";
import { ValidationDomainError } from "#/server/domain/common/errors";
import type {
	AcquisitionChannel,
	IndividualPrefix,
	JuristicPrefix,
	OwnerGender,
	OwnerPrefix,
	OwnerType,
} from "../types/owner.types";
import { isIndividualPrefix, isJuristicPrefix } from "../types/owner.types";
import type { CalendarDate } from "../value-objects/calendar-date.vo";
import type { OwnerAddress } from "../value-objects/owner-address.vo";
import type { OwnerCode } from "../value-objects/owner-code.vo";
import type {
	OwnerConsents,
	OwnerConsentsProps,
} from "../value-objects/owner-consents.vo";
import type { TaxId } from "../value-objects/tax-id.vo";

const TRANSIENT_OWNER_ID = 0;

export type OwnerClassification =
	| {
			readonly ownerType: "INDIVIDUAL";
			readonly prefix: IndividualPrefix;
			readonly lastName: string | null;
			readonly dateOfBirth: CalendarDate | null;
			readonly gender: OwnerGender;
	  }
	| {
			readonly ownerType: "JURISTIC";
			readonly prefix: JuristicPrefix;
			readonly lastName: string | null;
			readonly dateOfBirth: null;
			readonly gender: "NOT_SPECIFIED";
	  };

export type OwnerWriteClassification =
	| {
			readonly ownerType: "INDIVIDUAL";
			readonly prefix: IndividualPrefix;
			readonly lastName: string;
			readonly dateOfBirth: CalendarDate;
			readonly gender: OwnerGender;
	  }
	| {
			readonly ownerType: "JURISTIC";
			readonly prefix: JuristicPrefix;
			readonly lastName: null;
			readonly dateOfBirth: null;
			readonly gender: "NOT_SPECIFIED";
	  };

export interface OwnerAddresses {
	readonly residential: OwnerAddress | null;
	readonly billing: OwnerAddress | null;
}

export interface OwnerWriteAddresses {
	readonly residential: OwnerAddress;
	readonly billing: OwnerAddress | null;
}

export interface OwnerProps {
	readonly ownerCode: OwnerCode | null;
	readonly classification: OwnerClassification;
	readonly firstName: string;
	readonly taxId: TaxId;
	readonly phoneNumber: string;
	readonly lineId: string | null;
	readonly email: string | null;
	readonly acquisitionChannel: AcquisitionChannel | null;
	readonly addresses: OwnerAddresses;
	readonly consents: OwnerConsents;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface CreateOwnerParams {
	readonly classification: OwnerWriteClassification;
	readonly firstName: string;
	readonly taxId: TaxId;
	readonly phoneNumber: string;
	readonly lineId: string | null;
	readonly email: string | null;
	readonly acquisitionChannel: AcquisitionChannel;
	readonly addresses: OwnerWriteAddresses;
	readonly consents: OwnerConsents;
}

export interface UpdateOwnerProfileParams {
	readonly classification: OwnerWriteClassification;
	readonly firstName: string;
	readonly taxId: TaxId;
	readonly phoneNumber: string;
	readonly lineId: string | null;
	readonly email: string | null;
	readonly acquisitionChannel: AcquisitionChannel;
	readonly addresses: OwnerWriteAddresses;
	readonly consents: OwnerConsents;
}

export interface UpdateOwnerContactParams {
	readonly phoneNumber: string;
	readonly lineId: string | null;
	readonly email: string | null;
}

function normalizeAndValidateClassification(
	classification: OwnerClassification,
): OwnerClassification {
	const lastName = normalizeOptionalString(
		classification.lastName,
		"lastName",
		150,
	);

	if (classification.ownerType === "INDIVIDUAL") {
		if (!isIndividualPrefix(classification.prefix)) {
			throw new ValidationDomainError(
				`คำนำหน้า "${classification.prefix}" ไม่ถูกต้องสำหรับเจ้าของที่เป็นบุคคลธรรมดา`,
			);
		}
		return {
			ownerType: "INDIVIDUAL",
			prefix: classification.prefix,
			lastName,
			dateOfBirth: classification.dateOfBirth,
			gender: classification.gender,
		};
	}

	if (!isJuristicPrefix(classification.prefix)) {
		throw new ValidationDomainError(
			`คำนำหน้า "${classification.prefix}" ไม่ถูกต้องสำหรับเจ้าของประเภทนิติบุคคล`,
		);
	}
	if (classification.dateOfBirth !== null) {
		throw new ValidationDomainError("เจ้าของประเภทนิติบุคคลไม่สามารถมีวันเกิดได้");
	}
	if (classification.gender !== "NOT_SPECIFIED") {
		throw new ValidationDomainError(
			'เจ้าของประเภทนิติบุคคลต้องระบุเพศเป็น "NOT_SPECIFIED" เท่านั้น',
		);
	}

	return {
		ownerType: "JURISTIC",
		prefix: classification.prefix,
		lastName,
		dateOfBirth: null,
		gender: "NOT_SPECIFIED",
	};
}

function normalizeWriteClassification(
	classification: OwnerWriteClassification,
): OwnerClassification {
	if (classification.ownerType === "INDIVIDUAL") {
		return {
			ownerType: "INDIVIDUAL",
			prefix: classification.prefix,
			lastName: normalizeRequiredString(
				classification.lastName,
				"lastName",
				100,
			),
			dateOfBirth: classification.dateOfBirth,
			gender: classification.gender,
		};
	}

	return {
		ownerType: "JURISTIC",
		prefix: classification.prefix,
		lastName: null,
		dateOfBirth: null,
		gender: "NOT_SPECIFIED",
	};
}

function assertWriteInvariants(
	params: CreateOwnerParams | UpdateOwnerProfileParams,
): void {
	if (!params.consents.privacyPolicy) {
		throw new ValidationDomainError(
			"ต้องให้ความยินยอมนโยบายความเป็นส่วนตัว (privacyPolicy) ก่อนบันทึกข้อมูล",
		);
	}
	if (!params.addresses.residential) {
		throw new ValidationDomainError(
			"ต้องระบุที่อยู่ปัจจุบัน (residential) อย่างน้อย 1 รายการ",
		);
	}
}

function normalizeAndValidateAddresses(
	addresses: OwnerAddresses,
): OwnerAddresses {
	const residential = addresses.residential;
	const billing = addresses.billing;

	if (residential?.isDefault && billing?.isDefault) {
		throw new ValidationDomainError(
			"สามารถกำหนดเป็นที่อยู่หลัก (isDefault) ได้เพียง 1 รายการเท่านั้น",
		);
	}

	if (residential && !residential.isDefault && !billing?.isDefault) {
		return Object.freeze({
			residential: residential.withDefault(true),
			billing,
		});
	}

	return Object.freeze({
		residential,
		billing,
	});
}

function validateAndNormalizeProps(props: OwnerProps): OwnerProps {
	if (
		Number.isNaN(props.createdAt.getTime()) ||
		Number.isNaN(props.updatedAt.getTime())
	) {
		throw new ValidationDomainError("วันที่สร้างและวันที่แก้ไขข้อมูลเจ้าของสัตว์ต้องถูกต้อง");
	}
	if (props.updatedAt.getTime() < props.createdAt.getTime()) {
		throw new ValidationDomainError(
			"วันที่อัปเดตข้อมูลเจ้าของสัตว์ต้องไม่เก่ากว่าวันที่สร้างข้อมูล",
		);
	}

	return {
		ownerCode: props.ownerCode,
		classification: normalizeAndValidateClassification(props.classification),
		firstName: normalizeRequiredString(props.firstName, "firstName", 255),
		taxId: props.taxId,
		phoneNumber: normalizeRequiredString(props.phoneNumber, "phoneNumber", 30),
		lineId: normalizeOptionalString(props.lineId, "lineId", 100),
		email: normalizeEmail(props.email),
		acquisitionChannel: props.acquisitionChannel,
		addresses: normalizeAndValidateAddresses(props.addresses),
		consents: props.consents,
		createdAt: new Date(props.createdAt.getTime()),
		updatedAt: new Date(props.updatedAt.getTime()),
	};
}

export class Owner extends AggregateRoot<OwnerProps, number> {
	private constructor(ownerId: number, props: OwnerProps) {
		super(ownerId, props);
	}

	static create(params: CreateOwnerParams): Owner {
		assertWriteInvariants(params);
		const now = new Date();
		const validated = validateAndNormalizeProps({
			ownerCode: null,
			classification: normalizeWriteClassification(params.classification),
			firstName: params.firstName,
			taxId: params.taxId,
			phoneNumber: params.phoneNumber,
			lineId: params.lineId,
			email: params.email,
			acquisitionChannel: params.acquisitionChannel,
			addresses: params.addresses,
			consents: params.consents,
			createdAt: now,
			updatedAt: now,
		});

		const owner = new Owner(TRANSIENT_OWNER_ID, validated);
		owner.addDomainEvent({
			eventName: "OwnerCreated",
			occurredAt: now,
		});
		return owner;
	}

	static reconstitute(ownerId: number, props: OwnerProps): Owner {
		if (!Number.isInteger(ownerId) || ownerId <= 0) {
			throw new ValidationDomainError("รหัสเจ้าของสัตว์ที่บันทึกไว้ต้องเป็นจำนวนเต็มบวก");
		}
		if (props.ownerCode === null) {
			throw new ValidationDomainError("ข้อมูลเจ้าของสัตว์ที่บันทึกไว้ต้องมีรหัสเจ้าของ");
		}
		return new Owner(ownerId, validateAndNormalizeProps(props));
	}

	updateProfile(params: UpdateOwnerProfileParams): void {
		if (
			params.classification.ownerType !== this.props.classification.ownerType
		) {
			throw new ValidationDomainError("ไม่สามารถเปลี่ยนประเภทเจ้าของสัตว์ได้");
		}

		assertWriteInvariants(params);

		const now = new Date();
		this.props = validateAndNormalizeProps({
			ownerCode: this.props.ownerCode,
			classification: normalizeWriteClassification(params.classification),
			firstName: params.firstName,
			taxId: params.taxId,
			phoneNumber: params.phoneNumber,
			lineId: params.lineId,
			email: params.email,
			acquisitionChannel: params.acquisitionChannel,
			addresses: params.addresses,
			consents: params.consents,
			createdAt: this.props.createdAt,
			updatedAt: now,
		});

		this.addDomainEvent({
			eventName: "OwnerUpdated",
			occurredAt: now,
		});
	}

	updateContact(params: UpdateOwnerContactParams): void {
		this.props = validateAndNormalizeProps({
			...this.props,
			phoneNumber: params.phoneNumber,
			lineId: params.lineId,
			email: params.email,
			updatedAt: new Date(),
		});
	}

	updateAddresses(addresses: OwnerAddresses): void {
		this.props = validateAndNormalizeProps({
			...this.props,
			addresses,
			updatedAt: new Date(),
		});
	}

	updateConsents(partial: Partial<OwnerConsentsProps>): void {
		this.props = validateAndNormalizeProps({
			...this.props,
			consents: this.props.consents.withUpdates(partial),
			updatedAt: new Date(),
		});
	}

	get ownerCode(): OwnerCode | null {
		return this.props.ownerCode;
	}

	get classification(): OwnerClassification {
		return this.props.classification;
	}

	get ownerType(): OwnerType {
		return this.props.classification.ownerType;
	}

	get prefix(): OwnerPrefix {
		return this.props.classification.prefix;
	}

	get firstName(): string {
		return this.props.firstName;
	}

	get lastName(): string | null {
		return this.props.classification.lastName;
	}

	get taxId(): TaxId {
		return this.props.taxId;
	}

	get dateOfBirth(): CalendarDate | null {
		return this.props.classification.dateOfBirth;
	}

	get gender(): OwnerGender {
		return this.props.classification.gender;
	}

	get phoneNumber(): string {
		return this.props.phoneNumber;
	}

	get lineId(): string | null {
		return this.props.lineId;
	}

	get email(): string | null {
		return this.props.email;
	}

	get acquisitionChannel(): AcquisitionChannel | null {
		return this.props.acquisitionChannel;
	}

	get residentialAddress(): OwnerAddress | null {
		return this.props.addresses.residential;
	}

	get billingAddress(): OwnerAddress | null {
		return this.props.addresses.billing;
	}

	get consents(): OwnerConsents {
		return this.props.consents;
	}

	get createdAt(): Date {
		return new Date(this.props.createdAt.getTime());
	}

	get updatedAt(): Date {
		return new Date(this.props.updatedAt.getTime());
	}
}
