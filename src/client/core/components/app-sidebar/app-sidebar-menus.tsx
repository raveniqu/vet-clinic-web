import { cn } from "cn";
import { ChevronRight, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { parseMenuHref, useAppSidebarMenus } from "#/client/core/hooks/use-app-sidebar-menus";
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "#/client/shared/shadcn/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "#/client/shared/shadcn/components/ui/collapsible";
import {
  AppSidebarMenuButtonLink,
  AppSidebarMenuSubButtonLink,
} from "#/client/shared/components/app-link";

export type AppSidebarMenusProps = {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
  items: {
    id: string;
    title: string;
    href: string;
    action?: string | React.ReactNode;
    badge?: {
      isLoading?: boolean;
      content: string;
      className?: string;
    };
  }[];
  action?: string | React.ReactNode;
  badge?: {
    isLoading?: boolean;
    content: string;
    className?: string;
  };
  status?: "new" | "beta";
};

export function AppSidebarMenus({ menus }: { menus: AppSidebarMenusProps[] }) {
  const { isGroupOpen, handleOpenChange } = useAppSidebarMenus(menus);

  return (
    <SidebarMenu>
      {menus.map((menu) => {
        const MenuIcon = menu.icon;
        const parsedMenu = parseMenuHref(menu.href);

        return menu.items.length > 0 ? (
          <Collapsible
            key={menu.id}
            open={isGroupOpen(menu.id)}
            onOpenChange={(nextOpen) => handleOpenChange(menu.id, nextOpen)}
            className="group/collapsible"
            render={<SidebarMenuItem />}
          >
            <CollapsibleTrigger render={<SidebarMenuButton className="justify-between" />}>
              <span className="flex items-center gap-2">
                <MenuIcon />
                <span>{menu.title}</span>
              </span>
              <ChevronRight className="transition-transform duration-200 group-data-open/collapsible:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {menu.items.map((item) => {
                  const parsedItem = parseMenuHref(item.href);

                  return (
                    <SidebarMenuSubItem key={item.id}>
                      <AppSidebarMenuSubButtonLink
                        to={parsedItem.to}
                        search={parsedItem.search}
                        className="text-xs text-muted-foreground"
                        activeProps={{
                          className: "bg-primary/3 text-primary",
                        }}
                        activeOptions={{
                          exact: true,
                          includeSearch: parsedItem.hasSearch,
                        }}
                      >
                        {item.title}
                      </AppSidebarMenuSubButtonLink>
                      {item.action ? <SidebarMenuAction>{item.action}</SidebarMenuAction> : null}
                      {item.badge !== undefined ? (
                        <SidebarMenuBadge className={cn("bg-secondary px-2", item.badge.className)}>
                          {item.badge.isLoading ? (
                            <Loader2 className="mx-1.5 size-3 animate-spin" />
                          ) : (
                            item.badge.content
                          )}
                        </SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SidebarMenuItem key={menu.id}>
            <AppSidebarMenuButtonLink
              to={parsedMenu.to}
              search={parsedMenu.search}
              activeProps={{
                className: "bg-primary/3 text-primary",
              }}
              activeOptions={{
                exact: true,
                includeSearch: parsedMenu.hasSearch,
              }}
            >
              <MenuIcon />
              {menu.title}
            </AppSidebarMenuButtonLink>
            {menu.action ? <SidebarMenuAction>{menu.action}</SidebarMenuAction> : null}
            {menu.badge !== undefined ? (
              <SidebarMenuBadge className={cn("bg-secondary px-2", menu.badge.className)}>
                {menu.badge.isLoading ? (
                  <Loader2 className="mx-1.5 size-3 animate-spin" />
                ) : (
                  menu.badge.content
                )}
              </SidebarMenuBadge>
            ) : null}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
