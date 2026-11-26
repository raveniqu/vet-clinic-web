import { parseRpcError } from "#/client/shared/helpers/rpc-error";

export type OwnerDetailsErrorKind =
	| "upstream"
	| "unauthorized"
	| "forbidden"
	| "unexpected";

export interface OwnerDetailsErrorPresentation {
	readonly kind: OwnerDetailsErrorKind;
	readonly badgeLabel: string;
	readonly title: string;
	readonly description: string;
	readonly requiresSignIn: boolean;
	readonly technicalCode: string | null;
	readonly technicalMessage: string;
}

/**
 * Maps unknown route/query errors on the owner details page into clear Thai UX copy
 * while keeping raw error metadata separate for progressive-disclosure diagnostics.
 */
export function classifyOwnerDetailsError(
	error: unknown,
): OwnerDetailsErrorPresentation {
	const parsed = parseRpcError(error);
	const technicalCode = parsed?.code ?? null;
	const technicalMessage =
		error instanceof Error && error.message.trim().length > 0
			? error.message.trim()
			: "Unknown error";

	switch (technicalCode) {
		case "UPSTREAM_SERVICE_ERROR":
			return {
				kind: "upstream",
				badgeLabel: "เชื่อมต่อบริการหลักไม่ได้",
				title: "ไม่สามารถโหลดข้อมูลเจ้าของสัตว์เลี้ยงได้",
				description:
					"บริการหลักตอบกลับข้อมูลไม่ถูกต้องหรือยังไม่พร้อมใช้งานชั่วคราว กรุณาลองโหลดข้อมูลใหม่อีกครั้ง หรือกลับไปหน้ารายชื่อเจ้าของ",
				requiresSignIn: false,
				technicalCode,
				technicalMessage,
			};
		case "UNAUTHORIZED":
			return {
				kind: "unauthorized",
				badgeLabel: "ต้องเข้าสู่ระบบใหม่",
				title: "เซสชันการใช้งานหมดอายุหรือไม่ถูกต้อง",
				description: "กรุณาเข้าสู่ระบบใหม่อีกครั้งเพื่อดูประวัติและรายละเอียดเจ้าของสัตว์เลี้ยง",
				requiresSignIn: true,
				technicalCode,
				technicalMessage,
			};
		case "FORBIDDEN":
			return {
				kind: "forbidden",
				badgeLabel: "ไม่มีสิทธิ์เข้าถึง",
				title: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลเจ้าของสัตว์เลี้ยงรายนี้",
				description:
					"บัญชีผู้ใช้งานปัจจุบันไม่ได้รับอนุญาตให้เปิดดูประวัติเจ้าของสัตว์เลี้ยง กรุณาติดต่อผู้ดูแลระบบหรือกลับไปหน้ารายชื่อเจ้าของ",
				requiresSignIn: false,
				technicalCode,
				technicalMessage,
			};
		default:
			return {
				kind: "unexpected",
				badgeLabel: "เกิดข้อผิดพลาด",
				title: "ไม่สามารถเปิดดูประวัติเจ้าของสัตว์เลี้ยงได้",
				description:
					"เกิดข้อผิดพลาดที่ไม่คาดคิดระหว่างโหลดข้อมูล กรุณาลองโหลดข้อมูลใหม่อีกครั้ง หรือกลับไปหน้ารายชื่อเจ้าของ",
				requiresSignIn: false,
				technicalCode,
				technicalMessage,
			};
	}
}
