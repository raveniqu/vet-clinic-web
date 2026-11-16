import { Dog } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "#/client/shared/shadcn/components/ui/sheet";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { usePetFormShell } from "#/client/features/reception/pets/hooks/use-pet-form-shell";
import { PetStepIndicator } from "./pet-step-indicator";
import { PetStepIdentity } from "./pet-step-identity";
import { PetStepPhysical } from "./pet-step-physical";
import { PetStepCaution } from "./pet-step-caution";
import { PetFormActions } from "./pet-form-actions";

export function AddNewPetForm() {
  const isMobile = useIsMobile();
  const { isOpen, setIsOpen, currentStep } = usePetFormShell();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
          <Button
            size={isMobile ? "icon-sm" : "sm"}
            onClick={(e) => {
              e.currentTarget.blur();
            }}
          />
        }
      >
        <Dog className="size-4" />
        <span className="sr-only md:not-sr-only md:text-xs lg:text-sm">Add New Pet</span>
      </SheetTrigger>

      <SheetContent className="flex h-full w-full! gap-0 bg-secondary sm:max-w-md! md:max-w-xl! lg:max-w-2xl!">
        {/* Header */}
        <SheetHeader className="pt-6 pb-3 text-left">
          <SheetTitle className="text-base sm:text-lg">Register New Pet</SheetTitle>
          <SheetDescription className="text-xs">
            Create new pet profile, link primary owner, and record initial medical baseline.
          </SheetDescription>
        </SheetHeader>

        {/* Step Indicator */}
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
