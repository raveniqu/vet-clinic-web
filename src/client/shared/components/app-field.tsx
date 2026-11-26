import { cn } from "cn";
import type { ComponentProps } from "react";
import {
	FieldDescription,
	FieldError,
	FieldLabel,
	FieldLegend,
	FieldSet,
	FieldTitle,
} from "../shadcn/components/ui/field";

export function AppFieldSet({
	className,
	...props
}: ComponentProps<typeof FieldSet>) {
	return (
		<FieldSet
			className={cn(
				"rounded-3xl border bg-card p-4 shadow-sm dark:border-0",
				className,
			)}
			{...props}
		/>
	);
}

export function AppFieldLegend({
	className,
	...props
}: ComponentProps<typeof FieldLegend>) {
	return (
		<FieldLegend
			className={cn(
				"mb-0 flex items-center gap-2 px-2 pt-1",
				"text-lg! font-semibold md:text-xl!",
				"[&_svg]:size-4 [&_svg]:text-primary md:[&_svg]:size-5",
				className,
			)}
			{...props}
		/>
	);
}

export function AppFieldLabel({
	className,
	...props
}: ComponentProps<typeof FieldLabel>) {
	return (
		<FieldLabel
			className={cn("text-xs text-muted-foreground md:text-sm", className)}
			{...props}
		/>
	);
}

export function AppFieldTitle({
	className,
	...props
}: ComponentProps<typeof FieldTitle>) {
	return (
		<FieldTitle className={cn("font-medium text-foreground")} {...props} />
	);
}

export function AppFieldDescription({
	className,
	...props
}: ComponentProps<typeof FieldDescription>) {
	return (
		<FieldDescription
			className={cn("text-[10px] md:text-xs", className)}
			{...props}
		/>
	);
}

export function AppFieldError({
	className,
	...props
}: ComponentProps<typeof FieldError>) {
	return (
		<FieldError
			className={cn("text-[10px] md:text-xs", className)}
			{...props}
		/>
	);
}
