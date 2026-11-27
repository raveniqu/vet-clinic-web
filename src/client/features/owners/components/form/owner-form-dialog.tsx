import { useOwnerFormShell } from "#/client/features/owners/hooks/use-owner-form-shell";
import { Badge } from "#/client/shared/shadcn/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/client/shared/shadcn/components/ui/dialog";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { OwnerFormActions } from "./owner-form-actions";
import { OwnerFormBody } from "./owner-form-body";
import { OwnerFormSheet } from "./owner-form-sheet";
import { OwnerStepIndicator } from "./owner-step-indicator";

export function OwnerFormDialog() {
	const isMobile = useIsMobile();
	const {
		isOpen,
		setIsOpen,
		isEdit,
		ownerCode,
		isLoadingOwner,
		isLoadOwnerError,
		handleFormSubmit,
	} = useOwnerFormShell();

	if (isMobile) {
		return <OwnerFormSheet />;
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="flex max-h-[90vh] w-full! max-w-2xl! flex-col gap-0 overflow-hidden bg-secondary p-0">
				<form className="contents" noValidate onSubmit={handleFormSubmit}>
					<DialogHeader className="px-6 pt-6 pb-3 text-left">
						<div className="flex flex-wrap items-center gap-2">
							<DialogTitle className="text-base sm:text-lg">
								{isEdit ? "แก้ไขข้อมูลเจ้าของสัตว์เลี้ยง" : "ลงทะเบียนเจ้าของสัตว์เลี้ยงใหม่"}
							</DialogTitle>
							{isEdit && ownerCode ? (
								<Badge variant="outline" className="font-mono text-xs">
									{ownerCode}
								</Badge>
							) : null}
						</div>
						<DialogDescription className="text-xs">
							{isEdit
								? "อัปเดตข้อมูลระบุตัวตน ช่องทางการติดต่อ ที่อยู่ และความยินยอม PDPA"
								: "กรอกข้อมูลส่วนตัว ช่องทางติดต่อ ที่อยู่ และความยินยอม PDPA ของเจ้าของสัตว์เลี้ยง"}
						</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col px-6 py-2">
						<OwnerStepIndicator />
					</div>

					<div className="flex-1 overflow-y-auto px-6 py-4">
						<OwnerFormBody />
					</div>

					{!isLoadingOwner && !isLoadOwnerError ? (
						<DialogFooter className="bg-card/50 p-4">
							<OwnerFormActions />
						</DialogFooter>
					) : null}
				</form>
			</DialogContent>
		</Dialog>
	);
}
