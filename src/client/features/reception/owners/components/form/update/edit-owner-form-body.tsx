import { useOwnerFormShell } from "#/client/features/reception/owners/hooks/use-owner-form-shell";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "#/client/shared/shadcn/components/ui/sheet";
import { OwnerFormActions } from "../create/add-new-owner-form/owner-form-actions";
import { OwnerStepAddress } from "../create/add-new-owner-form/owner-step-address";
import { OwnerStepIdentityContact } from "../create/add-new-owner-form/owner-step-identity-contact";
import { OwnerStepIndicator } from "../create/add-new-owner-form/owner-step-indicator";
import { OwnerStepPreferencesPdpa } from "../create/add-new-owner-form/owner-step-preferences-pdpa";

export function EditOwnerFormBody() {
  const { isOpen, setIsOpen, currentStep, handleFormSubmit } = useOwnerFormShell();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex h-full w-full! gap-0 bg-secondary sm:max-w-md! md:max-w-xl! lg:max-w-2xl!">
        <form className="contents" noValidate onSubmit={handleFormSubmit}>
          {/* Header */}
          <SheetHeader className="pt-6 pb-3 text-left">
            <SheetTitle className="text-base sm:text-lg">แก้ไขข้อมูลเจ้าของสัตว์เลี้ยง</SheetTitle>
            <SheetDescription className="text-xs">
              อัปเดตข้อมูลส่วนตัว ช่องทางการติดต่อ ที่อยู่ และความยินยอม PDPA
            </SheetDescription>
          </SheetHeader>

          {/* Step Indicator (Non-linear navigation enabled in edit mode) */}
          <div className="flex flex-col p-4">
            <OwnerStepIndicator />
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {currentStep === 1 && <OwnerStepIdentityContact />}
            {currentStep === 2 && <OwnerStepAddress />}
            {currentStep === 3 && <OwnerStepPreferencesPdpa />}
          </div>

          {/* Sticky Actions Footer */}
          <SheetFooter>
            <OwnerFormActions />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
