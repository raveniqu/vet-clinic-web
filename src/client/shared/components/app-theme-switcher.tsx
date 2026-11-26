import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../shadcn/components/theme-provider";
import { DropdownMenuItem } from "../shadcn/components/ui/dropdown-menu";
import { Switch } from "../shadcn/components/ui/switch";

export function AppThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark =
		mounted &&
		(theme === "system"
			? document.documentElement.classList.contains("dark")
			: theme === "dark");

	const toggleTheme = () => {
		setTheme(isDark ? "light" : "dark");
	};

	return (
		<DropdownMenuItem closeOnClick={false} onClick={toggleTheme}>
			<Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
			<Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
			<span className="mr-auto">สลับธีมสี</span>
			<Switch
				size="sm"
				checked={isDark}
				className="pointer-events-none"
				tabIndex={-1}
			/>
		</DropdownMenuItem>
	);
}
