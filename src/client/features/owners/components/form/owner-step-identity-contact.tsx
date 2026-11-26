import { cn } from "cn";
import {
	AlertTriangle,
	Building2,
	CalendarIcon,
	ContactRound,
	Phone,
	UserRound,
	UsersRoundCollaboration,
} from "lucide-react";
import { useOwnerIdentityContactForm } from "#/client/features/owners/hooks/use-owner-identity-contact-form";
import {
	GENDER_SELECT_ITEMS,
	INDIVIDUAL_PREFIX_SELECT_ITEMS,
	JURISTIC_PREFIX_SELECT_ITEMS,
} from "#/client/features/owners/models/owner-form.model";
import { AppCalendar } from "#/client/shared/components/app-calendar";
import {
	AppFieldDescription,
	AppFieldError,
	AppFieldLabel,
	AppFieldLegend,
	AppFieldSet,
	AppFieldTitle,
} from "#/client/shared/components/app-field";
import { AppInput } from "#/client/shared/components/app-input-group";
import {
	AppSelectContent,
	AppSelectTrigger,
} from "#/client/shared/components/app-select";
import {
	formatPhoneNumber,
	formatTaxId,
} from "#/client/shared/helpers/formatters";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "#/client/shared/shadcn/components/ui/alert";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
	Field,
	FieldContent,
	FieldGroup,
} from "#/client/shared/shadcn/components/ui/field";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/client/shared/shadcn/components/ui/popover";
import {
	RadioGroup,
	RadioGroupItem,
} from "#/client/shared/shadcn/components/ui/radio-group";
import {
	Select,
	SelectItem,
	SelectValue,
} from "#/client/shared/shadcn/components/ui/select";

