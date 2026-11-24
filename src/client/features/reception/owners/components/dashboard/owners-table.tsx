import { Building2, Check, Copy, MapPin, PawPrint } from "lucide-react";
import { AppDataTable } from "#/client/shared/components/app-data-table";
import { AppSpeciesIcon } from "#/client/shared/components/app-species-icon";
import { formatPhoneNumber, formatTaxId } from "#/client/shared/helpers/formatters";
import { Avatar, AvatarFallback } from "#/client/shared/shadcn/components/ui/avatar";
import { Badge } from "#/client/shared/shadcn/components/ui/badge";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "#/client/shared/shadcn/components/ui/popover";
import { Separator } from "#/client/shared/shadcn/components/ui/separator";
import { OwnerRowProvider } from "#/client/features/reception/owners/contexts/owner-row.context";
import { useOwnersTable } from "#/client/features/reception/owners/hooks/use-owners-table";
import {
  formatAddressArea,
  formatFullAddress,
  formatOwnerRegisteredDate,
  formatPreferredChannelDetail,
  getOwnerDisplayName,
  getOwnerInitials,
  hasNonEmptyText,
  LANGUAGE_LABEL_MAP,
} from "#/client/features/reception/owners/models/owners-table";
import { OwnerPdpaPopover } from "./owner-pdpa-popover";
import { OwnerRowActions } from "./owner-row-actions";
import { OwnersTableEmpty } from "./owners-table-empty";

