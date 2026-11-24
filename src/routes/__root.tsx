import { createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

import { AppRootDocument } from "#/client/core/app-root";
import { EntryPoint } from "#/client/core/screens/entry-point";
import { NotFoundScreen } from "#/client/core/screens/not-found.screen";

import appCss from "#/client/styles/global.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
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
        title: "ระบบบริหารจัดการคลินิกสัตวแพทย์",
      },
      {
        name: "description",
        content: "ระบบบริหารจัดการคลินิกสัตวแพทย์ครบวงจร",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon-light.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon-dark.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  }),
  notFoundComponent: NotFoundScreen,
  shellComponent: AppRootDocument,
  component: EntryPoint,
});
