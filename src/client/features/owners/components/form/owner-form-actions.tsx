import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CheckIcon,
	Loader2Icon,
} from "lucide-react";
import { useOwnerFormShell } from "#/client/features/owners/hooks/use-owner-form-shell";
import { Button } from "#/client/shared/shadcn/components/ui/button";

export function OwnerFormActions() {
	const { currentStep, nextStep, prevStep, isSubmitting, setIsOpen, isEdit } =
		useOwnerFormShell();

	return (
		<div className="flex w-full items-center justify-between gap-3">
			<div>
				{currentStep > 1 ? (
					<Button
						key="owner-form-prev-step"
						type="button"
						variant="outline"
						size="sm"
						onClick={prevStep}
						disabled={isSubmitting}
					>
						<ArrowLeftIcon className="mr-1.5 size-4" aria-hidden="true" />
						<span>ย้อนกลับ</span>
					</Button>
				) : (
					<Button
						key="owner-form-cancel"
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => setIsOpen(false)}
						disabled={isSubmitting}
					>
						<span>ยกเลิก</span>
					</Button>
				)}
			</div>

			<div className="flex items-center gap-2">
				{isEdit ? (
					<>
						{currentStep < 3 ? (
							<Button
								key="owner-form-edit-next"
								type="button"
								variant="outline"
								size="sm"
								onClick={nextStep}
								disabled={isSubmitting}
							>
								<span>ถัดไป</span>
								<ArrowRightIcon className="ml-1.5 size-4" aria-hidden="true" />
							</Button>
						) : null}
						<Button
							key="owner-form-edit-submit"
							type="submit"
							size="sm"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2Icon
										className="mr-1.5 size-4 animate-spin"
										aria-hidden="true"
									/>
									<span>กำลังบันทึก...</span>
								</>
							) : (
								<>
									<CheckIcon className="mr-1.5 size-4" aria-hidden="true" />
									<span>บันทึกการเปลี่ยนแปลง</span>
								</>
							)}
						</Button>
					</>
				) : currentStep < 3 ? (
					<Button
						key="owner-form-create-next"
						type="button"
						size="sm"
						onClick={nextStep}
						disabled={isSubmitting}
					>
						<span>ขั้นตอนถัดไป</span>
						<ArrowRightIcon className="ml-1.5 size-4" aria-hidden="true" />
					</Button>
				) : (
					<Button
						key="owner-form-create-submit"
						type="submit"
						size="sm"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<Loader2Icon
									className="mr-1.5 size-4 animate-spin"
									aria-hidden="true"
								/>
								<span>กำลังลงทะเบียน...</span>
							</>
						) : (
							<>
								<CheckIcon className="mr-1.5 size-4" aria-hidden="true" />
								<span>ลงทะเบียนเจ้าของสัตว์เลี้ยง</span>
							</>
						)}
					</Button>
				)}
			</div>
		</div>
	);
}