export function OwnerStepIdentityContact() {
	const {
		values,
		errors,
		isEdit,
		isJuristic,
		conflictBanner,
		duplicatePhoneOwner,
		duplicateTaxIdOwner,
		isCalendarOpen,
		setIsCalendarOpen,
		selectedDobDate,
		formattedDobLabel,
		calendarStartMonth,
		calendarEndMonth,
		defaultDobMonth,
		handleOwnerTypeChange,
		handlePrefixChange,
		handleFirstNameChange,
		handleLastNameChange,
		handleTaxIdChange,
		handleDobSelect,
		handleGenderChange,
		handlePhoneNumberChange,
		handleLineIdChange,
		handleEmailChange,
	} = useOwnerIdentityContactForm();

	const prefixItems = isJuristic
		? JURISTIC_PREFIX_SELECT_ITEMS
		: INDIVIDUAL_PREFIX_SELECT_ITEMS;

	return (
		<div className="flex flex-col gap-8">
			{conflictBanner ? (
				<Alert variant="destructive">
					<AlertTriangle className="size-4" aria-hidden="true" />
					<AlertTitle>พบข้อมูลซ้ำกับรายการที่มีอยู่แล้วในระบบ</AlertTitle>
					<AlertDescription>{conflictBanner}</AlertDescription>
				</Alert>
			) : null}

			<AppFieldSet>
				<AppFieldLegend>
					<UsersRoundCollaboration aria-hidden="true" />
					<span>ประเภทลูกค้า</span>
				</AppFieldLegend>
				<RadioGroup
					value={values.ownerType}
					onValueChange={handleOwnerTypeChange}
					disabled={isEdit}
					className="grid grid-cols-1 gap-3 md:grid-cols-2"
				>
					<AppFieldLabel
						htmlFor="owner-type-individual"
						className="cursor-pointer"
					>
						<Field
							orientation="horizontal"
							className="w-full items-center justify-between"
						>
							<div className="flex items-center gap-3">
								<div
									className={cn(
										"flex size-9 items-center justify-center rounded-full transition-colors",
										!isJuristic
											? "bg-primary text-primary-foreground"
											: "bg-muted text-muted-foreground",
									)}
								>
									<UserRound className="size-4" aria-hidden="true" />
								</div>
								<FieldContent className="gap-0.5">
									<AppFieldTitle>บุคคลธรรมดา</AppFieldTitle>
									<AppFieldDescription>ลูกค้าทั่วไป</AppFieldDescription>
								</FieldContent>
							</div>
							<RadioGroupItem value="INDIVIDUAL" id="owner-type-individual" />
						</Field>
					</AppFieldLabel>

					<AppFieldLabel
						htmlFor="owner-type-juristic"
						className="cursor-pointer"
					>
						<Field
							orientation="horizontal"
							className="w-full items-center justify-between"
						>
							<div className="flex items-center gap-3">
								<div
									className={cn(
										"flex size-9 items-center justify-center rounded-full transition-colors",
										isJuristic
											? "bg-primary text-primary-foreground"
											: "bg-muted text-muted-foreground",
									)}
								>
									<Building2 className="size-4" aria-hidden="true" />
								</div>
								<FieldContent className="gap-0.5">
									<AppFieldTitle>นิติบุคคล / องค์กร</AppFieldTitle>
									<AppFieldDescription>
										บริษัท / ห้างหุ้นส่วน / มูลนิธิ
									</AppFieldDescription>
								</FieldContent>
							</div>
							<RadioGroupItem value="JURISTIC" id="owner-type-juristic" />
						</Field>
					</AppFieldLabel>
				</RadioGroup>
				{isEdit ? (
					<AppFieldDescription>
						ประเภทลูกค้าไม่สามารถเปลี่ยนแปลงได้หลังจากลงทะเบียนแล้ว
					</AppFieldDescription>
				) : null}
			</AppFieldSet>

			<AppFieldSet>
				<AppFieldLegend>
					<ContactRound aria-hidden="true" />
					<span>ข้อมูลระบุตัวตน</span>
				</AppFieldLegend>

				<div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
					<Field
						data-invalid={Boolean(errors.prefix)}
						className={cn("sm:col-span-3", isJuristic && "sm:col-span-4")}
					>
						<AppFieldLabel htmlFor="owner-prefix">
							<span>{isJuristic ? "ประเภทองค์กร" : "คำนำหน้า"}</span>
							<span className="font-bold text-destructive">*</span>
						</AppFieldLabel>
						<Select
							key={isJuristic ? "prefix-juristic" : "prefix-individual"}
							value={values.prefix}
							items={prefixItems}
							onValueChange={handlePrefixChange}
						>
							<AppSelectTrigger id="owner-prefix" className="w-full">
								<SelectValue />
							</AppSelectTrigger>
							<AppSelectContent>
								{prefixItems.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.label}
									</SelectItem>
								))}
							</AppSelectContent>
						</Select>
						{errors.prefix ? (
							<AppFieldError>{errors.prefix}</AppFieldError>
						) : null}
					</Field>

					<Field
						data-invalid={Boolean(errors.firstName)}
						className={cn(isJuristic ? "sm:col-span-8" : "sm:col-span-4")}
					>
						<AppFieldLabel htmlFor="owner-first-name">
							<span>{isJuristic ? "ชื่อองค์กร / นิติบุคคล" : "ชื่อจริง"}</span>
							<span className="font-bold text-destructive">*</span>
						</AppFieldLabel>
						<AppInput
							id="owner-first-name"
							value={values.firstName}
							onChange={handleFirstNameChange}
							placeholder={isJuristic ? "เช่น บริษัท สยามเพ็ท จำกัด" : "เช่น เอกนิติ"}
							aria-invalid={Boolean(errors.firstName)}
							className="placeholder:text-sm"
						/>
						{errors.firstName ? (
							<AppFieldError>{errors.firstName}</AppFieldError>
						) : null}
					</Field>

					{!isJuristic ? (
						<Field
							data-invalid={Boolean(errors.lastName)}
							className="sm:col-span-5"
						>
							<AppFieldLabel htmlFor="owner-last-name">
								<span>นามสกุล</span>
								<span className="font-bold text-destructive">*</span>
							</AppFieldLabel>
							<AppInput
								id="owner-last-name"
								value={values.lastName}
								onChange={handleLastNameChange}
								placeholder="เช่น เลี้ยงหมา"
								aria-invalid={Boolean(errors.lastName)}
								className="placeholder:text-sm"
							/>
							{errors.lastName ? (
								<AppFieldError>{errors.lastName}</AppFieldError>
							) : null}
						</Field>
					) : null}

					<Field data-invalid={Boolean(errors.taxId)} className="col-span-full">
						<AppFieldLabel htmlFor="owner-tax-id">
							<span>
								{isJuristic
									? "เลขประจำตัวผู้เสียภาษีนิติบุคคล (13 หลัก)"
									: "เลขบัตรประชาชน / เลขประจำตัวผู้เสียภาษี (13 หลัก)"}
							</span>
							<span className="font-bold text-destructive">*</span>
						</AppFieldLabel>
						<AppInput
							id="owner-tax-id"
							value={formatTaxId(values.taxId)}
							inputMode="numeric"
							maxLength={17}
							onChange={handleTaxIdChange}
							placeholder={
								isJuristic ? "0-XXXX-XXXXX-XX-X" : "X-XXXX-XXXXX-XX-X"
							}
							aria-invalid={Boolean(errors.taxId)}
							className="tracking-wide placeholder:text-sm"
						/>
						{errors.taxId ? (
							<AppFieldError>{errors.taxId}</AppFieldError>
						) : null}
						{duplicateTaxIdOwner ? (
							<Alert variant="destructive" className="mt-2">
								<AlertTriangle className="size-4" aria-hidden="true" />
								<AlertTitle>พบเลขประจำตัวผู้เสียภาษีซ้ำในระบบ</AlertTitle>
								<AlertDescription>
									ตรงกับลูกค้า: <strong>{duplicateTaxIdOwner.displayName}</strong>{" "}
									({duplicateTaxIdOwner.ownerCode}) กรุณาตรวจสอบก่อนบันทึก
								</AlertDescription>
							</Alert>
						) : null}
					</Field>
				</div>

				{!isJuristic ? (
					<div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
						<Field data-invalid={Boolean(errors.dateOfBirth)}>
							<AppFieldLabel htmlFor="owner-dob">
								<span>วันเกิด</span>
								<span className="font-bold text-destructive">*</span>
							</AppFieldLabel>
							<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
								<PopoverTrigger
									id="owner-dob"
									render={
										<Button
											type="button"
											variant="ghost"
											className={cn(
												"w-full justify-start border-0 bg-transparent px-3 text-left font-normal shadow-[inset_0_2px_3px_-1px_rgba(0,0,0,0.1),0_2px_3px_0_rgba(0,0,0,0.1)] dark:ring dark:ring-border",
												!values.dateOfBirth && "text-muted-foreground",
											)}
										/>
									}
								>
									<CalendarIcon
										className="mr-2 size-4 text-muted-foreground"
										aria-hidden="true"
									/>
									{formattedDobLabel || (
										<span className="text-muted-foreground">เลือกวันเกิด</span>
									)}
								</PopoverTrigger>
								<PopoverContent
									className="w-auto bg-transparent p-0 backdrop-blur-md"
									align="start"
								>
									<AppCalendar
										mode="single"
										captionLayout="dropdown"
										selected={selectedDobDate}
										onSelect={handleDobSelect}
										startMonth={calendarStartMonth}
										endMonth={calendarEndMonth}
										defaultMonth={defaultDobMonth}
									/>
								</PopoverContent>
							</Popover>
							{errors.dateOfBirth ? (
								<AppFieldError>{errors.dateOfBirth}</AppFieldError>
							) : null}
						</Field>

						<Field data-invalid={Boolean(errors.gender)}>
							<AppFieldLabel htmlFor="owner-gender">
								<span>เพศ</span>
								<span className="font-bold text-destructive">*</span>
							</AppFieldLabel>
							<Select
								value={values.gender}
								items={GENDER_SELECT_ITEMS}
								onValueChange={handleGenderChange}
							>
								<AppSelectTrigger id="owner-gender">
									<SelectValue />
								</AppSelectTrigger>
								<AppSelectContent>
									{GENDER_SELECT_ITEMS.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</AppSelectContent>
							</Select>
							{errors.gender ? (
								<AppFieldError>{errors.gender}</AppFieldError>
							) : null}
						</Field>
					</div>
				) : null}
			</AppFieldSet>

			<AppFieldSet>
				<AppFieldLegend>
					<Phone aria-hidden="true" />
					<span>ช่องทางการติดต่อ</span>
				</AppFieldLegend>
				<FieldContent className="flex flex-col gap-4">
					{duplicatePhoneOwner ? (
						<Alert variant="destructive">
							<AlertTriangle className="size-4" aria-hidden="true" />
							<AlertTitle>พบเบอร์โทรศัพท์ซ้ำในระบบ</AlertTitle>
							<AlertDescription>
								เบอร์โทรศัพท์นี้ตรงกับลูกค้า:{" "}
								<strong>{duplicatePhoneOwner.displayName}</strong> (
								{duplicatePhoneOwner.ownerCode}) กรุณาตรวจสอบก่อนสร้างหรือบันทึกข้อมูล
							</AlertDescription>
						</Alert>
					) : null}
					<FieldGroup className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
						<Field
							data-invalid={Boolean(errors.phoneNumber)}
							className="sm:col-span-2"
						>
							<AppFieldLabel htmlFor="owner-phone-number">
								<span>เบอร์โทรศัพท์</span>
								<span className="font-bold text-destructive">*</span>
							</AppFieldLabel>
							<AppInput
								id="owner-phone-number"
								type="tel"
								inputMode="numeric"
								maxLength={12}
								value={formatPhoneNumber(values.phoneNumber)}
								onChange={handlePhoneNumberChange}
								placeholder="08X-XXX-XXXX"
								aria-invalid={Boolean(errors.phoneNumber)}
								className="tracking-wide placeholder:text-sm"
							/>
							{errors.phoneNumber ? (
								<AppFieldError>{errors.phoneNumber}</AppFieldError>
							) : null}
						</Field>

						<Field data-invalid={Boolean(errors.lineId)}>
							<AppFieldLabel htmlFor="owner-line-id">LINE ID</AppFieldLabel>
							<AppInput
								id="owner-line-id"
								value={values.lineId}
								onChange={handleLineIdChange}
								placeholder="เช่น a.line"
								aria-invalid={Boolean(errors.lineId)}
							/>
							{errors.lineId ? (
								<AppFieldError>{errors.lineId}</AppFieldError>
							) : null}
						</Field>

						<Field data-invalid={Boolean(errors.email)}>
							<AppFieldLabel htmlFor="owner-email">อีเมล</AppFieldLabel>
							<AppInput
								id="owner-email"
								type="email"
								value={values.email}
								onChange={handleEmailChange}
								placeholder="example@email.com"
								aria-invalid={Boolean(errors.email)}
							/>
							{errors.email ? (
								<AppFieldError>{errors.email}</AppFieldError>
							) : null}
						</Field>
					</FieldGroup>
				</FieldContent>
			</AppFieldSet>
		</div>
	);
}