export function OwnersTable() {
  const {
    table,
    isPending,
    petsByOwnerId,
    speciesCodeById,
    copyPhone,
    isPhoneCopied,
    copyTaxId,
    isTaxIdCopied,
  } = useOwnersTable();

  return (
    <AppDataTable
      table={table}
      isLoading={isPending}
      itemLabel="รายการ"
      emptyState={<OwnersTableEmpty />}
      renderCell={(cell) => {
        const owner = cell.row.original;
        const displayName = getOwnerDisplayName(owner);

        if (cell.column.id === "owner") {
          return (
            <div className="flex items-center gap-3">
              <Avatar className="size-9 shrink-0">
                <AvatarFallback className="text-xs font-medium">
                  {owner.customerType === "JURISTIC" ? (
                    <Building2 className="size-4 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    getOwnerInitials(owner)
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-medium text-foreground">{displayName}</span>
                  {owner.customerType === "JURISTIC" ? (
                    <Badge variant="outline">นิติบุคคล</Badge>
                  ) : null}
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {owner.customerCode}
                </span>
              </div>
            </div>
          );
        }

        if (cell.column.id === "contact") {
          const phoneCopied = isPhoneCopied(owner.id);
          return (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <span className="font-mono text-xs text-foreground">
                  {formatPhoneNumber(owner.phonePrimary)}
                </span>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  aria-label={`คัดลอกเบอร์โทรศัพท์ของ ${displayName}`}
                  onClick={() => void copyPhone(owner.id, owner.phonePrimary)}
                >
                  {phoneCopied ? (
                    <Check className="text-primary" aria-hidden="true" />
                  ) : (
                    <Copy aria-hidden="true" />
                  )}
                </Button>
              </div>
              <span className="truncate text-xs text-muted-foreground">
                {formatPreferredChannelDetail(owner)}
              </span>
            </div>
          );
        }

        if (cell.column.id === "pets") {
          const pets = petsByOwnerId.get(owner.id) ?? [];
          if (pets.length === 0) {
            return <span className="text-xs text-muted-foreground">ไม่มีสัตว์เลี้ยง</span>;
          }

          return (
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    className="h-auto rounded-full p-0 hover:bg-transparent"
                    aria-label={`ดูสัตว์เลี้ยง ${pets.length} ตัวของ ${displayName}`}
                  />
                }
              >
                <Badge variant="secondary">
                  <PawPrint data-icon="inline-start" className="text-primary" aria-hidden="true" />
                  <span>{pets.length} ตัว</span>
                </Badge>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-72 gap-3">
                <PopoverHeader>
                  <PopoverTitle className="text-sm">สัตว์เลี้ยงในระบบ — {displayName}</PopoverTitle>
                  <PopoverDescription className="text-xs">
                    สัตว์เลี้ยงในความดูแล {pets.length} ตัว
                  </PopoverDescription>
                </PopoverHeader>
                <Separator />
                <ul className="flex flex-col gap-2">
                  {pets.map((pet) => (
                    <li key={pet.id} className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex min-w-0 items-center gap-2">
                        <AppSpeciesIcon
                          code={speciesCodeById.get(pet.speciesId)}
                          className="size-4 shrink-0 text-primary"
                        />
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-medium text-foreground">
                            {pet.petName}
                          </span>
                          <span className="truncate text-muted-foreground">{pet.breedName}</span>
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-muted-foreground">
                        {pet.petCode}
                      </span>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          );
        }

        if (cell.column.id === "pdpaConsent") {
          return (
            <OwnerRowProvider owner={owner}>
              <OwnerPdpaPopover />
            </OwnerRowProvider>
          );
        }

        if (cell.column.id === "taxId") {
          const taxIdCopied = isTaxIdCopied(owner.id);
          return (
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs text-foreground">{formatTaxId(owner.taxId)}</span>
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                aria-label={`คัดลอกเลขประจำตัวผู้เสียภาษีของ ${displayName}`}
                onClick={() => void copyTaxId(owner.id, owner.taxId)}
              >
                {taxIdCopied ? (
                  <Check className="text-primary" aria-hidden="true" />
                ) : (
                  <Copy aria-hidden="true" />
                )}
              </Button>
            </div>
          );
        }

        if (cell.column.id === "additionalContacts") {
          const hasAdditionalContact =
            hasNonEmptyText(owner.phoneSecondary) ||
            hasNonEmptyText(owner.lineId) ||
            hasNonEmptyText(owner.email);

          return hasAdditionalContact ? (
            <div className="flex max-w-48 flex-col gap-0.5 text-xs">
              {hasNonEmptyText(owner.phoneSecondary) ? (
                <span className="truncate font-mono text-foreground">
                  สำรอง: {formatPhoneNumber(owner.phoneSecondary)}
                </span>
              ) : null}
              {hasNonEmptyText(owner.lineId) ? (
                <span className="truncate text-muted-foreground">LINE: {owner.lineId}</span>
              ) : null}
              {hasNonEmptyText(owner.email) ? (
                <span className="truncate text-muted-foreground">{owner.email}</span>
              ) : null}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          );
        }

        if (cell.column.id === "address") {
          const areaLabel = formatAddressArea(owner);
          return areaLabel ? (
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    className="h-auto max-w-44 justify-start px-1.5 py-0.5 text-left font-normal"
                    aria-label={`ดูที่อยู่เต็มของ ${displayName}`}
                  />
                }
              >
                <MapPin data-icon="inline-start" aria-hidden="true" />
                <span className="truncate text-xs text-foreground">{areaLabel}</span>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80">
                <PopoverHeader>
                  <PopoverTitle className="text-sm">ที่อยู่ในระบบ — {displayName}</PopoverTitle>
                  <PopoverDescription className="text-xs whitespace-pre-wrap text-foreground">
                    {formatFullAddress(owner)}
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          );
        }

        if (cell.column.id === "preferredSchedule") {
          return (
            <span className="text-xs text-foreground">
              {owner.preferredTime} · {LANGUAGE_LABEL_MAP[owner.preferredLanguage]}
            </span>
          );
        }

        if (cell.column.id === "referralSource") {
          return <span className="text-xs text-muted-foreground">{owner.referralSource}</span>;
        }

        if (cell.column.id === "createdAt") {
          return (
            <span className="text-xs text-muted-foreground">
              {formatOwnerRegisteredDate(owner.createdAt)}
            </span>
          );
        }

        if (cell.column.id === "actions") {
          return (
            <OwnerRowProvider owner={owner}>
              <OwnerRowActions />
            </OwnerRowProvider>
          );
        }

        return <table.FlexRender cell={cell} />;
      }}
    />
  );
}
