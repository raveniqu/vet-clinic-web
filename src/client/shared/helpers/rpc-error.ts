const RPC_ERROR_PATTERN = /^\[([A-Z_]+)\]\s*(.*)$/;

export type RpcErrorCode =
	| "DOMAIN_VALIDATION_ERROR"
	| "UNAUTHORIZED"
	| "FORBIDDEN"
	| "NOT_FOUND"
	| "CONFLICT"
	| "INVALID_STATE_TRANSITION"
	| "UPSTREAM_SERVICE_ERROR";

export interface ParsedRpcError {
	readonly code: RpcErrorCode | string;
	readonly detail: string;
}

const DEFAULT_FALLBACK_MESSAGE = "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง";

const ERROR_CODE_FRIENDLY_MESSAGES: Partial<Record<RpcErrorCode, string>> = {
	UNAUTHORIZED: "เซสชันหมดอายุหรือยังไม่ได้เข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
	FORBIDDEN: "คุณไม่มีสิทธิ์เข้าถึงหรือดำเนินการรายการนี้",
	NOT_FOUND: "ไม่พบข้อมูลที่ต้องการ หรือข้อมูลอาจถูกลบออกจากระบบแล้ว",
	UPSTREAM_SERVICE_ERROR: "ไม่สามารถเชื่อมต่อบริการหลักได้ชั่วคราว กรุณาลองใหม่อีกครั้ง",
};

export function parseRpcError(error: unknown): ParsedRpcError | null {
	if (!(error instanceof Error)) {
		return null;
	}

	const match = RPC_ERROR_PATTERN.exec(error.message.trim());
	if (!match) {
		return null;
	}

	return {
		code: match[1],
		detail: match[2].trim(),
	};
}

export function getUserFriendlyErrorMessage(error: unknown): string {
	const parsed = parseRpcError(error);
	if (parsed) {
		const mappedMessage =
			ERROR_CODE_FRIENDLY_MESSAGES[parsed.code as RpcErrorCode];
		if (mappedMessage) {
			return mappedMessage;
		}
		if (parsed.detail.length > 0) {
			return parsed.detail;
		}
		return DEFAULT_FALLBACK_MESSAGE;
	}
	if (error instanceof Error && error.message.trim().length > 0) {
		return error.message;
	}

	return DEFAULT_FALLBACK_MESSAGE;
}
