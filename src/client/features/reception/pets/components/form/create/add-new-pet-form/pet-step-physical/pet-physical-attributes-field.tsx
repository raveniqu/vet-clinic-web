import { Calendar as CalendarIcon, Clock, ClockFading, Scale } from "lucide-react";
import { cn } from "cn";
import { Field } from "#/client/shared/shadcn/components/ui/field";
import { Input } from "#/client/shared/shadcn/components/ui/input";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import { Badge } from "#/client/shared/shadcn/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "#/client/shared/shadcn/components/ui/popover";
import { AppCalendar } from "#/client/shared/components/app-calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "#/client/shared/shadcn/components/ui/input-group";
import {
  AppFieldDescription,
  AppFieldError,
  AppFieldLabel,
  AppFieldLegend,
  AppFieldSet,
} from "#/client/shared/components/app-field";
import { formatThaiShortDate } from "#/client/shared/helpers/formatters";
import { usePetPhysicalAttributes } from "#/client/features/reception/pets/hooks/use-pet-physical-attributes";

export function PetPhysicalAttributesField() {
  const {
    weight,
    weightError,
    handleWeightChange,

    dateOfBirth,
    birthDateIsEstimated,
    estimatedYears,
    estimatedMonths,
    dateOfBirthError,
    isCalendarOpen,
    setIsCalendarOpen,
    handleDateSelect,

    isApproxOpen,
    handleOpenApproxChange,
    tempYears,
    tempMonths,
    tempEstimatedDob,
    handleTempYearsChange,
    handleTempMonthsChange,
    handleApplyApproxAge,
    handleClearApproxAge,

    color,
    colorError,
    handleColorChange,
  } = usePetPhysicalAttributes();

  return (
    <AppFieldSet>
      <AppFieldLegend>
        <Scale />
        <span>ลักษณะทางกายภาพและอายุ</span>
      </AppFieldLegend>

      {/* Row 1: Weight & Date of Birth */}
      <div className="grid grid-cols-1 items-start gap-x-3 gap-y-6 sm:grid-cols-2">
        {/* Weight Field */}
        <Field data-invalid={!!weightError}>
          <AppFieldLabel htmlFor="pet-weight">
            <span>น้ำหนักเริ่มต้น</span>
            <span className="font-bold text-destructive">*</span>
          </AppFieldLabel>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Scale className="size-3.5 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              id="pet-weight"
              type="number"
              step="0.01"
              min="0.01"
              max="300"
              placeholder="เช่น 4.5"
              value={weight}
              onChange={handleWeightChange}
              className="py-0.5 placeholder:text-xs"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText className="text-xs">กก.</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          {weightError ? (
            <AppFieldError>{weightError}</AppFieldError>
          ) : (
            <AppFieldDescription>จำเป็นสำหรับการคำนวณขนาดยาและประเมินสุขภาพ</AppFieldDescription>
          )}
        </Field>

        {/* Date of Birth / Age Field */}
        <Field data-invalid={!!dateOfBirthError} className="gap-2">
          <div className="flex items-center justify-between">
            <AppFieldLabel htmlFor="dob-field">
              <span>วันเกิด / อายุ</span>
              <span className="font-bold text-destructive">*</span>
            </AppFieldLabel>

            {/* Approximate Age Popover Trigger */}
            <Popover open={isApproxOpen} onOpenChange={handleOpenApproxChange}>
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    size="xs"
                    variant={birthDateIsEstimated ? "default" : "ghost"}
                    className={cn(
                      "h-6 gap-1 border-0 px-2 text-xs shadow-md/10 inset-shadow-sm/5 dark:ring dark:ring-border",
                      birthDateIsEstimated && "bg-primary text-primary-foreground shadow-xs"
                    )}
                  />
                }
              >
                <ClockFading className="size-3" />
                <span>ประมาณอายุ</span>
              </PopoverTrigger>
              <PopoverContent align="end" side="top" className="w-68 p-3">
                <PopoverHeader className="flex flex-row items-center justify-between pb-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Clock className="size-3.5 text-primary" />
                    <span>คำนวณวันเกิดโดยประมาณ</span>
                  </div>
                  <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                    {formatThaiShortDate(tempEstimatedDob)}
                  </Badge>
                </PopoverHeader>
                <p className="pb-2 text-[11px] text-muted-foreground">
                  ระบุอายุโดยประมาณของสัตว์เลี้ยงเพื่อคำนวณวันเกิดอัตโนมัติ
                </p>
                <div className="grid grid-cols-2 gap-2.5 pb-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground">ปี</span>
                    <Input
                      id="estimated-years"
                      type="number"
                      min={0}
                      max={40}
                      value={tempYears || ""}
                      placeholder="0"
                      onChange={(e) => handleTempYearsChange(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground">เดือน</span>
                    <Input
                      id="estimated-months"
                      type="number"
                      min={0}
                      max={11}
                      value={tempMonths || ""}
                      placeholder="0"
                      onChange={(e) => handleTempMonthsChange(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2.5">
                  {birthDateIsEstimated ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={handleClearApproxAge}
                      className="text-xs text-destructive hover:bg-destructive/10"
                    >
                      ล้างค่า
                    </Button>
                  ) : (
                    <div />
                  )}
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => handleOpenApproxChange(false)}
                      className="text-xs"
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      size="xs"
                      onClick={handleApplyApproxAge}
                      className="text-xs"
                    >
                      นำไปใช้
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Calendar Picker Trigger */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger
              id="dob-field"
              render={
                <Button
                  type="button"
                  variant="secondary"
                  className={cn(
                    "h-9.5 w-full justify-start text-left font-normal",
                    !dateOfBirth && "text-muted-foreground"
                  )}
                />
              }
            >
              {dateOfBirth ? (
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="size-4 text-muted-foreground" />
                    <span className="text-foreground">{formatThaiShortDate(dateOfBirth)}</span>
                  </div>
                  {birthDateIsEstimated && (
                    <Badge variant="secondary" className="px-1.5 py-0 text-xs font-normal">
                      ~{estimatedYears} ปี {estimatedMonths} เดือน
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CalendarIcon className="size-4 text-muted-foreground" />
                  <span>เลือกวันเกิด</span>
                </div>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <AppCalendar
                mode="single"
                captionLayout="dropdown"
                selected={dateOfBirth ? new Date(dateOfBirth) : undefined}
                onSelect={handleDateSelect}
                startMonth={new Date(new Date().getFullYear() - 30, 0)}
                endMonth={new Date()}
                defaultMonth={dateOfBirth ? new Date(dateOfBirth) : new Date()}
              />
            </PopoverContent>
          </Popover>
          {dateOfBirthError && <AppFieldError>{dateOfBirthError}</AppFieldError>}
        </Field>
      </div>

      {/* Row 2: Color & Markings (Full Width) */}
      <Field data-invalid={!!colorError}>
        <AppFieldLabel htmlFor="pet-color">สีขนและตำหนิ</AppFieldLabel>
        <Input
          id="pet-color"
          value={color}
          onChange={handleColorChange}
          placeholder="เช่น ขาว-ครีม, ดำ-น้ำตาล, ลายสลิดสีน้ำตาล"
        />
        <AppFieldDescription>ระบุสีขนเด่นหรือลักษณะตำหนิเฉพาะตัว</AppFieldDescription>
      </Field>
    </AppFieldSet>
  );
}
