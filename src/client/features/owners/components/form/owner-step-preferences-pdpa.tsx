import { Settings2, ShieldCheck } from "lucide-react";
import { useOwnerPreferencesPdpaForm } from "#/client/features/owners/hooks/use-owner-preferences-pdpa-form";
import { ACQUISITION_CHANNEL_SELECT_ITEMS } from "#/client/features/owners/models/owner-form.model";
import {
	AppFieldDescription,
	AppFieldError,
	AppFieldLabel,
	AppFieldLegend,
	AppFieldSet,
	AppFieldTitle,
} from "#/client/shared/components/app-field";
import {
	AppSelectContent,
	AppSelectTrigger,
} from "#/client/shared/components/app-select";
import { Checkbox } from "#/client/shared/shadcn/components/ui/checkbox";
import {
	Field,
	FieldContent,
	FieldGroup,
} from "#/client/shared/shadcn/components/ui/field";
import {
	Select,
	SelectItem,
	SelectValue,
} from "#/client/shared/shadcn/components/ui/select";

export function OwnerStepPreferencesPdpa() {
	const {
		values,
		errors,
		handleAcquisitionChannelChange,
		handleAppointmentChange,
		handleMarketingChange,
		handleMediaChange,
		handleResearchChange,
	} = useOwnerPreferencesPdpaForm();

	return (
		<div className="flex flex-col gap-8">
			<AppFieldSet>
				<AppFieldLegend>
					<Settings2 aria-hidden="true" />
					<span>ช่องทางที่รู้จักคลินิก</span>
				</AppFieldLegend>
				<FieldContent className="gap-4">
					<Field data-invalid={Boolean(errors.acquisitionChannel)}>
						<AppFieldLabel htmlFor="owner-acquisition-channel">
							<span>รู้จักคลินิกจากช่องทางใด?</span>
							<span className="font-bold text-destructive">*</span>
						</AppFieldLabel>
						<Select
							value={values.acquisitionChannel}
							items={ACQUISITION_CHANNEL_SELECT_ITEMS}
							onValueChange={handleAcquisitionChannelChange}
						>
							<AppSelectTrigger
								id="owner-acquisition-channel"
								className="w-full"
							>
								<SelectValue />
							</AppSelectTrigger>
							<AppSelectContent>
								{ACQUISITION_CHANNEL_SELECT_ITEMS.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.label}
									</SelectItem>
								))}
							</AppSelectContent>
						</Select>
						{errors.acquisitionChannel ? (
							<AppFieldError>{errors.acquisitionChannel}</AppFieldError>
						) : null}
					</Field>
				</FieldContent>
			</AppFieldSet>

			<AppFieldSet>
				<AppFieldLegend>
					<ShieldCheck aria-hidden="true" />
					<span>การคุ้มครองข้อมูลส่วนบุคคล</span>
				</AppFieldLegend>
				<FieldGroup className="gap-4">
					<Field orientation="horizontal" className="items-start">
						<Checkbox
							id="pdpa-privacy-policy"
							checked={values.privacyPolicy}
							disabled
							className="mt-1"
						/>
						<AppFieldLabel
							htmlFor="pdpa-privacy-policy"
							className="flex cursor-not-allowed flex-col items-start gap-0"
						>
							<AppFieldTitle>
								รับทราบนโยบายความเป็นส่วนตัวและนโยบายการรักษาพยาบาลสัตว์
							</AppFieldTitle>
							<AppFieldDescription>
								จำเป็นสำหรับการเปิดประวัติเวชระเบียนสัตว์เลี้ยงตามมาตรฐานของคลินิก
							</AppFieldDescription>
						</AppFieldLabel>
						{errors.privacyPolicy ? (
							<AppFieldError>{errors.privacyPolicy}</AppFieldError>
						) : null}
					</Field>

					<Field orientation="horizontal" className="items-start">
						<Checkbox
							id="pdpa-appointment"
							checked={values.appointment}
							onCheckedChange={handleAppointmentChange}
							className="mt-1"
						/>
						<AppFieldLabel
							htmlFor="pdpa-appointment"
							className="cursor-pointer"
						>
							<AppFieldTitle>
								ยินยอมให้แจ้งเตือนนัดหมาย การฉีดวัคซีน และผลตรวจทางห้องปฏิบัติการ
							</AppFieldTitle>
						</AppFieldLabel>
					</Field>

					<Field orientation="horizontal" className="items-start">
						<Checkbox
							id="pdpa-marketing"
							checked={values.marketing}
							onCheckedChange={handleMarketingChange}
							className="mt-1"
						/>
						<AppFieldLabel htmlFor="pdpa-marketing" className="cursor-pointer">
							<AppFieldTitle>
								ยินยอมรับข่าวสาร โปรโมชัน และสิทธิพิเศษจากคลินิก
							</AppFieldTitle>
						</AppFieldLabel>
					</Field>

					<Field orientation="horizontal" className="items-start">
						<Checkbox
							id="pdpa-media"
							checked={values.media}
							onCheckedChange={handleMediaChange}
							className="mt-1"
						/>
						<AppFieldLabel htmlFor="pdpa-media" className="cursor-pointer">
							<AppFieldTitle>
								ยินยอมให้บันทึกภาพถ่ายและสื่อของสัตว์เลี้ยงเพื่อการสื่อสารของคลินิก
							</AppFieldTitle>
						</AppFieldLabel>
					</Field>

					<Field orientation="horizontal" className="items-start">
						<Checkbox
							id="pdpa-research"
							checked={values.research}
							onCheckedChange={handleResearchChange}
							className="mt-1"
						/>
						<AppFieldLabel htmlFor="pdpa-research" className="cursor-pointer">
							<AppFieldTitle>
								ยินยอมให้นำข้อมูลทางคลินิกแบบไม่ระบุตัวตนไปใช้เพื่อการศึกษาและวิจัยทางสัตวแพทย์
							</AppFieldTitle>
						</AppFieldLabel>
					</Field>
				</FieldGroup>
			</AppFieldSet>
		</div>
	);
}
