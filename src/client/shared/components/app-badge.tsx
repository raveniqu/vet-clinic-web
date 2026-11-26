import { cva } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";
import { Badge } from "../shadcn/components/ui/badge";

export const appBadgeVariants = cva("", {
	variants: {
		variant: {
			success:
				"bg-success/10 text-xs font-normal text-emerald-600 ring ring-success/30 hover:bg-success/10 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-success/10",
			pending:
				"bg-warning/10 text-xs font-normal text-yellow-600 ring ring-warning/30 hover:bg-warning/20 hover:text-yellow-700 dark:text-yellow-400",
			failed:
				"bg-destructive/10 text-xs font-normal text-destructive ring ring-destructive/30 hover:bg-destructive/10 hover:text-destructive",
			info: "bg-info/10 text-xs font-normal text-blue-600 ring ring-info/30 hover:bg-info/10 hover:text-blue-700 dark:text-blue-400",
			ghost:
				"bg-secondary/50 text-muted-foreground ring ring-border hover:bg-secondary/50",
		},
	},
	defaultVariants: {
		variant: "success",
	},
});

export function SuccessBadge({
	className,
	...props
}: Omit<ComponentProps<typeof Badge>, "variant">) {
	return (
		<Badge
			variant="ghost"
			className={cn(appBadgeVariants({ variant: "success" }), className)}
			{...props}
		/>
	);
}

export function NegativeBadge({
	className,
	...props
}: Omit<ComponentProps<typeof Badge>, "variant">) {
	return (
		<Badge
			variant="ghost"
			className={cn(appBadgeVariants({ variant: "failed" }), className)}
			{...props}
		/>
	);
}

export function WarningBadge({
	className,
	...props
}: Omit<ComponentProps<typeof Badge>, "variant">) {
	return (
		<Badge
			variant="ghost"
			className={cn(appBadgeVariants({ variant: "pending" }), className)}
			{...props}
		/>
	);
}

export function InfoBadge({
	className,
	...props
}: Omit<ComponentProps<typeof Badge>, "variant">) {
	return (
		<Badge
			variant="ghost"
			className={cn(appBadgeVariants({ variant: "info" }), className)}
			{...props}
		/>
	);
}

export function GhostBadge({
	className,
	...props
}: Omit<ComponentProps<typeof Badge>, "variant">) {
	return (
		<Badge
			variant="ghost"
			className={cn(appBadgeVariants({ variant: "ghost" }), className)}
			{...props}
		/>
	);
}

export type BadgeStatusType = "success" | "pending" | "failed";

export function getStatusBadge(status: BadgeStatusType) {
	switch (status) {
		case "success":
			return (
				<SuccessBadge>
					<span className="text-xs">สำเร็จ</span>
				</SuccessBadge>
			);
		case "pending":
			return (
				<WarningBadge>
					<span className="text-xs">รอดำเนินการ</span>
				</WarningBadge>
			);
		case "failed":
			return (
				<NegativeBadge>
					<span className="text-xs">ไม่สำเร็จ</span>
				</NegativeBadge>
			);
		default:
			return (
				<InfoBadge>
					<span className="text-xs">{status}</span>
				</InfoBadge>
			);
	}
}
