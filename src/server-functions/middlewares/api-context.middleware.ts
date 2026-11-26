import { createMiddleware } from "@tanstack/react-start";
import {
	getCookie,
	setResponseHeader,
	setResponseStatus,
} from "@tanstack/react-start/server";
import { env } from "#/server/config/env";
import type { DomainErrorCode } from "#/server/domain/common/errors";
import {
	DomainError,
	UnauthorizedDomainError,
} from "#/server/domain/common/errors";
import { InfrastructureError } from "#/server/infrastructure/http/errors";
import { runWithApiRequestContext } from "#/server/infrastructure/http/request-context";

const DOMAIN_ERROR_STATUS_MAP: Record<DomainErrorCode, number> = {
	DOMAIN_VALIDATION_ERROR: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	INVALID_STATE_TRANSITION: 422,
};

export const apiContextMiddleware = createMiddleware({
	type: "function",
}).server(async ({ next, signal }) => {
	const sessionId = getCookie("session_id");
	setResponseHeader("Cache-Control", "no-store");

	try {
		if (env.REQUIRE_SESSION_COOKIE && !sessionId) {
			throw new UnauthorizedDomainError(
				"Authentication required. Please sign in.",
			);
		}

		return await runWithApiRequestContext({ sessionId, signal }, () => next());
	} catch (error) {
		if (error instanceof DomainError) {
			setResponseStatus(DOMAIN_ERROR_STATUS_MAP[error.code]);
			throw new Error(`[${error.code}] ${error.message}`);
		}

		if (error instanceof InfrastructureError) {
			setResponseStatus(502);
			throw new Error(`[${error.code}] ${error.message}`);
		}

		throw error;
	}
});
