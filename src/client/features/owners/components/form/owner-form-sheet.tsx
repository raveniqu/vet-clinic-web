import { AlertTriangle, RotateCcw } from "lucide-react";
import { useOwnerFormShell } from "#/client/features/owners/hooks/use-owner-form-shell";
import { AppSheetContent } from "#/client/shared/components/app-sheet";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "#/client/shared/shadcn/components/ui/alert";
import { Badge } from "#/client/shared/shadcn/components/ui/badge";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
	Sheet,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "#/client/shared/shadcn/components/ui/sheet";
import { Skeleton } from "#/client/shared/shadcn/components/ui/skeleton";
import { OwnerFormActions } from "./owner-form-actions";
import { OwnerStepAddress } from "./owner-step-address";
import { OwnerStepIdentityContact } from "./owner-step-identity-contact";
import { OwnerStepIndicator } from "./owner-step-indicator";
import { OwnerStepPreferencesPdpa } from "./owner-step-preferences-pdpa";

export function OwnerFormSheet() {
	const {
		isOpen,
		setIsOpen,
		isEdit,
		ownerCode,
		isLoadingOwner,
		isLoadOwnerError,
		currentStep,
		handleFormSubmit,
		retryLoadOwner,
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
						{isLoadingOwner ? (
							<div className="flex flex-col gap-4">
								<Skeleton className="h-32 w-full rounded-3xl" />
								<Skeleton className="h-56 w-full rounded-3xl" />
								<Skeleton className="h-44 w-full rounded-3xl" />
							</div>
						) : isLoadOwnerError ? (
							<Alert variant="destructive">
								<AlertTriangle className="size-4" aria-hidden="true" />
								<AlertTitle>ไม่สามารถโหลดข้อมูลเจ้าของสัตว์เลี้ยงได้</AlertTitle>
								<AlertDescription className="flex flex-col gap-3">
									<span>กรุณาลองโหลดใหม่อีกครั้ง หรือปิดหน้าต่างแล้วเลือกใหม่</span>
									<Button
										type="button"
										size="xs"
										variant="outline"
										className="w-fit"
										onClick={retryLoadOwner}
									>
										<RotateCcw data-icon="inline-start" aria-hidden="true" />
										<span>ลองใหม่</span>
									</Button>
								</AlertDescription>
							</Alert>
						) : (
							<>
								{currentStep === 1 ? <OwnerStepIdentityContact /> : null}
								{currentStep === 2 ? <OwnerStepAddress /> : null}
								{currentStep === 3 ? <OwnerStepPreferencesPdpa /> : null}
							</>
						)}
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
