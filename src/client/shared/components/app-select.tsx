import { cn } from "cn";
import type { ComponentProps } from "react";
import { SelectContent, SelectTrigger } from "../shadcn/components/ui/select";

export function AppSelectContent({
	className,
	...props
}: ComponentProps<typeof SelectContent>) {
	return (
		<SelectContent
			alignItemWithTrigger={false}
			align="end"
			className={cn("bg-transparent backdrop-blur-md", className)}
			{...props}
		/>
	);
}

export function AppSelectTrigger({
	className,
	...props
}: ComponentProps<typeof SelectTrigger>) {
	return (
		<SelectTrigger
			className={cn(
				"border-0 bg-transparent shadow-[inset_0_2px_3px_-1px_rgba(0,0,0,0.1),0_2px_3px_0_rgba(0,0,0,0.1)] dark:ring dark:ring-border",
				className,
			)}
			{...props}
		/>
	);
}
