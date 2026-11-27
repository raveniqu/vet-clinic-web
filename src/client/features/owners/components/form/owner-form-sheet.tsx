import { useOwnerFormShell } from "#/client/features/owners/hooks/use-owner-form-shell";
import { AppSheetContent } from "#/client/shared/components/app-sheet";
import { Badge } from "#/client/shared/shadcn/components/ui/badge";
import {
	Sheet,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "#/client/shared/shadcn/components/ui/sheet";
import { OwnerFormActions } from "./owner-form-actions";
import { OwnerFormBody } from "./owner-form-body";
import { OwnerStepIndicator } from "./owner-step-indicator";

export function OwnerFormSheet() {
	const {
		isOpen,
		setIsOpen,
		isEdit,
		ownerCode,
		isLoadingOwner,
		isLoadOwnerError,
		handleFormSubmit,
	} = useOwnerFormShell();

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<AppSheetContent className="flex h-full w-full! gap-0 bg-secondary">
				<form className="contents" noValidate onSubmit={handleFormSubmit}>
					<SheetHeader className="pt-6 pb-3 text-left">
						<div className="flex flex-wrap items-center gap-2">
							<SheetTitle className="text-base sm:text-lg">
								{isEdit ? "แก้ไขข้อมูลเจ้าของสัตว์เลี้ยง" : "ลงทะเบียนเจ้าของสัตว์เลี้ยงใหม่"}
							</SheetTitle>
							{isEdit && ownerCode ? (
								<Badge variant="outline" className="font-mono text-xs">
									{ownerCode}
								</Badge>
							) : null}
						</div>
						<SheetDescription className="text-xs">
							{isEdit
								? "อัปเดตข้อมูลระบุตัวตน ช่องทางการติดต่อ ที่อยู่ และความยินยอม PDPA"
								: "กรอกข้อมูลส่วนตัว ช่องทางติดต่อ ที่อยู่ และความยินยอม PDPA ของเจ้าของสัตว์เลี้ยง"}
						</SheetDescription>
					</SheetHeader>

					<div className="flex flex-col p-4">
						<OwnerStepIndicator />
					</div>

					<div className="flex-1 overflow-y-auto px-4 py-4">
						<OwnerFormBody />
					</div>

					{!isLoadingOwner && !isLoadOwnerError ? (
						<SheetFooter>
							<OwnerFormActions />
						</SheetFooter>
					) : null}
				</form>
			</AppSheetContent>
		</Sheet>
	);
}
