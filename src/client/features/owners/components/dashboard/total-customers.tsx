import { UsersRound } from "lucide-react";
import { useOwnersMetrics } from "#/client/features/owners/hooks/use-owners-metrics";
import {
	AppCard,
	AppCardContent,
	AppCardDescription,
	AppCardFooter,
	AppCardFooterDescription,
	AppCardHeader,
	AppCardTitle,
} from "#/client/shared/components/app-card";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemTitle,
} from "#/client/shared/shadcn/components/ui/item";
import { Skeleton } from "#/client/shared/shadcn/components/ui/skeleton";

export function TotalCustomers() {
	const { totalOwnersCount, isPending } = useOwnersMetrics();

	return (
		<AppCard>
			<AppCardHeader>
				<AppCardTitle>
					<UsersRound className="size-4 text-primary" aria-hidden="true" />
					<span>ลูกค้าทั้งหมด</span>
				</AppCardTitle>
				<AppCardDescription>สรุปจำนวนเจ้าของสัตว์เลี้ยงที่ใช้งานอยู่</AppCardDescription>
			</AppCardHeader>
			<AppCardContent className="justify-between">
				<div className="flex items-baseline justify-between">
					{isPending ? (
						<Skeleton className="h-9 w-20" />
					) : (
						<div className="text-3xl font-bold tracking-tight text-foreground">
							{totalOwnersCount ?? 0}
						</div>
					)}
					<span className="text-xs font-medium text-muted-foreground">
						ข้อมูลจริงจาก API
					</span>
				</div>

				<ItemGroup className="grid grid-cols-2 gap-2 text-xs">
					<Item variant="outline" size="xs" className="rounded-xl">
						<ItemContent className="flex flex-row justify-between">
							<ItemDescription className="text-sm">บุคคลธรรมดา</ItemDescription>
							<ItemTitle className="text-sm text-muted-foreground">—</ItemTitle>
						</ItemContent>
					</Item>
					<Item variant="outline" size="xs" className="rounded-xl">
						<ItemContent className="flex flex-row justify-between">
							<ItemDescription className="text-sm">นิติบุคคล</ItemDescription>
							<ItemTitle className="text-sm text-muted-foreground">—</ItemTitle>
						</ItemContent>
					</Item>
				</ItemGroup>
			</AppCardContent>
			<AppCardFooter>
				<AppCardFooterDescription>
					สัดส่วนแยกประเภทและ PDPA ครบทุกข้อจะแสดงเมื่อ Summary API พร้อมใช้งาน
				</AppCardFooterDescription>
			</AppCardFooter>
		</AppCard>
	);
}
