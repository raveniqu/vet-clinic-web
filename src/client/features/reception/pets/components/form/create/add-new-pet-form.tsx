import { Dog } from "lucide-react";
import { usePetFormShell } from "#/client/features/reception/pets/hooks/use-pet-form-shell";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "#/client/shared/shadcn/components/ui/sheet";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { PetFormActions } from "./add-new-pet-form/pet-form-actions";
import { PetStepCaution } from "./add-new-pet-form/pet-step-caution";
import { PetStepIdentity } from "./add-new-pet-form/pet-step-identity";
import { PetStepIndicator } from "./add-new-pet-form/pet-step-indicator";
import { PetStepPhysical } from "./add-new-pet-form/pet-step-physical";

export function AddNewPetForm() {
  const isMobile = useIsMobile();
  const { isOpen, setIsOpen, currentStep, handleFormSubmit } = usePetFormShell();

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
        <span className="sr-only md:not-sr-only md:text-xs lg:text-sm">เพิ่มสัตว์เลี้ยงใหม่</span>
      </SheetTrigger>

      <SheetContent className="flex h-full w-full! gap-0 bg-secondary sm:max-w-md! md:max-w-xl! lg:max-w-2xl!">
        <form className="contents" noValidate onSubmit={handleFormSubmit}>
          {/* Header */}
          <SheetHeader className="pt-6 pb-3 text-left">
            <SheetTitle className="text-base sm:text-lg">ลงทะเบียนสัตว์เลี้ยงใหม่</SheetTitle>
            <SheetDescription className="text-xs">
              สร้างประวัติสัตว์เลี้ยง เชื่อมโยงเจ้าของหลัก และบันทึกข้อมูลสุขภาพเบื้องต้น
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
        </form>
      </SheetContent>
    </Sheet>
  );
}
