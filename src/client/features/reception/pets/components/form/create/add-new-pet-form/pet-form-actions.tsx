import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { usePetFormShell } from "#/client/features/reception/pets/hooks/use-pet-form-shell";
import { Button } from "#/client/shared/shadcn/components/ui/button";

export function PetFormActions() {
  const { currentStep, nextStep, prevStep, isSubmitting, setIsOpen, isEdit } = usePetFormShell();

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
            <ArrowLeft className="mr-1.5 size-4" />
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
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            )}
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 size-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="mr-1.5 size-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </>
        ) : currentStep < 3 ? (
          <Button type="button" size="sm" onClick={nextStep} disabled={isSubmitting}>
            <span>Next Step</span>
            <ArrowRight className="ml-1.5 size-4" />
          </Button>
        ) : (
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1.5 size-4 animate-spin" />
                <span>Registering Pet...</span>
              </>
            ) : (
              <>
                <Check className="mr-1.5 size-4" />
                <span>Register Pet</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
