import type {
	AppFieldExtendedReactFormApi,
	FormValidateFn,
	FormValidateOrFn,
} from "@tanstack/react-form";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { cn } from "cn";
import { Loader2 } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { Button } from "../shadcn/components/ui/button";
import { Field } from "../shadcn/components/ui/field";
import { Input } from "../shadcn/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../shadcn/components/ui/select";
import { Textarea } from "../shadcn/components/ui/textarea";
import { AppFieldDescription, AppFieldError, AppFieldLabel } from "./app-field";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

export function extractFormErrorMessage(error: unknown): string | undefined {
	if (typeof error === "string" && error.length > 0) {
		return error;
	}
	if (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof error.message === "string" &&
		error.message.length > 0
	) {
		return error.message;
	}
	return undefined;
}

export function normalizeFormErrors(
	errors: readonly unknown[],
): Array<{ message?: string } | undefined> {
	return errors.map((error) => {
		const message = extractFormErrorMessage(error);
		return message ? { message } : undefined;
	});
}

interface AppFormTextFieldProps {
	label: string;
	required?: boolean;
	type?: InputHTMLAttributes<HTMLInputElement>["type"];
	inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
	maxLength?: number;
	placeholder?: string;
	autoComplete?: string;
	description?: string;
	disabled?: boolean;
	className?: string;
	fieldClassName?: string;
}

export function AppFormTextField({
	label,
	required = false,
	type = "text",
	inputMode,
	maxLength,
	placeholder,
	autoComplete,
	description,
	disabled,
	className,
	fieldClassName,
}: AppFormTextFieldProps) {
	const field = useFieldContext<string>();
	const firstError = extractFormErrorMessage(field.state.meta.errors[0]);
	const isInvalid = Boolean(firstError);

	return (
		<Field data-invalid={isInvalid} className={fieldClassName}>
			<AppFieldLabel htmlFor={field.name}>
				<span>{label}</span>
				{required ? (
					<span className="font-bold text-destructive">*</span>
				) : null}
			</AppFieldLabel>
			<Input
				id={field.name}
				name={field.name}
				type={type}
				inputMode={inputMode}
				maxLength={maxLength}
				value={field.state.value}
				placeholder={placeholder}
				autoComplete={autoComplete}
				disabled={disabled}
				aria-invalid={isInvalid}
				className={cn("placeholder:text-sm", className)}
				onBlur={field.handleBlur}
				onChange={(event) => field.handleChange(event.target.value)}
			/>
			{firstError ? (
				<AppFieldError>{firstError}</AppFieldError>
			) : description ? (
				<AppFieldDescription>{description}</AppFieldDescription>
			) : null}
		</Field>
	);
}

interface AppFormTextareaFieldProps {
	label: string;
	placeholder?: string;
	description?: string;
	disabled?: boolean;
	rows?: number;
	className?: string;
	fieldClassName?: string;
}

export function AppFormTextareaField({
	label,
	placeholder,
	description,
	disabled,
	rows = 3,
	className,
	fieldClassName,
}: AppFormTextareaFieldProps) {
	const field = useFieldContext<string>();
	const firstError = extractFormErrorMessage(field.state.meta.errors[0]);
	const isInvalid = Boolean(firstError);

	return (
		<Field data-invalid={isInvalid} className={fieldClassName}>
			<AppFieldLabel htmlFor={field.name}>{label}</AppFieldLabel>
			<Textarea
				id={field.name}
				name={field.name}
				rows={rows}
				value={field.state.value}
				placeholder={placeholder}
				disabled={disabled}
				aria-invalid={isInvalid}
				className={className}
				onBlur={field.handleBlur}
				onChange={(event) => field.handleChange(event.target.value)}
			/>
			{description ? (
				<AppFieldDescription>{description}</AppFieldDescription>
			) : null}
			{firstError ? <AppFieldError>{firstError}</AppFieldError> : null}
		</Field>
	);
}

export interface AppFormSelectOption {
	label: string;
	value: string;
}

