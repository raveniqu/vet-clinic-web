import { SearchIcon } from "lucide-react";
import {
	AppShellContent,
	AppShellRoot,
} from "#/client/shared/components/app-shell";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "#/client/shared/shadcn/components/ui/empty";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "#/client/shared/shadcn/components/ui/input-group";
import { Kbd } from "#/client/shared/shadcn/components/ui/kbd";

export function AppNotFoundScreen() {
	return (
		<AppShellRoot>
			<AppShellContent>
				<Empty>
					<EmptyHeader>
						<EmptyTitle>404 - ไม่พบข้อมูล</EmptyTitle>
						<EmptyDescription>
							หน้าเว็บที่คุณกำลังมองหาไม่มีอยู่จริง โปรดลองค้นหาสิ่งที่คุณต้องการด้านล่าง
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<InputGroup className="sm:w-3/4">
							<InputGroupInput placeholder="Try searching for pages..." />
							<InputGroupAddon>
								<SearchIcon />
							</InputGroupAddon>
							<InputGroupAddon align="inline-end">
								<Kbd>/</Kbd>
							</InputGroupAddon>
						</InputGroup>
						<EmptyDescription>
							ต้องการความช่วยเหลือ? <a href=".">ติดต่อฝ่ายสนับสนุน</a>
						</EmptyDescription>
					</EmptyContent>
				</Empty>
			</AppShellContent>
		</AppShellRoot>
	);
}
