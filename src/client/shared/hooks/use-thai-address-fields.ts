import { address, byPostalCode, search } from "@geothai/core";
import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import type { GeoAddressSuggestion } from "./use-geo-thai";
import {
	allProvinces,
	getAllDistrictsWithProvince,
	getDistrictsForProvince,
	getSubdistrictsForDistrict,
	useGeoThai,
} from "./use-geo-thai";

export interface ThaiAddressFieldValues {
	addressLine: string;
	subdistrict: string;
	district: string;
	province: string;
	postalCode: string;
}

export type ThaiAddressFieldErrors = Partial<
	Record<keyof ThaiAddressFieldValues, string>
>;

export interface ThaiSubdistrictItem {
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

export interface ThaiDistrictItem {
	id: string;
	nameEn: string;
	nameTh: string;
	provinceNameEn: string;
	provinceNameTh: string;
	displayText: string;
}

export interface UseThaiAddressFieldsOptions {
	values: ThaiAddressFieldValues;
	errors: ThaiAddressFieldErrors;
	onChangeField: <TKey extends keyof ThaiAddressFieldValues>(
		field: TKey,
		value: ThaiAddressFieldValues[TKey],
	) => void;
	onPatchFields: (patch: Partial<ThaiAddressFieldValues>) => void;
}

export interface UseThaiAddressFieldsReturn {
	values: ThaiAddressFieldValues;
	errors: ThaiAddressFieldErrors;
	query: string;
	setQuery: (value: string) => void;
	suggestions: GeoAddressSuggestion[];
	provinceOptions: string[];
	districtItems: ThaiDistrictItem[];
	subdistrictItems: ThaiSubdistrictItem[];
	selectedDistrictItem: ThaiDistrictItem | null;
	selectedSubdistrictItem: ThaiSubdistrictItem | null;
	setProvinceSearchInput: (value: string) => void;
	setDistrictSearchInput: (value: string) => void;
	setSubdistrictSearchInput: (value: string) => void;
	handleSuggestionSelect: (item: GeoAddressSuggestion | null) => void;
	handleAddressLineChange: (event: ChangeEvent<HTMLInputElement>) => void;
	handleProvinceChange: (newProvince: string | null) => void;
	handleDistrictSelect: (item: ThaiDistrictItem | null) => void;
	handleSubdistrictSelect: (item: ThaiSubdistrictItem | null) => void;
	handlePostalCodeChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function useThaiAddressFields({
	values,
	errors,
	onChangeField,
	onPatchFields,
}: UseThaiAddressFieldsOptions): UseThaiAddressFieldsReturn {
	const { query, setQuery, suggestions } = useGeoThai();

	const [provinceSearchInput, setProvinceSearchInput] = useState("");
	const [districtSearchInput, setDistrictSearchInput] = useState("");
	const [subdistrictSearchInput, setSubdistrictSearchInput] = useState("");

	const provinceOptions = useMemo(() => {
		const trimmed = provinceSearchInput.trim().toLowerCase();
		if (!trimmed) {
			return allProvinces.map((p) => p.nameTh);
		}
		return allProvinces
			.filter(
				(p) =>
					p.nameTh.includes(trimmed) ||
					p.nameEn.toLowerCase().includes(trimmed),
			)
			.map((p) => p.nameTh);
	}, [provinceSearchInput]);

	const allDistricts = useMemo<ThaiDistrictItem[]>(
		() => getAllDistrictsWithProvince(),
		[],
	);

	const districtItems = useMemo<ThaiDistrictItem[]>(() => {
		const trimmed = districtSearchInput.trim().toLowerCase();

		if (values.province) {
			const scoped = getDistrictsForProvince(values.province).map((d) => ({
				id: d.code,
				nameEn: d.nameEn,
				nameTh: d.nameTh,
				provinceNameEn: "",
				provinceNameTh: values.province,
				displayText: d.nameTh || d.nameEn,
			}));

			if (!trimmed) return scoped;

			return scoped.filter(
				(d) =>
					d.nameTh.includes(trimmed) ||
					d.nameEn.toLowerCase().includes(trimmed),
			);
		}

		if (!trimmed) {
			return allDistricts.slice(0, 50);
		}

		return allDistricts
			.filter(
				(d) =>
					d.nameTh.includes(trimmed) ||
					d.nameEn.toLowerCase().includes(trimmed) ||
					d.provinceNameTh.includes(trimmed) ||
					d.provinceNameEn.toLowerCase().includes(trimmed),
			)
			.slice(0, 30);
	}, [allDistricts, districtSearchInput, values.province]);

	const scopedSubdistricts = useMemo(() => {
		if (!values.province || !values.district) return [];
		return getSubdistrictsForDistrict(values.province, values.district);
	}, [values.province, values.district]);

	const subdistrictItems = useMemo<ThaiSubdistrictItem[]>(() => {
		const trimmed = subdistrictSearchInput.trim().toLowerCase();

		if (scopedSubdistricts.length > 0) {
			const scoped = scopedSubdistricts.map((s) => ({
				id: `${s.code}-${s.postalCode}`,
				nameEn: s.nameEn,
				nameTh: s.nameTh,
				districtNameEn: "",
				districtNameTh: values.district,
				provinceNameEn: "",
				provinceNameTh: values.province,
				postalCode: s.postalCode,
				displayText: s.nameTh || s.nameEn,
			}));

			if (!trimmed) return scoped;

			return scoped.filter(
				(s) =>
					s.nameTh.includes(trimmed) ||
					s.nameEn.toLowerCase().includes(trimmed),
			);
		}

		if (trimmed.length < 2) return [];

		const searchResults = search(trimmed, { limit: 10 });
		const items: ThaiSubdistrictItem[] = [];

		for (const res of searchResults) {
			if (res.level === "subdistrict") {
				const fullAddr = address(res.area.code);
				if (!fullAddr) continue;

				const subNameEn =
					fullAddr.subdistrict.name_en || fullAddr.subdistrict.name_th;
				const subNameTh =
					fullAddr.subdistrict.name_th || fullAddr.subdistrict.name_en;
				const distNameEn =
					fullAddr.district.name_en || fullAddr.district.name_th;
				const distNameTh =
					fullAddr.district.name_th || fullAddr.district.name_en;
				const provNameEn =
					fullAddr.province.name_en || fullAddr.province.name_th;
				const provNameTh =
					fullAddr.province.name_th || fullAddr.province.name_en;
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
					displayText: `${subNameTh} (${distNameTh}, ${provNameTh})`,
				});
			}
		}

		return items;
	}, [
		scopedSubdistricts,
		values.district,
		values.province,
		subdistrictSearchInput,
	]);

