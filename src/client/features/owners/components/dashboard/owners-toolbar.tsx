import { UserRoundSearch } from "lucide-react";
import {
	AppCard,
	AppCardContent,
	AppCardDescription,
	AppCardHeader,
	AppCardTitle,
} from "#/client/shared/components/app-card";
import { OwnersColumnPicker } from "./owners-column-picker";
import { OwnersSearchInput } from "./owners-search-input";

export function OwnersToolbar() {
	return (
		<AppCard className="h-fit">
			<AppCardHeader>
				<AppCardTitle>
					<UserRoundSearch className="size-4 text-primary" aria-hidden="true" />
					<span>ค้นหาเจ้าของสัตว์เลี้ยง</span>
				</AppCardTitle>
				<AppCardDescription>
					ค้นหาและกรองรายชื่อเจ้าของสัตว์เลี้ยงจากฐานข้อมูลจริง
				</AppCardDescription>
			</AppCardHeader>
			<AppCardContent className="flex-row">
				<OwnersSearchInput />
				<OwnersColumnPicker />
			</AppCardContent>
		</AppCard>
	);
}
