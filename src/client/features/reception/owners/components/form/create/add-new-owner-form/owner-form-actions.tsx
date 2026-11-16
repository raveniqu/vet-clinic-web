import { useOwnerFormShell } from "#/client/features/reception/owners/hooks/use-owner-form-shell";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, Loader2Icon } from "lucide-react";

export function OwnerFormActions() {
  const { currentStep, nextStep, prevStep, submitForm, isSubmitting, setIsOpen, isEdit } =
    useOwnerFormShell();

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
            <span>Back</span>
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            <span>Cancel</span>
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
                <span>Next</span>
                <ArrowRightIcon className="ml-1.5 size-4" />
              </Button>
            )}
            <Button type="button" size="sm" onClick={submitForm} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2Icon className="mr-1.5 size-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckIcon className="mr-1.5 size-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </>
        ) : currentStep < 3 ? (
          <Button type="button" size="sm" onClick={nextStep} disabled={isSubmitting}>
            <span>Next Step</span>
            <ArrowRightIcon className="ml-1.5 size-4" />
          </Button>
        ) : (
          <Button type="button" size="sm" onClick={submitForm} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2Icon className="mr-1.5 size-4 animate-spin" />
                <span>Registering Owner...</span>
              </>
            ) : (
              <>
                <CheckIcon className="mr-1.5 size-4" />
                <span>Register Owner</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
