export type OwnerType = "INDIVIDUAL" | "JURISTIC";
export type IndividualPrefix = "MR" | "MRS" | "MS";
export type JuristicPrefix = "COMMERCIAL" | "NON_PROFIT" | "OTHER";
export type OwnerPrefix = IndividualPrefix | JuristicPrefix;
export type OwnerGender = "MALE" | "FEMALE" | "NOT_SPECIFIED";
export type AcquisitionChannel =
	| "WALK_IN"
	| "LINE_OA"
	| "WEB_PORTAL"
	| "REFERRAL"
	| "SOCIAL_MEDIA"
	| "CAMPAIGN";

const INDIVIDUAL_PREFIX_SET: ReadonlySet<string> = new Set(["MR", "MRS", "MS"]);
const JURISTIC_PREFIX_SET: ReadonlySet<string> = new Set([
	"COMMERCIAL",
	"NON_PROFIT",
	"OTHER",
]);

export function isIndividualPrefix(
	prefix: OwnerPrefix,
): prefix is IndividualPrefix {
	return INDIVIDUAL_PREFIX_SET.has(prefix);
}
export function isJuristicPrefix(
	prefix: OwnerPrefix,
): prefix is JuristicPrefix {
	return JURISTIC_PREFIX_SET.has(prefix);
}
