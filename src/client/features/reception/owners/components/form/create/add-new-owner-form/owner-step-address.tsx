import { MapPinIcon, Search, SparklesIcon } from "lucide-react";
import { useOwnerAddressForm } from "#/client/features/reception/owners/hooks/use-owner-address-form";
import type {
  DistrictItem,
  SubdistrictItem,
} from "#/client/features/reception/owners/hooks/use-owner-address-form";
import {
  AppFieldDescription,
  AppFieldError,
  AppFieldLabel,
  AppFieldLegend,
  AppFieldSet,
} from "#/client/shared/components/app-field";
import type { GeoAddressSuggestion } from "#/client/shared/hooks/use-geo-thai";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "#/client/shared/shadcn/components/ui/combobox";
import { Field, FieldContent, FieldGroup } from "#/client/shared/shadcn/components/ui/field";
import { Input } from "#/client/shared/shadcn/components/ui/input";
import { InputGroupAddon } from "#/client/shared/shadcn/components/ui/input-group";

export function OwnerStepAddress() {
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
  } = useOwnerAddressForm();

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Smart Address Search */}
      <AppFieldSet>
        <AppFieldLegend>
          <SparklesIcon className="animate-pulse text-amber-500!" />
          <span>Smart Address Search</span>
        </AppFieldLegend>
        <FieldContent className="gap-3">
          <AppFieldLabel htmlFor="geo-search-input">
            Type 5-digit postal code or district name
          </AppFieldLabel>
          <Combobox<GeoAddressSuggestion>
            items={suggestions}
            filter={null}
            onInputValueChange={setQuery}
            onValueChange={handleSuggestionSelect}
            itemToStringLabel={(item) => item.displayText}
            isItemEqualToValue={(a, b) => a.id === b.id}
          >
            <ComboboxInput
              id="geo-search-input"
              placeholder="e.g., 10110, Vadhana, or Khlong Tan..."
              showClear
              className="w-full text-xs placeholder:text-xs!"
            >
              <InputGroupAddon align="inline-start">
                <Search className="size-4 text-muted-foreground" />
              </InputGroupAddon>
            </ComboboxInput>

            <ComboboxContent
              align="start"
              sideOffset={4}
              className="z-50 w-(--anchor-width) bg-transparent backdrop-blur-md"
            >
              <ComboboxList>
                <ComboboxEmpty className="py-3 text-center text-xs text-muted-foreground">
                  {query.trim().length < 2
                    ? "Type at least 2 characters to search addresses..."
                    : "No matching Thai addresses found."}
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
      </AppFieldSet>

      {/* 2. Address Details Form */}
      <AppFieldSet>
        <AppFieldLegend>
          <MapPinIcon />
          <span>Address Details</span>
        </AppFieldLegend>
        <FieldContent className="gap-6">
          <Field data-invalid={!!errors.addressLine}>
            <AppFieldLabel htmlFor="owner-addressline">
              Street Address (House No., Building, Alley, Road)
              <span className="font-bold text-destructive">*</span>
            </AppFieldLabel>
            <Input
              id="owner-addressline"
              value={values.addressLine}
              onChange={handleAddressLineChange}
              placeholder="e.g., 88/12 Thong Lo Soi 13, Sukhumvit 55 Rd."
              aria-invalid={!!errors.addressLine}
            />
            {errors.addressLine ? (
              <AppFieldError>{errors.addressLine}</AppFieldError>
            ) : (
              <AppFieldDescription>
                Specify building number, village, alley, and road.
              </AppFieldDescription>
            )}
          </Field>

          <FieldGroup className="grid grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-2">
            {/* Subdistrict / Tambon: Can be searched or chosen first without prior district selection */}
            <Field data-invalid={!!errors.subdistrict}>
              <AppFieldLabel htmlFor="owner-subdistrict">
                Subdistrict / Tambon
                <span className="font-bold text-destructive">*</span>
              </AppFieldLabel>
              <Combobox<SubdistrictItem>
                items={subdistrictItems}
                value={selectedSubdistrictItem}
                onInputValueChange={setSubdistrictSearchInput}
                onValueChange={handleSubdistrictSelect}
                itemToStringLabel={(item) => item.displayText}
                isItemEqualToValue={(a, b) => a.id === b.id}
              >
                <ComboboxInput
                  id="owner-subdistrict"
                  placeholder="Select or search subdistrict / tambon..."
                  showClear
                  className="w-full"
                  aria-invalid={!!errors.subdistrict}
                />
                <ComboboxContent
                  align="start"
                  sideOffset={4}
                  className="z-50 w-(--anchor-width) bg-transparent backdrop-blur-md"
                >
                  <ComboboxList>
                    <ComboboxEmpty className="py-3 text-center text-xs text-muted-foreground">
                      Type at least 2 characters to search subdistricts...
                    </ComboboxEmpty>
                    {subdistrictItems.map((sub) => (
                      <ComboboxItem key={sub.id} value={sub} className="text-xs">
                        {sub.displayText}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {errors.subdistrict && <AppFieldError>{errors.subdistrict}</AppFieldError>}
            </Field>

            {/* District / Amphoe: Can be chosen independently, auto-filling province */}
            <Field data-invalid={!!errors.district}>
              <AppFieldLabel htmlFor="owner-district">
                District / Amphoe
                <span className="font-bold text-destructive">*</span>
              </AppFieldLabel>
              <Combobox<DistrictItem>
                items={districtItems}
                value={selectedDistrictItem}
                onInputValueChange={setDistrictSearchInput}
                onValueChange={handleDistrictSelect}
                itemToStringLabel={(item) => item.displayText}
                isItemEqualToValue={(a, b) => a.id === b.id}
              >
                <ComboboxInput
                  id="owner-district"
                  placeholder="Select or search district / amphoe..."
                  showClear
                  className="w-full"
                  aria-invalid={!!errors.district}
                />
                <ComboboxContent
                  align="start"
                  sideOffset={4}
                  className="z-50 w-(--anchor-width) bg-transparent backdrop-blur-md"
                >
                  <ComboboxList>
                    <ComboboxEmpty className="py-3 text-center text-xs text-muted-foreground">
                      No matching districts found.
                    </ComboboxEmpty>
                    {districtItems.map((dist) => (
                      <ComboboxItem key={dist.id} value={dist} className="text-xs">
                        {dist.displayText}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {errors.district && <AppFieldError>{errors.district}</AppFieldError>}
            </Field>

            {/* Province */}
            <Field data-invalid={!!errors.province}>
              <AppFieldLabel htmlFor="owner-province">
                Province
                <span className="font-bold text-destructive">*</span>
              </AppFieldLabel>
              <Combobox<string>
                items={provinceOptions}
                value={values.province || null}
                onInputValueChange={setProvinceSearchInput}
                onValueChange={handleProvinceChange}
              >
                <ComboboxInput
                  id="owner-province"
                  placeholder="Select or search province..."
                  showClear
                  className="w-full"
                  aria-invalid={!!errors.province}
                />
                <ComboboxContent
                  align="start"
                  sideOffset={4}
                  className="z-50 w-(--anchor-width) bg-transparent backdrop-blur-md"
                >
                  <ComboboxList>
                    <ComboboxEmpty className="py-3 text-center text-xs text-muted-foreground">
                      No provinces found.
                    </ComboboxEmpty>
                    {provinceOptions.map((prov) => (
                      <ComboboxItem key={prov} value={prov} className="text-xs">
                        {prov}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {errors.province && <AppFieldError>{errors.province}</AppFieldError>}
            </Field>

            {/* Postal Code: Supports typing 5 digits to auto-detect province and district */}
            <Field data-invalid={!!errors.postalCode}>
              <AppFieldLabel htmlFor="owner-postalcode">
                Postal Code
                <span className="font-bold text-destructive">*</span>
              </AppFieldLabel>
              <Input
                id="owner-postalcode"
                inputMode="numeric"
                maxLength={5}
                value={values.postalCode}
                onChange={handlePostalCodeChange}
                placeholder="e.g., 10110"
                aria-invalid={!!errors.postalCode}
                className="tracking-wider"
              />
              {errors.postalCode && <AppFieldError>{errors.postalCode}</AppFieldError>}
            </Field>
          </FieldGroup>
        </FieldContent>
      </AppFieldSet>
    </div>
  );
}
