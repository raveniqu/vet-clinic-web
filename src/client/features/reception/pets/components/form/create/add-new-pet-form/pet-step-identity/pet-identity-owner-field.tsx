import type { OwnerDto } from "#/shared/schemas/owner.schema";
import { Dot, Search, UserRoundCheck, UserRoundPlus, UsersRound } from "lucide-react";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import { Field } from "#/client/shared/shadcn/components/ui/field";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "#/client/shared/shadcn/components/ui/combobox";
import { InputGroupAddon } from "#/client/shared/shadcn/components/ui/input-group";
import {
  AppFieldError,
  AppFieldLabel,
  AppFieldLegend,
  AppFieldSet,
} from "#/client/shared/components/app-field";
import { usePetOwnerSelection } from "#/client/features/reception/pets/hooks/use-pet-owner-selection";
import { formatOwnerSummaryName } from "#/client/features/reception/pets/models/pet-form";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "#/client/shared/shadcn/components/ui/item";
import { formatPhoneNumber } from "#/client/shared/helpers/formatters";

export function PetIdentityOwnerField() {
  const {
    allOwners,
    selectedOwner,
    selectedOwnerSummary,
    ownerError,
    handleSelectOwner,
    handleClearOwner,
    openNewOwnerModal,
    filterOwner,
    getOwnerLabel,
    isOwnerEqualToValue,
  } = usePetOwnerSelection();

  const isMobile = useIsMobile();

  return (
    <AppFieldSet>
      <AppFieldLegend>
        <UsersRound />
        <span>ข้อมูลเจ้าของสัตว์เลี้ยง</span>
      </AppFieldLegend>

      <Field data-invalid={!!ownerError}>
        <AppFieldLabel htmlFor="owner-search-input">
          <span>เลือกเจ้าของสัตว์เลี้ยง</span>
          <span className="font-bold text-destructive">*</span>
        </AppFieldLabel>

        {selectedOwnerSummary ? (
          /* Selected Owner Summary Card */
          <Item variant="outline" className="border-0 bg-primary/5 ring-1 ring-primary/50">
            <ItemMedia variant="icon" className="size-8 rounded-full bg-primary/10 text-primary">
              <UserRoundCheck />
            </ItemMedia>
            <ItemContent className="gap-0">
              <ItemTitle>{selectedOwnerSummary.fullName}</ItemTitle>
              <ItemDescription className="text-xs">
                โทร:{" "}
                {formatPhoneNumber(selectedOwnerSummary.phone || selectedOwner?.phonePrimary || "")}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="link" size="xs" onClick={handleClearOwner}>
                เปลี่ยน
              </Button>
            </ItemActions>
          </Item>
        ) : (
          /* Owner Search / Create Combobox */
          <div className="flex items-center gap-2">
            <Combobox<OwnerDto>
              items={allOwners}
              value={selectedOwner}
              filter={filterOwner}
              onValueChange={(owner) => {
                if (owner) {
                  handleSelectOwner(owner);
                }
              }}
              itemToStringLabel={getOwnerLabel}
              isItemEqualToValue={isOwnerEqualToValue}
            >
              <ComboboxInput
                id="owner-search-input"
                placeholder="ค้นหาเจ้าของจากชื่อ, เบอร์โทร หรือรหัสลูกค้า..."
                showClear
                showTrigger={false}
                className="**:placeholder:text-sm sm:w-full"
              >
                <InputGroupAddon align="inline-start">
                  <Search />
                </InputGroupAddon>
              </ComboboxInput>

              <ComboboxContent align="start" className="bg-transparent backdrop-blur-md">
                <ComboboxList>
                  <ComboboxEmpty className="py-6 text-center text-muted-foreground">
                    ไม่พบข้อมูลเจ้าของสัตว์เลี้ยงในระบบ
                  </ComboboxEmpty>
                  <ComboboxCollection>
                    {(owner: OwnerDto) => {
                      const fullName = formatOwnerSummaryName(owner);
                      return (
                        <ComboboxItem key={owner.id} value={owner}>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{fullName}</span>
                            <span className="flex flex-col items-start text-xs text-muted-foreground sm:flex-row">
                              <span>{formatPhoneNumber(owner.phonePrimary)}</span>
                              <Dot className="hidden sm:block" />
                              <span className="hidden sm:block">{owner.customerCode}</span>
                            </span>
                          </div>
                        </ComboboxItem>
                      );
                    }}
                  </ComboboxCollection>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            <Button
              type="button"
              size={isMobile ? "icon" : "default"}
              variant="ghost"
              onClick={openNewOwnerModal}
              className="shrink-0 shadow-md/10 inset-shadow-sm/5 dark:ring dark:ring-border"
            >
              <UserRoundPlus />
              <span className="sr-only md:not-sr-only">เจ้าของใหม่</span>
            </Button>
          </div>
        )}

        {ownerError && <AppFieldError>{ownerError}</AppFieldError>}
      </Field>
    </AppFieldSet>
  );
}
