import type { ComponentProps } from "react";
import { Badge } from "../shadcn/components/ui/badge";
import { cva } from "class-variance-authority";
import { cn } from "cn";

export const appBadgeVariants = cva("", {
  variants: {
    variant: {
      success:
        "bg-emerald-500/10 text-xs font-normal text-emerald-600 ring ring-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-500/10",
      pending:
        "bg-yellow-500/10 text-xs font-normal text-yellow-600 ring ring-yellow-500/30 hover:bg-yellow-500/20 hover:text-yellow-700 dark:text-yellow-400",
      failed:
        "bg-destructive/10 text-xs font-normal text-destructive ring ring-destructive/30 hover:bg-destructive/10 hover:text-destructive",
      info: "bg-blue-500/10 text-xs font-normal text-blue-600 ring ring-blue-500/30 hover:bg-blue-500/10 hover:text-blue-700 dark:text-blue-400",
      ghost: "bg-secondary/50 text-muted-foreground ring ring-border hover:bg-secondary/50",
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

export function InfoBadge({ className, ...props }: Omit<ComponentProps<typeof Badge>, "variant">) {
  return (
    <Badge
      variant="ghost"
      className={cn(appBadgeVariants({ variant: "info" }), className)}
      {...props}
    />
  );
}

export function GhostBadge({ className, ...props }: Omit<ComponentProps<typeof Badge>, "variant">) {
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
          <span className="text-xs">Success</span>
        </SuccessBadge>
      );
    case "pending":
      return (
        <WarningBadge>
          <span className="text-xs">Pending</span>
        </WarningBadge>
      );
    case "failed":
      return (
        <NegativeBadge>
          <span className="text-xs">Failed</span>
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