interface AppFormSelectFieldProps {
	label: string;
	options: readonly AppFormSelectOption[];
	placeholder?: string;
	description?: string;
	disabled?: boolean;
	className?: string;
	fieldClassName?: string;
}

export function AppFormSelectField({
	label,
	options,
	placeholder,
	description,
	disabled,
	className,
	fieldClassName,
}: AppFormSelectFieldProps) {
	const field = useFieldContext<string>();
	const firstError = extractFormErrorMessage(field.state.meta.errors[0]);
	const isInvalid = Boolean(firstError);

	return (
		<Field data-invalid={isInvalid} className={fieldClassName}>
			<AppFieldLabel htmlFor={field.name}>{label}</AppFieldLabel>
			<Select
				items={options}
				value={field.state.value || null}
				disabled={disabled}
				onValueChange={(nextValue) => {
					if (nextValue) {
						field.handleChange(nextValue);
					}
				}}
			>
				<SelectTrigger
					id={field.name}
					className={cn("w-full", className)}
					aria-invalid={isInvalid}
					onBlur={field.handleBlur}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent
					alignItemWithTrigger={false}
					className="bg-transparent backdrop-blur-md"
				>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{description ? (
				<AppFieldDescription>{description}</AppFieldDescription>
			) : null}
			{firstError ? <AppFieldError>{firstError}</AppFieldError> : null}
		</Field>
	);
}

interface AppFormSubmitButtonProps {
	children: ReactNode;
	loadingLabel?: string;
	size?: "default" | "xs" | "sm" | "lg";
	className?: string;
	disabled?: boolean;
}

export function AppFormSubmitButton({
	children,
	loadingLabel,
	size = "sm",
	className,
	disabled = false,
}: AppFormSubmitButtonProps) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button
					type="submit"
					size={size}
					className={className}
					disabled={disabled || isSubmitting}
				>
					{isSubmitting ? (
						<>
							<Loader2
								className="mr-1.5 size-4 animate-spin"
								aria-hidden="true"
							/>
							<span>{loadingLabel ?? children}</span>
						</>
					) : (
						children
					)}
				</Button>
			)}
		</form.Subscribe>
	);
}

const appFieldComponents = {
	TextField: AppFormTextField,
	TextareaField: AppFormTextareaField,
	SelectField: AppFormSelectField,
};

const appFormComponents = {
	SubmitButton: AppFormSubmitButton,
};

export type AppFormApi<
	TFormData extends Record<string, unknown>,
	TOnSubmit extends
		| undefined
		| FormValidateOrFn<TFormData> = FormValidateFn<TFormData>,
> = AppFieldExtendedReactFormApi<
	TFormData,
	undefined,
	undefined,
	undefined,
	undefined,
	undefined,
	TOnSubmit,
	undefined,
	undefined,
	undefined,
	undefined,
	never,
	typeof appFieldComponents,
	typeof appFormComponents
>;

export function createZodStepValidatorErrors<
	TValues extends Record<string, unknown>,
>(
	schema: {
		safeParse: (input: unknown) => {
			success: boolean;
			error?: { issues: readonly { path: PropertyKey[]; message: string }[] };
		};
	},
	values: TValues,
): Partial<Record<Extract<keyof TValues, string>, string>> {
	const result = schema.safeParse(values);
	if (result.success || !result.error) {
		return {};
	}

	const fieldErrors: Partial<Record<Extract<keyof TValues, string>, string>> =
		{};
	for (const issue of result.error.issues) {
		const key = issue.path[0];
		if (typeof key === "string" && !(key in fieldErrors)) {
			fieldErrors[key as Extract<keyof TValues, string>] = issue.message;
		}
	}
	return fieldErrors;
}

export const { useAppForm, withForm, withFieldGroup, useTypedAppFormContext } =
	createFormHook({
		fieldContext,
		formContext,
		fieldComponents: appFieldComponents,
		formComponents: appFormComponents,
	});
