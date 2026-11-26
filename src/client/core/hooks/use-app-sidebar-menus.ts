import {
	deepEqual,
	defaultParseSearch,
	useLocation,
} from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { AppSidebarMenusProps } from "../components/app-sidebar/app-sidebar-menus";

export function parseMenuHref(href: string) {
	const [pathname, searchStr] = href.split("?");
	const search = searchStr ? defaultParseSearch(searchStr) : undefined;
	return {
		to: pathname,
		search,
		hasSearch: Boolean(searchStr),
	};
}

export function useAppSidebarMenus(menus: AppSidebarMenusProps[]) {
	const location = useLocation();

	const activeGroupId = useMemo(() => {
		const matchedGroup = menus.find((menu) =>
			menu.items.some((item) => {
				const parsed = parseMenuHref(item.href);
				if (parsed.to !== location.pathname) return false;
				if (parsed.hasSearch) {
					return deepEqual(location.search, parsed.search, true);
				}
				return true;
			}),
		);
		return matchedGroup?.id ?? null;
	}, [menus, location.pathname, location.search]);

	const [openGroup, setOpenGroups] = useState<Record<string, boolean>>(() =>
		activeGroupId ? { [activeGroupId]: true } : {},
	);

	useEffect(() => {
		if (!location.pathname) return;
		setOpenGroups(activeGroupId ? { [activeGroupId]: true } : {});
	}, [activeGroupId, location.pathname]);

	const handleOpenChange = (groupId: string, nextOpen: boolean) => {
		setOpenGroups(nextOpen ? { [groupId]: true } : {});
	};

	const isGroupOpen = (groupId: string) => Boolean(openGroup[groupId]);

	return {
		isGroupOpen,
		handleOpenChange,
	};
}
