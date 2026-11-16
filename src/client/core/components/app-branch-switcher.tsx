import { ChevronsUpDown, Plus } from "lucide-react";
import {
  AppBrand,
  AppBrandIdentity,
  AppBrandLink,
  AppBrandLogo,
} from "#/client/shared/components/app-brand";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/client/shared/shadcn/components/ui/dropdown-menu";
import { SidebarMenuButton } from "#/client/shared/shadcn/components/ui/sidebar";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { useBranchSwitcher } from "../hooks/use-app-branch-switcher";

export function AppBranchSwitcher() {
  const { selectItems, selectedItem, onBranchChange } = useBranchSwitcher();
  const isMobile = useIsMobile();
  const SelectedIcon = selectedItem?.icon;
  return (
    <>
      {selectItems.length > 1 ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-sidebar-primary text-sidebar-primary-foreground">
              {SelectedIcon ? <SelectedIcon className="size-4" /> : null}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{selectedItem?.label}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-3.5! stroke-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side={isMobile ? "bottom" : "right"}
            className={`${isMobile ? "" : "w-fit max-w-64"} bg-transparent backdrop-blur-md`}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>Branches</DropdownMenuLabel>
              {selectItems.map((item) => (
                <DropdownMenuItem
                  key={item.value}
                  onClick={() => onBranchChange(item.value)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-4 items-center justify-center rounded-md">
                    <item.icon className="size-3.5 shrink-0 basis-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <div className="flex size-6 items-center justify-center rounded-md bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Add branch</div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <AppBrand>
          <AppBrandLink to="/">
            <AppBrandLogo />
            <AppBrandIdentity>Vet Clinic</AppBrandIdentity>
          </AppBrandLink>
        </AppBrand>
      )}
    </>
  );
}
