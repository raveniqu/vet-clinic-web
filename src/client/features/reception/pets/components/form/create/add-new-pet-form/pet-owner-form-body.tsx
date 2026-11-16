import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/client/shared/shadcn/components/ui/dialog";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { useOwnerFormShell } from "#/client/features/reception/owners/hooks/use-owner-form-shell";
import { OwnerStepIndicator } from "#/client/features/reception/owners/components/form/create/add-new-owner-form/owner-step-indicator";
import { OwnerStepIdentityContact } from "#/client/features/reception/owners/components/form/create/add-new-owner-form/owner-step-identity-contact";
import { OwnerStepAddress } from "#/client/features/reception/owners/components/form/create/add-new-owner-form/owner-step-address";
import { OwnerStepPreferencesPdpa } from "#/client/features/reception/owners/components/form/create/add-new-owner-form/owner-step-preferences-pdpa";
import { OwnerFormActions } from "#/client/features/reception/owners/components/form/create/add-new-owner-form/owner-form-actions";
import { AddNewOwnerForm } from "#/client/features/reception/owners/components/form/create/add-new-owner-form";

export function PetOwnerFormBody() {
  const isMobile = useIsMobile();
  const { isOpen, setIsOpen, currentStep } = useOwnerFormShell();

  if (isMobile) {
    return <AddNewOwnerForm />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex max-h-[90vh] w-full! max-w-2xl! flex-col gap-0 overflow-hidden bg-secondary p-0">
        <DialogHeader className="px-6 pt-6 pb-3 text-left">
          <DialogTitle className="text-base sm:text-lg">Register New Owner</DialogTitle>
          <DialogDescription className="text-xs">
            Manage owner profile, contact channels, and PDPA consent preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col px-6 py-2">
          <OwnerStepIndicator />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {currentStep === 1 && <OwnerStepIdentityContact />}
          {currentStep === 2 && <OwnerStepAddress />}
          {currentStep === 3 && <OwnerStepPreferencesPdpa />}
        </div>

        <DialogFooter className="bg-card/50 p-4">
          <OwnerFormActions />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
