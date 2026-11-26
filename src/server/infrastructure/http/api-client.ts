import { z } from "zod";
import {
	ConflictDomainError,
	ForbiddenDomainError,
	NotFoundDomainError,
	UnauthorizedDomainError,
	ValidationDomainError,
} from "#/server/domain/common/errors";
import { UpstreamServiceError } from "./errors";
import { getApiRequestContext } from "./request-context";

const apiErrorResponseSchema = z.object({
	error_message: z.string().min(1),
});

const SAFE_COOKIE_VALUE_PATTERN = /^[^\s;]+$/;

export interface ApiClientConfig {
	readonly baseUrl: string;
	readonly timeoutMs: number;
	readonly apidogToken?: string;
}

export type ApiQueryParams = Record<string, string | number | undefined>;
export type ApiHttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface ApiGetOptions {
	readonly query?: ApiQueryParams;
}

export interface ApiRequestOptions {
	readonly query?: ApiQueryParams;
	readonly body?: unknown;
}

export class ApiClient {
	private readonly baseUrl: string;
	private readonly timeoutMs: number;
	private readonly apidogToken?: string;

	constructor(config: ApiClientConfig) {
		this.baseUrl = config.baseUrl.replace(/\/+$/, "");
		this.timeoutMs = config.timeoutMs;
		this.apidogToken = config.apidogToken;
	}

	async getJson<TOutput>(
		path: string,
		schema: z.ZodType<TOutput>,
		options?: ApiGetOptions,
	): Promise<TOutput> {
		const response = await this.executeRequest("GET", path, {
			query: options?.query,
		});
		if (!response.ok) {
			throw await this.mapHttpError(path, response);
		}
		return this.parseSuccessResponse(path, response, schema);
	}

	async getOptionalJson<TOutput>(
		path: string,
		schema: z.ZodType<TOutput>,
		options?: ApiGetOptions,
	): Promise<TOutput | null> {
		const response = await this.executeRequest("GET", path, {
			query: options?.query,
		});
		if (response.status === 404) {
			return null;
		}
		if (!response.ok) {
			throw await this.mapHttpError(path, response);
		}
		return this.parseSuccessResponse(path, response, schema);
	}

	async postJson<TOutput>(
		path: string,
		body: unknown,
		schema: z.ZodType<TOutput>,
		options?: ApiGetOptions,
	): Promise<TOutput> {
		const response = await this.executeRequest("POST", path, {
			query: options?.query,
			body,
		});
		if (!response.ok) {
			throw await this.mapHttpError(path, response);
		}
		return this.parseSuccessResponse(path, response, schema);
	}

	async putNoContent(
		path: string,
		body: unknown,
		options?: ApiGetOptions,
	): Promise<void> {
		const response = await this.executeRequest("PUT", path, {
			query: options?.query,
			body,
		});
		if (!response.ok) {
			throw await this.mapHttpError(path, response);
		}
	}

	async deleteNoContent(path: string, options?: ApiGetOptions): Promise<void> {
		const response = await this.executeRequest("DELETE", path, {
			query: options?.query,
		});
		if (!response.ok) {
			throw await this.mapHttpError(path, response);
		}
	}

	private async executeRequest(
		method: ApiHttpMethod,
		path: string,
		options?: ApiRequestOptions,
	): Promise<Response> {
		const url = this.buildUrl(path, options?.query);
		const requestContext = getApiRequestContext();
		const hasBody = options?.body !== undefined;
		const headers = this.buildHeaders(requestContext?.sessionId, hasBody);
		const timeoutSignal = AbortSignal.timeout(this.timeoutMs);
		const signal = requestContext?.signal
			? AbortSignal.any([requestContext.signal, timeoutSignal])
			: timeoutSignal;

		try {
			return await fetch(url, {
				method,
				headers,
				body: hasBody ? JSON.stringify(options.body) : undefined,
				signal,
			});
		} catch (error) {
			if (error instanceof DOMException && error.name === "TimeoutError") {
				throw new UpstreamServiceError(
					"Upstream API request timed out. Please try again.",
				);
			}
			if (error instanceof DOMException && error.name === "AbortError") {
				throw new UpstreamServiceError("Upstream API request was cancelled.");
			}
			const errorName =
				error instanceof Error ? error.name : "UnknownNetworkError";
			console.error("[ApiClient] Network failure", {
				method,
				path,
				errorName,
			});
			throw new UpstreamServiceError("Unable to reach upstream API service.");
		}
	}

	private buildUrl(path: string, query?: ApiQueryParams): URL {
		const normalizedPath = path.startsWith("/") ? path : `/${path}`;
		const url = new URL(`${this.baseUrl}${normalizedPath}`);

		if (!query) {
			return url;
		}

		for (const [key, value] of Object.entries(query)) {
			if (value === undefined) {
				continue;
			}
			if (typeof value === "string" && value.length === 0) {
				continue;
			}
			url.searchParams.set(key, String(value));
		}

		return url;
	}

	private buildHeaders(sessionId?: string, hasBody = false): Headers {
		const headers = new Headers({
			Accept: "application/json",
		});

		if (hasBody) {
			headers.set("Content-Type", "application/json");
		}

		if (sessionId) {
			if (!SAFE_COOKIE_VALUE_PATTERN.test(sessionId)) {
				throw new UnauthorizedDomainError("Invalid session identifier.");
			}
			headers.set("Cookie", `session_id=${sessionId}`);
		}

		if (this.apidogToken) {
			headers.set("apidogToken", this.apidogToken);
		}

		return headers;
	}

	private async parseSuccessResponse<TOutput>(
		path: string,
		response: Response,
		schema: z.ZodType<TOutput>,
	): Promise<TOutput> {
		let rawBody: unknown;
		try {
			rawBody = await response.json();
		} catch {
			console.error("[ApiClient] Invalid JSON response", {
				path,
				status: response.status,
			});
			throw new UpstreamServiceError(
				"Received malformed JSON from upstream API.",
			);
		}

		const parsed = schema.safeParse(rawBody);
		if (!parsed.success) {
			const issuePaths = parsed.error.issues
				.slice(0, 10)
				.map((issue) => issue.path.join(".") || "<root>");
			console.error("[ApiClient] Response contract validation failed", {
				path,
				issueCount: parsed.error.issues.length,
				issuePaths,
			});
			throw new UpstreamServiceError(
				"Upstream API returned an unexpected payload format.",
			);
		}

		return parsed.data;
	}

	private async mapHttpError(path: string, response: Response): Promise<Error> {
		const message = await this.readErrorMessage(response);

		switch (response.status) {
			case 400:
			case 422:
				return new ValidationDomainError(message);
			case 401:
				return new UnauthorizedDomainError(message);
			case 403:
				return new ForbiddenDomainError(message);
			case 404:
				return new NotFoundDomainError(message);
			case 409:
				return new ConflictDomainError(message);
			default:
				console.error("[ApiClient] Upstream HTTP error", {
					path,
					status: response.status,
				});
				return new UpstreamServiceError(
					"An unexpected upstream service error occurred.",
				);
		}
	}

	private async readErrorMessage(response: Response): Promise<string> {
		try {
			const rawBody: unknown = await response.json();
			const parsed = apiErrorResponseSchema.safeParse(rawBody);
			if (parsed.success) {
				return parsed.data.error_message;
			}
		} catch {
			// Fallback to HTTP status text when error body is not JSON.
		}

		return response.statusText || `HTTP ${response.status}`;
	}
}
