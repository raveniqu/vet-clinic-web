import { cn } from "cn";

export function AppDashboardRoot({ className, ...props }: React.ComponentProps<"article">) {
  return (
    <article
      data-slot="app-dashboard-root"
      className={cn("flex w-full flex-1 flex-col gap-6 p-4 lg:p-6", className)}
      {...props}
    />
  );
}

export function AppDashboardHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="app-dashboard-header"
      className={cn(
        "flex w-full flex-col gap-0 sm:gap-1 lg:gap-2",
        "has-data-[slot=app-dashboard-actions]:grid has-data-[slot=app-dashboard-actions]:grid-cols-[1fr_auto]",
        className
      )}
      {...props}
    />
  );
}

export function AppDashboardTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"h1"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? "div" : "h1";

  return (
    <Comp
      data-slot="app-dashboard-title"
      className={cn(
        "line-clamp-1 py-1 text-xl font-semibold text-ellipsis sm:py-1.5 sm:text-2xl lg:py-2.5 lg:text-3xl",
        className
      )}
      {...props}
    />
  );
}

export function AppDashboardDescription({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"p"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? "div" : "p";

  return (
    <Comp
      data-slot="app-dashboard-description"
      className={cn(
        "line-clamp-1 text-xs leading-6 text-ellipsis text-muted-foreground md:text-sm xl:text-base",
        "col-start-1",
        className
      )}
      {...props}
    />
  );
}

export function AppDashboardActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-dashboard-actions"
      className={cn(
        "row-span-auto col-span-full col-start-2 row-start-1 flex items-center justify-end gap-2",
        className
      )}
      {...props}
    />
  );
}

export function AppDashboardContent({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="app-dashboard-content"
      className={cn("grid grid-cols-12 gap-6", className)}
      {...props}
    />
  );
}

export function AppDashboardFooter({ className, ...props }: React.ComponentProps<"footer">) {
  return <footer data-slot="app-dashboard-footer" className={cn("", className)} {...props} />;
}
