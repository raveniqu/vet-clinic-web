import { UserRoundCheck } from "lucide-react";
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

export function NewCustomers() {
	return (
		<AppCard>
			<AppCardHeader>
				<AppCardTitle>
					<UserRoundCheck className="size-4 text-primary" aria-hidden="true" />
					<span>ลูกค้าใหม่</span>
				</AppCardTitle>
				<AppCardDescription>ลงทะเบียนในช่วง 7 วันที่ผ่านมา</AppCardDescription>
				<AppCardAction>
					<InfoBadge>รอเชื่อม API</InfoBadge>
				</AppCardAction>
			</AppCardHeader>
			<AppCardContent>
				<Empty className="py-6">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<UserRoundCheck aria-hidden="true" />
						</EmptyMedia>
						<EmptyTitle className="text-base">สถิติลูกค้าใหม่รายสัปดาห์</EmptyTitle>
						<EmptyDescription className="text-xs">
							ตัวเลขแนวโน้มลูกค้าใหม่จะแสดงที่นี่เมื่อ Endpoint Summary Analytics
							พร้อมให้บริการ
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</AppCardContent>
		</AppCard>
	);
}
