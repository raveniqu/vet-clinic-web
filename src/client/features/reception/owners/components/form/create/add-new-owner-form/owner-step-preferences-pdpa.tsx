import { Settings2, ShieldCheck } from "lucide-react";
import { useOwnerPreferencesPdpaForm } from "#/client/features/reception/owners/hooks/use-owner-preferences-pdpa-form";
import {
  PREFERRED_CHANNEL_SELECT_ITEMS,
  PREFERRED_LANGUAGE_SELECT_ITEMS,
  PREFERRED_TIME_SELECT_ITEMS,
  REFERRAL_SOURCE_SELECT_ITEMS,
} from "#/client/features/reception/owners/models/owner-form";
import {
  AppFieldDescription,
  AppFieldLabel,
  AppFieldLegend,
  AppFieldSet,
  AppFieldTitle,
} from "#/client/shared/components/app-field";
import { Checkbox } from "#/client/shared/shadcn/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
} from "#/client/shared/shadcn/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/client/shared/shadcn/components/ui/select";

export function OwnerStepPreferencesPdpa() {
  const {
    values,
    errors,
    handleReferralSourceChange,
    handlePreferredChannelChange,
    handlePreferredTimeChange,
    handlePreferredLanguageChange,
    handlePdpaRemindersChange,
    handlePdpaMarketingChange,
    handlePdpaMediaChange,
  } = useOwnerPreferencesPdpaForm();

  return (
    <div className="flex flex-col gap-8">
      <AppFieldSet>
        <AppFieldLegend>
          <Settings2 />
          <span>ความต้องการและช่องทางสื่อสาร</span>
        </AppFieldLegend>
        <FieldContent className="gap-x-4 gap-y-6">
          <Field>
            <AppFieldLabel htmlFor="owner-referral">รู้จักคลินิกจากช่องทางใด?</AppFieldLabel>
            <Select
              value={values.referralSource}
              items={REFERRAL_SOURCE_SELECT_ITEMS}
              onValueChange={handleReferralSourceChange}
            >
              <SelectTrigger id="owner-referral" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                alignItemWithTrigger={false}
                className="bg-transparent backdrop-blur-md"
              >
                {REFERRAL_SOURCE_SELECT_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <FieldGroup className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
            <Field>
              <AppFieldLabel htmlFor="owner-pref-channel">ช่องทางติดต่อที่สะดวก</AppFieldLabel>
              <Select
                value={values.preferredChannel}
                items={PREFERRED_CHANNEL_SELECT_ITEMS}
                onValueChange={handlePreferredChannelChange}
              >
                <SelectTrigger id="owner-pref-channel" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  alignItemWithTrigger={false}
                  className="bg-transparent backdrop-blur-md"
                >
                  {PREFERRED_CHANNEL_SELECT_ITEMS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <AppFieldLabel htmlFor="owner-pref-time">ช่วงเวลาที่สะดวก</AppFieldLabel>
              <Select
                value={values.preferredTime}
                items={PREFERRED_TIME_SELECT_ITEMS}
                onValueChange={handlePreferredTimeChange}
              >
                <SelectTrigger id="owner-pref-time" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="w-fit bg-transparent backdrop-blur-md"
                  alignItemWithTrigger={false}
                  align="start"
                >
                  {PREFERRED_TIME_SELECT_ITEMS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <AppFieldLabel htmlFor="owner-pref-lang">ภาษาที่ต้องการสื่อสาร</AppFieldLabel>
              <Select
                value={values.preferredLanguage}
                items={PREFERRED_LANGUAGE_SELECT_ITEMS}
                onValueChange={handlePreferredLanguageChange}
              >
                <SelectTrigger id="owner-pref-lang" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  alignItemWithTrigger={false}
                  className="bg-transparent backdrop-blur-lg"
                >
                  {PREFERRED_LANGUAGE_SELECT_ITEMS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </FieldContent>
      </AppFieldSet>

      {/* Personal Data Protection (PDPA Consents) */}
      <AppFieldSet>
        <AppFieldLegend>
          <ShieldCheck />
          <span>
            การคุ้มครองข้อมูลส่วนบุคคล{" "}
            <span className="hidden md:inline">(ความยินยอม PDPA)</span>
          </span>
        </AppFieldLegend>
        <FieldGroup className="gap-3">
          <Field orientation="horizontal" className="items-start">
            <Checkbox
              id="pdpa-privacy"
              checked={values.pdpaPrivacyNotice}
              disabled
              className="mt-1"
            />
            <AppFieldLabel
              htmlFor="pdpa-privacy"
              className="flex cursor-not-allowed flex-col items-start gap-0"
            >
              <AppFieldTitle>
                รับทราบนโยบายความเป็นส่วนตัวและนโยบายการรักษาพยาบาลสัตว์
              </AppFieldTitle>
              <AppFieldDescription>
                จำเป็นสำหรับการเปิดประวัติเวชระเบียนสัตว์เลี้ยงตามมาตรฐานของคลินิก
              </AppFieldDescription>
            </AppFieldLabel>
            {errors.pdpaPrivacyNotice && <FieldError>{errors.pdpaPrivacyNotice}</FieldError>}
          </Field>
          <Field orientation="horizontal" className="items-start">
            <Checkbox
              id="pdpa-reminders"
              checked={values.pdpaReminders}
              onCheckedChange={handlePdpaRemindersChange}
              className="mt-1"
            />
            <AppFieldLabel htmlFor="pdpa-reminders">
              <AppFieldTitle>
                ยินยอมให้แจ้งเตือนนัดหมาย การฉีดวัคซีน และผลตรวจทางห้องปฏิบัติการผ่าน SMS / LINE
              </AppFieldTitle>
            </AppFieldLabel>
          </Field>
          <Field orientation="horizontal" className="items-start">
            <Checkbox
              id="pdpa-marketing"
              checked={values.pdpaMarketing}
              onCheckedChange={handlePdpaMarketingChange}
              className="mt-0.5"
            />
            <AppFieldLabel htmlFor="pdpa-marketing">
              <AppFieldTitle>
                ยินยอมรับข่าวสาร โปรโมชัน และสิทธิพิเศษจากคลินิก
              </AppFieldTitle>
            </AppFieldLabel>
          </Field>
          <Field orientation="horizontal" className="items-start">
            <Checkbox
              id="pdpa-media"
              checked={values.pdpaMedia}
              onCheckedChange={handlePdpaMediaChange}
              className="mt-0.5"
            />
            <AppFieldLabel htmlFor="pdpa-media">
              <AppFieldTitle>
                ยินยอมให้บันทึกภาพถ่ายและสื่อของสัตว์เลี้ยงเพื่อการสื่อสารและประชาสัมพันธ์ของคลินิก
              </AppFieldTitle>
            </AppFieldLabel>
          </Field>
        </FieldGroup>
      </AppFieldSet>
    </div>
  );
}
