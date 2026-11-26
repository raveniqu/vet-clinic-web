import { History } from "lucide-react";
import { InfoBadge } from "#/client/shared/components/app-badge";
import {
	AppCard,
	AppCardAction,
	AppCardContent,
	AppCardDescription,
	AppCardHeader,
	AppCardTitle,
} from "#/client/shared/components/app-card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "#/client/shared/shadcn/components/ui/empty";

export function RecentVisits() {
	return (
		<AppCard className="flex flex-col">
			<AppCardHeader>
				<AppCardTitle>
					<History className="size-4 text-primary" aria-hidden="true" />
					<span>การเข้ารับบริการล่าสุด</span>
				</AppCardTitle>
				<AppCardDescription>
					รายการตรวจและเข้ารับบริการล่าสุดของคลินิก
				</AppCardDescription>
				<AppCardAction>
					<InfoBadge>รอเชื่อม API</InfoBadge>
				</AppCardAction>
			</AppCardHeader>
			<AppCardContent>
				<Empty className="py-6">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<History aria-hidden="true" />
						</EmptyMedia>
						<EmptyTitle className="text-base">
							ยังไม่มีข้อมูลการเข้ารับบริการ
						</EmptyTitle>
						<EmptyDescription className="text-xs">
							รายการตรวจและประวัติเข้าพบสัตวแพทย์จะแสดงที่นี่เมื่อโมดูลนัดหมายและเวชระเบียนพร้อมใช้งาน
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</AppCardContent>
		</AppCard>
	);
}
