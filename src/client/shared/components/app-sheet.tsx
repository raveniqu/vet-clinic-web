import { cn } from "cn";
import type { ComponentProps } from "react";
import { SheetContent } from "../shadcn/components/ui/sheet";

export function AppSheetContent({
	className,
	...props
}: ComponentProps<typeof SheetContent>) {
	return (
		<SheetContent
			className={cn("max-w-full! sm:max-w-2xl! 2xl:max-w-3xl!", className)}
			{...props}
		/>
	);
}
