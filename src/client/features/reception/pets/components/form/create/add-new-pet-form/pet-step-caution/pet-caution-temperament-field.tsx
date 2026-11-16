import { OctagonAlert, ShieldAlert, Smile, TriangleAlert, Zap } from "lucide-react";
import { cn } from "cn";
import { Field, FieldContent } from "#/client/shared/shadcn/components/ui/field";
import { RadioGroup, RadioGroupItem } from "#/client/shared/shadcn/components/ui/radio-group";
import {
  AppFieldDescription,
  AppFieldLabel,
  AppFieldLegend,
  AppFieldSet,
  AppFieldTitle,
} from "#/client/shared/components/app-field";
import { usePetCaution } from "#/client/features/reception/pets/hooks/use-pet-caution";
import type { TemperamentAlert } from "#/shared/schemas/pet.schema";

const temperamentOptions: {
  value: TemperamentAlert;
  title: string;
  description: string;
  icon: typeof Smile;
}[] = [
  {
    value: "Docile",
    title: "Docile",
    description: "Gentle and easy to handle",
    icon: Smile,
  },
  {
    value: "Nervous",
    title: "Nervous",
    description: "Anxious, startles easily",
    icon: Zap,
  },
  {
    value: "Aggressive",
    title: "Aggressive",
    description: "May bite or scratch if provoked",
    icon: TriangleAlert,
  },
  {
    value: "Needs Muzzle",
    title: "Needs Muzzle",
    description: "Mandatory restraint for safety",
    icon: OctagonAlert,
  },
];

export function PetCautionTemperamentField() {
  const { temperament, handleTemperamentChange } = usePetCaution();

  return (
    <AppFieldSet>
      <AppFieldLegend>
        <ShieldAlert className="size-4 text-primary" />
        <span>Handling & Temperament</span>
      </AppFieldLegend>

      <Field>
        <AppFieldLabel>
          <span>Staff Safety & Handling Alert</span>
          <span className="font-bold text-destructive">*</span>
        </AppFieldLabel>

        <RadioGroup
          value={temperament}
          onValueChange={(val) => handleTemperamentChange(val as TemperamentAlert)}
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
        >
          {temperamentOptions.map((opt) => {
            const isSelected = temperament === opt.value;
            const IconComp = opt.icon;
            const id = `temp-${opt.value.toLowerCase().replace(/\s+/g, "-")}`;

            return (
              <AppFieldLabel key={opt.value} htmlFor={id} className="cursor-pointer">
                <Field orientation="horizontal" className="w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <IconComp className="size-4" />
                    </div>
                    <FieldContent className="gap-0.5">
                      <AppFieldTitle>{opt.title}</AppFieldTitle>
                      <AppFieldDescription>{opt.description}</AppFieldDescription>
                    </FieldContent>
                  </div>
                  <RadioGroupItem value={opt.value} id={id} />
                </Field>
              </AppFieldLabel>
            );
          })}
        </RadioGroup>
      </Field>
    </AppFieldSet>
  );
}
