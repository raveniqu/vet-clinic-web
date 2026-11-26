import { PawPrint } from "lucide-react";
import { InfoBadge } from "#/client/shared/components/app-badge";
import {
	AppCard,
	AppCardAction,
	AppCardContent,
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

export function OwnerPetsOwned() {
	return (
		<AppCard className="mt-4">
			<AppCardHeader>
				<AppCardTitle>
					<PawPrint className="size-4 text-primary" aria-hidden="true" />
					<span>สัตว์เลี้ยงในความดูแล</span>
				</AppCardTitle>
				<AppCardAction>
					<InfoBadge>รอเชื่อม API</InfoBadge>
				</AppCardAction>
			</AppCardHeader>
			<AppCardContent>
				<Empty className="py-10">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<PawPrint aria-hidden="true" />
						</EmptyMedia>
						<EmptyTitle>รอเชื่อมต่อข้อมูลโมดูลสัตว์เลี้ยง (Pets)</EmptyTitle>
						<EmptyDescription>
							รายการสัตว์เลี้ยง ประวัติพันธุ์ และน้ำหนักจะแสดงที่นี่เมื่อ Pets API พร้อมใช้งาน
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</AppCardContent>
		</AppCard>
	);
}
