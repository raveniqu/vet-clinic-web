import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { QueryClient } from "@tanstack/react-query";
import { ownersKeys } from "#/client/caches/owners/keys";
import { reconcileSearchInputSync } from "#/client/features/owners/hooks/use-owners-search-input";
import {
	ownersRouteSearchSchema,
	pickOwnersApiSearchParams,
} from "#/client/features/owners/models/owners-route-search.model";
import { Route } from "#/routes/_private/owners/index";
import { ownersSearchParamsSchema } from "#/shared/schemas/owners.schema";

type OwnersLoaderFn = Extract<
	NonNullable<typeof Route.options.loader>,
	(...args: never[]) => unknown
>;

function getOwnersLoaderFn(): OwnersLoaderFn {
	const loader = Route.options.loader;
	assert.equal(typeof loader, "function");
	if (typeof loader !== "function") {
		throw new Error("Route loader must be a function");
	}
	return loader;
}

function createStubLoaderContext(
	queryClient: QueryClient,
	cause: "enter" | "stay" | "preload",
) {
	const search = ownersRouteSearchSchema.parse({
		page: 1,
		limit: 10,
		search: "เอก",
		sort: "created_at:desc",
	});
	const deps = pickOwnersApiSearchParams(search);

	return {
		deps,
		loaderContext: {
			abortController: new AbortController(),
			preload: cause === "preload",
			params: {},
			deps,
			context: { queryClient },
			location: {
				href: "/owners?page=1&limit=10&search=%E0%B9%80%E0%B8%AD%E0%B8%81&sort=created_at%3Adesc",
				pathname: "/owners",
				search,
				searchStr:
					"?page=1&limit=10&search=%E0%B9%80%E0%B8%AD%E0%B8%81&sort=created_at%3Adesc",
				state: {},
				hash: "",
				maskedLocation: undefined,
				unmaskedLocation: undefined,
			},
			navigate: () => undefined,
			parentMatchPromise: Promise.resolve(undefined as never),
			cause,
			route: Route,
		} as unknown as Parameters<OwnersLoaderFn>[0],
	};
}

describe("owners search & route loader regression tests", () => {
	it("preserves Thai search parameter across route and API search schemas", () => {
		const routeParsed = ownersRouteSearchSchema.parse({
			page: "1",
			limit: "10",
			search: "เอก",
			sort: "created_at:desc",
		});
		const apiDeps = pickOwnersApiSearchParams(routeParsed);
		const validated = ownersSearchParamsSchema.parse(apiDeps);

		assert.deepEqual(validated, {
			page: 1,
			limit: 10,
			search: "เอก",
			sort: "created_at:desc",
			ownerType: undefined,
			acquisitionChannel: undefined,
			createdFrom: undefined,
			createdTo: undefined,
		});
	});

	it("does not block or reject on cause='stay' so in-page search keeps OwnersScreen mounted", async () => {
		const loader = getOwnersLoaderFn();

		const queryClient = new QueryClient();
		let capturedKey: unknown;
		let rejectSlowQuery: ((reason?: unknown) => void) | undefined;

		queryClient.query = ((options: { queryKey: unknown }) => {
			capturedKey = options.queryKey;
			return new Promise((_resolve, reject) => {
				rejectSlowQuery = reject;
			});
		}) as typeof queryClient.query;

		const { deps, loaderContext } = createStubLoaderContext(
			queryClient,
			"stay",
		);

		const raceResult = await Promise.race([
			Promise.resolve(loader(loaderContext)).then(() => "resolved-immediately"),
			new Promise<string>((resolve) =>
				setTimeout(() => resolve("timed-out-blocking"), 20),
			),
		]);

		assert.equal(raceResult, "resolved-immediately");
		assert.deepEqual(capturedKey, ownersKeys.list(deps));

		// Ensure rejecting background prefetch does not surface an unhandled rejection
		rejectSlowQuery?.(new Error("Simulated network error"));
		await new Promise((resolve) => setTimeout(resolve, 10));
	});

	it("awaits queryClient.query on cause='enter' for SSR and initial navigation", async () => {
		const loader = getOwnersLoaderFn();

		const queryClient = new QueryClient();
		const expectedPayload = {
			page: 1,
			limit: 10,
			totalItems: 1,
			totalPages: 1,
			hasNext: false,
			hasPrev: false,
			data: [],
		};
		let resolved = false;

		queryClient.query = (async () => {
			await new Promise((resolve) => setTimeout(resolve, 15));
			resolved = true;
			return expectedPayload;
		}) as unknown as typeof queryClient.query;

		const { loaderContext } = createStubLoaderContext(queryClient, "enter");
		const result = await loader(loaderContext);

		assert.equal(resolved, true);
		assert.deepEqual(result, expectedPayload);
	});

	it("reconciles local debounced dispatches vs external search resets without clobbering keystrokes", () => {
		const queue: string[] = ["เ", "เอก"];

		// First debounced dispatch commits while user has already typed "เอก"
		assert.deepEqual(reconcileSearchInputSync(queue, "เ"), {
			shouldSyncInput: false,
			nextInput: "เ",
		});
		assert.deepEqual(queue, ["เอก"]);

		// Second debounced dispatch commits
		assert.deepEqual(reconcileSearchInputSync(queue, "เอก"), {
			shouldSyncInput: false,
			nextInput: "เอก",
		});
		assert.deepEqual(queue, []);

		// External reset (e.g. resetFilters) clears input
		assert.deepEqual(reconcileSearchInputSync(queue, ""), {
			shouldSyncInput: true,
			nextInput: "",
		});

		// Browser Back returning to previously searched term syncs input
		assert.deepEqual(reconcileSearchInputSync(queue, "เอก"), {
			shouldSyncInput: true,
			nextInput: "เอก",
		});
	});
});
