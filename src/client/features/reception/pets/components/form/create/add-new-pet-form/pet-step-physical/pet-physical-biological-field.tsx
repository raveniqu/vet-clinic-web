import { Activity, CircleHelp, Mars, Scissors, Sparkles, Venus } from "lucide-react";
import { cn } from "cn";
import { Field, FieldContent } from "#/client/shared/shadcn/components/ui/field";
import { RadioGroup, RadioGroupItem } from "#/client/shared/shadcn/components/ui/radio-group";
import {
  AppFieldDescription,
  AppFieldError,
  AppFieldLabel,
  AppFieldLegend,
  AppFieldSet,
  AppFieldTitle,
} from "#/client/shared/components/app-field";
import { usePetPhysicalBiological } from "#/client/features/reception/pets/hooks/use-pet-physical-biological";

export function PetPhysicalBiologicalField() {
  const {
    sex,
    sexError,
    handleSexChange,

    reproductiveStatus,
    reproductiveStatusError,
    handleReproductiveStatusChange,
  } = usePetPhysicalBiological();

  return (
    <AppFieldSet>
      <AppFieldLegend>
        <Activity />
        <span>Biological Profile</span>
      </AppFieldLegend>

      {/* 1. Sex Selection */}
      <Field data-invalid={!!sexError}>
        <AppFieldLabel>
          <span>Sex</span>
          <span className="font-bold text-destructive">*</span>
        </AppFieldLabel>

        <RadioGroup
          value={sex}
          onValueChange={(val) => handleSexChange(val as typeof sex)}
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
        >
          {/* Male Card */}
          <AppFieldLabel htmlFor="sex-male" className="cursor-pointer">
            <Field orientation="horizontal" className="w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full transition-colors",
                    sex === "Male"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Mars className="size-4" />
                </div>
                <FieldContent className="gap-0.5">
                  <AppFieldTitle>Male</AppFieldTitle>
                  <AppFieldDescription>Boy / Sire</AppFieldDescription>
                </FieldContent>
              </div>
              <RadioGroupItem value="Male" id="sex-male" />
            </Field>
          </AppFieldLabel>

          {/* Female Card */}
          <AppFieldLabel htmlFor="sex-female" className="cursor-pointer">
            <Field orientation="horizontal" className="w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full transition-colors",
                    sex === "Female"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Venus className="size-4" />
                </div>
                <FieldContent className="gap-0.5">
                  <AppFieldTitle>Female</AppFieldTitle>
                  <AppFieldDescription>Girl / Dam</AppFieldDescription>
                </FieldContent>
              </div>
              <RadioGroupItem value="Female" id="sex-female" />
            </Field>
          </AppFieldLabel>

          {/* Unknown Card (Span 2 Columns - Subtle Fallback) */}
          <AppFieldLabel htmlFor="sex-unknown" className="cursor-pointer sm:col-span-2">
            <Field orientation="horizontal" className="w-full items-center justify-between py-2.5!">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full transition-colors",
                    sex === "Unknown"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <CircleHelp className="size-4" />
                </div>
                <FieldContent className="gap-0.5">
                  <AppFieldTitle className="text-xs">Unknown</AppFieldTitle>
                  <AppFieldDescription>Cannot determine yet or newborn</AppFieldDescription>
                </FieldContent>
              </div>
              <RadioGroupItem value="Unknown" id="sex-unknown" />
            </Field>
          </AppFieldLabel>
        </RadioGroup>
        {sexError && <AppFieldError>{sexError}</AppFieldError>}
      </Field>

      {/* 2. Reproductive Status (Neutered / Spayed) */}
      <Field data-invalid={!!reproductiveStatusError}>
        <AppFieldLabel>
          <span>Reproductive Status</span>
          <span className="font-bold text-destructive">*</span>
        </AppFieldLabel>

        <RadioGroup
          value={reproductiveStatus}
          onValueChange={(val) => handleReproductiveStatusChange(val as typeof reproductiveStatus)}
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
        >
          {/* Neutered Card */}
          <AppFieldLabel htmlFor="rep-neutered" className="cursor-pointer">
            <Field orientation="horizontal" className="w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full transition-colors",
                    reproductiveStatus === "Neutered"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Scissors className="size-4" />
                </div>
                <FieldContent className="gap-0.5">
                  <AppFieldTitle>Neutered</AppFieldTitle>
                  <AppFieldDescription>Spayed or castrated</AppFieldDescription>
                </FieldContent>
              </div>
              <RadioGroupItem value="Neutered" id="rep-neutered" />
            </Field>
          </AppFieldLabel>

          {/* Intact Card */}
          <AppFieldLabel htmlFor="rep-intact" className="cursor-pointer">
            <Field orientation="horizontal" className="w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full transition-colors",
                    reproductiveStatus === "Intact"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Sparkles className="size-4" />
                </div>
                <FieldContent className="gap-0.5">
                  <AppFieldTitle>Intact</AppFieldTitle>
                  <AppFieldDescription>Not sterilized</AppFieldDescription>
                </FieldContent>
              </div>
              <RadioGroupItem value="Intact" id="rep-intact" />
            </Field>
          </AppFieldLabel>

          {/* Unknown Card (Span 2 Columns - Subtle Fallback) */}
          <AppFieldLabel htmlFor="rep-unknown" className="cursor-pointer sm:col-span-2">
            <Field orientation="horizontal" className="w-full items-center justify-between py-2.5!">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full transition-colors",
                    reproductiveStatus === "Unknown"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <CircleHelp className="size-4" />
                </div>
                <FieldContent className="gap-0.5">
                  <AppFieldTitle className="text-xs">Unknown Status</AppFieldTitle>
                  <AppFieldDescription>
                    Pending veterinary exam or rescue history
                  </AppFieldDescription>
                </FieldContent>
              </div>
              <RadioGroupItem value="Unknown" id="rep-unknown" />
            </Field>
          </AppFieldLabel>
        </RadioGroup>
        {reproductiveStatusError && <AppFieldError>{reproductiveStatusError}</AppFieldError>}
      </Field>
    </AppFieldSet>
  );
}
