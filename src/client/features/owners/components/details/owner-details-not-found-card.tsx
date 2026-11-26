import { Undo2, UserRoundPlus, UserRoundX } from "lucide-react";
import { GhostBadge } from "#/client/shared/components/app-badge";
import {
	AppCard,
	AppCardAction,
	AppCardContent,
	AppCardHeader,
	AppCardTitle,
} from "#/client/shared/components/app-card";
import { AppButtonLink } from "#/client/shared/components/app-link";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "#/client/shared/shadcn/components/ui/empty";

export function OwnerDetailsNotFoundCard() {
	return (
		<AppCard className="col-span-full">
			<AppCardHeader>
				<AppCardTitle>
					<UserRoundX className="size-4 text-primary" aria-hidden="true" />
					<span>สถานะข้อมูลเจ้าของสัตว์เลี้ยง</span>
				</AppCardTitle>
				<AppCardAction>
					<GhostBadge className="font-mono">NOT_FOUND</GhostBadge>
				</AppCardAction>
			</AppCardHeader>
			<AppCardContent>
				<Empty className="py-10">
					<EmptyHeader className="max-w-lg">
						<EmptyMedia variant="icon">
							<UserRoundX aria-hidden="true" />
						</EmptyMedia>
						<EmptyTitle>ไม่พบข้อมูลเจ้าของสัตว์เลี้ยงรายนี้ในระบบ</EmptyTitle>
						<EmptyDescription className="leading-relaxed text-pretty">
							รายการนี้อาจถูกลบออกจากระบบแล้ว หรือรหัสเจ้าของในลิงก์ไม่ถูกต้อง
							กรุณากลับไปเลือกจากหน้ารายชื่อเจ้าของ หรือลงทะเบียนเจ้าของใหม่
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent className="max-w-lg">
						<div className="flex flex-wrap items-center justify-center gap-3">
							<AppButtonLink to="/owners" className="min-h-11 sm:min-h-9">
								<Undo2 data-icon="inline-start" aria-hidden="true" />
								<span>กลับไปหน้ารายชื่อเจ้าของ</span>
							</AppButtonLink>
							<AppButtonLink
								to="/owners"
								search={{ openAddNewForm: true }}
								variant="outline"
								className="min-h-11 sm:min-h-9"
							>
								<UserRoundPlus data-icon="inline-start" aria-hidden="true" />
								<span>เพิ่มเจ้าของใหม่</span>
							</AppButtonLink>
						</div>
					</EmptyContent>
				</Empty>
			</AppCardContent>
		</AppCard>
	);
}
