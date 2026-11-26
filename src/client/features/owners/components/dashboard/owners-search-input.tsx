import { Search, X } from "lucide-react";
import { useOwnersSearchInput } from "#/client/features/owners/hooks/use-owners-search-input";
import {
	AppInputGroup,
	AppInputGroupInput,
} from "#/client/shared/components/app-input-group";
import {
	InputGroupAddon,
	InputGroupButton,
} from "#/client/shared/shadcn/components/ui/input-group";

export function OwnersSearchInput() {
	const {
		inputRef,
		searchInput,
		handleSearchChange,
		hasSearchTerm,
		clearSearch,
	} = useOwnersSearchInput();

	return (
		<AppInputGroup className="w-full">
			<AppInputGroupInput
				ref={inputRef}
				value={searchInput}
				onChange={handleSearchChange}
				placeholder="ค้นหาด้วยรหัสลูกค้า, ชื่อ, เบอร์โทร หรือเลขผู้เสียภาษี 13 หลัก..."
				aria-label="ค้นหาเจ้าของสัตว์เลี้ยง"
			/>
			<InputGroupAddon>
				<Search
					className="size-3.5 text-muted-foreground sm:size-4"
					aria-hidden="true"
				/>
			</InputGroupAddon>
			{hasSearchTerm ? (
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						type="button"
						size="icon-xs"
						variant="ghost"
						aria-label="ล้างคำค้นหา"
						onClick={clearSearch}
					>
						<X aria-hidden="true" />
					</InputGroupButton>
				</InputGroupAddon>
			) : null}
		</AppInputGroup>
	);
}
