import { AsyncLocalStorage } from "node:async_hooks";

export interface ApiRequestContext {
	readonly sessionId?: string;
	readonly signal?: AbortSignal;
}

const apiRequestContextStorage = new AsyncLocalStorage<ApiRequestContext>();

export function runWithApiRequestContext<T>(
	context: ApiRequestContext,
	callback: () => T,
): T {
	return apiRequestContextStorage.run(context, callback);
}

export function getApiRequestContext(): ApiRequestContext | undefined {
	return apiRequestContextStorage.getStore();
}
