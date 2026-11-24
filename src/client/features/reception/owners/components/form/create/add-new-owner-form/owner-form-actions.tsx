import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, Loader2Icon } from "lucide-react";
import { useOwnerFormShell } from "#/client/features/reception/owners/hooks/use-owner-form-shell";
import { Button } from "#/client/shared/shadcn/components/ui/button";

export function OwnerFormActions() {
  const { currentStep, nextStep, prevStep, isSubmitting, setIsOpen, isEdit } = useOwnerFormShell();

  return (
    <div className="flex w-full items-center justify-between gap-3">
      {/* Left side: Back or Cancel */}
      <div>
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={prevStep}
            disabled={isSubmitting}
          >
            <ArrowLeftIcon className="mr-1.5 size-4" />
            <span>ย้อนกลับ</span>
          </Button>
        ) : (
          <Button
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

      {/* Right side: Actions */}
      <div className="flex items-center gap-2">
        {isEdit ? (
          <>
            {currentStep < 3 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={nextStep}
                disabled={isSubmitting}
              >
                <span>ถัดไป</span>
                <ArrowRightIcon className="ml-1.5 size-4" />
              </Button>
            )}
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2Icon className="mr-1.5 size-4 animate-spin" />
                  <span>กำลังบันทึก...</span>
                </>
              ) : (
                <>
                  <CheckIcon className="mr-1.5 size-4" />
                  <span>บันทึกการเปลี่ยนแปลง</span>
                </>
              )}
            </Button>
          </>
        ) : currentStep < 3 ? (
          <Button type="button" size="sm" onClick={nextStep} disabled={isSubmitting}>
            <span>ขั้นตอนถัดไป</span>
            <ArrowRightIcon className="ml-1.5 size-4" />
          </Button>
        ) : (
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2Icon className="mr-1.5 size-4 animate-spin" />
                <span>กำลังลงทะเบียน...</span>
              </>
            ) : (
              <>
                <CheckIcon className="mr-1.5 size-4" />
                <span>ลงทะเบียนเจ้าของสัตว์เลี้ยง</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
