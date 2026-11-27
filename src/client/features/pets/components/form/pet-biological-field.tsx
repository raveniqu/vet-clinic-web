import { cn } from "cn";
import {
	Activity,
	CircleHelp,
	Mars,
	Scissors,
	Sparkles,
	Venus,
} from "lucide-react";
import { usePetPhysicalForm } from "#/client/features/pets/hooks/use-pet-physical-form";
import {
	AppFieldDescription,
	AppFieldError,
	AppFieldLabel,
	AppFieldLegend,
	AppFieldSet,
	AppFieldTitle,
} from "#/client/shared/components/app-field";
import {
	Field,
	FieldContent,
} from "#/client/shared/shadcn/components/ui/field";
import {
	RadioGroup,
	RadioGroupItem,
} from "#/client/shared/shadcn/components/ui/radio-group";

export function PetBiologicalField() {
	const {
		sex,
		sexError,
		handleSexChange,
		reproductiveStatus,
		reproductiveStatusError,
		handleReproductiveStatusChange,
	} = usePetPhysicalForm();

	return (
		<AppFieldSet>
			<AppFieldLegend>
				<Activity aria-hidden="true" />
				<span>ข้อมูลทางชีวภาพ</span>
			</AppFieldLegend>

			<Field data-invalid={Boolean(sexError)}>
				<AppFieldLabel>
					<span>เพศ</span>
					<span className="font-bold text-destructive">*</span>
				</AppFieldLabel>

				<RadioGroup
					value={sex}
					onValueChange={handleSexChange}
					className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
				>
					<AppFieldLabel htmlFor="sex-male" className="cursor-pointer">
						<Field
							orientation="horizontal"
							className="w-full items-center justify-between"
						>
							<div className="flex items-center gap-3">
								<div
									className={cn(
										"flex size-9 items-center justify-center rounded-full transition-colors",
										sex === "Male"
											? "bg-primary text-primary-foreground"
											: "bg-muted text-muted-foreground",
									)}
								>
									<Mars className="size-4" aria-hidden="true" />
								</div>
								<FieldContent className="gap-0.5">
									<AppFieldTitle>เพศผู้</AppFieldTitle>
									<AppFieldDescription>ตัวผู้ / พ่อพันธุ์</AppFieldDescription>
								</FieldContent>
							</div>
							<RadioGroupItem value="Male" id="sex-male" />
						</Field>
					</AppFieldLabel>

					<AppFieldLabel htmlFor="sex-female" className="cursor-pointer">
						<Field
							orientation="horizontal"
							className="w-full items-center justify-between"
						>
							<div className="flex items-center gap-3">
								<div
									className={cn(
										"flex size-9 items-center justify-center rounded-full transition-colors",
										sex === "Female"
											? "bg-primary text-primary-foreground"
											: "bg-muted text-muted-foreground",
									)}
								>
									<Venus className="size-4" aria-hidden="true" />
								</div>
								<FieldContent className="gap-0.5">
									<AppFieldTitle>เพศเมีย</AppFieldTitle>
									<AppFieldDescription>ตัวเมีย / แม่พันธุ์</AppFieldDescription>
								</FieldContent>
							</div>
							<RadioGroupItem value="Female" id="sex-female" />
						</Field>
					</AppFieldLabel>

					<AppFieldLabel
						htmlFor="sex-unknown"
						className="cursor-pointer sm:col-span-2"
					>
						<Field
							orientation="horizontal"
							className="w-full items-center justify-between py-2.5!"
						>
							<div className="flex items-center gap-3">
								<div
									className={cn(
										"flex size-8 items-center justify-center rounded-full transition-colors",
										sex === "Unknown"
											? "bg-primary text-primary-foreground"
											: "bg-muted text-muted-foreground",
									)}
								>
									<CircleHelp className="size-4" aria-hidden="true" />
								</div>
								<FieldContent className="gap-0.5">
									<AppFieldTitle className="text-xs">ไม่ระบุ</AppFieldTitle>
									<AppFieldDescription>
										ยังไม่สามารถระบุเพศได้หรือเพิ่งแรกเกิด
									</AppFieldDescription>
								</FieldContent>
							</div>
							<RadioGroupItem value="Unknown" id="sex-unknown" />
						</Field>
					</AppFieldLabel>
				</RadioGroup>
				{sexError ? <AppFieldError>{sexError}</AppFieldError> : null}
			</Field>

			<Field data-invalid={Boolean(reproductiveStatusError)}>
				<AppFieldLabel>
					<span>สถานะการทำหมัน</span>
					<span className="font-bold text-destructive">*</span>
				</AppFieldLabel>

				<RadioGroup
					value={reproductiveStatus}
					onValueChange={handleReproductiveStatusChange}
					className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
				>
					<AppFieldLabel htmlFor="rep-neutered" className="cursor-pointer">
						<Field
							orientation="horizontal"
							className="w-full items-center justify-between"
						>
							<div className="flex items-center gap-3">
								<div
									className={cn(
										"flex size-9 items-center justify-center rounded-full transition-colors",
										reproductiveStatus === "Neutered"
											? "bg-primary text-primary-foreground"
											: "bg-muted text-muted-foreground",
									)}
								>
									<Scissors className="size-4" aria-hidden="true" />
								</div>
								<FieldContent className="gap-0.5">
									<AppFieldTitle>ทำหมันแล้ว</AppFieldTitle>
									<AppFieldDescription>
										ผ่านการทำหมันเรียบร้อยแล้ว
									</AppFieldDescription>
								</FieldContent>
							</div>
							<RadioGroupItem value="Neutered" id="rep-neutered" />
						</Field>
					</AppFieldLabel>

					<AppFieldLabel htmlFor="rep-intact" className="cursor-pointer">
						<Field
							orientation="horizontal"
							className="w-full items-center justify-between"
						>
							<div className="flex items-center gap-3">
								<div
									className={cn(
										"flex size-9 items-center justify-center rounded-full transition-colors",
										reproductiveStatus === "Intact"
											? "bg-primary text-primary-foreground"
											: "bg-muted text-muted-foreground",
									)}
								>
									<Sparkles className="size-4" aria-hidden="true" />
								</div>
								<FieldContent className="gap-0.5">
									<AppFieldTitle>ยังไม่ทำหมัน</AppFieldTitle>
									<AppFieldDescription>ยังไม่ได้ผ่านการทำหมัน</AppFieldDescription>
								</FieldContent>
							</div>
							<RadioGroupItem value="Intact" id="rep-intact" />
						</Field>
					</AppFieldLabel>

					<AppFieldLabel
						htmlFor="rep-unknown"
						className="cursor-pointer sm:col-span-2"
					>
						<Field
							orientation="horizontal"
							className="w-full items-center justify-between py-2.5!"
						>
							<div className="flex items-center gap-3">
								<div
									className={cn(
										"flex size-8 items-center justify-center rounded-full transition-colors",
										reproductiveStatus === "Unknown"
											? "bg-primary text-primary-foreground"
											: "bg-muted text-muted-foreground",
									)}
								>
									<CircleHelp className="size-4" aria-hidden="true" />
								</div>
								<FieldContent className="gap-0.5">
									<AppFieldTitle className="text-xs">ไม่ทราบสถานะ</AppFieldTitle>
									<AppFieldDescription>
										รอสัตวแพทย์ตรวจประเมินหรือไม่มีประวัติเดิม
									</AppFieldDescription>
								</FieldContent>
							</div>
							<RadioGroupItem value="Unknown" id="rep-unknown" />
						</Field>
					</AppFieldLabel>
				</RadioGroup>
				{reproductiveStatusError ? (
					<AppFieldError>{reproductiveStatusError}</AppFieldError>
				) : null}
			</Field>
		</AppFieldSet>
	);
}
