import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useAddNewPetFormContext } from "#/client/features/reception/pets/contexts/add-new-pet-form-provider";
import { useFormErrors, useFormValues } from "#/client/shared/hooks/use-wizard-form";

const PET_PHYSICAL_ATTR_KEYS = [
  "weight",
  "dateOfBirth",
  "birthDateIsEstimated",
  "estimatedYears",
  "estimatedMonths",
  "color",
] as const;

const PET_PHYSICAL_ATTR_ERROR_KEYS = ["weight", "dateOfBirth", "color"] as const;

const calculateEstimatedDob = (years: number, months: number): string => {
  const now = new Date();
  let targetYear = now.getFullYear() - years;
  let targetMonth = now.getMonth() - months;

  while (targetMonth < 0) {
    targetYear -= 1;
    targetMonth += 12;
  }

  const yStr = String(targetYear);
  const mStr = String(targetMonth + 1).padStart(2, "0");
  const dStr = "01";
  return `${yStr}-${mStr}-${dStr}`;
};

export function usePetPhysicalAttributes() {
  const { form, setFieldValue, setMultipleFields } = useAddNewPetFormContext();
  const values = useFormValues(form, PET_PHYSICAL_ATTR_KEYS);
  const stepErrors = useFormErrors(form, PET_PHYSICAL_ATTR_ERROR_KEYS);

  // Popover open states
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isApproxOpen, setIsApproxOpen] = useState(false);

  // Temporary state for the Approx Popover
  const [tempYears, setTempYears] = useState<number>(values.estimatedYears || 0);
  const [tempMonths, setTempMonths] = useState<number>(values.estimatedMonths || 0);

  // Real-time preview of calculated date inside Popover
  const tempEstimatedDob = useMemo(
    () => calculateEstimatedDob(tempYears, tempMonths),
    [tempYears, tempMonths]
  );

  // Handle opening/closing of Approx Popover
  const handleOpenApproxChange = useCallback(
    (open: boolean) => {
      if (open) {
        setTempYears(values.estimatedYears || 0);
        setTempMonths(values.estimatedMonths || 0);
      }
      setIsApproxOpen(open);
    },
    [values.estimatedYears, values.estimatedMonths]
  );

  // Temporary years input change
  const handleTempYearsChange = useCallback((valStr: string) => {
    const y = Math.max(0, Math.min(40, parseInt(valStr, 10) || 0));
    setTempYears(y);
  }, []);

  // Temporary months input change
  const handleTempMonthsChange = useCallback((valStr: string) => {
    const m = Math.max(0, Math.min(11, parseInt(valStr, 10) || 0));
    setTempMonths(m);
  }, []);

  // Commit approximate age into form atomically
  const handleApplyApproxAge = useCallback(() => {
    const calculatedDate = calculateEstimatedDob(tempYears, tempMonths);
    setMultipleFields({
      birthDateIsEstimated: true,
      estimatedYears: tempYears,
      estimatedMonths: tempMonths,
      dateOfBirth: calculatedDate,
    });
    setIsApproxOpen(false);
  }, [tempYears, tempMonths, setMultipleFields]);

  // Clear approximate age atomically
  const handleClearApproxAge = useCallback(() => {
    setMultipleFields({
      birthDateIsEstimated: false,
      estimatedYears: 0,
      estimatedMonths: 0,
      dateOfBirth: "",
    });
    setTempYears(0);
    setTempMonths(0);
    setIsApproxOpen(false);
  }, [setMultipleFields]);

  // Select exact date from Calendar
  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        // Reset estimated flag since user explicitly picked an exact date
        setMultipleFields({
          dateOfBirth: `${year}-${month}-${day}`,
          birthDateIsEstimated: false,
          estimatedYears: 0,
          estimatedMonths: 0,
        });
      } else {
        setFieldValue("dateOfBirth", "");
      }
      setIsCalendarOpen(false);
    },
    [setFieldValue, setMultipleFields]
  );

  // Weight
  const handleWeightChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFieldValue("weight", e.target.value);
    },
    [setFieldValue]
  );

  // Color
  const handleColorChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFieldValue("color", e.target.value);
    },
    [setFieldValue]
  );

  return {
    // Weight
    weight: values.weight,
    weightError: stepErrors.weight,
    handleWeightChange,

    // Date of Birth & Calendar
    dateOfBirth: values.dateOfBirth,
    birthDateIsEstimated: values.birthDateIsEstimated,
    estimatedYears: values.estimatedYears,
    estimatedMonths: values.estimatedMonths,
    dateOfBirthError: stepErrors.dateOfBirth,
    isCalendarOpen,
    setIsCalendarOpen,
    handleDateSelect,

    // Approx Popover State & Handlers
    isApproxOpen,
    handleOpenApproxChange,
    tempYears,
    tempMonths,
    tempEstimatedDob,
    handleTempYearsChange,
    handleTempMonthsChange,
    handleApplyApproxAge,
    handleClearApproxAge,

    // Color & Markings
    color: values.color,
    colorError: stepErrors.color,
    handleColorChange,
  };
}
