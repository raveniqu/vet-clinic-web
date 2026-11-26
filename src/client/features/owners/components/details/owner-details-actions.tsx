import { Edit, Plus, Trash2 } from "lucide-react";
import { useOwnerDetails } from "#/client/features/owners/hooks/use-owner-details";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";

export function OwnerDetailsActions() {
	const isMobile = useIsMobile();
	const { handleEditOwner, handleDeleteOwner, handleAddPetComingSoon } =
		useOwnerDetails();

	return (
		<>
			<Button
				type="button"
				size={isMobile ? "icon-sm" : "sm"}
				variant="destructive"
				onClick={handleDeleteOwner}
			>
				<Trash2 aria-hidden="true" />
				<span className="sr-only md:not-sr-only">ลบข้อมูล</span>
			</Button>
			<Button
				type="button"
				size={isMobile ? "icon-sm" : "sm"}
				variant="outline"
				onClick={handleEditOwner}
			>
				<Edit aria-hidden="true" />
				<span className="sr-only md:not-sr-only">แก้ไขข้อมูลเจ้าของ</span>
			</Button>
			<Button
				type="button"
				size={isMobile ? "icon-sm" : "sm"}
				onClick={handleAddPetComingSoon}
			>
				<Plus aria-hidden="true" />
				<span className="sr-only md:not-sr-only">เพิ่มสัตว์เลี้ยงใหม่</span>
			</Button>
		</>
	);
}
