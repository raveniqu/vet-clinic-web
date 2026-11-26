import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

// Preserve Nitro's built-in ignored warning codes when providing a custom onwarn.
const NITRO_IGNORED_WARNING_CODES = new Set([
	"EVAL",
	"CIRCULAR_DEPENDENCY",
	"THIS_IS_UNDEFINED",
	"EMPTY_BUNDLE",
]);

const TANSTACK_NODE_MODULES_RE = /[/\\]node_modules[/\\]@tanstack[/\\]/;

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		nitro({
			rollupConfig: { external: [/^@sentry\//] },
			rolldownConfig: {
				onwarn(warning, warn) {
					if (warning.code && NITRO_IGNORED_WARNING_CODES.has(warning.code)) {
						return;
					}
					// @tanstack/react-router ships "use client" for RSC; Rolldown warns when bundling it for Nitro SSR.
					const target = warning.id ?? warning.loc?.file ?? warning.message;
					if (
						warning.code === "MODULE_LEVEL_DIRECTIVE" &&
						TANSTACK_NODE_MODULES_RE.test(target)
					) {
						return;
					}
					warn(warning);
				},
			},
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});

export default config;
