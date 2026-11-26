import { Search, SparklesIcon } from "lucide-react";
import type { GeoAddressSuggestion } from "#/client/shared/hooks/use-geo-thai";
import type {
	ThaiDistrictItem,
	ThaiSubdistrictItem,
	UseThaiAddressFieldsReturn,
} from "#/client/shared/hooks/use-thai-address-fields";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
} from "../shadcn/components/ui/combobox";
import { Field, FieldContent, FieldGroup } from "../shadcn/components/ui/field";
import { InputGroupAddon } from "../shadcn/components/ui/input-group";
import { AppFieldError, AppFieldLabel } from "./app-field";
import { AppComboboxInput, AppInput } from "./app-input-group";

export interface AppThaiAddressFieldsProps {
	idPrefix: string;
	controller: UseThaiAddressFieldsReturn;
	addressLinePlaceholder?: string;
}

export function AppThaiAddressFields({
	idPrefix,
	controller,
	addressLinePlaceholder = "เช่น 88/12 ซ.ทองหล่อ 13 ถ.สุขุมวิท 55",
}: AppThaiAddressFieldsProps) {
	const {
		values,
		errors,
		query,
		setQuery,
		suggestions,
		provinceOptions,
		districtItems,
		subdistrictItems,
		selectedDistrictItem,
		selectedSubdistrictItem,
		setProvinceSearchInput,
		setDistrictSearchInput,
		setSubdistrictSearchInput,
		handleSuggestionSelect,
		handleAddressLineChange,
		handleProvinceChange,
		handleDistrictSelect,
		handleSubdistrictSelect,
		handlePostalCodeChange,
	} = controller;

	return (
		<div className="flex flex-col gap-6">
			<FieldContent className="gap-2">
				<AppFieldLabel htmlFor={`${idPrefix}-geo-search`}>
					<SparklesIcon
						className="size-3.5 text-amber-500"
						aria-hidden="true"
					/>
					<span>ค้นหาที่อยู่อัตโนมัติ (รหัสไปรษณีย์ / แขวง / เขต)</span>
				</AppFieldLabel>
				<Combobox<GeoAddressSuggestion>
					items={suggestions}
					filter={null}
					onInputValueChange={setQuery}
					onValueChange={handleSuggestionSelect}
					itemToStringLabel={(item) => item.displayText}
					isItemEqualToValue={(a, b) => a.id === b.id}
				>
					<AppComboboxInput
						id={`${idPrefix}-geo-search`}
						placeholder="เช่น 10110, วัฒนา หรือ คลองตันเหนือ..."
						showClear
					>
						<InputGroupAddon align="inline-start">
							<Search className="size-4 text-muted-foreground" />
						</InputGroupAddon>
					</AppComboboxInput>

					<ComboboxContent
						align="start"
						sideOffset={4}
						className="z-50 w-(--anchor-width) bg-popover/95 backdrop-blur-md"
					>
						<ComboboxList>
							<ComboboxEmpty className="py-3 text-center text-xs text-muted-foreground">
								{query.trim().length < 2
									? "พิมพ์อย่างน้อย 2 ตัวอักษรเพื่อค้นหาที่อยู่..."
									: "ไม่พบข้อมูลที่อยู่ที่ตรงกัน"}
							</ComboboxEmpty>
							{suggestions.map((item) => (
								<ComboboxItem key={item.id} value={item} className="text-xs">
									{item.displayText}
								</ComboboxItem>
							))}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</FieldContent>

			<Field data-invalid={Boolean(errors.addressLine)}>
				<AppFieldLabel htmlFor={`${idPrefix}-address-line`}>
					<span>ที่อยู่ (บ้านเลขที่ อาคาร หมู่บ้าน ซอย ถนน)</span>
					<span className="font-bold text-destructive">*</span>
				</AppFieldLabel>
				<AppInput
					id={`${idPrefix}-address-line`}
					value={values.addressLine}
					onChange={handleAddressLineChange}
					placeholder={addressLinePlaceholder}
					aria-invalid={Boolean(errors.addressLine)}
				/>
				{errors.addressLine ? (
					<AppFieldError>{errors.addressLine}</AppFieldError>
				) : null}
			</Field>

			<FieldGroup className="grid grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-2">
				<Field data-invalid={Boolean(errors.subdistrict)}>
					<AppFieldLabel htmlFor={`${idPrefix}-subdistrict`}>
						<span>แขวง / ตำบล</span>
						<span className="font-bold text-destructive">*</span>
					</AppFieldLabel>
					<Combobox<ThaiSubdistrictItem>
						items={subdistrictItems}
						value={selectedSubdistrictItem}
						onInputValueChange={setSubdistrictSearchInput}
						onValueChange={handleSubdistrictSelect}
						itemToStringLabel={(item) => item.displayText}
						isItemEqualToValue={(a, b) => a.id === b.id}
					>
						<AppComboboxInput
							id={`${idPrefix}-subdistrict`}
							placeholder="เลือกหรือค้นหาแขวง / ตำบล..."
							showClear
							className="w-full"
							aria-invalid={Boolean(errors.subdistrict)}
						/>
						<ComboboxContent
							align="start"
							sideOffset={4}
							className="z-50 w-(--anchor-width) bg-popover/95 backdrop-blur-md"
						>
							<ComboboxList>
								<ComboboxEmpty className="py-3 text-center text-xs text-muted-foreground">
									พิมพ์อย่างน้อย 2 ตัวอักษรเพื่อค้นหาแขวง / ตำบล...
								</ComboboxEmpty>
								{subdistrictItems.map((sub) => (
									<ComboboxItem key={sub.id} value={sub} className="text-xs">
										{sub.displayText}
									</ComboboxItem>
								))}
							</ComboboxList>
						</ComboboxContent>
					</Combobox>
					{errors.subdistrict ? (
						<AppFieldError>{errors.subdistrict}</AppFieldError>
					) : null}
				</Field>

				<Field data-invalid={Boolean(errors.district)}>
					<AppFieldLabel htmlFor={`${idPrefix}-district`}>
						<span>เขต / อำเภอ</span>
						<span className="font-bold text-destructive">*</span>
					</AppFieldLabel>
					<Combobox<ThaiDistrictItem>
						items={districtItems}
						value={selectedDistrictItem}
						onInputValueChange={setDistrictSearchInput}
						onValueChange={handleDistrictSelect}
						itemToStringLabel={(item) => item.displayText}
						isItemEqualToValue={(a, b) => a.id === b.id}
					>
						<AppComboboxInput
							id={`${idPrefix}-district`}
							placeholder="เลือกหรือค้นหาเขต / อำเภอ..."
							showClear
							className="w-full"
							aria-invalid={Boolean(errors.district)}
						/>
						<ComboboxContent
							align="start"
							sideOffset={4}
							className="z-50 w-(--anchor-width) bg-popover/95 backdrop-blur-md"
						>
							<ComboboxList>
								<ComboboxEmpty className="py-3 text-center text-xs text-muted-foreground">
									ไม่พบเขต / อำเภอที่ตรงกัน
								</ComboboxEmpty>
								{districtItems.map((dist) => (
									<ComboboxItem key={dist.id} value={dist} className="text-xs">
										{dist.displayText}
									</ComboboxItem>
								))}
							</ComboboxList>
						</ComboboxContent>
					</Combobox>
					{errors.district ? (
						<AppFieldError>{errors.district}</AppFieldError>
					) : null}
				</Field>

				<Field data-invalid={Boolean(errors.province)}>
					<AppFieldLabel htmlFor={`${idPrefix}-province`}>
						<span>จังหวัด</span>
						<span className="font-bold text-destructive">*</span>
					</AppFieldLabel>
					<Combobox<string>
						items={provinceOptions}
						value={values.province || null}
						onInputValueChange={setProvinceSearchInput}
						onValueChange={handleProvinceChange}
					>
						<AppComboboxInput
							id={`${idPrefix}-province`}
							placeholder="เลือกหรือค้นหาจังหวัด..."
							showClear
							className="w-full"
							aria-invalid={Boolean(errors.province)}
						/>
						<ComboboxContent
							align="start"
							sideOffset={4}
							className="z-50 w-(--anchor-width) bg-popover/95 backdrop-blur-md"
						>
							<ComboboxList>
								<ComboboxEmpty className="py-3 text-center text-xs text-muted-foreground">
									ไม่พบจังหวัดที่ตรงกัน
								</ComboboxEmpty>
								{provinceOptions.map((prov) => (
									<ComboboxItem key={prov} value={prov} className="text-xs">
										{prov}
									</ComboboxItem>
								))}
							</ComboboxList>
						</ComboboxContent>
					</Combobox>
					{errors.province ? (
						<AppFieldError>{errors.province}</AppFieldError>
					) : null}
				</Field>

				<Field data-invalid={Boolean(errors.postalCode)}>
					<AppFieldLabel htmlFor={`${idPrefix}-postal-code`}>
						<span>รหัสไปรษณีย์</span>
						<span className="font-bold text-destructive">*</span>
					</AppFieldLabel>
					<AppInput
						id={`${idPrefix}-postal-code`}
						inputMode="numeric"
						maxLength={5}
						value={values.postalCode}
						onChange={handlePostalCodeChange}
						placeholder="เช่น 10110"
						aria-invalid={Boolean(errors.postalCode)}
						className="tracking-wider"
					/>
					{errors.postalCode ? (
						<AppFieldError>{errors.postalCode}</AppFieldError>
					) : null}
				</Field>
			</FieldGroup>
		</div>
	);
}
