import type { ComponentProps } from "react";
import { Badge } from "../shadcn/components/ui/badge";
import { cva } from "class-variance-authority";
import { cn } from "cn";

export const appBadgeVariants = cva("", {
  variants: {
    variant: {
      success:
        "border-emerald-500/20 bg-emerald-500/10 text-xs font-normal text-emerald-600 dark:text-emerald-400",
      pending:
        "border-yellow-500/20 bg-yellow-500/10 text-xs font-normal text-yellow-600 dark:text-yellow-400",
      failed: "bg-destructive/10 text-xs font-normal text-destructive",
      info: "border-blue-500/20 bg-blue-500/10 text-xs font-normal text-blue-600 dark:text-blue-400",
      ghost: "bg-secondary/50 text-muted-foreground",
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
