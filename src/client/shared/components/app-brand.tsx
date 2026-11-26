import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { useTheme } from "../shadcn/components/theme-provider";

export function AppBrand({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="app-brand" className={className} {...props} />;
}

export function AppBrandLink({
	className,
	children,
	...props
}: React.ComponentProps<typeof Link>) {
	return (
		<Link
			data-slot="app-brand-link"
			className={cn("flex items-center gap-2 px-2", className)}
			{...props}
		>
			{children}
		</Link>
	);
}

export function AppBrandLogo({
	className,
	size = "sm",
	...props
}: React.ComponentProps<"img"> & { size?: "sm" | "md" | "lg" }) {
	const { theme } = useTheme();
	const isDarkTheme = theme !== "light";

	const logoSize = {
		sm: "64x64",
		md: "128x128",
		lg: "256x256",
	};

	const sizeMapClasses = {
		sm: "size-8",
		md: "size-16",
		lg: "size-24",
	};

	const imageSrc = props.src
		? props.src
		: isDarkTheme
			? `/assets/logo/dark-${logoSize[size]}.webp`
			: `/assets/logo/light-${logoSize[size]}.webp`;

	return (
		<img
			data-slot="app-brand-logo"
			src={imageSrc}
			className={cn("aspect-square", sizeMapClasses[size], className)}
			alt={props.alt ? props.alt : "โลโก้คลินิก"}
			{...props}
		/>
	);
}

export function AppBrandIdentity({
	className,
	children,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="app-brand-identity"
			className={cn("line-clamp-1 truncate text-xl font-semibold", className)}
			{...props}
		>
			{children}
		</span>
	);
}
