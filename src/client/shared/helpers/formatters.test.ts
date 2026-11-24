import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatPetAge,
  formatRegisteredDate,
  formatThaiLongDate,
  formatThaiShortDate,
} from "./formatters";

describe("Thai date and pet age formatters", () => {
  it("formats estimated pet ages in Thai with tilde prefix", () => {
    assert.equal(
      formatPetAge({
        birthDateIsEstimated: true,
        estimatedYears: 2,
        estimatedMonths: 4,
      }),
      "~2 ปี 4 เดือน"
    );

    assert.equal(
      formatPetAge({
        birthDateIsEstimated: true,
        estimatedYears: 3,
        estimatedMonths: 0,
      }),
      "~3 ปี"
    );

    assert.equal(
      formatPetAge({
        birthDateIsEstimated: true,
        estimatedYears: 0,
        estimatedMonths: 5,
      }),
      "~5 เดือน"
    );

    assert.equal(
      formatPetAge({
        birthDateIsEstimated: true,
        estimatedYears: 0,
        estimatedMonths: 0,
      }),
      "~< 1 เดือน"
    );
  });

  it("formats exact pet ages from dateOfBirth in Thai", () => {
    const now = new Date();
    const twoYearsThreeMonthsAgo = new Date(
      now.getFullYear() - 2,
      now.getMonth() - 3,
      Math.min(now.getDate(), 15)
    );
    const yyyy = twoYearsThreeMonthsAgo.getFullYear();
    const mm = String(twoYearsThreeMonthsAgo.getMonth() + 1).padStart(2, "0");
    const dd = String(twoYearsThreeMonthsAgo.getDate()).padStart(2, "0");

    assert.equal(
      formatPetAge({
        birthDateIsEstimated: false,
        dateOfBirth: `${yyyy}-${mm}-${dd}`,
      }),
      "2 ปี 3 เดือน"
    );

    const futureDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    const fYyyy = futureDate.getFullYear();
    const fMm = String(futureDate.getMonth() + 1).padStart(2, "0");
    const fDd = String(futureDate.getDate()).padStart(2, "0");

    assert.equal(
      formatPetAge({
        birthDateIsEstimated: false,
        dateOfBirth: `${fYyyy}-${fMm}-${fDd}`,
      }),
      "< 1 เดือน"
    );
  });

  it("formats short and long Thai Buddhist Era dates consistently", () => {
    assert.equal(formatThaiShortDate("2026-01-10"), "10 ม.ค. 2569");
    assert.equal(formatThaiShortDate(new Date(2026, 0, 10)), "10 ม.ค. 2569");
    assert.equal(formatThaiLongDate("2026-01-10"), "10 มกราคม 2569");
    assert.equal(formatRegisteredDate("2026-01-10"), "10 ม.ค. 2569");
  });

  it("handles empty and invalid dates safely with fallbacks", () => {
    assert.equal(formatThaiShortDate(""), "—");
    assert.equal(formatThaiShortDate("not-a-date"), "—");
    assert.equal(formatThaiShortDate("not-a-date", "ไม่ระบุ"), "ไม่ระบุ");
    assert.equal(formatThaiLongDate(""), "—");
    assert.equal(formatThaiLongDate("invalid", "ไม่ระบุ"), "ไม่ระบุ");
    assert.equal(formatRegisteredDate("invalid", "-"), "-");
  });
});
