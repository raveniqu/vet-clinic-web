import { AlertTriangle, RotateCcw } from "lucide-react";
import { usePetFormShell } from "#/client/features/pets/hooks/use-pet-form-shell";
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
import { PetFormActions } from "./pet-form-actions";
import { PetStepCaution } from "./pet-step-caution";
import { PetStepIdentity } from "./pet-step-identity";
import { PetStepIndicator } from "./pet-step-indicator";
import { PetStepPhysical } from "./pet-step-physical";

export function PetFormSheet() {
	const {
		isOpen,
		setIsOpen,
		isEdit,
		petCode,
		isLoadingPet,
		isLoadPetError,
		currentStep,
		handleFormSubmit,
		retryLoadPet,
	} = usePetFormShell();

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<AppSheetContent className="flex h-full w-full! gap-0 bg-secondary">
				<form className="contents" noValidate onSubmit={handleFormSubmit}>
					<SheetHeader className="pt-6 pb-3 text-left">
						<div className="flex flex-wrap items-center gap-2">
							<SheetTitle className="text-base sm:text-lg">
								{isEdit ? "แก้ไขข้อมูลสัตว์เลี้ยง" : "ลงทะเบียนสัตว์เลี้ยงใหม่"}
							</SheetTitle>
							{isEdit && petCode ? (
								<Badge variant="outline" className="font-mono text-xs">
									{petCode}
								</Badge>
							) : null}
						</div>
						<SheetDescription className="text-xs">
							{isEdit
								? "อัปเดตประวัติสัตว์เลี้ยง ข้อมูลทางกายภาพ และข้อควรระวังทางการแพทย์"
								: "สร้างประวัติสัตว์เลี้ยง เชื่อมโยงเจ้าของหลัก และบันทึกข้อมูลสุขภาพเบื้องต้น"}
						</SheetDescription>
					</SheetHeader>

					<div className="flex flex-col p-4">
						<PetStepIndicator />
					</div>

					<div className="flex-1 overflow-y-auto px-4 py-4">
						{isLoadingPet ? (
							<div className="flex flex-col gap-4">
								<Skeleton className="h-32 w-full rounded-3xl" />
								<Skeleton className="h-56 w-full rounded-3xl" />
								<Skeleton className="h-44 w-full rounded-3xl" />
							</div>
						) : isLoadPetError ? (
							<Alert variant="destructive">
								<AlertTriangle className="size-4" aria-hidden="true" />
								<AlertTitle>ไม่สามารถโหลดข้อมูลสัตว์เลี้ยงได้</AlertTitle>
								<AlertDescription className="flex flex-col gap-3">
									<span>กรุณาลองโหลดใหม่อีกครั้ง หรือปิดหน้าต่างแล้วเลือกใหม่</span>
									<Button
										type="button"
										size="xs"
										variant="outline"
										className="w-fit"
										onClick={retryLoadPet}
									>
										<RotateCcw data-icon="inline-start" aria-hidden="true" />
										<span>ลองใหม่</span>
									</Button>
								</AlertDescription>
							</Alert>
						) : (
							<>
								{currentStep === 1 ? <PetStepIdentity /> : null}
								{currentStep === 2 ? <PetStepPhysical /> : null}
								{currentStep === 3 ? <PetStepCaution /> : null}
							</>
						)}
					</div>

					{!isLoadingPet && !isLoadPetError ? (
						<SheetFooter>
							<PetFormActions />
						</SheetFooter>
					) : null}
				</form>
			</AppSheetContent>
		</Sheet>
	);
}
