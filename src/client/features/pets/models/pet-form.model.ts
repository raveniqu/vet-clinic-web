import { z } from "zod";
import { getOwnerDisplayName } from "#/client/features/owners/models/owners-table.model";
import type { WizardStepNumber } from "#/client/shared/hooks/use-wizard-form";
import type {
	OwnerDetailsResponse,
	OwnerListItem,
} from "#/shared/schemas/owners.schema";

export const petSexSchema = z.enum(["Male", "Female", "Unknown"]);
export type PetSex = z.infer<typeof petSexSchema>;

export const reproductiveStatusSchema = z.enum([
	"Neutered",
	"Intact",
	"Unknown",
]);
export type ReproductiveStatus = z.infer<typeof reproductiveStatusSchema>;

export const speciesGroupSchema = z.enum([
	"CANINE",
	"FELINE",
	"EXOTIC_MAMMAL",
	"AVIAN",
	"REPTILE",
	"AMPHIBIAN",
	"OTHER",
]);
export type SpeciesGroup = z.infer<typeof speciesGroupSchema>;

export const temperamentAlertSchema = z.enum([
	"Docile",
	"Nervous",
	"Aggressive",
	"Needs Muzzle",
]);
export type TemperamentAlert = z.infer<typeof temperamentAlertSchema>;

export interface PetSpeciesOption {
	id: number;
	code: string;
	name: string;
	nameTh: string;
	group: SpeciesGroup;
}

export interface PetBreedOption {
	id: number;
	speciesId: number;
	breedName: string;
	isCustom?: boolean;
}

export interface SelectedOwnerSummary {
	ownerId: number;
	ownerCode: string;
	displayName: string;
	phoneNumber: string;
}

export interface PetFormValues extends Record<string, unknown> {
	ownerId: number | null;
	petName: string;
	speciesId: number;
	breedId: number;
	customBreedName: string;
	photo: string;
	sex: PetSex;
	reproductiveStatus: ReproductiveStatus;
	birthDateIsEstimated: boolean;
	dateOfBirth: string;
	estimatedYears: number;
	estimatedMonths: number;
	color: string;
	weight: string;
	microchipNumber: string;
	temperament: TemperamentAlert;
	allergies: string;
	medicalNotes: string;
}

export interface PetEditableRecord extends PetFormValues {
	petId: number;
	petCode: string;
	ownerSummary?: SelectedOwnerSummary;
}

export const INITIAL_SPECIES_SEEDS: readonly PetSpeciesOption[] = [
	{
		id: 1,
		code: "CANINE",
		name: "Dog",
		nameTh: "สุนัข",
		group: "CANINE",
	},
	{
		id: 2,
		code: "FELINE",
		name: "Cat",
		nameTh: "แมว",
		group: "FELINE",
	},
	{
		id: 3,
		code: "RABBIT",
		name: "Rabbit",
		nameTh: "กระต่าย",
		group: "EXOTIC_MAMMAL",
	},
	{
		id: 4,
		code: "HAMSTER",
		name: "Hamster",
		nameTh: "แฮมสเตอร์",
		group: "EXOTIC_MAMMAL",
	},
	{
		id: 5,
		code: "AVIAN",
		name: "Bird",
		nameTh: "นก",
		group: "AVIAN",
	},
	{
		id: 6,
		code: "SNAKE",
		name: "Snake",
		nameTh: "งู",
		group: "REPTILE",
	},
	{
		id: 7,
		code: "TURTLE",
		name: "Turtle",
		nameTh: "เต่า",
		group: "REPTILE",
	},
];

