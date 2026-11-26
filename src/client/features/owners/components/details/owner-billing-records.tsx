import { Receipt } from "lucide-react";
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

export function OwnerBillingRecords() {
	return (
		<AppCard className="mt-4">
			<AppCardHeader>
				<AppCardTitle>
					<Receipt className="size-4 text-primary" aria-hidden="true" />
					<span>ประวัติการชำระเงิน</span>
				</AppCardTitle>
				<AppCardAction>
					<InfoBadge>รอเชื่อม API</InfoBadge>
				</AppCardAction>
			</AppCardHeader>
			<AppCardContent>
				<Empty className="py-10">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Receipt aria-hidden="true" />
						</EmptyMedia>
						<EmptyTitle>รอเชื่อมต่อข้อมูลระบบการเงิน</EmptyTitle>
						<EmptyDescription>
							ใบเสร็จรับเงินและรายการชำระค่าบริการจะแสดงที่นี่เมื่อ Billing API พร้อมใช้งาน
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</AppCardContent>
		</AppCard>
	);
}
