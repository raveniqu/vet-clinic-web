import { forwardRef } from "react";
import type { ComponentProps } from "react";

import { createLink } from "@tanstack/react-router";
import type { LinkComponent } from "@tanstack/react-router";

import { cn } from "cn";

import { ChevronRight, Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../shadcn/components/ui/card";

import { Tooltip, TooltipContent, TooltipTrigger } from "../shadcn/components/ui/tooltip";

export function AppCard({ className, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card
      {...props}
      className={cn(
        "gap-0 bg-card-foreground/2.5 py-0 dark:bg-transparent dark:ring-card/75",
        className
      )}
    />
  );
}

export function AppCardHeader({ className, ...props }: ComponentProps<typeof CardHeader>) {
  return <CardHeader {...props} className={cn("w-full gap-y-1 py-4", className)} />;
}

export function AppCardTitle({ className, ...props }: ComponentProps<typeof CardTitle>) {
  return (
    <CardTitle
      {...props}
      className={cn(
        "flex max-w-48 items-center gap-2 text-sm font-semibold sm:max-w-full",
        className
      )}
    />
  );
}

export function AppCardToolTip({ className, ...props }: ComponentProps<typeof TooltipContent>) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Info className="size-3 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent {...props} className={cn("flex flex-col items-start gap-1", className)} />
    </Tooltip>
  );
}

export function AppCardToolTipTitle({ className, ...props }: ComponentProps<"p">) {
  return <p {...props} className={cn("text-sm font-semibold text-background", className)} />;
}

export function AppCardToolTipDescription({ className, ...props }: ComponentProps<"p">) {
  return <p {...props} className={cn("text-xs text-muted-foreground", className)} />;
}

export function AppCardDescription({
  className,
  ...props
}: ComponentProps<typeof CardDescription>) {
  return (
    <CardDescription
      {...props}
      className={cn("truncate text-xs text-muted-foreground", className)}
    />
  );
}

export function AppCardAction({ className, ...props }: ComponentProps<typeof CardAction>) {
  return (
    <CardAction {...props} className={cn("relative ml-auto flex items-center gap-2", className)} />
  );
}

export function AppCardContent({ className, ...props }: ComponentProps<typeof CardContent>) {
  return (
    <CardContent
      {...props}
      className={cn(
        "flex w-full flex-1 flex-col gap-2 rounded-t-2xl bg-background p-4 md:gap-4 lg:p-6 dark:bg-card/50",
        className
      )}
    />
  );
}

export function AppCardFooter({ className, ...props }: ComponentProps<typeof CardFooter>) {
  return (
    <CardFooter
      {...props}
      className={cn("w-full justify-between border-t bg-card/50 py-4!", className)}
    />
  );
}

export function AppCardFooterDetails({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cn(className)} />;
}

interface BasicLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: LucideIcon;
  iconSide?: "start" | "end";
}

const BasicLinkComponent = forwardRef<HTMLAnchorElement, BasicLinkProps>(
  ({ icon: Icon = ChevronRight, iconSide = "end", ...props }, ref) => {
    return (
      <a
        ref={ref}
        {...props}
        className={cn(
          "flex items-center gap-1 text-xs text-ellipsis whitespace-nowrap text-primary",
          props.className
        )}
      >
        {iconSide === "start" && <Icon className="size-3" />}
        <span>{props.children}</span>
        {iconSide === "end" && <Icon className="size-3" />}
      </a>
    );
  }
);

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const AppCardFooterLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};

export function AppCardFooterDescription({ className, ...props }: ComponentProps<"p">) {
  return <p {...props} className={cn("line-clamp-1 text-xs text-muted-foreground", className)} />;
}
