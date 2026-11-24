import { useCallback, useMemo, useState } from "react";
import { address, byPostalCode, districts, provinces, search, subdistricts } from "@geothai/core";

export interface GeoAddressSuggestion {
  id: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
  displayText: string;
}

export interface GeoProvince {
  code: string;
  nameEn: string;
  nameTh: string;
}

export interface GeoDistrict {
  code: string;
  nameEn: string;
  nameTh: string;
  provinceCode: string;
}

export interface GeoDistrictWithProvince extends GeoDistrict {
  id: string;
  provinceNameEn: string;
  provinceNameTh: string;
  displayText: string;
}

export interface GeoSubdistrict {
  code: string;
  nameEn: string;
  nameTh: string;
  districtCode: string;
  provinceCode: string;
  postalCode: string;
}

export const allProvinces: GeoProvince[] = provinces()
  .map((p) => ({
    code: p.code,
    nameEn: p.name_en,
    nameTh: p.name_th,
  }))
  .sort((a, b) => a.nameTh.localeCompare(b.nameTh, "th"));

const provinceByLookupKey = new Map<string, GeoProvince>();
for (const prov of allProvinces) {
  provinceByLookupKey.set(prov.nameEn.toLowerCase(), prov);
  provinceByLookupKey.set(prov.nameTh, prov);
}

const districtsByProvinceCodeCache = new Map<string, GeoDistrict[]>();
const subdistrictsByDistrictCodeCache = new Map<string, GeoSubdistrict[]>();
let cachedAllDistrictsWithProvince: GeoDistrictWithProvince[] | null = null;

function getDistrictsByProvinceCode(provinceCode: string): GeoDistrict[] {
  const cached = districtsByProvinceCodeCache.get(provinceCode);
  if (cached) return cached;

  const computed = districts(provinceCode)
    .map((d) => ({
      code: d.code,
      nameEn: d.name_en,
      nameTh: d.name_th,
      provinceCode: d.province_code,
    }))
    .sort((a, b) => a.nameTh.localeCompare(b.nameTh, "th"));

  districtsByProvinceCodeCache.set(provinceCode, computed);
  return computed;
}

export function getDistrictsForProvince(provinceName: string): GeoDistrict[] {
  if (!provinceName) return [];
  const prov =
    provinceByLookupKey.get(provinceName.toLowerCase()) ?? provinceByLookupKey.get(provinceName);
  if (!prov) return [];
  return getDistrictsByProvinceCode(prov.code);
}

export function getAllDistrictsWithProvince(): GeoDistrictWithProvince[] {
  if (cachedAllDistrictsWithProvince) {
    return cachedAllDistrictsWithProvince;
  }

  const list: GeoDistrictWithProvince[] = [];
  for (const p of allProvinces) {
    for (const d of getDistrictsByProvinceCode(p.code)) {
      list.push({
        ...d,
        id: d.code,
        provinceNameEn: p.nameEn,
        provinceNameTh: p.nameTh,
        displayText: `${d.nameTh} (${p.nameTh})`,
      });
    }
  }

  cachedAllDistrictsWithProvince = list;
  return list;
}

export function getSubdistrictsForDistrict(
  provinceName: string,
  districtName: string
): GeoSubdistrict[] {
  if (!provinceName || !districtName) return [];
  const distList = getDistrictsForProvince(provinceName);
  const targetLower = districtName.toLowerCase();
  const dist = distList.find(
    (d) => d.nameEn.toLowerCase() === targetLower || d.nameTh === districtName
  );
  if (!dist) return [];

  const cached = subdistrictsByDistrictCodeCache.get(dist.code);
  if (cached) return cached;

  const computed = subdistricts(dist.code)
    .map((s) => ({
      code: s.code,
      nameEn: s.name_en,
      nameTh: s.name_th,
      districtCode: s.district_code,
      provinceCode: s.province_code,
      postalCode: s.postal_codes[0] ?? "",
    }))
    .sort((a, b) => a.nameTh.localeCompare(b.nameTh, "th"));

  subdistrictsByDistrictCodeCache.set(dist.code, computed);
  return computed;
}

export function useGeoThai() {
  const [query, setQuery] = useState("");

  const searchAddresses = useCallback((rawQuery: string, limit = 8): GeoAddressSuggestion[] => {
    const trimmed = rawQuery.trim();
    if (!trimmed || trimmed.length < 2) return [];

    const results: GeoAddressSuggestion[] = [];

    // Case 1: Postal code numeric query (3-5 digits)
    if (/^\d{3,5}$/.test(trimmed)) {
      const matchedSubdistricts = byPostalCode(trimmed);
      for (const s of matchedSubdistricts) {
        const addr = address(s.code);
        if (!addr) continue;

        const subName = addr.subdistrict.name_th || addr.subdistrict.name_en;
        const distName = addr.district.name_th || addr.district.name_en;
        const provName = addr.province.name_th || addr.province.name_en;
        const postal = addr.subdistrict.postal_codes[0] ?? trimmed;

        results.push({
          id: `${addr.subdistrict.code}-${postal}`,
          subdistrict: subName,
          district: distName,
          province: provName,
          postalCode: postal,
          displayText: `${subName} › ${distName} › ${provName} (${postal})`,
        });

        if (results.length >= limit) break;
      }
      return results;
    }

    // Case 2: Text search (subdistrict, district, province in Thai or English)
    const searchResults = search(trimmed, { limit });
    for (const res of searchResults) {
      if (res.level === "subdistrict") {
        const addr = address(res.area.code);
        if (!addr) continue;

        const subName = addr.subdistrict.name_th || addr.subdistrict.name_en;
        const distName = addr.district.name_th || addr.district.name_en;
        const provName = addr.province.name_th || addr.province.name_en;
        const postal = addr.subdistrict.postal_codes[0] ?? "";

        results.push({
          id: `${addr.subdistrict.code}-${postal}`,
          subdistrict: subName,
          district: distName,
          province: provName,
          postalCode: postal,
          displayText: `${subName} › ${distName} › ${provName} (${postal})`,
        });
      } else if (res.level === "district") {
        const distCode = res.area.code;
        const sampleAddr = address(`${distCode}01`);
        if (sampleAddr) {
          const subName = sampleAddr.subdistrict.name_th || sampleAddr.subdistrict.name_en;
          const distName = sampleAddr.district.name_th || sampleAddr.district.name_en;
          const provName = sampleAddr.province.name_th || sampleAddr.province.name_en;
          const postal = sampleAddr.subdistrict.postal_codes[0] ?? "";

          results.push({
            id: `${sampleAddr.subdistrict.code}-${postal}`,
            subdistrict: subName,
            district: distName,
            province: provName,
            postalCode: postal,
            displayText: `${subName} › ${distName} › ${provName} (${postal})`,
          });
        }
      }

      if (results.length >= limit) break;
    }

    return results;
  }, []);

  const suggestions = useMemo(() => searchAddresses(query), [query, searchAddresses]);

  return {
    query,
    setQuery,
    suggestions,
    searchAddresses,
  };
}
