import { useOwnerDeleteContext } from "../contexts/owner-delete.context";

export function useOwnerDeleteDialog() {
	const { deletingTarget, isPending, closeDeleteDialog, confirmDelete } =
		useOwnerDeleteContext();

	const isOpen = deletingTarget !== null;
	const targetLabel = deletingTarget
		? deletingTarget.ownerCode
			? `${deletingTarget.displayName} (${deletingTarget.ownerCode})`
			: deletingTarget.displayName
		: "";

	return {
		isOpen,
		isPending,
		title: "ยืนยันการลบข้อมูลเจ้าของสัตว์เลี้ยง",
		description: `คุณต้องการลบข้อมูลของ "${targetLabel}" ออกจากรายการที่ใช้งานอยู่ใช่หรือไม่? ข้อมูลประวัติ PDPA เดิมจะยังคงถูกเก็บรักษาตามข้อกำหนด`,
		onOpenChange: (nextOpen: boolean) => {
			if (!nextOpen) {
				closeDeleteDialog();
			}
		},
		onConfirm: confirmDelete,
	};
}
