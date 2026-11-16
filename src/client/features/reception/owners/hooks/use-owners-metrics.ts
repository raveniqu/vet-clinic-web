import { useMemo } from "react";
import { useOwnersDashboardContext } from "../contexts/owners-dashboard-provider";

export function useOwnersMetrics() {
  const { allOwners } = useOwnersDashboardContext();

  return useMemo(() => {
    const totalOwnersCount = allOwners.length;
    let individualCount = 0;
    let juristicCount = 0;
    let fullConsentCount = 0;

    for (const owner of allOwners) {
      if (owner.customerType === "INDIVIDUAL") {
        individualCount += 1;
      } else {
        juristicCount += 1;
      }

      if (
        owner.pdpaPrivacyNotice &&
        owner.pdpaReminders &&
        owner.pdpaMarketing &&
        owner.pdpaMedia
      ) {
        fullConsentCount += 1;
      }
    }

    const fullConsentPercentage =
      totalOwnersCount === 0 ? 0 : Math.round((fullConsentCount / totalOwnersCount) * 100);

    return {
      totalOwnersCount,
      individualCount,
      juristicCount,
      fullConsentCount,
      fullConsentPercentage,
    };
  }, [allOwners]);
}