export const INITIAL_BREED_SEEDS: readonly PetBreedOption[] = [
	{ id: 101, speciesId: 1, breedName: "พันธุ์ผสม / พันธุ์ไทย" },
	{ id: 102, speciesId: 1, breedName: "ไม่ระบุ" },
	{ id: 103, speciesId: 1, breedName: "โกลเด้น รีทรีฟเวอร์" },
	{ id: 104, speciesId: 1, breedName: "ปอมเมอเรเนียน" },
	{ id: 105, speciesId: 1, breedName: "เฟรนช์ บูลด็อก" },
	{ id: 106, speciesId: 1, breedName: "พุดเดิ้ล / ทอย พุดเดิ้ล" },
	{ id: 107, speciesId: 1, breedName: "ไซบีเรียน ฮัสกี้" },
	{ id: 108, speciesId: 1, breedName: "เวลช์ คอร์กี้" },
	{ id: 109, speciesId: 1, breedName: "บีเกิ้ล" },
	{ id: 110, speciesId: 1, breedName: "ไทยหลังอาน" },
	{ id: 111, speciesId: 1, breedName: "ชิสุ" },
	{ id: 112, speciesId: 1, breedName: "ลาบราดอร์ รีทรีฟเวอร์" },
	{ id: 201, speciesId: 2, breedName: "พันธุ์ผสม / แมวไทยขนสั้น" },
	{ id: 202, speciesId: 2, breedName: "ไม่ระบุ" },
	{ id: 203, speciesId: 2, breedName: "บริติช ชอร์ตแฮร์" },
	{ id: 204, speciesId: 2, breedName: "เปอร์เซีย" },
	{ id: 205, speciesId: 2, breedName: "สก็อตติช โฟลด์" },
	{ id: 206, speciesId: 2, breedName: "อเมริกัน ชอร์ตแฮร์" },
	{ id: 207, speciesId: 2, breedName: "วิเชียรมาศ" },
	{ id: 208, speciesId: 2, breedName: "เมนคูน" },
	{ id: 209, speciesId: 2, breedName: "สฟิงซ์" },
	{ id: 210, speciesId: 2, breedName: "โคราช (สีสวาด)" },
	{ id: 301, speciesId: 3, breedName: "พันธุ์ผสม" },
	{ id: 302, speciesId: 3, breedName: "ไม่ระบุ" },
	{ id: 303, speciesId: 3, breedName: "ฮอลแลนด์ ลอป" },
	{ id: 304, speciesId: 3, breedName: "เนเธอร์แลนด์ ดวอร์ฟ" },
	{ id: 305, speciesId: 3, breedName: "มินิเร็กซ์" },
	{ id: 401, speciesId: 4, breedName: "วินเทอร์ไวท์" },
	{ id: 402, speciesId: 4, breedName: "ซีเรียนแฮมสเตอร์" },
	{ id: 403, speciesId: 4, breedName: "โรโบรอฟสกี้" },
	{ id: 501, speciesId: 5, breedName: "ค็อกคาเทล" },
	{ id: 502, speciesId: 5, breedName: "หงส์หยก" },
	{ id: 503, speciesId: 5, breedName: "ซันคอนัวร์" },
	{ id: 504, speciesId: 5, breedName: "เลิฟเบิร์ด" },
	{ id: 601, speciesId: 6, breedName: "งูคอร์นสเน็ก" },
	{ id: 602, speciesId: 6, breedName: "งูบอลไพธอน" },
	{ id: 701, speciesId: 7, breedName: "เต่าญี่ปุ่น (แก้มแดง)" },
	{ id: 702, speciesId: 7, breedName: "เต่าซูคาต้า" },
];

export const INITIAL_PET_FORM_VALUES: PetFormValues = {
	ownerId: null,
	petName: "",
	speciesId: 1,
	breedId: 101,
	customBreedName: "",
	photo: "",
	sex: "Unknown",
	reproductiveStatus: "Unknown",
	birthDateIsEstimated: false,
	dateOfBirth: "",
	estimatedYears: 0,
	estimatedMonths: 0,
	color: "",
	weight: "",
	microchipNumber: "",
	temperament: "Docile",
	allergies: "",
	medicalNotes: "",
};

const step1Shape = {
	ownerId: z
		.number({ error: "กรุณาเลือกเจ้าของสัตว์เลี้ยง" })
		.int()
		.positive("กรุณาเลือกเจ้าของสัตว์เลี้ยง")
		.nullable()
		.refine((val) => val !== null && val > 0, {
			message: "กรุณาเลือกเจ้าของสัตว์เลี้ยง",
		}),
	petName: z.string().trim().min(1, "กรุณาระบุชื่อสัตว์เลี้ยง"),
	speciesId: z.number().int().positive("กรุณาเลือกชนิดสัตว์"),
	breedId: z.number().int().positive("กรุณาเลือกสายพันธุ์"),
	customBreedName: z.string(),
	photo: z.string(),
};

