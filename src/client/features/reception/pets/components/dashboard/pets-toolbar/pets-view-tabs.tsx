import { Grid2X2, TableProperties } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "#/client/shared/shadcn/components/ui/tabs";

import { usePetTabs } from "#/client/features/reception/pets/hooks/use-pet-tabs";

export function PetsViewTabs() {
  const { selectedTab, onSelectedTab } = usePetTabs();

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(val) => onSelectedTab(val)}
      className="hidden md:inline-flex"
    >
      <TabsList className="h-8! bg-background shadow-md/10 inset-shadow-sm/5 dark:bg-transparent dark:ring-1 dark:ring-border">
        <TabsTrigger value="list" className="border-0 data-active:bg-secondary">
          <TableProperties aria-hidden="true" />
          <span>List View</span>
        </TabsTrigger>
        <TabsTrigger value="grid" className="border-0 data-active:bg-secondary">
          <Grid2X2 aria-hidden="true" />
          <span>Grid View</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
