import type { ComponentProps } from "react";
import { cn } from "cn";

import { InputGroup, InputGroupInput } from "../shadcn/components/ui/input-group";

export function AppInputGroup({ className, ...props }: ComponentProps<typeof InputGroup>) {
  return (
    <InputGroup
      className={cn(
        "h-8 border-0 bg-transparent shadow-[inset_0_2px_3px_-1px_rgba(0,0,0,0.1),0_2px_3px_0_rgba(0,0,0,0.1)] dark:ring dark:ring-border",
        className
      )}
      {...props}
    />
  );
}

export function AppInputGroupInput({
  className,
  ...props
}: ComponentProps<typeof InputGroupInput>) {
  return <InputGroupInput className={cn("placeholder:text-sm", className)} {...props} autoFocus />;
}
