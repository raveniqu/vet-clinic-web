import { createLink } from "@tanstack/react-router";
import { Button } from "../shadcn/components/ui/button";
import {
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "../shadcn/components/ui/pagination";
import {
	SidebarMenuButton,
	SidebarMenuSubButton,
} from "../shadcn/components/ui/sidebar";

export const AppButtonLink = createLink(Button);
export const AppSidebarMenuButtonLink = createLink(SidebarMenuButton);
export const AppSidebarMenuSubButtonLink = createLink(SidebarMenuSubButton);
export const AppPaginationLink = createLink(PaginationLink);
export const AppPaginationNextLink = createLink(PaginationNext);
export const AppPaginationPreviousLink = createLink(PaginationPrevious);
