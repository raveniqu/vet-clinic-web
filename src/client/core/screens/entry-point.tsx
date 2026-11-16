import { Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "#/client/shared/shadcn/components/theme-provider";
import { Toaster } from "#/client/shared/shadcn/components/ui/toast";

/**
 * Add Context Providers Here
 */
export function EntryPoint() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="_simple-start-theme">
      <Outlet />
      <Toaster />
    </ThemeProvider>
  );
}
