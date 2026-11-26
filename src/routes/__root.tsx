import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { AppRootDocument } from "#/client/core/app-root";
import { AppEntryPoint } from "#/client/core/screens/app-entry-point";
import { AppErrorScreen } from "#/client/core/screens/app-error.screen";
import { AppNotFoundScreen } from "#/client/core/screens/app-not-found.screen";
import appCss from "#/client/styles/global.css?url";

export interface RouterContext {
	readonly queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Vet Care ERP",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: AppRootDocument,
	component: AppEntryPoint,
	errorComponent: AppErrorScreen,
	notFoundComponent: AppNotFoundScreen,
});
