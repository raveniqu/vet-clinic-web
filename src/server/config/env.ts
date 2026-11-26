import "@tanstack/react-start/server-only";
import { z } from "zod";

const booleanEnvFlagSchema = z
	.enum(["true", "false"])
	.default("true")
	.transform((value) => value === "true");

const serverEnvSchema = z.object({
	API_BASE_URL: z
		.url("API_BASE_URL must be a valid URL")
		.transform((value) => value.replace(/\/+$/, "")),
	API_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(10000),
	APIDOG_TOKEN: z.string().min(1).optional(),
	REQUIRE_SESSION_COOKIE: booleanEnvFlagSchema,
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function parseServerEnv(): ServerEnv {
	const result = serverEnvSchema.safeParse({
		API_BASE_URL: process.env.API_BASE_URL,
		API_TIMEOUT_MS: process.env.API_TIMEOUT_MS,
		APIDOG_TOKEN: process.env.APIDOG_TOKEN || undefined,
		REQUIRE_SESSION_COOKIE: process.env.REQUIRE_SESSION_COOKIE || undefined,
	});

	if (!result.success) {
		const invalidKeys = result.error.issues
			.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
			.join("; ");
		throw new Error(`Invalid server environment configuration: ${invalidKeys}`);
	}

	return result.data;
}

export const env: ServerEnv = parseServerEnv();
