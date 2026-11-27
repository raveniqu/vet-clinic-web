import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { usePetFormShell } from "#/client/features/pets/hooks/use-pet-form-shell";
import { Button } from "#/client/shared/shadcn/components/ui/button";

export function PetFormActions() {
	const { currentStep, nextStep, prevStep, isSubmitting, setIsOpen, isEdit } =
		usePetFormShell();

	return (
		<div className="flex w-full items-center justify-between gap-3">
			<div>
				{currentStep > 1 ? (
					<Button
						key="pet-form-prev-step"
						type="button"
						variant="outline"
						size="sm"
						onClick={prevStep}
						disabled={isSubmitting}
					>
						<ArrowLeft className="mr-1.5 size-4" aria-hidden="true" />
						<span>ย้อนกลับ</span>
					</Button>
				) : (
					<Button
						key="pet-form-cancel"
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
								key="pet-form-edit-next"
								type="button"
								variant="outline"
								size="sm"
								onClick={nextStep}
								disabled={isSubmitting}
							>
								<span>ถัดไป</span>
								<ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
							</Button>
						) : null}
						<Button
							key="pet-form-edit-submit"
							type="submit"
							size="sm"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2
										className="mr-1.5 size-4 animate-spin"
										aria-hidden="true"
									/>
									<span>กำลังบันทึก...</span>
								</>
							) : (
								<>
									<Check className="mr-1.5 size-4" aria-hidden="true" />
									<span>บันทึกการเปลี่ยนแปลง</span>
								</>
							)}
						</Button>
					</>
				) : currentStep < 3 ? (
					<Button
						key="pet-form-create-next"
						type="button"
						size="sm"
						onClick={nextStep}
						disabled={isSubmitting}
					>
						<span>ขั้นตอนถัดไป</span>
						<ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
					</Button>
				) : (
					<Button
						key="pet-form-create-submit"
						type="submit"
						size="sm"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<Loader2
									className="mr-1.5 size-4 animate-spin"
									aria-hidden="true"
								/>
								<span>กำลังลงทะเบียน...</span>
							</>
						) : (
							<>
								<Check className="mr-1.5 size-4" aria-hidden="true" />
								<span>ลงทะเบียนสัตว์เลี้ยง</span>
							</>
						)}
					</Button>
				)}
			</div>
		</div>
	);
}
