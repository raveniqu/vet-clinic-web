import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { OwnerDto } from "#/shared/schemas/owner.schema";
import { ownersSearchSchema } from "#/shared/schemas/owner.schema";
import { petsSearchSchema } from "#/shared/schemas/pet.schema";
import {
  computeOwnersMetrics,
  filterOwners,
  getOwnerColumnVisibilityState,
  normalizeVisibleOwnerColumns,
} from "./owners-table";

const SAMPLE_OWNERS: OwnerDto[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    customerCode: "CUS-0001",
    customerType: "INDIVIDUAL",
    prefix: "Mr.",
    firstName: "Somchai",
    lastName: "Jaidee",
    taxId: "1234567890123",
    dateOfBirth: "1990-01-01",
    gender: "Male",
    phonePrimary: "0812345678",
    phoneSecondary: "021234567",
    lineId: "@somchai",
    email: "somchai@example.com",
    addressLine: "123 Sukhumvit",
    subdistrict: "Khlong Tan",
    district: "Vadhana",
    province: "Bangkok",
    postalCode: "10110",
    referralSource: "Walk-in",
    preferredChannel: "LINE",
    preferredTime: "13:00 - 17:00",
    preferredLanguage: "TH",
    pdpaPrivacyNotice: true,
    pdpaReminders: true,
    pdpaMarketing: true,
    pdpaMedia: true,
    createdAt: "2026-01-10T10:00:00.000Z",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    customerCode: "CUS-0002",
    customerType: "JURISTIC",
    prefix: "Foundation",
    firstName: "Happy Paws",
    lastName: "",
    taxId: "0123456789012",
    dateOfBirth: "",
    gender: "Not Specified",
    phonePrimary: "0899998888",
    phoneSecondary: "",
    lineId: "",
    email: "contact@happypaws.org",
    addressLine: "99 Rama IX",
    subdistrict: "Huai Khwang",
    district: "Huai Khwang",
    province: "Bangkok",
    postalCode: "10310",
    referralSource: "Partner Organization",
    preferredChannel: "PHONE",
    preferredTime: "09:00 - 12:00",
    preferredLanguage: "EN",
    pdpaPrivacyNotice: true,
    pdpaReminders: true,
    pdpaMarketing: false,
    pdpaMedia: false,
    createdAt: "2026-02-15T10:00:00.000Z",
  },
];

describe("Route search schemas (UUID + pagination resilience)", () => {
  it("accepts UUID editOwnerId and editPetId and falls back cleanly on invalid params", () => {
    const validUuid = "11111111-1111-4111-8111-111111111111";
    const parsedOwner = ownersSearchSchema.parse({
      editOwnerId: validUuid,
      search: "  somchai ",
      quickFilters: ["preferredLine", "invalid"],
      page: "2",
      pageSize: "25",
    });

    assert.equal(parsedOwner.editOwnerId, validUuid);
    assert.equal(parsedOwner.search, "somchai");
    assert.deepEqual(parsedOwner.quickFilters, []);
    assert.equal(parsedOwner.page, 2);
    assert.equal(parsedOwner.pageSize, 25);

    const invalidOwner = ownersSearchSchema.parse({
      editOwnerId: "not-a-uuid",
      page: -5,
      sortBy: "unknown",
    });
    assert.equal(invalidOwner.editOwnerId, undefined);
    assert.equal(invalidOwner.page, 1);
    assert.equal(invalidOwner.sortBy, "createdAt");

    const parsedPet = petsSearchSchema.parse({ editPetId: validUuid });
    assert.equal(parsedPet.editPetId, validUuid);
  });
});

describe("Owners table pure helpers", () => {
  it("filters owners across all searchable contact fields and quick filters", () => {
    assert.equal(filterOwners(SAMPLE_OWNERS, "", []).length, 2);
    assert.equal(filterOwners(SAMPLE_OWNERS, "@somchai", []).length, 1);
    assert.equal(filterOwners(SAMPLE_OWNERS, "0123456789012", []).length, 1);
    assert.deepEqual(
      filterOwners(SAMPLE_OWNERS, "", ["juristic"]).map((o) => o.id),
      ["22222222-2222-4222-8222-222222222222"]
    );
    assert.deepEqual(filterOwners(SAMPLE_OWNERS, "", ["preferredLine", "juristic"]), []);
  });

  it("computes owner metrics and full PDPA percentage", () => {
    const metrics = computeOwnersMetrics(SAMPLE_OWNERS);
    assert.deepEqual(metrics, {
      totalOwnersCount: 2,
      individualCount: 1,
      juristicCount: 1,
      fullConsentCount: 1,
      fullConsentPercentage: 50,
    });
  });

  it("retains locked owner column and maps visibility state cleanly", () => {
    const normalized = normalizeVisibleOwnerColumns(["taxId", "invalid-key"]);
    assert.deepEqual(normalized, ["owner", "taxId"]);

    const visibility = getOwnerColumnVisibilityState(normalized);
    assert.equal(visibility.owner, true);
    assert.equal(visibility.taxId, true);
    assert.equal(visibility.contact, false);
    assert.equal(visibility.actions, true);
  });
});
