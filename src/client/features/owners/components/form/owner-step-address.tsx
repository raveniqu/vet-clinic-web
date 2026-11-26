import { Copy, Home, MapPinIcon, Receipt } from "lucide-react";
import { useOwnerAddressForm } from "#/client/features/owners/hooks/use-owner-address-form";
import {
	AppFieldDescription,
	AppFieldLabel,
	AppFieldLegend,
	AppFieldSet,
	AppFieldTitle,
} from "#/client/shared/components/app-field";
import { AppThaiAddressFields } from "#/client/shared/components/app-thai-address-fields";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
	Field,
	FieldContent,
} from "#/client/shared/shadcn/components/ui/field";
import {
	RadioGroup,
	RadioGroupItem,
} from "#/client/shared/shadcn/components/ui/radio-group";
import { Separator } from "#/client/shared/shadcn/components/ui/separator";
import { Switch } from "#/client/shared/shadcn/components/ui/switch";

export function OwnerStepAddress() {
	const {
		hasBillingAddress,
		defaultAddressType,
		residentialController,
		billingController,
		handleHasBillingAddressChange,
		handleCopyResidentialToBilling,
		handleDefaultAddressTypeChange,
	} = useOwnerAddressForm();

	return (
		<div className="flex flex-col gap-8">
			<AppFieldSet>
				<AppFieldLegend>
					<Home aria-hidden="true" />
					<span>ที่อยู่ปัจจุบัน</span>
				</AppFieldLegend>
				<AppThaiAddressFields
					idPrefix="residential"
					controller={residentialController}
				/>
			</AppFieldSet>

			<AppFieldSet>
				<div className="flex flex-wrap items-center justify-between gap-3">
					<AppFieldLegend>
						<Receipt aria-hidden="true" />
						<span>ที่อยู่สำหรับออกใบเสร็จ</span>
					</AppFieldLegend>
					<div className="flex items-center gap-2">
						<AppFieldLabel
							htmlFor="owner-has-billing-address"
							className="cursor-pointer"
						>
							เพิ่มที่อยู่ออกใบเสร็จแยกต่างหาก
						</AppFieldLabel>
						<Switch
							id="owner-has-billing-address"
							checked={hasBillingAddress}
							onCheckedChange={handleHasBillingAddressChange}
						/>
					</div>
				</div>

				{hasBillingAddress ? (
					<div className="flex flex-col gap-6">
						<div className="flex justify-end">
							<Button
								type="button"
								size="xs"
								variant="outline"
								onClick={handleCopyResidentialToBilling}
							>
								<Copy data-icon="inline-start" aria-hidden="true" />
								<span>คัดลอกจากที่อยู่ปัจจุบัน</span>
							</Button>
						</div>

						<AppThaiAddressFields
							idPrefix="billing"
							controller={billingController}
							addressLinePlaceholder="เช่น เลขที่อาคาร / สำนักงานสำหรับออกใบเสร็จ..."
						/>

						<Separator />

						<Field>
							<AppFieldLabel>
								<MapPinIcon className="size-3.5" aria-hidden="true" />
								<span>กำหนดที่อยู่หลักในการติดต่อ (isDefault)</span>
							</AppFieldLabel>
							<RadioGroup
								value={defaultAddressType}
								onValueChange={handleDefaultAddressTypeChange}
								className="grid grid-cols-1 gap-3 sm:grid-cols-2"
							>
								<AppFieldLabel
									htmlFor="default-address-residential"
									className="cursor-pointer"
								>
									<Field
										orientation="horizontal"
										className="w-full items-center justify-between"
									>
										<FieldContent className="gap-0.5">
											<AppFieldTitle>ที่อยู่ปัจจุบัน</AppFieldTitle>
											<AppFieldDescription>
												ใช้เป็นค่าเริ่มต้นในการติดต่อ
											</AppFieldDescription>
										</FieldContent>
										<RadioGroupItem
											value="residential"
											id="default-address-residential"
										/>
									</Field>
								</AppFieldLabel>

								<AppFieldLabel
									htmlFor="default-address-billing"
									className="cursor-pointer"
								>
									<Field
										orientation="horizontal"
										className="w-full items-center justify-between"
									>
										<FieldContent className="gap-0.5">
											<AppFieldTitle>ที่อยู่ออกใบเสร็จ</AppFieldTitle>
											<AppFieldDescription>
												ใช้เป็นค่าเริ่มต้นแทนที่อยู่ปัจจุบัน
											</AppFieldDescription>
										</FieldContent>
										<RadioGroupItem
											value="billing"
											id="default-address-billing"
										/>
									</Field>
								</AppFieldLabel>
							</RadioGroup>
						</Field>
					</div>
				) : (
					<AppFieldDescription>
						หากไม่เปิดใช้งาน ระบบจะกำหนดให้ที่อยู่ปัจจุบันเป็นที่อยู่หลัก (isDefault)
						และหากอยู่ในโหมดแก้ไข ที่อยู่ใบเสร็จเดิม (ถ้ามี) จะถูกยกเลิกเมื่อบันทึก
					</AppFieldDescription>
				)}
			</AppFieldSet>
		</div>
	);
}
