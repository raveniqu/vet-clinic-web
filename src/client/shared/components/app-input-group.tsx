import { cn } from "cn";
import type { ComponentProps } from "react";
import { ComboboxInput } from "../shadcn/components/ui/combobox";
import { Input } from "../shadcn/components/ui/input";
import {
	InputGroup,
	InputGroupInput,
} from "../shadcn/components/ui/input-group";

const INPUT_GROUP_DEFAULT_CLASSNAME =
	"border-0 bg-transparent shadow-[inset_0_2px_3px_-1px_rgba(0,0,0,0.1),0_2px_3px_0_rgba(0,0,0,0.1)] dark:ring dark:ring-border";

export function AppInputGroup({
	className,
	...props
}: ComponentProps<typeof InputGroup>) {
	return (
		<InputGroup
			className={cn(INPUT_GROUP_DEFAULT_CLASSNAME, className)}
			{...props}
		/>
	);
}

export function AppInputGroupInput({
	className,
	...props
}: ComponentProps<typeof InputGroupInput>) {
	return (
		<InputGroupInput
			className={cn("placeholder:text-sm", className)}
			{...props}
		/>
	);
}

export function AppInput({
	className,
	...props
}: ComponentProps<typeof Input>) {
	return (
		<Input
			className={cn(
				"border-0 bg-transparent shadow-[inset_0_2px_3px_-1px_rgba(0,0,0,0.1),0_2px_3px_0_rgba(0,0,0,0.1)] dark:ring dark:ring-border",
				className,
			)}
			{...props}
		/>
	);
}

export function AppComboboxInput({
	className,
	...props
}: ComponentProps<typeof ComboboxInput>) {
	return (
		<ComboboxInput
			className={cn(
				"w-full border-0 bg-transparent text-xs shadow-[inset_0_2px_3px_-1px_rgba(0,0,0,0.1),0_2px_3px_0_rgba(0,0,0,0.1)] placeholder:text-xs! dark:ring dark:ring-border",
				className,
			)}
			{...props}
		/>
	);
}
