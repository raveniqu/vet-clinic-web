import { cn } from "cn";
import {
	Calendar as CalendarIcon,
	Clock,
	ClockFading,
	Scale,
} from "lucide-react";
import { usePetPhysicalForm } from "#/client/features/pets/hooks/use-pet-physical-form";
import { AppCalendar } from "#/client/shared/components/app-calendar";
import {
	AppFieldDescription,
	AppFieldError,
	AppFieldLabel,
	AppFieldLegend,
	AppFieldSet,
} from "#/client/shared/components/app-field";
import {
	AppInput,
	AppInputGroup,
	AppInputGroupInput,
} from "#/client/shared/components/app-input-group";
import { formatThaiShortDate } from "#/client/shared/helpers/formatters";
import { Badge } from "#/client/shared/shadcn/components/ui/badge";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import { Field } from "#/client/shared/shadcn/components/ui/field";
import {
	InputGroupAddon,
	InputGroupText,
} from "#/client/shared/shadcn/components/ui/input-group";
import {
	Popover,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
} from "#/client/shared/shadcn/components/ui/popover";
import { Separator } from "#/client/shared/shadcn/components/ui/separator";

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
		selectedDobDate,
		calendarStartMonth,
		calendarEndMonth,
		defaultDobMonth,
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
	} = usePetPhysicalForm();

	return (
		<AppFieldSet>
			<AppFieldLegend>
				<Scale aria-hidden="true" />
				<span>ลักษณะทางกายภาพและอายุ</span>
			</AppFieldLegend>

			<div className="grid grid-cols-1 items-start gap-x-3 gap-y-6 sm:grid-cols-2">
				<Field data-invalid={Boolean(weightError)}>
					<AppFieldLabel htmlFor="pet-weight">
						<span>น้ำหนักเริ่มต้น</span>
						<span className="font-bold text-destructive">*</span>
					</AppFieldLabel>
					<AppInputGroup>
						<InputGroupAddon align="inline-start">
							<Scale
								className="size-3.5 text-muted-foreground"
								aria-hidden="true"
							/>
						</InputGroupAddon>
						<AppInputGroupInput
							id="pet-weight"
							type="number"
							step="0.01"
							min="0.01"
							max="300"
							placeholder="เช่น 4.5"
							value={weight}
							onChange={handleWeightChange}
							aria-invalid={Boolean(weightError)}
							className="py-0.5 placeholder:text-xs"
						/>
						<InputGroupAddon align="inline-end">
							<InputGroupText className="text-xs">กก.</InputGroupText>
						</InputGroupAddon>
					</AppInputGroup>
					{weightError ? (
						<AppFieldError>{weightError}</AppFieldError>
					) : (
						<AppFieldDescription>
							จำเป็นสำหรับการคำนวณขนาดยาและประเมินสุขภาพ
						</AppFieldDescription>
					)}
				</Field>

				<Field data-invalid={Boolean(dateOfBirthError)} className="gap-2">
					<div className="flex items-center justify-between">
						<AppFieldLabel htmlFor="pet-dob-field">
							<span>วันเกิด / อายุ</span>
							<span className="font-bold text-destructive">*</span>
						</AppFieldLabel>

						<Popover open={isApproxOpen} onOpenChange={handleOpenApproxChange}>
							<PopoverTrigger
								render={
									<Button
										type="button"
										size="xs"
										variant={birthDateIsEstimated ? "default" : "outline"}
										className="h-6 gap-1 px-2 text-xs"
									/>
								}
							>
								<ClockFading className="size-3" aria-hidden="true" />
								<span>ประมาณอายุ</span>
							</PopoverTrigger>
							<PopoverContent align="end" side="top" className="w-68 p-3">
								<PopoverHeader className="flex flex-row items-center justify-between pb-1">
									<div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
										<Clock
											className="size-3.5 text-primary"
											aria-hidden="true"
										/>
										<span>คำนวณวันเกิดโดยประมาณ</span>
									</div>
									<Badge
										variant="secondary"
										className="px-1.5 py-0 text-[10px]"
									>
										{formatThaiShortDate(tempEstimatedDob)}
									</Badge>
								</PopoverHeader>
								<p className="pb-2 text-[11px] text-muted-foreground">
									ระบุอายุโดยประมาณของสัตว์เลี้ยงเพื่อคำนวณวันเกิดอัตโนมัติ
								</p>
								<div className="grid grid-cols-2 gap-2.5 pb-3">
									<div className="flex flex-col gap-1">
										<AppFieldLabel htmlFor="estimated-years">ปี</AppFieldLabel>
										<AppInput
											id="estimated-years"
											type="number"
											min={0}
											max={40}
											value={tempYears || ""}
											placeholder="0"
											onChange={handleTempYearsChange}
											className="h-8 text-xs"
										/>
									</div>
									<div className="flex flex-col gap-1">
										<AppFieldLabel htmlFor="estimated-months">
											เดือน
										</AppFieldLabel>
										<AppInput
											id="estimated-months"
											type="number"
											min={0}
											max={11}
											value={tempMonths || ""}
											placeholder="0"
											onChange={handleTempMonthsChange}
											className="h-8 text-xs"
										/>
									</div>
								</div>
								<Separator className="mb-2.5" />
								<div className="flex items-center justify-between">
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

					<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
						<PopoverTrigger
							id="pet-dob-field"
							render={
								<Button
									type="button"
									variant="outline"
									className={cn(
										"h-9.5 w-full justify-start text-left font-normal",
										!dateOfBirth && "text-muted-foreground",
									)}
								/>
							}
						>
							{dateOfBirth ? (
								<div className="flex w-full items-center justify-between">
									<div className="flex items-center gap-2">
										<CalendarIcon
											className="size-4 text-muted-foreground"
											aria-hidden="true"
										/>
										<span className="text-foreground">
											{formatThaiShortDate(dateOfBirth)}
										</span>
									</div>
									{birthDateIsEstimated ? (
										<Badge
											variant="secondary"
											className="px-1.5 py-0 text-xs font-normal"
										>
											~{estimatedYears} ปี {estimatedMonths} เดือน
										</Badge>
									) : null}
								</div>
							) : (
								<div className="flex items-center gap-2">
									<CalendarIcon
										className="size-4 text-muted-foreground"
										aria-hidden="true"
									/>
									<span>เลือกวันเกิด</span>
								</div>
							)}
						</PopoverTrigger>
						<PopoverContent
							className="w-auto bg-popover/95 p-0 backdrop-blur-md"
							align="start"
						>
							<AppCalendar
								mode="single"
								captionLayout="dropdown"
								selected={selectedDobDate}
								onSelect={handleDateSelect}
								startMonth={calendarStartMonth}
								endMonth={calendarEndMonth}
								defaultMonth={defaultDobMonth}
							/>
						</PopoverContent>
					</Popover>
					{dateOfBirthError ? (
						<AppFieldError>{dateOfBirthError}</AppFieldError>
					) : null}
				</Field>
			</div>

			<Field data-invalid={Boolean(colorError)}>
				<AppFieldLabel htmlFor="pet-color">สีขนและตำหนิ</AppFieldLabel>
				<AppInput
					id="pet-color"
					value={color}
					onChange={handleColorChange}
					placeholder="เช่น ขาว-ครีม, ดำ-น้ำตาล, ลายสลิดสีน้ำตาล"
					aria-invalid={Boolean(colorError)}
				/>
				<AppFieldDescription>ระบุสีขนเด่นหรือลักษณะตำหนิเฉพาะตัว</AppFieldDescription>
				{colorError ? <AppFieldError>{colorError}</AppFieldError> : null}
			</Field>
		</AppFieldSet>
	);
}
