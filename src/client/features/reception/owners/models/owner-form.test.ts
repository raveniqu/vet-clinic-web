import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extractFormErrorMessage } from "#/client/shared/components/app-form";
import { resolveFirstFailedWizardStep } from "#/client/shared/hooks/use-wizard-form";
import type { OwnerDto } from "#/shared/schemas/owner.schema";
import {
  applyOwnerFieldSideEffects,
  INITIAL_OWNER_FORM_VALUES,
  mapOwnerToInput,
  resolveOwnerFieldStep,
} from "./owner-form";

function createOwnerFixture(): OwnerDto {
  return {
    id: "01950f4b-3d44-7000-8000-000000000101",
    customerCode: "CUS-2026-0001",
    createdAt: "2026-01-10T00:00:00.000Z",
    customerType: "INDIVIDUAL",
    prefix: "Ms.",
    firstName: "Emily",
    lastName: "Watson",
    taxId: "1100500123456",
    dateOfBirth: "1990-02-14",
    gender: "Female",
    phonePrimary: "0891234567",
    phoneSecondary: "",
    lineId: "@emily_w",
    email: "emily@example.com",
    addressLine: "88/12 Thong Lo",
    subdistrict: "Khlong Tan Nuea",
    district: "Watthana",
    province: "Bangkok",
    postalCode: "10110",
    referralSource: "Walk-in",
    preferredChannel: "LINE",
    preferredTime: "13:00 - 17:00",
    preferredLanguage: "EN",
    pdpaPrivacyNotice: true,
    pdpaReminders: true,
    pdpaMarketing: false,
    pdpaMedia: false,
  };
}

describe("Owner form pure helpers", () => {
  it("resolves wizard steps across identity, address, and preferences fields", () => {
    assert.equal(resolveOwnerFieldStep("firstName"), 1);
    assert.equal(resolveOwnerFieldStep("phonePrimary"), 1);
    assert.equal(resolveOwnerFieldStep("province"), 2);
    assert.equal(resolveOwnerFieldStep("postalCode"), 2);
    assert.equal(resolveOwnerFieldStep("pdpaPrivacyNotice"), 3);

    assert.equal(
      resolveFirstFailedWizardStep(
        ["postalCode", "firstName", "pdpaPrivacyNotice"],
        resolveOwnerFieldStep
      ),
      1
    );
    assert.equal(
      resolveFirstFailedWizardStep(["postalCode", "preferredChannel"], resolveOwnerFieldStep),
      2
    );
  });

  it("resets lastName and adjusts prefix when toggling customerType", () => {
    const individual = {
      ...INITIAL_OWNER_FORM_VALUES,
      prefix: "นางสาว",
      lastName: "ศรีสุวรรณ",
    };

    const switchedToJuristic = applyOwnerFieldSideEffects(individual, "customerType", "JURISTIC");
    assert.equal(switchedToJuristic.customerType, "JURISTIC");
    assert.equal(switchedToJuristic.prefix, "บริษัท");
    assert.equal(switchedToJuristic.lastName, "");

    const foundationStays = applyOwnerFieldSideEffects(
      { ...individual, prefix: "มูลนิธิ" },
      "customerType",
      "JURISTIC"
    );
    assert.equal(foundationStays.prefix, "มูลนิธิ");

    const partnershipStays = applyOwnerFieldSideEffects(
      { ...individual, prefix: "ห้างหุ้นส่วน" },
      "customerType",
      "JURISTIC"
    );
    assert.equal(partnershipStays.prefix, "ห้างหุ้นส่วน");

    const backToIndividual = applyOwnerFieldSideEffects(
      switchedToJuristic,
      "customerType",
      "INDIVIDUAL"
    );
    assert.equal(backToIndividual.prefix, "คุณ");
  });

  it("maps OwnerDto to CreateOwnerInput and extracts StandardSchemaV1 / string errors cleanly", () => {
    const owner = createOwnerFixture();
    const mapped = mapOwnerToInput(owner);
    assert.equal(mapped.firstName, "Emily");
    assert.equal(mapped.postalCode, "10110");
    assert.equal(mapped.pdpaReminders, true);

    assert.equal(extractFormErrorMessage("Required"), "Required");
    assert.equal(extractFormErrorMessage({ message: "Invalid Tax ID" }), "Invalid Tax ID");
    assert.equal(extractFormErrorMessage(undefined), undefined);
  });
});
