import {
  AlertTriangle,
  Building2,
  CalendarIcon,
  ContactRound,
  Phone,
  UserRound,
  UsersRoundCollaboration,
} from "lucide-react";
import { cn } from "cn";
import { useOwnerIdentityContactForm } from "#/client/features/reception/owners/hooks/use-owner-identity-contact-form";
import {
  AppFieldDescription,
  AppFieldError,
  AppFieldLabel,
  AppFieldLegend,
  AppFieldSet,
  AppFieldTitle,
} from "#/client/shared/components/app-field";
import { formatPhoneNumber, formatTaxId } from "#/client/shared/helpers/formatters";
import { Alert, AlertDescription, AlertTitle } from "#/client/shared/shadcn/components/ui/alert";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import { Calendar } from "#/client/shared/shadcn/components/ui/calendar";
import { Field, FieldContent, FieldGroup } from "#/client/shared/shadcn/components/ui/field";
import { Input } from "#/client/shared/shadcn/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/client/shared/shadcn/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "#/client/shared/shadcn/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/client/shared/shadcn/components/ui/select";

export function OwnerStepIdentityContact() {
  const {
    values,
    errors,
    duplicateOwner,
    isJuristic,
    isCalendarOpen,
    setIsCalendarOpen,
    selectedDobDate,
    formattedDobLabel,
    calendarStartMonth,
    calendarEndMonth,
    defaultDobMonth,
    handleCustomerTypeChange,
    handlePrefixChange,
    handleFirstNameChange,
    handleLastNameChange,
    handleTaxIdChange,
    handleDobSelect,
    handleGenderChange,
    handlePhonePrimaryChange,
    handlePhoneSecondaryChange,
    handleLineIdChange,
    handleEmailChange,
  } = useOwnerIdentityContactForm();

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Customer Type Selector (Radio Card Group) */}
      <AppFieldSet>
        <AppFieldLegend>
          <UsersRoundCollaboration />
          <span>Customer Type</span>
        </AppFieldLegend>
        <RadioGroup
          value={values.customerType}
          onValueChange={handleCustomerTypeChange}
          className="grid grid-cols-1 gap-3 md:grid-cols-2"
        >
          {/* Individual Card */}
          <AppFieldLabel htmlFor="type-individual" className="cursor-pointer">
            <Field orientation="horizontal" className="w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full transition-colors",
                    !isJuristic
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <UserRound className="size-4" />
                </div>
                <FieldContent className="gap-0.5">
                  <AppFieldTitle>Individual</AppFieldTitle>
                  <AppFieldDescription>Natural Person</AppFieldDescription>
                </FieldContent>
              </div>
              <RadioGroupItem value="INDIVIDUAL" id="type-individual" />
            </Field>
          </AppFieldLabel>

          {/* Juristic Card */}
          <AppFieldLabel htmlFor="type-juristic" className="cursor-pointer">
            <Field orientation="horizontal" className="w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full transition-colors",
                    isJuristic
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Building2 className="size-4" />
                </div>
                <FieldContent className="gap-0.5">
                  <AppFieldTitle>Juristic / Org</AppFieldTitle>
                  <AppFieldDescription>Company / Foundation</AppFieldDescription>
                </FieldContent>
              </div>
              <RadioGroupItem value="JURISTIC" id="type-juristic" />
            </Field>
          </AppFieldLabel>
        </RadioGroup>
      </AppFieldSet>

      {/* 2. Identity Details */}
      <AppFieldSet>
        <AppFieldLegend>
          <ContactRound />
          <span>Identity Details</span>
        </AppFieldLegend>

        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
          {/* Prefix (มี key เพื่อป้องกัน Select Value Desync ระหว่าง Mr. กับ Company) */}
          <Field
            data-invalid={!!errors.prefix}
            className={cn("sm:col-span-2", isJuristic && "sm:col-span-4")}
          >
            <AppFieldLabel htmlFor="owner-prefix">Prefix</AppFieldLabel>
            <Select
              key={isJuristic ? "prefix-juristic" : "prefix-individual"}
              value={values.prefix}
              onValueChange={handlePrefixChange}
            >
              <SelectTrigger id="owner-prefix" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} align="start">
                {!isJuristic ? (
                  <>
                    <SelectItem value="Mr.">Mr.</SelectItem>
                    <SelectItem value="Mrs.">Mrs.</SelectItem>
                    <SelectItem value="Ms.">Ms.</SelectItem>
                    <SelectItem value="Dr.">Dr.</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="Company">Company</SelectItem>
                    <SelectItem value="Foundation">Foundation</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            {errors.prefix && <AppFieldError>{errors.prefix}</AppFieldError>}
          </Field>

          {/* First Name / Org Name */}
          <Field
            data-invalid={!!errors.firstName}
            className={cn(isJuristic ? "sm:col-span-8" : "sm:col-span-5")}
          >
            <AppFieldLabel htmlFor="owner-firstname">
              {isJuristic ? "Organization / Legal Name" : "First Name"}
              <span className="font-bold text-destructive">*</span>
            </AppFieldLabel>
            <Input
              id="owner-firstname"
              value={values.firstName}
              onChange={handleFirstNameChange}
              placeholder={isJuristic ? "e.g., Happy Paws Foundation" : "e.g., Vipada"}
              aria-invalid={!!errors.firstName}
              className="placeholder:text-sm"
            />
            {errors.firstName && <AppFieldError>{errors.firstName}</AppFieldError>}
          </Field>

          {/* Last Name (เฉพาะ Individual) */}
          {!isJuristic && (
            <Field data-invalid={!!errors.lastName} className="sm:col-span-5">
              <AppFieldLabel htmlFor="owner-lastname">
                <span>Last Name</span>
                <span className="font-bold text-destructive">*</span>
              </AppFieldLabel>
              <Input
                id="owner-lastname"
                value={values.lastName}
                onChange={handleLastNameChange}
                placeholder="e.g., Srisuwan"
                aria-invalid={!!errors.lastName}
                className="placeholder:text-sm"
              />
              {errors.lastName && <AppFieldError>{errors.lastName}</AppFieldError>}
            </Field>
          )}

          {/* Citizen / Tax ID */}
          <Field data-invalid={!!errors.taxId} className="col-span-full">
            <AppFieldLabel htmlFor="owner-taxid">
              {isJuristic ? "Tax Identification Number" : "Citizen / Tax ID"}
              <span className="font-bold text-destructive">*</span>
            </AppFieldLabel>
            <Input
              id="owner-taxid"
              value={formatTaxId(values.taxId)}
              inputMode="numeric"
              maxLength={17}
              onChange={handleTaxIdChange}
              placeholder={isJuristic ? "0-XXXX-XXXXX-XX-X" : "X-XXXX-XXXXX-XX-X"}
              aria-invalid={!!errors.taxId}
              className="tracking-wide placeholder:text-sm"
            />
            {errors.taxId && <AppFieldError>{errors.taxId}</AppFieldError>}
          </Field>
        </div>

        {/* Date of Birth & Gender (เฉพาะ Individual) */}
        {!isJuristic && (
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <Field data-invalid={!!errors.dateOfBirth}>
              <AppFieldLabel htmlFor="owner-dob">Date of Birth</AppFieldLabel>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger
                  id="owner-dob"
                  render={
                    <Button
                      variant="secondary"
                      className={cn(
                        "h-9 w-full justify-start px-3 text-left font-normal",
                        !values.dateOfBirth && "text-muted-foreground"
                      )}
                    />
                  }
                >
                  <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                  {formattedDobLabel ?? (
                    <span className="text-muted-foreground">Select date of birth</span>
                  )}
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto bg-transparent p-0 backdrop-blur-md"
                  align="start"
                >
                  <Calendar
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
              {errors.dateOfBirth && <AppFieldError>{errors.dateOfBirth}</AppFieldError>}
            </Field>

            <Field data-invalid={!!errors.gender}>
              <AppFieldLabel htmlFor="owner-gender">Gender</AppFieldLabel>
              <Select value={values.gender} onValueChange={handleGenderChange}>
                <SelectTrigger id="owner-gender" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  alignItemWithTrigger={false}
                  className="bg-transparent backdrop-blur-md"
                >
                  <SelectItem value="Not Specified">Not Specified</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="LGBTQ+">LGBTQ+</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <AppFieldError>{errors.gender}</AppFieldError>}
            </Field>
          </div>
        )}
      </AppFieldSet>

      {/* 3. Contact Channels */}
      <AppFieldSet>
        <AppFieldLegend>
          <Phone />
          <span>Contact Channels</span>
        </AppFieldLegend>
        <FieldContent className="flex flex-col gap-4">
          {duplicateOwner && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Duplicate Phone Number</AlertTitle>
              <AlertDescription>
                Phone number matches an existing customer:{" "}
                <strong>
                  {duplicateOwner.prefix} {duplicateOwner.firstName} {duplicateOwner.lastName}
                </strong>{" "}
                ({duplicateOwner.customerCode}). Please verify before creating a new profile.
              </AlertDescription>
            </Alert>
          )}
          <FieldGroup className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <Field data-invalid={!!errors.phonePrimary}>
              <AppFieldLabel htmlFor="owner-phone1">
                Primary Phone
                <span className="font-bold text-destructive">*</span>
              </AppFieldLabel>
              <Input
                id="owner-phone1"
                type="tel"
                inputMode="numeric"
                maxLength={12}
                value={formatPhoneNumber(values.phonePrimary)}
                onChange={handlePhonePrimaryChange}
                placeholder="08X-XXX-XXXX"
                aria-invalid={!!errors.phonePrimary}
                className="tracking-wide placeholder:text-sm"
              />
              {errors.phonePrimary ? <AppFieldError>{errors.phonePrimary}</AppFieldError> : null}
            </Field>

            <Field data-invalid={!!errors.phoneSecondary}>
              <AppFieldLabel htmlFor="owner-phone2">Secondary Phone / Home</AppFieldLabel>
              <Input
                id="owner-phone2"
                type="tel"
                inputMode="numeric"
                maxLength={12}
                value={formatPhoneNumber(values.phoneSecondary)}
                onChange={handlePhoneSecondaryChange}
                placeholder="02-XXX-XXXX or 08X-XXX-XXXX"
                className="tracking-wide placeholder:text-sm"
              />
            </Field>

            <Field data-invalid={!!errors.lineId}>
              <AppFieldLabel htmlFor="owner-line">LINE ID</AppFieldLabel>
              <Input
                id="owner-line"
                value={values.lineId}
                onChange={handleLineIdChange}
                placeholder="e.g., @username"
              />
            </Field>

            <Field data-invalid={!!errors.email}>
              <AppFieldLabel htmlFor="owner-email">Email Address</AppFieldLabel>
              <Input
                id="owner-email"
                type="email"
                value={values.email}
                onChange={handleEmailChange}
                placeholder="example@email.com"
              />
              {errors.email && <AppFieldError>{errors.email}</AppFieldError>}
            </Field>
          </FieldGroup>
        </FieldContent>
      </AppFieldSet>
    </div>
  );
}
