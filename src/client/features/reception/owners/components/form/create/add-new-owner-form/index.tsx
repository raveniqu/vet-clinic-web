import { UserRoundPlusIcon } from "lucide-react";
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
import { useOwnerFormShell } from "#/client/features/reception/owners/hooks/use-owner-form-shell";

import { OwnerStepIndicator } from "./owner-step-indicator";
import { OwnerStepIdentityContact } from "./owner-step-identity-contact";
import { OwnerStepAddress } from "./owner-step-address";
import { OwnerStepPreferencesPdpa } from "./owner-step-preferences-pdpa";
import { OwnerFormActions } from "./owner-form-actions";

export function AddNewOwnerForm() {
  const isMobile = useIsMobile();
  const { isOpen, setIsOpen, currentStep } = useOwnerFormShell();

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
      </SheetContent>
    </Sheet>
  );
}
