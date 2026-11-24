import { cn } from "cn";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "#/client/shared/shadcn/components/ui/button";
import { useSidebar } from "#/client/shared/shadcn/components/ui/sidebar";

export function AppSidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { open, toggleSidebar } = useSidebar();
  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      {open ? <PanelLeftClose /> : <PanelLeftOpen />}
      <span className="sr-only">{open ? "ย่อแถบเมนูด้านข้าง" : "ขยายแถบเมนูด้านข้าง"}</span>
    </Button>
  );
}
