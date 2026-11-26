import { Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "#/client/shared/shadcn/components/theme-provider";
import { Toaster } from "#/client/shared/shadcn/components/ui/toast";
import { TooltipProvider } from "#/client/shared/shadcn/components/ui/tooltip";

export function AppEntryPoint() {
	return (
		<ThemeProvider>
			<TooltipProvider>
				<Outlet />
				<Toaster />
			</TooltipProvider>
		</ThemeProvider>
	);
}
