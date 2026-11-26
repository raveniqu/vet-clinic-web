import { cn } from "cn";
import type { LucideIcon } from "lucide-react";
import { Check, X } from "lucide-react";
import type { QuickFilterOption } from "../hooks/use-quick-filters";
import { Badge } from "../shadcn/components/ui/badge";
import { Button } from "../shadcn/components/ui/button";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "../shadcn/components/ui/toggle-group";

export interface QuickFilterIconMeta {
	icon: LucideIcon;
	className?: string;
}

export type QuickFilterLabelVisibility = "always" | "md" | "lg";

export interface AppQuickFiltersProps<TKey extends string> {
	quickFilters: TKey[];
	filterOptions: readonly QuickFilterOption<TKey>[];
	activeFilterCount: number;
	hasActiveFilter: boolean;
	filteredCount: number;
	totalCount: number;
	onQuickFiltersChange: (values: string[]) => void;
	clearAllFilters: () => void;
	iconMeta?: Partial<Record<TKey, QuickFilterIconMeta>>;
	ariaLabel?: string;
	labelVisibility?: QuickFilterLabelVisibility;
}

const LABEL_VISIBILITY_CLASS: Record<QuickFilterLabelVisibility, string> = {
	always: "block",
	md: "hidden md:block",
	lg: "hidden lg:block",
};

export function AppQuickFilters<TKey extends string>({
	quickFilters,
	filterOptions,
	activeFilterCount,
	hasActiveFilter,
	filteredCount,
	totalCount,
	onQuickFiltersChange,
	clearAllFilters,
	iconMeta,
	ariaLabel = "ตัวกรองด่วน",
	labelVisibility = "md",
}: AppQuickFiltersProps<TKey>) {
	const labelClassName = LABEL_VISIBILITY_CLASS[labelVisibility];

	return (
		<div className="flex w-full flex-wrap justify-center gap-4 md:justify-start">
			<ToggleGroup
				multiple
				size="sm"
				value={quickFilters}
				onValueChange={onQuickFiltersChange}
				aria-label={ariaLabel}
				className="flex gap-4"
			>
				{filterOptions.map((item) => {
					const meta = iconMeta?.[item.key];
					const FilterIcon = meta?.icon;
					const iconClassName = meta?.className;

					return (
						<ToggleGroupItem
							key={item.key}
							value={item.key}
							aria-label={`${item.label} (${item.count})`}
							className="w-fit gap-1.5 rounded-full border-0 px-3 text-xs shadow-md/10 inset-shadow-sm/5 transition-colors duration-200 ease-out aria-pressed:bg-primary/20 aria-pressed:text-primary motion-reduce:transition-none sm:gap-2 dark:ring-1 dark:ring-border"
						>
							{FilterIcon ? (
								<span
									aria-hidden="true"
									className="grid size-4 shrink-0 place-items-center"
								>
									<FilterIcon
										className={cn(
											"col-start-1 row-start-1 scale-100 rotate-0 opacity-100 transition-[scale,rotate,opacity] duration-200 ease-out group-aria-pressed/toggle:scale-0 group-aria-pressed/toggle:-rotate-90 group-aria-pressed/toggle:opacity-0 motion-reduce:transition-none",
											iconClassName,
										)}
									/>
									<Check className="col-start-1 row-start-1 scale-0 rotate-90 opacity-0 transition-[scale,rotate,opacity] duration-200 ease-out group-aria-pressed/toggle:scale-100 group-aria-pressed/toggle:rotate-0 group-aria-pressed/toggle:opacity-100 motion-reduce:transition-none" />
								</span>
							) : null}
							<span className={labelClassName}>{item.label}</span>
							<span>({item.count})</span>
						</ToggleGroupItem>
					);
				})}
			</ToggleGroup>

			{hasActiveFilter ? (
				<div className="ml-auto flex items-center gap-2">
					<Badge variant="secondary" className="gap-1.5">
						<span>ตัวกรอง ({activeFilterCount} รายการ)</span>
						<span className="text-muted-foreground">
							· {filteredCount} จาก {totalCount}
						</span>
					</Badge>
					<Button
						type="button"
						size="xs"
						variant="ghost"
						onClick={clearAllFilters}
					>
						<X data-icon="inline-start" aria-hidden="true" />
						<span>ล้างทั้งหมด</span>
					</Button>
				</div>
			) : null}
		</div>
	);
}
