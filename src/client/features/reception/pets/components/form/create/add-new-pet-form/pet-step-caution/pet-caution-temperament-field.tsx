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
    title: "เชื่อง / อ่อนโยน",
    description: "นิสัยเรียบร้อย จับบังคับได้ง่าย",
    icon: Smile,
  },
  {
    value: "Nervous",
    title: "ตื่นกลัว / กังวล",
    description: "ขี้กลัว ตกใจง่าย ควรเข้าหาอย่างนุ่มนวล",
    icon: Zap,
  },
  {
    value: "Aggressive",
    title: "ดุ / ก้าวร้าว",
    description: "อาจกัดหรือข่วนเมื่อตกใจหรือถูกกระตุ้น",
    icon: TriangleAlert,
  },
  {
    value: "Needs Muzzle",
    title: "ต้องใส่ตะกร้อครอบปาก",
    description: "ต้องใช้อุปกรณ์ควบคุมเพื่อความปลอดภัยขณะตรวจ",
    icon: OctagonAlert,
  },
];

export function PetCautionTemperamentField() {
  const { temperament, handleTemperamentChange } = usePetCaution();

  return (
    <AppFieldSet>
      <AppFieldLegend>
        <ShieldAlert className="size-4 text-primary" />
        <span>นิสัยและข้อควรระวังในการจับบังคับ</span>
      </AppFieldLegend>

      <Field>
        <AppFieldLabel>
          <span>ระดับการแจ้งเตือนความปลอดภัยของเจ้าหน้าที่</span>
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
