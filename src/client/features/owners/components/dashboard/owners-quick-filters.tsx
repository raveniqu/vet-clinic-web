import { ArrowDownUp, Building2, Check, UserRound, X } from "lucide-react";
import {
	ACQUISITION_CHANNEL_FILTER_ITEMS,
	OWNER_SORT_OPTIONS,
	OWNER_TYPE_FILTER_OPTIONS,
	useOwnersQuickFilters,
} from "#/client/features/owners/hooks/use-owners-quick-filters";
import { Badge } from "#/client/shared/shadcn/components/ui/badge";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/client/shared/shadcn/components/ui/select";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "#/client/shared/shadcn/components/ui/toggle-group";

export function OwnersQuickFilters() {
	const {
		selectedOwnerTypeValues,
		selectedAcquisitionChannel,
		selectedSort,
		activeFilterCount,
		hasActiveFilter,
		totalItems,
		handleOwnerTypeToggleChange,
		handleAcquisitionChannelChange,
		handleSortChange,
		clearAllFilters,
	} = useOwnersQuickFilters();

	return (
		<div className="flex w-full flex-wrap items-center gap-3">
			<ToggleGroup
				size="sm"
				value={selectedOwnerTypeValues}
				onValueChange={handleOwnerTypeToggleChange}
				aria-label="กรองตามประเภทเจ้าของสัตว์เลี้ยง"
				className="flex flex-wrap gap-2"
			>
				{OWNER_TYPE_FILTER_OPTIONS.map((item) => {
					const isSelected = selectedOwnerTypeValues.includes(item.value);
					const TypeIcon = item.value === "JURISTIC" ? Building2 : UserRound;

					return (
						<ToggleGroupItem
							key={item.value}
							value={item.value}
							aria-label={`กรองเฉพาะ${item.label}`}
							className="w-fit gap-1.5 rounded-full border-0 bg-transparent px-3 text-xs shadow-md/10 inset-shadow-sm/10 aria-pressed:bg-primary/15 aria-pressed:text-primary"
						>
							{isSelected ? (
								<Check className="size-3.5" aria-hidden="true" />
							) : (
								<TypeIcon className="size-3.5" aria-hidden="true" />
							)}
							<span>{item.label}</span>
						</ToggleGroupItem>
					);
				})}
			</ToggleGroup>

			<Select
				value={selectedAcquisitionChannel}
				items={ACQUISITION_CHANNEL_FILTER_ITEMS}
				onValueChange={handleAcquisitionChannelChange}
			>
				<SelectTrigger
					size="sm"
					aria-label="กรองตามช่องทางที่รู้จักคลินิก"
					className="w-48 text-xs"
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent align="start" alignItemWithTrigger={false}>
					{ACQUISITION_CHANNEL_FILTER_ITEMS.map((item) => (
						<SelectItem key={item.value} value={item.value} className="text-xs">
							{item.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={selectedSort}
				items={OWNER_SORT_OPTIONS}
				onValueChange={handleSortChange}
			>
				<SelectTrigger
					size="sm"
					aria-label="เรียงลำดับรายการ"
					className="w-36 text-xs"
				>
					<ArrowDownUp
						className="size-3.5 text-muted-foreground"
						aria-hidden="true"
					/>
					<SelectValue />
				</SelectTrigger>
				<SelectContent align="start" alignItemWithTrigger={false}>
					{OWNER_SORT_OPTIONS.map((item) => (
						<SelectItem key={item.value} value={item.value} className="text-xs">
							{item.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{hasActiveFilter ? (
				<div className="ml-auto flex items-center gap-2">
					<Badge variant="secondary" className="gap-1.5">
						<span>ตัวกรอง ({activeFilterCount})</span>
						<span className="text-muted-foreground">
							· พบ {totalItems} รายการ
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
