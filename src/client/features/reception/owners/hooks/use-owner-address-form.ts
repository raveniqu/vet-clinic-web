import { useCallback, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { address, byPostalCode, search } from "@geothai/core";
import { useAddNewOwnerFormContext } from "#/client/features/reception/owners/contexts/add-new-owner-form-provider";
import {
  allProvinces,
  getAllDistrictsWithProvince,
  getDistrictsForProvince,
  getSubdistrictsForDistrict,
  useGeoThai,
} from "#/client/shared/hooks/use-geo-thai";
import type { GeoAddressSuggestion } from "#/client/shared/hooks/use-geo-thai";
import { useFormErrors, useFormValues } from "#/client/shared/hooks/use-wizard-form";

const OWNER_STEP_2_KEYS = [
  "addressLine",
  "subdistrict",
  "district",
  "province",
  "postalCode",
] as const;

export interface SubdistrictItem {
  id: string;
  nameEn: string;
  nameTh: string;
  districtNameEn: string;
  districtNameTh: string;
  provinceNameEn: string;
  provinceNameTh: string;
  postalCode: string;
  displayText: string;
}

export interface DistrictItem {
  id: string;
  nameEn: string;
  nameTh: string;
  provinceNameEn: string;
  provinceNameTh: string;
  displayText: string;
}

export function useOwnerAddressForm() {
  const { form, setFieldValue, setMultipleFields, handleSelectAddress } =
    useAddNewOwnerFormContext();
  const values = useFormValues(form, OWNER_STEP_2_KEYS);
  const errors = useFormErrors(form, OWNER_STEP_2_KEYS);

  const { query, setQuery, suggestions } = useGeoThai();

  const [provinceSearchInput, setProvinceSearchInput] = useState("");
  const [districtSearchInput, setDistrictSearchInput] = useState("");
  const [subdistrictSearchInput, setSubdistrictSearchInput] = useState("");

  // 1. Filtered Province Options based on user search input
  const provinceOptions = useMemo(() => {
    const trimmed = provinceSearchInput.trim().toLowerCase();
    if (!trimmed) {
      return allProvinces.map((p) => p.nameEn);
    }
    return allProvinces
      .filter((p) => p.nameEn.toLowerCase().includes(trimmed) || p.nameTh.includes(trimmed))
      .map((p) => p.nameEn);
  }, [provinceSearchInput]);

  // 2. Cached nationwide districts from module-level GeoThai index (O(1) reference)
  const allDistricts = useMemo<DistrictItem[]>(() => getAllDistrictsWithProvince(), []);

  // 3. District Items (scoped when province is selected, or searchable nationwide when province is empty)
  const districtItems = useMemo<DistrictItem[]>(() => {
    const trimmed = districtSearchInput.trim().toLowerCase();

    if (values.province) {
      const scoped = getDistrictsForProvince(values.province).map((d) => ({
        id: d.code,
        nameEn: d.nameEn,
        nameTh: d.nameTh,
        provinceNameEn: values.province,
        provinceNameTh: "",
        displayText: d.nameEn,
      }));

      if (!trimmed) return scoped;

      return scoped.filter(
        (d) => d.nameEn.toLowerCase().includes(trimmed) || d.nameTh.includes(trimmed)
      );
    }

    if (!trimmed) {
      return allDistricts.slice(0, 50);
    }

    return allDistricts
      .filter(
        (d) =>
          d.nameEn.toLowerCase().includes(trimmed) ||
          d.nameTh.includes(trimmed) ||
          d.provinceNameEn.toLowerCase().includes(trimmed)
      )
      .slice(0, 30);
  }, [allDistricts, districtSearchInput, values.province]);

  // 4. Known subdistricts when district is already selected
  const scopedSubdistricts = useMemo(() => {
    if (!values.province || !values.district) return [];
    return getSubdistrictsForDistrict(values.province, values.district);
  }, [values.province, values.district]);

  // 5. Dynamic subdistrict items (supports selecting subdistrict first via search or scoped list)
  const subdistrictItems = useMemo<SubdistrictItem[]>(() => {
    const trimmed = subdistrictSearchInput.trim().toLowerCase();

    if (scopedSubdistricts.length > 0) {
      const scoped = scopedSubdistricts.map((s) => ({
        id: `${s.code}-${s.postalCode}`,
        nameEn: s.nameEn,
        nameTh: s.nameTh,
        districtNameEn: values.district,
        districtNameTh: "",
        provinceNameEn: values.province,
        provinceNameTh: "",
        postalCode: s.postalCode,
        displayText: s.nameEn,
      }));

      if (!trimmed) return scoped;

      return scoped.filter(
        (s) => s.nameEn.toLowerCase().includes(trimmed) || s.nameTh.includes(trimmed)
      );
    }

    if (trimmed.length < 2) return [];

    const searchResults = search(trimmed, { limit: 10 });
    const items: SubdistrictItem[] = [];

    for (const res of searchResults) {
      if (res.level === "subdistrict") {
        const fullAddr = address(res.area.code);
        if (!fullAddr) continue;

        const subNameEn = fullAddr.subdistrict.name_en || fullAddr.subdistrict.name_th;
        const subNameTh = fullAddr.subdistrict.name_th;
        const distNameEn = fullAddr.district.name_en || fullAddr.district.name_th;
        const distNameTh = fullAddr.district.name_th;
        const provNameEn = fullAddr.province.name_en || fullAddr.province.name_th;
        const provNameTh = fullAddr.province.name_th;
        const postal = fullAddr.subdistrict.postal_codes[0] ?? "";

        items.push({
          id: `${fullAddr.subdistrict.code}-${postal}`,
          nameEn: subNameEn,
          nameTh: subNameTh,
          districtNameEn: distNameEn,
          districtNameTh: distNameTh,
          provinceNameEn: provNameEn,
          provinceNameTh: provNameTh,
          postalCode: postal,
          displayText: `${subNameEn} (${distNameEn}, ${provNameEn})`,
        });
      }
    }

    return items;
  }, [scopedSubdistricts, values.district, values.province, subdistrictSearchInput]);

  // 6. Selected items for controlled Combobox components
  const selectedDistrictItem = useMemo<DistrictItem | null>(() => {
    if (!values.district) return null;
    const targetLower = values.district.toLowerCase();
    return (
      districtItems.find((item) => item.nameEn.toLowerCase() === targetLower) ?? {
        id: values.district,
        nameEn: values.district,
        nameTh: "",
        provinceNameEn: values.province,
        provinceNameTh: "",
        displayText: values.district,
      }
    );
  }, [districtItems, values.district, values.province]);

  const selectedSubdistrictItem = useMemo<SubdistrictItem | null>(() => {
    if (!values.subdistrict) return null;
    const targetLower = values.subdistrict.toLowerCase();
    return (
      subdistrictItems.find((item) => item.nameEn.toLowerCase() === targetLower) ?? {
        id: values.subdistrict,
        nameEn: values.subdistrict,
        nameTh: "",
        districtNameEn: values.district,
        districtNameTh: "",
        provinceNameEn: values.province,
        provinceNameTh: "",
        postalCode: values.postalCode,
        displayText: values.subdistrict,
      }
    );
  }, [subdistrictItems, values.subdistrict, values.district, values.province, values.postalCode]);

  const handleSuggestionSelect = useCallback(
    (item: GeoAddressSuggestion | null) => {
      if (item) {
        handleSelectAddress(item);
      }
    },
    [handleSelectAddress]
  );

  const handleAddressLineChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFieldValue("addressLine", e.target.value);
    },
    [setFieldValue]
  );

  // Handler: Province change
  const handleProvinceChange = useCallback(
    (newProvince: string | null) => {
      const val = newProvince ?? "";
      if (val !== values.province) {
        setMultipleFields({
          province: val,
          district: "",
          subdistrict: "",
          postalCode: "",
        });
        setSubdistrictSearchInput("");
        setDistrictSearchInput("");
      } else {
        setFieldValue("province", val);
      }
    },
    [setFieldValue, setMultipleFields, values.province]
  );

  // Handler: District selection with automatic Province auto-fill (District-first)
  const handleDistrictSelect = useCallback(
    (item: DistrictItem | null) => {
      if (!item) {
        setMultipleFields({
          district: "",
          subdistrict: "",
          postalCode: "",
        });
        return;
      }

      setMultipleFields({
        district: item.nameEn,
        ...(item.provinceNameEn && item.provinceNameEn !== values.province
          ? { province: item.provinceNameEn }
          : {}),
        subdistrict: "",
        postalCode: "",
      });
      setSubdistrictSearchInput("");
    },
    [setMultipleFields, values.province]
  );

  // Handler: Subdistrict change with automatic Reverse-Lookup (Subdistrict-first)
  const handleSubdistrictSelect = useCallback(
    (item: SubdistrictItem | null) => {
      if (!item) {
        setMultipleFields({
          subdistrict: "",
          postalCode: "",
        });
        return;
      }

      setMultipleFields({
        subdistrict: item.nameEn,
        ...(item.districtNameEn ? { district: item.districtNameEn } : {}),
        ...(item.provinceNameEn ? { province: item.provinceNameEn } : {}),
        ...(item.postalCode ? { postalCode: item.postalCode } : {}),
      });
    },
    [setMultipleFields]
  );

  // Handler: Postal Code change with automatic Reverse-Lookup (Postal-code-first)
  const handlePostalCodeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const rawDigits = e.target.value.replace(/\D/g, "").slice(0, 5);

      if (rawDigits.length === 5) {
        const matches = byPostalCode(rawDigits);
        if (matches.length > 0) {
          const sampleAddr = address(matches[0].code);
          if (sampleAddr) {
            const provName = sampleAddr.province.name_en || sampleAddr.province.name_th;
            const distName = sampleAddr.district.name_en || sampleAddr.district.name_th;

            const uniqueDistricts = new Set<string>();
            for (const m of matches) {
              const a = address(m.code);
              if (a) {
                uniqueDistricts.add(a.district.name_en || a.district.name_th);
              }
            }

            setMultipleFields({
              postalCode: rawDigits,
              ...(provName ? { province: provName } : {}),
              ...(uniqueDistricts.size === 1 && distName ? { district: distName } : {}),
            });
            return;
          }
        }
      }

      setFieldValue("postalCode", rawDigits);
    },
    [setFieldValue, setMultipleFields]
  );

  return {
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
  };
}
