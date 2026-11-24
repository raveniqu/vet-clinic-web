import { usePetFormShell } from "#/client/features/reception/pets/hooks/use-pet-form-shell";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "#/client/shared/shadcn/components/ui/sheet";
import { PetFormActions } from "../create/add-new-pet-form/pet-form-actions";
import { PetStepCaution } from "../create/add-new-pet-form/pet-step-caution";
import { PetStepIdentity } from "../create/add-new-pet-form/pet-step-identity";
import { PetStepIndicator } from "../create/add-new-pet-form/pet-step-indicator";
import { PetStepPhysical } from "../create/add-new-pet-form/pet-step-physical";

export function EditPetFormBody() {
  const { isOpen, setIsOpen, currentStep, handleFormSubmit } = usePetFormShell();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex h-full w-full! gap-0 bg-secondary sm:max-w-md! md:max-w-xl! lg:max-w-2xl!">
        <form className="contents" noValidate onSubmit={handleFormSubmit}>
          {/* Header */}
          <SheetHeader className="pt-6 pb-3 text-left">
            <SheetTitle className="text-base sm:text-lg">แก้ไขข้อมูลสัตว์เลี้ยง</SheetTitle>
            <SheetDescription className="text-xs">
              อัปเดตประวัติสัตว์เลี้ยง ข้อมูลทางกายภาพ และข้อควรระวังทางการแพทย์
            </SheetDescription>
          </SheetHeader>

          {/* Step Indicator (Non-linear navigation enabled in edit mode) */}
          <div className="flex flex-col p-4">
            <PetStepIndicator />
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {currentStep === 1 && <PetStepIdentity />}
            {currentStep === 2 && <PetStepPhysical />}
            {currentStep === 3 && <PetStepCaution />}
          </div>

          {/* Sticky Actions Footer */}
          <SheetFooter>
            <PetFormActions />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
