import { useOwnerDeleteDialog } from "#/client/features/owners/hooks/use-owner-delete-dialog";
import { AppConfirmDialog } from "#/client/shared/components/app-confirm-dialog";

export function OwnerDeleteAlertDialog() {
	const { isOpen, isPending, title, description, onOpenChange, onConfirm } =
		useOwnerDeleteDialog();

	return (
		<AppConfirmDialog
			open={isOpen}
			onOpenChange={onOpenChange}
			title={title}
			description={description}
			confirmLabel="ยืนยันการลบ"
			cancelLabel="ยกเลิก"
			isPending={isPending}
			variant="destructive"
			onConfirm={onConfirm}
		/>
	);
}
