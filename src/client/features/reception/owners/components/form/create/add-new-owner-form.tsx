import { UserRoundPlusIcon } from "lucide-react";
import { useOwnerFormShell } from "#/client/features/reception/owners/hooks/use-owner-form-shell";
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
import { OwnerFormActions } from "./add-new-owner-form/owner-form-actions";
import { OwnerStepAddress } from "./add-new-owner-form/owner-step-address";
import { OwnerStepIdentityContact } from "./add-new-owner-form/owner-step-identity-contact";
import { OwnerStepIndicator } from "./add-new-owner-form/owner-step-indicator";
import { OwnerStepPreferencesPdpa } from "./add-new-owner-form/owner-step-preferences-pdpa";

export function AddNewOwnerForm() {
  const isMobile = useIsMobile();
  const { isOpen, setIsOpen, currentStep, handleFormSubmit } = useOwnerFormShell();

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
        <UserRoundPlusIcon className="size-4" />
        <span className="sr-only md:not-sr-only md:text-xs lg:text-sm">Add New Owner</span>
      </SheetTrigger>

      <SheetContent className="flex h-full w-full! gap-0 bg-secondary sm:max-w-md! md:max-w-xl! lg:max-w-2xl!">
        <form className="contents" noValidate onSubmit={handleFormSubmit}>
          {/* Header */}
          <SheetHeader className="pt-6 pb-3 text-left">
            <SheetTitle className="text-base sm:text-lg">Register New Owner</SheetTitle>
            <SheetDescription className="text-xs">
              Manage owner profile, contact channels, and PDPA consent preferences.
            </SheetDescription>
          </SheetHeader>

          {/* Step Indicator */}
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
