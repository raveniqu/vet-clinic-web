import "@tanstack/react-start/server-only";
import { env } from "#/server/config/env";
import { ApiClient } from "#/server/infrastructure/http/api-client";
import { ApiOwnerRepository } from "#/server/infrastructure/owners/owner-api.repository";
import { ApiOwnerQueryAdapter } from "#/server/infrastructure/owners/owner-api-query.adapter";

export const apiClient = new ApiClient({
	baseUrl: env.API_BASE_URL,
	timeoutMs: env.API_TIMEOUT_MS,
	apidogToken: env.APIDOG_TOKEN,
});

export const ownerRepository = new ApiOwnerRepository(apiClient);
export const ownerQueryAdapter = new ApiOwnerQueryAdapter(apiClient);
