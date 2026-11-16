import { createLink } from "@tanstack/react-router";
import { SidebarMenuButton, SidebarMenuSubButton } from "../shadcn/components/ui/sidebar";
import {
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../shadcn/components/ui/pagination";
import { Button } from "../shadcn/components/ui/button";

export const AppButtonLink = createLink(Button);
export const AppSidebarMenuButtonLink = createLink(SidebarMenuButton);
export const AppSidebarMenuSubButtonLink = createLink(SidebarMenuSubButton);
export const AppPaginationLink = createLink(PaginationLink);
export const AppPaginationNextLink = createLink(PaginationNext);
export const AppPaginationPreviousLink = createLink(PaginationPrevious);
