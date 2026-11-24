import { Fragment } from "react";
import { Activity, CheckIcon, ChevronRightIcon, Dog, ShieldAlert } from "lucide-react";
import { cn } from "cn";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "#/client/shared/shadcn/components/ui/breadcrumb";
import { usePetFormShell } from "#/client/features/reception/pets/hooks/use-pet-form-shell";

const steps = [
  {
    step: 1,
    label: "ข้อมูลสัตว์เลี้ยงและเจ้าของ",
    description: "เจ้าของ ชื่อ และสายพันธุ์",
    icon: Dog,
  },
  {
    step: 2,
    label: "ลักษณะทางกายภาพ",
    description: "เพศ อายุ และน้ำหนัก",
    icon: Activity,
  },
  {
    step: 3,
    label: "ข้อควรระวังและสุขภาพ",
    description: "ไมโครชิปและประวัติแพทย์",
    icon: ShieldAlert,
  },
] as const;

export function PetStepIndicator() {
  const { currentStep, goToStep, isEdit } = usePetFormShell();

  return (
    <Breadcrumb aria-label="ขั้นตอนการลงทะเบียนสัตว์เลี้ยง" className="w-full">
      <BreadcrumbList className="flex flex-col items-start gap-1 md:flex-row md:items-center md:justify-evenly md:gap-2">
        {steps.map((s, index) => {
          const isDone = currentStep > s.step;
          const isCurrent = currentStep === s.step;
          const isClickable = isEdit || isDone;
          const StepIcon = s.icon;

          return (
            <Fragment key={s.step}>
              <BreadcrumbItem className="min-w-0">
                <button
                  type="button"
                  onClick={() => isClickable && goToStep(s.step)}
                  disabled={!isClickable}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 text-left transition-opacity",
                    isClickable ? "cursor-pointer hover:opacity-80" : "cursor-default"
                  )}
                >
                  {/* Circular Icon Badge */}
                  <span
                    className={cn(
                      "flex size-8.5 shrink-0 items-center justify-center rounded-full transition-colors sm:size-9",
                      isCurrent
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : isDone
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isDone ? <CheckIcon className="size-4" /> : <StepIcon className="size-4" />}
                  </span>

                  {/* Two-line Label & Description */}
                  <div className="flex min-w-0 flex-col">
                    <span
                      className={cn(
                        "truncate text-xs transition-colors",
                        isCurrent
                          ? "font-semibold text-foreground"
                          : isDone
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                      )}
                    >
                      {s.label}
                    </span>
                    <span className="truncate text-[11px] leading-tight text-muted-foreground">
                      {s.description}
                    </span>
                  </div>
                </button>
              </BreadcrumbItem>

              {/* Step Separators */}
              {index < steps.length - 1 && (
                <BreadcrumbSeparator className="flex items-center text-muted-foreground/60">
                  <ChevronRightIcon className="hidden md:block" />
                  <div
                    className={cn(
                      "ml-4 block h-3.5 w-0.5 rounded-full transition-colors md:hidden",
                      isDone ? "bg-primary/40" : "bg-border"
                    )}
                    aria-hidden="true"
                  />
                </BreadcrumbSeparator>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
