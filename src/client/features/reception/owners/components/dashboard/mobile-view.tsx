import { Building2, Check, Copy, Eye, PawPrint, Pencil, Phone, UsersRound } from "lucide-react";
import { OwnerRowProvider } from "#/client/features/reception/owners/contexts/owner-row.context";
import { useOwnersMobile } from "#/client/features/reception/owners/hooks/use-owners-mobile";
import {
  formatFullAddress,
  formatPreferredChannelDetail,
  getOwnerDisplayName,
  getOwnerInitials,
} from "#/client/features/reception/owners/models/owners-table";
import { AppButtonLink } from "#/client/shared/components/app-link";
import { AppSpeciesIcon } from "#/client/shared/components/app-species-icon";
import { formatPhoneNumber, formatTaxId } from "#/client/shared/helpers/formatters";
import { Avatar, AvatarFallback } from "#/client/shared/shadcn/components/ui/avatar";
import { Badge } from "#/client/shared/shadcn/components/ui/badge";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/client/shared/shadcn/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/client/shared/shadcn/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "#/client/shared/shadcn/components/ui/item";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "#/client/shared/shadcn/components/ui/popover";
import { Separator } from "#/client/shared/shadcn/components/ui/separator";
import { OwnerPdpaPopover } from "./owner-pdpa-popover";

export function MobileView() {
  const {
    mobileOwners,
    hasMore,
    remainingCount,
    loadMore,
    totalCount,
    isEmptyDataset,
    hasActiveFilter,
    clearFilters,
    petsByOwnerId,
    speciesCodeById,
    copyPhone,
    isPhoneCopied,
    openEditDialog,
  } = useOwnersMobile();

  if (mobileOwners.length === 0) {
    return (
      <Card className="col-span-full py-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UsersRound aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>
              {isEmptyDataset
                ? "ยังไม่มีข้อมูลเจ้าของสัตว์เลี้ยงในระบบ"
                : "ไม่พบข้อมูลเจ้าของสัตว์เลี้ยงที่ตรงกับตัวกรอง"}
            </EmptyTitle>
            <EmptyDescription>
              {isEmptyDataset
                ? "เริ่มต้นด้วยการลงทะเบียนเจ้าของสัตว์เลี้ยงใหม่จากปุ่มด้านบน"
                : "ลองปรับคำค้นหาหรือตัวกรองด่วนใหม่อีกครั้ง"}
            </EmptyDescription>
          </EmptyHeader>
          {hasActiveFilter ? (
            <EmptyContent>
              <Button type="button" variant="outline" className="min-h-11" onClick={clearFilters}>
                ล้างตัวกรองทั้งหมด
              </Button>
            </EmptyContent>
          ) : null}
        </Empty>
      </Card>
    );
  }

  return (
    <div className="col-span-full flex flex-col gap-4">
      {mobileOwners.map((owner) => {
        const displayName = getOwnerDisplayName(owner);
        const pets = petsByOwnerId.get(owner.id) ?? [];
        const phoneCopied = isPhoneCopied(owner.id);

        return (
          <Card key={owner.id} className="py-3">
            <CardHeader className="px-4.5">
              <div className="flex items-start gap-3">
                <Avatar className="size-9 shrink-0">
                  <AvatarFallback className="text-xs font-medium">
                    {owner.customerType === "JURISTIC" ? (
                      <Building2 className="size-4 text-muted-foreground" aria-hidden="true" />
                    ) : (
                      getOwnerInitials(owner)
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <CardTitle className="flex flex-wrap items-center gap-1.5 text-base">
                    <span>{displayName}</span>
                    {owner.customerType === "JURISTIC" ? (
                      <Badge variant="outline">นิติบุคคล</Badge>
                    ) : null}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {owner.customerCode}
                    </Badge>
                    <Badge variant="outline" className="font-normal text-muted-foreground">
                      เลขผู้เสียภาษี: {formatTaxId(owner.taxId)}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-2.5 px-4">
              <Item className="p-2.5" variant="muted">
                <ItemContent>
                  <ItemTitle className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 font-mono text-sm">
                      <Phone className="size-3.5 text-muted-foreground" aria-hidden="true" />
                      <span>{formatPhoneNumber(owner.phonePrimary)}</span>
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">
                      · {formatPreferredChannelDetail(owner)}
                    </span>
                  </ItemTitle>
                  <ItemDescription className="text-xs leading-relaxed">
                    {formatFullAddress(owner)}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="min-h-11 min-w-11"
                    aria-label={`คัดลอกเบอร์โทรศัพท์ของ ${displayName}`}
                    onClick={() => void copyPhone(owner.id, owner.phonePrimary)}
                  >
                    {phoneCopied ? (
                      <Check className="text-primary" aria-hidden="true" />
                    ) : (
                      <Copy aria-hidden="true" />
                    )}
                  </Button>
                </ItemActions>
              </Item>

              {pets.length === 0 ? (
                <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground">
                  <PawPrint className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  <span>ยังไม่มีสัตว์เลี้ยงในระบบ</span>
                </div>
              ) : (
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        className="min-h-11 w-full justify-start px-2 text-left text-xs font-normal"
                        aria-label={`ดูสัตว์เลี้ยง ${pets.length} ตัวของ ${displayName}`}
                      />
                    }
                  >
                    <PawPrint className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="truncate text-muted-foreground">
                      <span className="font-medium text-foreground">
                        สัตว์เลี้ยง {pets.length} ตัว:
                      </span>{" "}
                      {pets.map((pet) => pet.petName).join(", ")}
                    </span>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-72 gap-3">
                    <PopoverHeader>
                      <PopoverTitle className="text-sm">
                        สัตว์เลี้ยงในระบบ — {displayName}
                      </PopoverTitle>
                      <PopoverDescription className="text-xs">
                        สัตว์เลี้ยงในความดูแล {pets.length} ตัว
                      </PopoverDescription>
                    </PopoverHeader>
                    <Separator />
                    <ul className="flex flex-col gap-2">
                      {pets.map((pet) => (
                        <li
                          key={pet.id}
                          className="flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <AppSpeciesIcon
                              code={speciesCodeById.get(pet.speciesId)}
                              className="size-4 shrink-0 text-primary"
                            />
                            <div className="flex min-w-0 flex-col">
                              <span className="truncate font-medium text-foreground">
                                {pet.petName}
                              </span>
                              <span className="truncate text-muted-foreground">
                                {pet.breedName}
                              </span>
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
              )}
            </CardContent>

            <CardFooter className="flex-wrap gap-2 px-4 pt-1">
              <OwnerRowProvider owner={owner}>
                <OwnerPdpaPopover />
              </OwnerRowProvider>

              <div className="ml-auto flex items-center gap-2">
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  onClick={() => openEditDialog(owner)}
                >
                  <Pencil data-icon="inline-start" aria-hidden="true" />
                  <span>แก้ไข</span>
                </Button>
                <AppButtonLink
                  to="/owners/$ownerId"
                  params={{ ownerId: owner.id }}
                  type="button"
                  size="xs"
                  variant="link"
                >
                  <Eye data-icon="inline-start" aria-hidden="true" />
                  <span>ดูประวัติ</span>
                </AppButtonLink>
              </div>
            </CardFooter>
          </Card>
        );
      })}

      {hasMore ? (
        <Button type="button" variant="outline" className="min-h-11 w-full" onClick={loadMore}>
          โหลดข้อมูลเพิ่มเติม (เหลืออีก {remainingCount} จาก {totalCount} รายการ)
        </Button>
      ) : null}
    </div>
  );
}
