import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "#/client/shared/shadcn/components/ui/sheet";
import { usePetFormShell } from "#/client/features/reception/pets/hooks/use-pet-form-shell";
import { PetStepIndicator } from "../create/add-new-pet-form/pet-step-indicator";
import { PetStepIdentity } from "../create/add-new-pet-form/pet-step-identity";
import { PetStepPhysical } from "../create/add-new-pet-form/pet-step-physical";
import { PetStepCaution } from "../create/add-new-pet-form/pet-step-caution";
import { PetFormActions } from "../create/add-new-pet-form/pet-form-actions";

export function EditPetFormBody() {
  const { isOpen, setIsOpen, currentStep } = usePetFormShell();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex h-full w-full! gap-0 bg-secondary sm:max-w-md! md:max-w-xl! lg:max-w-2xl!">
        {/* Header */}
        <SheetHeader className="pt-6 pb-3 text-left">
          <SheetTitle className="text-base sm:text-lg">Edit Pet Profile</SheetTitle>
          <SheetDescription className="text-xs">
            Update pet profile, biological details, and clinical alerts.
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
      </SheetContent>
    </Sheet>
  );
}
