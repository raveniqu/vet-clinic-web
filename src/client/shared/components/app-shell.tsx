import { cn } from "cn";
import { useEffect, useState } from "react";

export function AppShellRoot({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"flex min-h-svh w-full max-w-full min-w-0 flex-col overflow-x-clip",
				className,
			)}
			{...props}
		/>
	);
}

export function AppShellHeader({
	className,
	...props
}: React.ComponentProps<"header">) {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 8);
		};

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			data-slot="app-shell-header"
			data-scrolled={isScrolled}
			className={cn(
				"sticky top-0 z-30 flex h-16 w-full items-center border-b border-transparent bg-background/0 px-4 transition-all duration-200",
				"data-[scrolled=true]:border-border/40 data-[scrolled=true]:bg-background/80 data-[scrolled=true]:backdrop-blur-md data-[scrolled=true]:supports-backdrop-filter:bg-background/60",
				className,
			)}
			{...props}
		/>
	);
}

export function AppShellContent({
	className,
	...props
}: React.ComponentProps<"article">) {
	return (
		<article
			className={cn("flex h-full flex-1 flex-col overflow-hidden", className)}
			{...props}
		/>
	);
}

export function AppShellFooter({
	className,
	...props
}: React.ComponentProps<"footer">) {
	return (
		<footer
			className={cn(
				"flex w-full items-center justify-between text-xs text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}
