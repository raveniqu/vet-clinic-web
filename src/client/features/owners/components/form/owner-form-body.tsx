import { AlertTriangle, RotateCcw } from "lucide-react";
import { useOwnerFormShell } from "#/client/features/owners/hooks/use-owner-form-shell";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "#/client/shared/shadcn/components/ui/alert";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import { Skeleton } from "#/client/shared/shadcn/components/ui/skeleton";
import { OwnerStepAddress } from "./owner-step-address";
import { OwnerStepIdentityContact } from "./owner-step-identity-contact";
import { OwnerStepPreferencesPdpa } from "./owner-step-preferences-pdpa";

export function OwnerFormBody() {
	const { isLoadingOwner, isLoadOwnerError, currentStep, retryLoadOwner } =
		useOwnerFormShell();

	if (isLoadingOwner) {
		return (
			<div className="flex flex-col gap-4">
				<Skeleton className="h-32 w-full rounded-3xl" />
				<Skeleton className="h-56 w-full rounded-3xl" />
				<Skeleton className="h-44 w-full rounded-3xl" />
			</div>
		);
	}

	if (isLoadOwnerError) {
		return (
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
		);
	}

	return (
		<>
			{currentStep === 1 ? <OwnerStepIdentityContact /> : null}
			{currentStep === 2 ? <OwnerStepAddress /> : null}
			{currentStep === 3 ? <OwnerStepPreferencesPdpa /> : null}
		</>
	);
}
