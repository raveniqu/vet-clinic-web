import type { ComponentProps } from "react";
import { th } from "react-day-picker/locale";
import { Calendar } from "#/client/shared/shadcn/components/ui/calendar";

const THAI_CAPTION_FORMATTER = new Intl.DateTimeFormat("th-TH", {
  month: "long",
  year: "numeric",
});

const THAI_DAY_LABEL_FORMATTER = new Intl.DateTimeFormat("th-TH", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const THAI_MONTH_SHORT_FORMATTER = new Intl.DateTimeFormat("th-TH", {
  month: "short",
});

export type AppCalendarProps = ComponentProps<typeof Calendar>;

export function AppCalendar({ locale = th, formatters, labels, ...props }: AppCalendarProps) {
  return (
    <Calendar
      locale={locale}
      formatters={{
        formatCaption: (month) => THAI_CAPTION_FORMATTER.format(month),
        formatMonthDropdown: (date) => THAI_MONTH_SHORT_FORMATTER.format(date),
        formatYearDropdown: (year) => String(year.getFullYear() + 543),
        ...formatters,
      }}
      labels={{
        labelGrid: (date) => THAI_CAPTION_FORMATTER.format(date),
        labelDayButton: (date) => THAI_DAY_LABEL_FORMATTER.format(date),
        ...labels,
      }}
      {...props}
    />
  );
}