	const selectedDistrictItem = useMemo<ThaiDistrictItem | null>(() => {
		if (!values.district) return null;
		const targetLower = values.district.toLowerCase();
		return (
			districtItems.find(
				(item) =>
					item.nameTh === values.district ||
					item.nameEn.toLowerCase() === targetLower,
			) ?? {
				id: values.district,
				nameEn: values.district,
				nameTh: values.district,
				provinceNameEn: values.province,
				provinceNameTh: values.province,
				displayText: values.district,
			}
		);
	}, [districtItems, values.district, values.province]);

	const selectedSubdistrictItem = useMemo<ThaiSubdistrictItem | null>(() => {
		if (!values.subdistrict) return null;
		const targetLower = values.subdistrict.toLowerCase();
		return (
			subdistrictItems.find(
				(item) =>
					item.nameTh === values.subdistrict ||
					item.nameEn.toLowerCase() === targetLower,
			) ?? {
				id: values.subdistrict,
				nameEn: values.subdistrict,
				nameTh: values.subdistrict,
				districtNameEn: values.district,
				districtNameTh: values.district,
				provinceNameEn: values.province,
				provinceNameTh: values.province,
				postalCode: values.postalCode,
				displayText: values.subdistrict,
			}
		);
	}, [
		subdistrictItems,
		values.subdistrict,
		values.district,
		values.province,
		values.postalCode,
	]);

	const handleSuggestionSelect = useCallback(
		(item: GeoAddressSuggestion | null) => {
			if (!item) return;
			onPatchFields({
				subdistrict: item.subdistrict,
				district: item.district,
				province: item.province,
				postalCode: item.postalCode,
			});
		},
		[onPatchFields],
	);

	const handleAddressLineChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			onChangeField("addressLine", event.target.value);
		},
		[onChangeField],
	);

	const handleProvinceChange = useCallback(
		(newProvince: string | null) => {
			const val = newProvince ?? "";
			if (val !== values.province) {
				onPatchFields({
					province: val,
					district: "",
					subdistrict: "",
					postalCode: "",
				});
				setSubdistrictSearchInput("");
				setDistrictSearchInput("");
			} else {
				onChangeField("province", val);
			}
		},
		[onChangeField, onPatchFields, values.province],
	);

	const handleDistrictSelect = useCallback(
		(item: ThaiDistrictItem | null) => {
			if (!item) {
				onPatchFields({
					district: "",
					subdistrict: "",
					postalCode: "",
				});
				return;
			}

			const nextProvince = item.provinceNameTh || item.provinceNameEn;
			onPatchFields({
				district: item.nameTh || item.nameEn,
				...(nextProvince && nextProvince !== values.province
					? { province: nextProvince }
					: {}),
				subdistrict: "",
				postalCode: "",
			});
			setSubdistrictSearchInput("");
		},
		[onPatchFields, values.province],
	);

	const handleSubdistrictSelect = useCallback(
		(item: ThaiSubdistrictItem | null) => {
			if (!item) {
				onPatchFields({
					subdistrict: "",
					postalCode: "",
				});
				return;
			}

			const nextDistrict = item.districtNameTh || item.districtNameEn;
			const nextProvince = item.provinceNameTh || item.provinceNameEn;
			onPatchFields({
				subdistrict: item.nameTh || item.nameEn,
				...(nextDistrict ? { district: nextDistrict } : {}),
				...(nextProvince ? { province: nextProvince } : {}),
				...(item.postalCode ? { postalCode: item.postalCode } : {}),
			});
		},
		[onPatchFields],
	);

	const handlePostalCodeChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const rawDigits = event.target.value.replace(/\D/g, "").slice(0, 5);

			if (rawDigits.length === 5) {
				const matches = byPostalCode(rawDigits);
				if (matches.length > 0) {
					const sampleAddr = address(matches[0].code);
					if (sampleAddr) {
						const provName =
							sampleAddr.province.name_th || sampleAddr.province.name_en;
						const distName =
							sampleAddr.district.name_th || sampleAddr.district.name_en;

						const uniqueDistricts = new Set<string>();
						for (const match of matches) {
							const found = address(match.code);
							if (found) {
								uniqueDistricts.add(
									found.district.name_th || found.district.name_en,
								);
							}
						}

						onPatchFields({
							postalCode: rawDigits,
							...(provName ? { province: provName } : {}),
							...(uniqueDistricts.size === 1 && distName
								? { district: distName }
								: {}),
						});
						return;
					}
				}
			}

			onChangeField("postalCode", rawDigits);
		},
		[onChangeField, onPatchFields],
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
