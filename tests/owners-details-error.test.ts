import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { classifyOwnerDetailsError } from "#/client/features/owners/models/owner-details-error.model";
import { OwnerDetailsErrorScreen } from "#/client/features/owners/screens/details-error";
import { OwnerDetailsNotFoundScreen } from "#/client/features/owners/screens/details-not-found";
import { Route } from "#/routes/_private/owners/$ownerId";

describe("owner details error & not-found handling", () => {
	it("wires OwnerDetailsErrorScreen and OwnerDetailsNotFoundScreen on the route", () => {
		assert.equal(Route.options.errorComponent, OwnerDetailsErrorScreen);
		assert.equal(Route.options.notFoundComponent, OwnerDetailsNotFoundScreen);
	});

	it("classifies UPSTREAM_SERVICE_ERROR with Thai copy and technical metadata", () => {
		const result = classifyOwnerDetailsError(
			new Error(
				"[UPSTREAM_SERVICE_ERROR] Upstream API returned an unexpected payload format.",
			),
		);

		assert.equal(result.kind, "upstream");
		assert.equal(result.requiresSignIn, false);
		assert.equal(result.technicalCode, "UPSTREAM_SERVICE_ERROR");
		assert.equal(
			result.technicalMessage,
			"[UPSTREAM_SERVICE_ERROR] Upstream API returned an unexpected payload format.",
		);
	});

	it("classifies UNAUTHORIZED errors to prompt sign-in", () => {
		const result = classifyOwnerDetailsError(
			new Error("[UNAUTHORIZED] Authentication required. Please sign in."),
		);

		assert.equal(result.kind, "unauthorized");
		assert.equal(result.requiresSignIn, true);
		assert.equal(result.technicalCode, "UNAUTHORIZED");
	});

	it("classifies FORBIDDEN errors cleanly without sign-in redirect", () => {
		const result = classifyOwnerDetailsError(
			new Error("[FORBIDDEN] Access denied."),
		);

		assert.equal(result.kind, "forbidden");
		assert.equal(result.requiresSignIn, false);
		assert.equal(result.technicalCode, "FORBIDDEN");
	});

	it("falls back safely for generic and non-Error throwables", () => {
		const generic = classifyOwnerDetailsError(new Error("Boom"));
		assert.equal(generic.kind, "unexpected");
		assert.equal(generic.technicalCode, null);
		assert.equal(generic.technicalMessage, "Boom");

		const nonError = classifyOwnerDetailsError("raw-string");
		assert.equal(nonError.kind, "unexpected");
		assert.equal(nonError.technicalCode, null);
		assert.equal(nonError.technicalMessage, "Unknown error");
	});
});