const step2Shape = {
	sex: petSexSchema,
	reproductiveStatus: reproductiveStatusSchema,
	birthDateIsEstimated: z.boolean(),
	dateOfBirth: z.iso.date({ error: "กรุณาระบุวันเกิดของสัตว์เลี้ยง" }),
	estimatedYears: z.number().int().min(0).max(50),
	estimatedMonths: z.number().int().min(0).max(11),
	color: z.string(),
	weight: z
		.string()
		.trim()
		.min(1, "กรุณาระบุน้ำหนักเริ่มต้น")
		.refine(
			(val) => {
				const num = Number.parseFloat(val);
				return !Number.isNaN(num) && num > 0 && num < 500;
			},
			{ message: "น้ำหนักต้องเป็นตัวเลขมากกว่า 0 (หน่วยกิโลกรัม)" },
		),
};

const step3Shape = {
	microchipNumber: z.string().refine(
		(val) => {
			const trimmed = val.trim();
			if (!trimmed) return true;
			return /^[0-9]{15}$/.test(trimmed);
		},
		{ message: "หมายเลขไมโครชิปต้องเป็นตัวเลข 15 หลัก (มาตรฐาน ISO)" },
	),
	temperament: temperamentAlertSchema,
	allergies: z.string(),
	medicalNotes: z.string(),
};

export const petStep1FormSchema = z.object(step1Shape);
export const petStep2FormSchema = z.object(step2Shape);
export const petStep3FormSchema = z.object(step3Shape);

export const petFormFullSchema: z.ZodType<PetFormValues> = z.object({
	...step1Shape,
	...step2Shape,
	...step3Shape,
});

export const PET_STEP_SCHEMAS = {
	1: petStep1FormSchema,
	2: petStep2FormSchema,
	3: petStep3FormSchema,
} as const;

const PET_STEP_1_FIELDS = new Set<string>(Object.keys(step1Shape));
const PET_STEP_2_FIELDS = new Set<string>(Object.keys(step2Shape));

export function resolvePetFieldStep(fieldKey: string): WizardStepNumber {
	if (PET_STEP_1_FIELDS.has(fieldKey)) return 1;
	if (PET_STEP_2_FIELDS.has(fieldKey)) return 2;
	return 3;
}

export function mapOwnerListItemToSummary(
	owner: OwnerListItem,
): SelectedOwnerSummary {
	return {
		ownerId: owner.ownerId,
		ownerCode: owner.ownerCode,
		displayName: getOwnerDisplayName(owner),
		phoneNumber: owner.phoneNumber,
	};
}

export function mapOwnerDetailsToSummary(
	owner: OwnerDetailsResponse,
): SelectedOwnerSummary {
	return {
		ownerId: owner.ownerId,
		ownerCode: owner.ownerCode,
		displayName: getOwnerDisplayName(owner),
		phoneNumber: owner.phoneNumber,
	};
}

export function mapPetRecordToFormValues(
	pet: PetEditableRecord,
): PetFormValues {
	return {
		ownerId: pet.ownerId,
		petName: pet.petName,
		speciesId: pet.speciesId,
		breedId: pet.breedId,
		customBreedName: pet.customBreedName,
		photo: pet.photo,
		sex: pet.sex,
		reproductiveStatus: pet.reproductiveStatus,
		birthDateIsEstimated: pet.birthDateIsEstimated,
		dateOfBirth: pet.dateOfBirth,
		estimatedYears: pet.estimatedYears,
		estimatedMonths: pet.estimatedMonths,
		color: pet.color,
		weight: pet.weight,
		microchipNumber: pet.microchipNumber,
		temperament: pet.temperament,
		allergies: pet.allergies,
		medicalNotes: pet.medicalNotes,
	};
}

export function formatMicrochipNumber(
	value: string | undefined | null,
): string {
	if (!value) return "";
	const digits = value.replace(/\D/g, "").slice(0, 15);
	const groups = digits.match(/.{1,3}/g);
	return groups ? groups.join("-") : digits;
}
